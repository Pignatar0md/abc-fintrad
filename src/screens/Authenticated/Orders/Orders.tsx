import React, { FC, ReactElement, useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import NoTransactionsText from 'components/Texts/NoTransactionsText';
import { colors, fontSizes } from 'styles';
import { OrdersScreenNavigationProp } from 'types/types';
import { Swipeable } from 'react-native-gesture-handler';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import BottomButtonOption from 'components/Prebuilts/BottomButtonsBar/BottomButtonOption';
import ActionButton from 'components/Table/ActionButton';
import RowButton from 'components/Buttons/Statements/RowButton';
import MaterialIcon from 'components/Icons/MaterialIcon';
import CellExtraInfoWrapper from 'components/Wrappers/CellExtraInfoWrapper';
import Line from 'components/Figures/Line';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import FontAwesomeIcon from 'components/Icons/FontAwesomeIcon';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';
import { deleteOrder, getOrdersList } from 'api/OrdersRequests';
import { OrdersContext } from 'state/OrdersContext';
import LoadingIndicator from 'components/LoadingIndicator';
import { OrderItem } from 'types/state';
import { ORDER_TYPE } from 'utils/static';
import AntDesigns from 'components/Icons/AntDesigns';
import { useIsFocused } from '@react-navigation/native';

const Orders: FC<OrdersScreenNavigationProp> = ({ navigation }): ReactElement => {
  const { t } = useTranslation();
  const { ordersInfo, ordersGetList, ordersGetListError, ordersGetListSuccess } =
    useContext(OrdersContext);
  const [rowPressed, setRowPressed] = useState<string>('');
  const [showErrorModal, setShowErrorModal] = useState<string>('');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const [showDeleteModal, setShowDeleteModal] = useState<{ show: boolean; orderId: number }>({
    show: false,
    orderId: 0,
  });
  let row: number[] = [];
  let prevOpenedRow: any;
  const closeRow = (index: number) => {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  const getOrders = async () => {
    const response = await getOrdersList();
    setLoading(true);
    ordersGetList();
    if (response?.data?.Succeeded) {
      setOrders(response?.data?.Data);
      ordersGetListSuccess(response?.data?.Data);
      await sendInfoLog({ event: '', detail: '' });
    } else {
      ordersGetListError('Could not get the orders, try again or contact customer support.');
      await sendErrorLog({ event: '', detail: '' });
    }
    setLoading(false);
  };

  useEffect(() => {
    isFocused && getOrders();
  }, [isFocused]);

  const removeOrder = async () => {
    setShowDeleteModal({ ...showDeleteModal, show: false });
    const response = await deleteOrder(showDeleteModal.orderId);
    if (response?.data?.Succeeded) {
      await sendInfoLog({ event: 'removeOrder - Orders', detail: 'successfully removed' });
      getOrders();
    } else {
      await sendErrorLog({
        event: 'removeOrder - Orders',
        detail: 'failed: ' + response.data.toString(),
      });
      setShowErrorModal('Something went wrong, try again or contact customer support.');
    }
  };

  const renderItem = ({ item, index }: { item: OrderItem; index: number }) => {
    const ID = item?.OrderID?.toString();
    return (
      <Swipeable
        renderRightActions={(progress, dragX) => renderHiddenItem({ item })}
        onSwipeableOpen={() => closeRow(index)}
        ref={(ref: any) => (row[index] = ref)}>
        <RowButton onPress={() => setRowPressed(ID)} pressed={rowPressed}>
          <>
            <View style={styles.rowWrapper}>
              <View style={{ padding: 10 }}>
                <View style={styles.descriptionDateContainer}>
                  <Text style={styles.descriptionValue}>{ORDER_TYPE[item?.Type].label}</Text>
                  <Text style={styles.dateValue}>{item?.OrderDate}</Text>
                </View>
                <View style={styles.valueBalanceWrapper}>
                  <View style={styles.targetContainer}>
                    <Text style={styles.targetText}>{t('targetColumn')}</Text>
                    <Text style={styles.targetTextValue}>{item?.TargetCCY}</Text>
                  </View>
                  <View style={styles.cellBalanceWrapper}>
                    <Text style={styles.balanceCellTitle}>{item?.CCYPair}</Text>
                    <MaterialIcon
                      icon={'keyboard-arrow-right'}
                      color={colors.blueGrey.c250}
                      size={20}
                      testId={'orders.iconButton.OpenRateArrow'}
                    />
                  </View>
                </View>
              </View>
              {rowPressed === ID && (
                <View style={styles.extraInfoWrapper}>
                  <View style={styles.rowExtraInfoWrapper}>
                    <CellExtraInfoWrapper
                      title={t('amountMayusc')}
                      info={item?.TargetAmount?.toString()}
                    />
                    <CellExtraInfoWrapper
                      title={t('levelMayusc')}
                      info={item?.TargetRate?.toString()}
                    />
                  </View>
                  <View style={styles.rowExtraInfoWrapper}>
                    <CellExtraInfoWrapper
                      title={t('priceMayusc')}
                      info={item?.TargetMargin?.toString()}
                    />
                    <CellExtraInfoWrapper title={t('expiryMayusc')} info={item?.ExpiryDate} />
                  </View>
                </View>
              )}
              <Line />
            </View>
          </>
        </RowButton>
      </Swipeable>
    );
  };

  const renderHiddenItem = ({ item }: { item: OrderItem }) => {
    const { backRightBtnRight, backRightBtnCenter } = styles;
    return (
      <View style={styles.buttonsWrapper}>
        <ActionButton
          onPress={() => navigation.navigate('AddOrder', { item })}
          buttonText={t('editCapital')}
          customStyle={backRightBtnCenter}
        />
        <ActionButton
          onPress={() => setShowDeleteModal({ show: true, orderId: item.OrderID })}
          buttonText={t('deleteCapital')}
          customStyle={backRightBtnRight}
        />
      </View>
    );
  };

  if (loading) {
    return <LoadingIndicator size={'small'} testId={'orders.loading'} background="white" />;
  }

  return (
    <SafeAreaWrapper>
      <ModalWindow
        testId="orders.deleteWarningModal"
        isVisible={showDeleteModal.show}
        icon={
          <FontAwesomeIcon
            testId="orders.questionIcon"
            color={colors.cyan.c600}
            size={46}
            icon="question-circle"
          />
        }
        title={t('confirmationCapital')}
        text={t('deleteBenericiaryWarning')}
        buttonAcceptText={t('ok')}
        buttonCancelText={t('cancelCapital') as string}
        onButtonAcceptPress={removeOrder}
        onButtonCancelPress={() => setShowDeleteModal({ ...showDeleteModal, show: false })}
      />
      <ModalWindow
        testId="orders.deleteWarningModal"
        isVisible={!!showErrorModal}
        icon={
          <AntDesigns
            testId="sendPayment.exclamationWarning"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('errorCapital')}
        text={showErrorModal}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setShowErrorModal('')}
      />
      <View style={styles.container}>
        {orders.length === 0 ? (
          <View style={{ flex: 1 }}>
            <NoTransactionsText
              customTextStyle={
                (!!ordersInfo.errorMessage as boolean)
                  ? { color: colors.red.c900, marginHorizontal: 20 }
                  : undefined
              }
              message={
                (!!ordersInfo.errorMessage as boolean)
                  ? ordersInfo.errorMessage
                  : t('noOrdersFound')
              }
            />
          </View>
        ) : (
          <FlatList
            style={{ backgroundColor: colors.grey.A100 }}
            data={orders}
            renderItem={renderItem}
          />
        )}
      </View>
      <BottomButtonOption buttonTitle={'addNew'} route={'AddOrder'} />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: colors.blue.c999,
  },
  headerContentWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue.c999,
    width: '100%',
    height: 30,
    paddingRight: 70,
    flexDirection: 'row',
  },
  headerText: {
    color: 'white',
    fontSize: fontSizes.medium16,
    fontFamily: 'OpenSans-SemiBold',
    marginRight: 5,
  },
  container: {
    backgroundColor: colors.grey.A100,
    flex: 1,
  },
  buttonsWrapper: {
    alignItems: 'center',
    backgroundColor: colors.grey.A100,
    width: 146,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  balanceCellTitle: {
    color: colors.grey.c800,
    marginRight: 10,
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.mediumSmall14,
  },
  valueBalanceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backRightBtnCenter: {
    backgroundColor: colors.blue.c650,
    right: 74,
  },
  backRightBtnRight: {
    backgroundColor: colors.red.A400,
    right: 2,
  },
  targetText: {
    margin: 3,
    color: colors.grey.c800,
    fontSize: fontSizes.small12,
    fontFamily: 'OpenSans-SemiBold',
  },
  targetTextValue: {
    color: colors.grey.c700,
    fontSize: fontSizes.small12,
    fontFamily: 'OpenSans-Regular',
  },
  dateValue: {
    marginHorizontal: 3,
    color: colors.grey.c900,
    fontSize: fontSizes.extraSmall10,
    fontFamily: 'OpenSans-SemiBold',
  },
  descriptionValue: {
    padding: 2,
    marginHorizontal: 3,
    backgroundColor: colors.cyan.A800,
    color: colors.grey.A100,
    fontSize: fontSizes.small12,
    fontFamily: 'OpenSans-Bold',
  },
  rowWrapper: { flex: 2, backgroundColor: colors.grey.A100 },
  descriptionDateContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  targetContainer: { flexDirection: 'row', alignItems: 'center' },
  cellBalanceWrapper: { flexDirection: 'row', alignItems: 'flex-end' },
  rowExtraInfoWrapper: { flex: 1, flexDirection: 'row', marginVertical: 12 },
  extraInfoWrapper: {
    flex: 2,
    backgroundColor: colors.blueGrey.c50,
    marginTop: 2,
    borderWidth: 1,
    borderColor: colors.blueGrey.c100,
  },
});

export default Orders;
