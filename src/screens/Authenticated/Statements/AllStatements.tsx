import React, { FC, ReactElement, useCallback, useContext, useEffect, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDate } from 'hooks/useDate';

import Line from 'components/Figures/Line';
import Dropdown from 'components/Inputs/Dropdown';
import DateInfo from 'components/Texts/Statements/DateInfo';
import RowList from 'components/Wrappers/Statements/RowList';
import RowButton from 'components/Buttons/Statements/RowButton';
import MonthYearPicker from 'components/Inputs/MonthYearPicker';
import NoTransactionsText from 'components/Texts/NoTransactionsText';
import CellAmountValue from 'components/Texts/Statements/CellAmountValue';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import FontAwesomeIcon from 'components/Icons/FontAwesomeIcon';
import AntDesigns from 'components/Icons/AntDesigns';
import Searchbar from 'components/Inputs/Searchbar';
import BalanceWrapper from 'components/Wrappers/Statements/BalanceWrapper';
import BalanceTypeTitle from 'components/Texts/Statements/BalanceTypeTitle';
import BalanceTypeValue from 'components/Texts/Statements/BalanceTypeValue';
import CellExtraInfoWrapper from 'components/Wrappers/CellExtraInfoWrapper';
import OperationTypeInfo from 'components/Texts/Statements/OperationTypeInfo';
import DateAndOpTypeWrapper from 'components/Wrappers/Statements/DateAndOpTypeWrapper';
import BottomButtonOptionsStatements from 'components/Prebuilts/BottomButtonsBar/BottomButtonOptionsStatements';

import { colors, fontSizes } from 'styles';
import { getCcyStatements, requestEmailWithCcyFileStatements } from 'api/StatementsRequests';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';
import { StatementsContext } from 'state/StatementsContext';
import { BeneficiariesContext } from 'state/BeneficiariesContext';
import { UserDetailsContext } from 'state/UserDetailsContext';
import { navigateType } from 'types/types';
import { StatementRow } from 'types/screens';
import { DropDown } from 'types/components';
import { getCcies } from 'utils/helpers';
import { formatBalance } from 'utils/helpers/Balances';
import { useNavigation } from '@react-navigation/native';

