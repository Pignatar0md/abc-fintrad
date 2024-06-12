import React, { FC, ReactElement, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';

import Line from 'components/Figures/Line';
import IconButton from 'components/Buttons/IconButton';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import MaterialIcon from 'components/Icons/MaterialIcon';
import DateInfo from 'components/Texts/Statements/DateInfo';
import RowButton from 'components/Buttons/Statements/RowButton';
import CellExtraInfoWrapper from 'components/Wrappers/CellExtraInfoWrapper';
import OperationTypeInfo from 'components/Texts/Statements/OperationTypeInfo';
import DateAndOpTypeWrapper from 'components/Wrappers/Statements/DateAndOpTypeWrapper';
import LoadingIndicator from 'components/LoadingIndicator';
import NoTransactionsText from 'components/Texts/NoTransactionsText';

import WrappedQuickLinks from 'components/Prebuilts/WrappedQuickLinks';
import AntDesigns from 'components/Icons/AntDesigns';
import DrawerHeader from 'components/Prebuilts/Headers/DrawerHeader';

import { PaymentsContext } from 'state/PaymentContext';
import { DEFAULT_HEADER_CONFIG, PAYMENT_STATUS_COLORS } from 'utils/static';
import { colors, fontSizes } from 'styles';
import { PaymentsScreenNavigationProp } from 'types/types';
import { renderStatusElement } from 'utils/forms';
import { paymentStatusType } from 'types/screens';
import { PaymentItem } from 'types/state';
import { getPayments } from 'api/PaymentsRequests';
import { formatDate } from 'utils/helpers/dates';
import { formatBalance } from 'utils/helpers/Balances';
import { getPlaneObjectData } from 'utils/localStorage';

import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';

const PaymentsForMain: FC<PaymentsScreenNavigationProp> = ({ navigation }): ReactElement => {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const [rowPressed, setRowPressed] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userApprovalLevel, setUserApprovalLevel] = useState<number>(0);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { paymentsInfo, paymentsGetList, paymentsGetListSuccess, paymentsGetListError } =
    useContext(PaymentsContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      header: () => (
        <>
          <DrawerHeader
            title={t('paymentsCapital')}
            extraIcon={
              <IconButton
                onPress={() => setShowInfoModal(true)}
                testId="paymentsInfo"
                icon={
                  <AntDesigns
                    icon={'infocirlce'}
                    color={colors.grey.A100}
                    size={10}
                    testId={'payments.iconTitle'}
                  />
                }
              />
            }
          />
          <WrappedQuickLinks />
        </>
      ),
    });
  }, []);

  useEffect(() => {
    getPaymentsList();
    getLoggedUserDetails();
  }, []);

  const getLoggedUserDetails = async () => {
    const { userDetails } = await getPlaneObjectData('userDetails');
    if (userDetails.Success) {
      setUserApprovalLevel(userDetails.PaymentApprovalType);
    }
  };

  const getPaymentsList = async () => {
    const response = await getPayments();
    setLoading(true);
    paymentsGetList();
    if (response?.data?.Succeeded) {
      await sendInfoLog({ event: 'GetCurrencyCards', detail: response?.data?.Succeeded });
      paymentsGetListSuccess(response?.data?.Data);
    } else {
      if (response?.data === 'Request failed with status code 401') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login', expired: true }],
        });
        await sendErrorLog({
          event: 'getPaymentsList getPayments - Payments',
          detail: 'user session expired: ' + response?.data,
        });
      } else {
        setErrorMessage(`${t('somethingWentWrong')}. ${t('tryLaterContactSupport')}`);
        await sendErrorLog({
          event: 'getPaymentsList getPayments - Payments',
          detail: response?.toString(),
        });
        paymentsGetListError(response?.data);
      }
    }
    setLoading(false);
  };

  const renderRow = ({ item }: { item: PaymentItem }) => {
    const paymentDefinedStatus = item.Status === 0 || item.Status === 1 ? '3' : item.Status + '';
    const colorStatus = PAYMENT_STATUS_COLORS[paymentDefinedStatus as paymentStatusType];
    const formattedDate = item?.Date && formatDate(item.Date);
    return (
      <RowButton onPress={() => setRowPressed(item.ID.toString())} pressed={rowPressed}>
        <>
          <View style={styles.rowWrapper}>
            <View>
              <DateAndOpTypeWrapper>
                <OperationTypeInfo
                  customStyle={{ fontFamily: 'OpenSans-Bold', fontSize: fontSizes.small12 }}
                  value={item.Currency}
                />
                <DateInfo customStyle={{ fontFamily: 'OpenSans-SemiBold' }} value={formattedDate} />
              </DateAndOpTypeWrapper>
              <Text style={styles.toUser}>{item.Name}</Text>
            </View>
            <View style={styles.amountDotWrapper}>
              <Text style={styles.amountText}>{formatBalance(item.Amount)}</Text>
              <MaterialIcon
                icon={'circle'}
                color={colorStatus}
                size={9}
                testId={'payments.Circle'}
              />
            </View>
          </View>
          <Line />
          {rowPressed === item.ID.toString() && (
            <View style={styles.extraInfoWrapper}>
              <View style={[styles.rowExtraInfoWrapper]}>
                <CellExtraInfoWrapper title={t('dateMayusc')} info={formattedDate} />
                {renderStatusElement(item.Status, item.Name, item.Creator, userApprovalLevel)}
              </View>
              <View style={styles.rowExtraInfoWrapper}>
                <CellExtraInfoWrapper
                  title={t('timeMayusc')}
                  info={item.EntryDate.split(' ')[1].substring(0, 5)}
                />
              </View>
              <View style={styles.rowExtraInfoWrapper}>
                <CellExtraInfoWrapper title={t('valueDate')} info={formattedDate} />
              </View>
              <View style={styles.rowExtraInfoWrapper}>
                <CellExtraInfoWrapper title={t('userMayusc')} info={item.Creator} />
              </View>
              <View style={styles.rowExtraInfoWrapper}>
                <CellExtraInfoWrapper title={t('amountMayusc')} info={item.Amount.toString()} />
              </View>
              <View style={styles.rowExtraInfoWrapper}>
                <CellExtraInfoWrapper title={t('nameMayusc')} info={item.Name} />
              </View>
            </View>
          )}
        </>
      </RowButton>
    );
  };

  if (loading) {
    return <LoadingIndicator size={'small'} testId={''} background="white" />;
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <ModalWindow
          testId="trade.redirectWebBrowser"
          isVisible={showInfoModal}
          icon={
            <AntDesigns
              testId="sendPayment.exclamationWarning"
              color={colors.cyan.c800}
              size={46}
              icon="infocirlce"
            />
          }
          title={t('paymentsCapital')}
          text={t('paymentActivityLastTwoWeeks')}
          buttonAcceptText={t('ok')}
          onButtonAcceptPress={() => setShowInfoModal(false)}
        />
        {paymentsInfo?.paymentsList?.length === 0 ? (
          <View style={{ flex: 1 }}>
            <NoTransactionsText
              customTextStyle={
                (!!errorMessage as boolean)
                  ? { color: colors.red.c900, marginHorizontal: 20 }
                  : undefined
              }
              message={(!!errorMessage as boolean) ? errorMessage : t('noPaymentsFound')}
            />
          </View>
        ) : (
          <FlatList
            renderItem={renderRow}
            data={paymentsInfo?.paymentsList}
            keyExtractor={(item: PaymentItem) => item.ID.toString()}
          />
        )}
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.grey.A100,
  },
  extraInfoWrapper: {
    flex: 2,
    backgroundColor: colors.blueGrey.c50,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.blueGrey.c100,
  },
  rowExtraInfoWrapper: { flex: 1, flexDirection: 'row', marginVertical: 3, marginRight: 5 },
  rowWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  toUser: {
    marginTop: 4,
    fontFamily: 'OpenSans-Regular',
    color: colors.grey.c900,
    fontSize: fontSizes.mediumSmall14,
    letterSpacing: 0.5,
  },
  amountDotWrapper: { flexDirection: 'row', alignItems: 'center' },
  amountText: {
    color: colors.blue.c999,
    marginRight: 12,
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.medium16,
  },
});

export default PaymentsForMain;
