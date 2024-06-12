import React, { FC, ReactElement, useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDate } from 'hooks/useDate';

import Line from 'components/Figures/Line';
import Dropdown from 'components/Inputs/Dropdown';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import AntDesigns from 'components/Icons/AntDesigns';
import Searchbar from 'components/Inputs/Searchbar';
import RowList from 'components/Wrappers/Statements/RowList';
import DateInfo from 'components/Texts/Statements/DateInfo';
import MonthYearPicker from 'components/Inputs/MonthYearPicker';
import RowButton from 'components/Buttons/Statements/RowButton';
import NoTransactionsText from 'components/Texts/NoTransactionsText';
import CellAmountValue from 'components/Texts/Statements/CellAmountValue';
import CellExtraInfoWrapper from 'components/Wrappers/CellExtraInfoWrapper';
import OperationTypeInfo from 'components/Texts/Statements/OperationTypeInfo';
import DateAndOpTypeWrapper from 'components/Wrappers/Statements/DateAndOpTypeWrapper';
import BottomButtonOptionsStatements from 'components/Prebuilts/BottomButtonsBar/BottomButtonOptionsStatements';

import { colors, fontSizes } from 'styles';
import { StatementRow } from 'types/screens';
import { getCurrencyCards } from 'api/CardRequests';
import {
  getCurrencyCardStatements,
  requestEmailWithCardFileStatements,
} from 'api/StatementsRequests';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';
import { StatementsContext } from 'state/StatementsContext';
import { dropdownInitState } from '../initialStates';
import LoadingIndicator from 'components/LoadingIndicator';
import { useNavigation } from '@react-navigation/native';
import { navigateType } from 'types/types';