const AllStatements: FC<{ route: navigateType }> = ({ route }): ReactElement => {
  const { t } = useTranslation();
  const { beneficiariesInfo } = useContext(BeneficiariesContext);
  const { userInfo } = useContext(UserDetailsContext);
  const navigation: navigateType = useNavigation();
  const { statementsInfo, setCcyAllStatements, setCciesStatements, setBalances } =
    useContext(StatementsContext);
  const { showMonthYear, date, onSelectMonth, switchMonthYearPickerVisible } = useDate();
  const [rowPressed, setRowPressed] = useState<string>('');
  const filteredCurrency =
    route?.params?.CCY &&
    beneficiariesInfo?.currencies?.find((ccy) => ccy.value === route?.params?.CCY);
  const [hideSearch, setHideSearch] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showImportXlsFileModal, setShowImportXlsFileModal] = useState<boolean>(false);
  const [showImportPdfFileModal, setShowImportPdfFileModal] = useState<boolean>(false);
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const preselectedCurrencyDropdown = route?.params?.CCY
    ? filteredCurrency
    : userInfo.defaultCurrency;
  const [selectedCurrency, setSelectedCurrency] = useState<DropDown>(
    preselectedCurrencyDropdown as DropDown,
  );

  const getBalancesAndStatements = useCallback(async () => {
    const currenciesToList = await getCcies(navigation);
    currenciesToList && setCciesStatements(currenciesToList as []);
    const response: any = await getCcyStatements(selectedCurrency.value, date.toDate());
    if (response?.data?.Succeeded) {
      setBalances(response?.data?.Data);
      setCcyAllStatements(response?.data?.Data?.Transactions);
      await sendInfoLog({ event: 'GetCcies', detail: 'success' });
    } else {
      if (response?.data === 'Request failed with status code 401') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login', expired: true }],
        });
        await sendErrorLog({
          event: 'GetCcies - AllStatements',
          detail: 'user session expired: ' + response?.data,
        });
      } else {
        setErrorMessage(`${t('somethingWentWrong')}. ${t('tryLaterContactSupport')}`);
        await sendErrorLog({ event: 'GetCcies - AllStatements', detail: response?.toString() });
      }
    }
  }, [selectedCurrency, date]);

  useEffect(() => {
    getBalancesAndStatements();
  }, [selectedCurrency, date, getBalancesAndStatements]);

  const sendStatementInFile = async ({
    fileType,
    allCcies,
  }: {
    fileType: 'XLSX' | 'PDF';
    allCcies: boolean;
  }) => {
    const response = await requestEmailWithCcyFileStatements({
      CCY: allCcies ? '*' : selectedCurrency.value,
      file: fileType,
      date: date.toDate(),
    });
    if (response?.data === '') {
      setShowSuccessModal(true);
    } else {
      setErrorModal(true);
    }
  };

  const filterData = (item: StatementRow) => {
    const { rowExtraInfoWrapper } = styles;
    const transId = item.TransID.toString();
    if (searchInput === '') {
      return (
        <RowButton onPress={() => setRowPressed(transId)}>
          <>
            <Line />
            <RowList isPressed={transId === rowPressed} id={transId}>
              <DateAndOpTypeWrapper>
                <DateInfo value={item.TransDate} />
                <OperationTypeInfo value={item.Action.toLocaleUpperCase()} />
              </DateAndOpTypeWrapper>
              <View style={styles.valueBalanceWrapper}>
                <CellAmountValue
                  value={`${formatBalance(Number(item.Amount))} ${item.CCY}`}
                  balance={item.Balance}
                />
                <View style={styles.cellBalanceWrapper}>
                  <Text style={styles.balanceCellTitle}>{t('balanceCapital')}</Text>
                  <Text style={styles.balanceCellValue}>{formatBalance(Number(item.Balance))}</Text>
                </View>
              </View>
            </RowList>
            {rowPressed === transId && (
              <View style={styles.extraInfoWrapper}>
                <View style={rowExtraInfoWrapper}>
                  <CellExtraInfoWrapper title={t('valueDateMayusc')} info={item.ValueDate} />
                </View>
                <View style={rowExtraInfoWrapper}>
                  <CellExtraInfoWrapper title={t('description')} info={item.Description} />
                </View>
                <View style={rowExtraInfoWrapper}>
                  <CellExtraInfoWrapper
                    title={t('transactionDate')}
                    info={`${item.TransDate} ${item.TransTime}`}
                  />
                </View>
              </View>
            )}
          </>
        </RowButton>
      );
    }
    if (
      item.Amount.toString().includes(searchInput) ||
      item.Action.toLowerCase().includes(searchInput.toLowerCase())
    ) {
      return (
        <RowButton onPress={() => setRowPressed(transId)}>
          <>
            <Line />
            <RowList isPressed={transId === rowPressed} id={transId}>
              <DateAndOpTypeWrapper>
                <DateInfo value={item.TransDate} />
                <OperationTypeInfo value={item.Action.toLocaleUpperCase()} />
              </DateAndOpTypeWrapper>
              <View style={styles.valueBalanceWrapper}>
                <CellAmountValue
                  value={`${formatBalance(Number(item.Amount))} ${item.CCY}`}
                  balance={item.Balance}
                />
                <View style={styles.cellBalanceWrapper}>
                  <Text style={styles.balanceCellTitle}>{t('balanceCapital')}</Text>
                  <Text style={styles.balanceCellValue}>{formatBalance(Number(item.Balance))}</Text>
                </View>
              </View>
            </RowList>
            {rowPressed === transId && (
              <View style={styles.extraInfoWrapper}>
                <View style={rowExtraInfoWrapper}>
                  <CellExtraInfoWrapper title={t('valueDateMayusc')} info={item.ValueDate} />
                </View>
                <View style={rowExtraInfoWrapper}>
                  <CellExtraInfoWrapper title={t('description')} info={item.Description} />
                </View>
                <View style={rowExtraInfoWrapper}>
                  <CellExtraInfoWrapper
                    title={t('transactionDate')}
                    info={`${item.TransDate} ${item.TransTime}`}
                  />
                </View>
              </View>
            )}
          </>
        </RowButton>
      );
    }
  };

  const renderRow = ({ item }: { item: StatementRow }) => filterData(item);

  return (
    <View style={styles.container}>
      <ModalWindow
        testId={'VfxCardStatements.modalStatementsFileSuccess'}
        isVisible={showSuccessModal}
        icon={
          <AntDesigns
            testId="sendPaymentDetails.checkCircle"
            color={colors.lightGreen.c450}
            size={46}
            icon="checkcircle"
          />
        }
        title={t('confirmationCapital')}
        text={t('emailWithStatementsSent')}
        buttonAcceptText={'OK'}
        onButtonAcceptPress={() => setShowSuccessModal(false)}
      />
      <ModalWindow
        testId={'VfxCardStatements.modalStatementsFileError'}
        isVisible={errorModal}
        icon={
          <AntDesigns
            testId="sendPayment.exclamationWarning"
            color={colors.amber.c800}
            size={46}
            icon="infocirlce"
          />
        }
        title={t('errorCapital')}
        text={t('emailWithStatementsNOTSent')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setErrorModal(false)}
      />
      <ModalWindow
        testId={'VfxCardStatements.modalXlsSending'}
        isVisible={showImportXlsFileModal}
        icon={
          <FontAwesomeIcon
            testId="beneficiaries.questionIcon"
            color={colors.cyan.c600}
            size={46}
            icon="question-circle"
          />
        }
        title={t('importantCapital')}
        text={t('importAllCcies')}
        buttonAcceptText={'Yes'}
        buttonCancelText={'No'}
        onButtonAcceptPress={() => {
          sendStatementInFile({
            fileType: 'XLSX',
            allCcies: true,
          });
          setShowImportXlsFileModal(false);
        }}
        onButtonCancelPress={() => {
          sendStatementInFile({
            fileType: 'XLSX',
            allCcies: false,
          });
          setShowImportXlsFileModal(false);
        }}
      />
      <ModalWindow
        testId={'VfxCardStatements.modalPdfSending'}
        isVisible={showImportPdfFileModal}
        icon={
          <FontAwesomeIcon
            testId="beneficiaries.questionIcon"
            color={colors.cyan.c600}
            size={46}
            icon="question-circle"
          />
        }
        title={t('importantCapital')}
        text={t('importAllCcies')}
        buttonAcceptText={'Yes'}
        buttonCancelText={'No'}
        onButtonAcceptPress={() => {
          sendStatementInFile({
            fileType: 'PDF',
            allCcies: true,
          });
          setShowImportPdfFileModal(false);
        }}
        onButtonCancelPress={() => {
          sendStatementInFile({
            fileType: 'PDF',
            allCcies: false,
          });
          setShowImportPdfFileModal(false);
        }}
      />
      <View style={styles.dropdownCalendarWrapper}>
        <Dropdown
          testId="allStatements.selectedCurrency"
          items={statementsInfo?.ccies}
          onChange={(newCurrency) => setSelectedCurrency(newCurrency)}
          placeholder={selectedCurrency?.label}
          ddWidth={160}
          ddHeight={52}
          defaultMargin={false}
          defaultValue={selectedCurrency}
          dropDownLabel={undefined}
          showBorder
        />
        <MonthYearPicker
          onButtonPress={switchMonthYearPickerVisible}
          format={'MMM YYYY'}
          onMonthSelected={onSelectMonth}
          month={date}
          containerFullWidth={false}
          isVisible={showMonthYear}
        />
      </View>
      <View style={styles.balanceOptionsWrapper}>
        {statementsInfo?.balances?.map(({ id, title, value }) => {
          return (
            <BalanceWrapper key={title} verticalmargin={id === 1 ? 5 : 0}>
              <BalanceTypeTitle title={t(title)} />
              <BalanceTypeValue value={formatBalance(value)} />
            </BalanceWrapper>
          );
        })}
      </View>
      <View style={styles.flatListWrapper}>
        {statementsInfo.allTransactions.length === 0 ? (
          <NoTransactionsText
            customTextStyle={
              (!!errorMessage as boolean)
                ? { color: colors.red.c900, marginHorizontal: 20 }
                : undefined
            }
            message={(!!errorMessage as boolean) ? errorMessage : t('noTransactionsFound')}
          />
        ) : (
          <FlatList
            data={statementsInfo.allTransactions}
            renderItem={renderRow as ListRenderItem<StatementRow>}
            keyExtractor={(item: StatementRow) => item?.TransID?.toString()}
          />
        )}
      </View>
      {hideSearch && (
        <Searchbar onChangeText={setSearchInput} onPressBack={() => setHideSearch(false)} />
      )}
      {!hideSearch && (
        <BottomButtonOptionsStatements
          onPdfPress={() => {
            if (date.toDate().getMonth() !== new Date().getMonth()) {
              setShowImportPdfFileModal(true);
            } else {
              sendStatementInFile({
                fileType: 'PDF',
                allCcies: false,
              });
            }
          }}
          onXlsPress={() => {
            if (date.toDate().getMonth() !== new Date().getMonth()) {
              setShowImportXlsFileModal(true);
            } else {
              sendStatementInFile({
                fileType: 'XLSX',
                allCcies: false,
              });
            }
          }}
          onSearchPress={() => setHideSearch(true)} //search by operation (trade) date or amount (NOT BALANCE, right column)
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.grey.A100 },
  dropdownCalendarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  flatListWrapper: { flex: 4, width: '100%' },
  cellBalanceWrapper: { alignItems: 'flex-end' },
  balanceOptionsWrapper: { flex: 1, width: '100%', paddingHorizontal: 20 },
  valueBalanceWrapper: { flexDirection: 'row', justifyContent: 'space-between' },
  extraInfoWrapper: {
    flex: 2,
    backgroundColor: colors.blueGrey.c50,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.blueGrey.c100,
  },
  rowExtraInfoWrapper: { flex: 1, flexDirection: 'row', marginVertical: 3, marginRight: 8 },
  balanceCellTitle: {
    color: colors.grey.c900,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: fontSizes.mediumSmall14,
  },
  balanceCellValue: {
    color: colors.grey.c750,
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.small12,
  },
});

export default AllStatements;