const VfxCardStatements: FC<{ route: navigateType }> = (): ReactElement => {
  const navigation: navigateType = useNavigation();
  const { statementsInfo, ccyCardsSetInfo, setCcyCardStatements } = useContext(StatementsContext);
  const { t } = useTranslation();
  const { rowExtraInfoWrapper } = styles;
  const { showMonthYear, date, onSelectMonth, switchMonthYearPickerVisible } = useDate();
  const [rowPressed, setRowPressed] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [hideSearch, setHideSearch] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [selectedCurrencyCard, setSelectedCurrencyCard] = useState(
    statementsInfo.currencyCards.length > 0 ? statementsInfo?.currencyCards[0] : dropdownInitState,
  );
  const getStatements = async () => {
    setLoading(true);
    const currencyCardsInfo = await getCurrencyCardsInfo();
    currencyCardsInfo.length > 0 && ccyCardsSetInfo(currencyCardsInfo);
    const statements = await getCurrencyCardStatements(selectedCurrencyCard, date.toDate());
    if (statements?.data?.Succeeded) {
      await sendInfoLog({ event: 'GetCcyCardStatements', detail: 'success' });
      setCcyCardStatements(statements?.data?.Data?.Transactions);
    } else {
      if (statements?.data === 'Request failed with status code 401') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login', expired: true }],
        });
        await sendErrorLog({
          event: 'Vfxcard statements - getStatements',
          detail: 'user session expired: ' + statements?.data,
        });
      } else {
        setErrorMessage(`${t('somethingWentWrong')}. ${t('tryLaterContactSupport')}`);
        await sendErrorLog({ event: 'GetCcyCardStatements', detail: statements?.toString() });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getStatements();
  }, [selectedCurrencyCard]);

  const getCurrencyCardsInfo = async (): Promise<any> => {
    const response = await getCurrencyCards();
    if (response?.data?.Succeeded) {
      await sendInfoLog({ event: 'GetCurrencyCards', detail: 'success' });
      return response?.data?.Data;
    } else {
      if (response?.data === 'Request failed with status code 401') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login', expired: true }],
        });
        await sendErrorLog({
          event: 'VfxCard statements - getCurrencyCardsInfo',
          detail: 'user session expired: ' + response?.data,
        });
      } else {
        setErrorMessage(`${t('somethingWentWrong')}. ${t('tryLaterContactSupport')}`);
        await sendErrorLog({ event: 'GetCurrencyCards', detail: response?.toString() });
        return [];
      }
    }
  };

  const searchFilter = (item: StatementRow) => {
    if (searchInput === '') {
      return (
        <RowButton onPress={() => setRowPressed(item.TransID.toString())} pressed={rowPressed}>
          <>
            <Line />
            <RowList id={item.TransID.toString()} isPressed={false}>
              <DateAndOpTypeWrapper>
                <DateInfo value={`${item.TransDate} ${item.displayTransTime}`} />
                <OperationTypeInfo value={item.Action} />
              </DateAndOpTypeWrapper>
              <View style={styles.valueBalanceWrapper}>
                <CellAmountValue value={`${item.Amount} ${item.CCY}`} balance={item.Balance} />
                <View style={styles.cellBalanceWrapper}>
                  <Text style={styles.balanceCellTitle}>{t('balance')}</Text>
                  <Text style={styles.balanceCellValue}>{item.Balance}</Text>
                </View>
              </View>
            </RowList>
            {rowPressed === item.TransID.toString() && (
              <View style={styles.extraInfoWrapper}>
                <View style={rowExtraInfoWrapper}>
                  <CellExtraInfoWrapper title={t('valueDateCapital')} info={item.ValueDate} />
                </View>
                <View style={rowExtraInfoWrapper}>
                  <CellExtraInfoWrapper title={t('description')} info={item.Description} />
                </View>
                <View style={rowExtraInfoWrapper}>
                  <CellExtraInfoWrapper title={t('transactionDate')} info={item.TransDate} />
                </View>
              </View>
            )}
          </>
        </RowButton>
      );
    }
    if (
      item.Amount.toString().includes(searchInput) ||
      item.Action.toString().includes(searchInput.toLocaleLowerCase())
    ) {
      return (
        <RowButton onPress={() => setRowPressed(item.TransID.toString())} pressed={rowPressed}>
          <>
            <Line />
            <RowList id={item.TransID.toString()} isPressed={false}>
              <DateAndOpTypeWrapper>
                <DateInfo value={`${item.TransDate} ${item.displayTransTime}`} />
                <OperationTypeInfo value={item.Action} />
              </DateAndOpTypeWrapper>
              <View style={styles.valueBalanceWrapper}>
                <CellAmountValue value={`${item.Amount} ${item.CCY}`} balance={item.Balance} />
                <View style={styles.cellBalanceWrapper}>
                  <Text style={styles.balanceCellTitle}>{t('balance')}</Text>
                  <Text style={styles.balanceCellValue}>{item.Balance}</Text>
                </View>
              </View>
            </RowList>
            {rowPressed === item.TransID.toString() && (
              <View style={styles.extraInfoWrapper}>
                <View style={rowExtraInfoWrapper}>
                  <CellExtraInfoWrapper title={t('valueDateCapital')} info={item.ValueDate} />
                </View>
                <View style={rowExtraInfoWrapper}>
                  <CellExtraInfoWrapper title={t('description')} info={item.Description} />
                </View>
                <View style={rowExtraInfoWrapper}>
                  <CellExtraInfoWrapper title={t('transactionDate')} info={item.TransDate} />
                </View>
              </View>
            )}
          </>
        </RowButton>
      );
    } else {
      return <View />;
    }
  };

  const renderRow = ({ item }: { item: StatementRow }) => searchFilter(item);

  const sendStatementInFile = async ({
    fileType,
    allCards,
  }: {
    fileType: 'XLSX' | 'PDF';
    allCards: boolean;
  }) => {
    const response = await requestEmailWithCardFileStatements({
      cardNumber: allCards ? '*' : selectedCurrencyCard.value,
      file: fileType,
      date: date.toDate(),
    });
    if (response?.data === '') {
      setShowSuccessModal(true);
      await sendInfoLog({ event: 'requestEmailWithCardFileStatements - sendStatementInFile - `VfxCardStatements', detail: 'success' });
    } else {
      setErrorModal(true);
      await sendErrorLog({
        event: 'requestEmailWithCardFileStatements - sendStatementInFile - `VfxCardStatements',
        detail: 'at trying to send xlsx or pdf statement by email: ' + response?.toString(),
      });
    }
  };

  if (loading) {
    return (
      <LoadingIndicator
        size={'small'}
        testId={'CommunicationSettings.Loading'}
        background="white"
      />
    );
  }

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
      <View style={styles.dropdownCalendarWrapper}>
        <Dropdown
          testId="vfxCardStatements.selectedCurrencyCard"
          items={statementsInfo?.currencyCards}
          onChange={setSelectedCurrencyCard}
          placeholder={statementsInfo?.currencyCards[0]?.label}
          ddWidth={160}
          ddHeight={52}
          defaultMargin={false}
          defaultValue={selectedCurrencyCard}
          dropDownLabel={undefined}
          showBorder
        />
        <MonthYearPicker
          onButtonPress={switchMonthYearPickerVisible}
          onMonthSelected={onSelectMonth}
          format={'MMM YYYY'}
          month={date}
          containerFullWidth={false}
          isVisible={showMonthYear}
        />
      </View>
      <View style={styles.flatListWrapper}>
        {statementsInfo?.vfxCardsTransactions?.length === 0 ? (
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
            data={statementsInfo.vfxCardsTransactions}
            renderItem={renderRow}
            keyExtractor={(item: StatementRow) => item?.TransID?.toString()}
          />
        )}
      </View>
      {hideSearch && (
        <Searchbar onChangeText={setSearchInput} onPressBack={() => setHideSearch(false)} />
      )}
      {!hideSearch && (
        <BottomButtonOptionsStatements
          onPdfPress={() => sendStatementInFile({ fileType: 'PDF', allCards: true })}
          onXlsPress={() => sendStatementInFile({ fileType: 'XLSX', allCards: true })}
          onSearchPress={() => setHideSearch(true)}
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
  balanceCellTitle: {
    color: colors.grey.c900,
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.mediumSmall14,
  },
  balanceCellValue: {
    color: colors.grey.c750,
    fontFamily: 'OpenSans-Light',
    fontSize: fontSizes.mediumSmall14,
  },
  valueBalanceWrapper: { flexDirection: 'row', justifyContent: 'space-between' },
  extraInfoWrapper: {
    flex: 2,
    backgroundColor: colors.blueGrey.c50,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.blueGrey.c100,
  },
  rowExtraInfoWrapper: { flex: 1, flexDirection: 'row', marginVertical: 3, marginRight: 8 },
});

export default VfxCardStatements;
