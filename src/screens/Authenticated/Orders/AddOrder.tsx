import React, { useEffect, useLayoutEffect, useState, useContext, FC, ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ModalWindow from 'components/Prebuilts/ModalWindow';
import Button from 'components/Buttons/Button';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import ScrollViewWrapper from 'components/Wrappers/ScrollViewWrapper';
import ResponsiveFormWrapper from 'components/Wrappers/ResponsiveFormWrapper';
import LabelTextFieldWrapper from 'components/Wrappers/LabelTextFieldWrapper';
import AntDesigns from 'components/Icons/AntDesigns';
import Dropdown from 'components/Inputs/Dropdown';
import { customInputWrapperLine } from 'components/static';
import CalendarField from 'components/Inputs/CalendarField';

import { BeneficiariesContext } from 'state/BeneficiariesContext';
import { checkAddOrderTextInputError, renderTextAreaInput, renderTextInput } from 'utils/forms';
import { DEFAULT_HEADER_CONFIG, ORDERTYPE_NUMBER, ORDER_TYPE } from 'utils/static';
import { colors } from 'styles';
import { DropDown, genericFn } from 'types/components';
import { AddOrderNavigationProp } from 'types/types';
import { InputUserOrderToAdd } from 'types/screens';
import { getPlaneObjectData } from 'utils/localStorage';
import { addNewOrder, updateOrder } from 'api/OrdersRequests';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';
import { createButtonAlert } from 'utils/helpers';

const AddOrder: FC<AddOrderNavigationProp> = ({ navigation, route }): ReactElement => {
  const { t } = useTranslation();
  const orderToUpdate = route?.params?.item ?? null;
  const title = orderToUpdate ? t('updateOrder') : t('addNewOrder');
  const orderType = orderToUpdate ? ORDER_TYPE[Number(orderToUpdate?.Type)].label : '';
  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      title,
    });
  }, []);

  const { beneficiariesInfo } = useContext(BeneficiariesContext);
  const [showErrorLowTargetRateModal, setShowErrorLowTargetRateModal] = useState<boolean>(false);
  const [showMarketOrderLiveModal, setShowMarketOrderLiveModal] = useState<boolean>(false);
  const [showErrorTargetRateFarOffMarketModal, setShowErrorTargetRateFarOffMarketModal] =
    useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<string>('');
  const [currenciesPair, setCurrenciesPair] = useState<[]>([]);
  const [selectedOrderType, setSelectedOrderType] = useState<DropDown>(
    orderToUpdate ? { label: orderType, value: orderToUpdate?.Type.toString() } : ORDER_TYPE[0],
  );
  const [selectedCciesPair, setSelectedCciesPair] = useState<DropDown>({
    label: orderToUpdate ? orderToUpdate.CCYPair : 'GBPEUR',
    value: orderToUpdate ? orderToUpdate.CCYPair : 'GBPEUR',
  });
  const defaultCcy = orderToUpdate
    ? beneficiariesInfo?.currencies?.find((ccy: DropDown) => ccy.label === orderToUpdate?.TargetCCY)
    : beneficiariesInfo?.currencies[0];
  const [selectedCcy, setSelectedCcy] = useState<DropDown>(defaultCcy as DropDown);

  const defaultTargetAmount =
    orderToUpdate && orderToUpdate?.Type !== 0 && orderToUpdate?.Type !== 1
      ? orderToUpdate?.TargetAmount
      : '';
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: {
      ccyAmount: defaultTargetAmount,
      targetRate: orderToUpdate?.TargetRate.toString() ?? '',
      expiryDate: orderToUpdate?.ExpiryDate ?? new Date(),
      notes: orderToUpdate?.Note ?? '',
    },
  });
  useEffect(() => {
    const getCurrencyPairs = async () => {
      const currencyPairsToList = await getPlaneObjectData('currencyPairs');
      currencyPairsToList.ccyPairs.length > 0
        ? setCurrenciesPair(currencyPairsToList.ccyPairs) // find orderToUpdate?.CCYPair and set
        : setShowErrorModal('Something went wrong, try again later or contact customer support');
    };
    getCurrencyPairs();
  }, []);

  const addOrder = async ({ ccyAmount, targetRate, expiryDate, notes }: InputUserOrderToAdd) => {
    const orderInfo = {
      ccyAmount,
      targetRate,
      expiryDate,
      notes,
      ccyPair: selectedCciesPair.value,
      orderType: selectedOrderType.value,
      targetCcy: selectedCcy.value,
    };
    let response = null;
    if (orderToUpdate?.OrderID) {
      response = await updateOrder({ order: orderInfo }, orderToUpdate?.OrderID);
    } else {
      response = await addNewOrder({ order: orderInfo });
    }
    if (response?.data?.Succeeded) {
      setShowMarketOrderLiveModal(true);
      await sendInfoLog({
        event: orderToUpdate?.OrderID ? 'addOrder - Update' : 'addOder - New',
        detail: 'success',
      });
      reset();
    } else {
      setShowErrorModal(
        typeof response === 'string' && !!response
          ? response
          : 'Could not get the orders, try again or contact customer support.',
      );
      await sendErrorLog({
        event: orderToUpdate?.OrderID ? 'addOrder - Update' : 'addOder - New',
        detail: response + '',
      });
    }
  };

  return (
    <SafeAreaWrapper customStyle={styles.container}>
      <View style={styles.firstRowWrapper}>
        <View testID="addOrder.BidWrapper" style={styles.boxWrapper}>
          <Text style={styles.titleBox}>Bid</Text>
          <Text style={{ color: colors.blue.A700 }}>1.1612</Text>
        </View>
        <View testID="addOrder.OfferWrapper" style={styles.boxWrapper}>
          <Text style={styles.titleBox}>Offer</Text>
          <Text style={{ color: colors.red.c500 }}>1.1781</Text>
        </View>
        <View testID="addOrder.TimeWrapper" style={styles.boxWrapper}>
          <Text style={styles.titleBox}>Time</Text>
          <Text style={{ color: colors.grey.c600 }}>11:24:19</Text>
        </View>
        <View testID="addOrder.ChgWrapper" style={styles.boxWrapper}>
          <Text style={styles.titleBox}>%Chg</Text>
          <Text style={{ color: colors.red.c500 }}>0.00%</Text>
        </View>
      </View>
      <ScrollViewWrapper backgroundColor="white" testId="addOrder.viewFormWrapper">
        <KeyboardAwareScrollView>
          <ResponsiveFormWrapper testId="addOrder.wrapperAddOrderForm">
            <ModalWindow
              testId="addOrder.errorModal"
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
            <ModalWindow
              testId="addOrder.targetRateHigherThanCurrRate"
              isVisible={showErrorLowTargetRateModal}
              icon={
                <AntDesigns
                  testId="addOrder.infoIcon"
                  color={colors.cyan.c800}
                  size={46}
                  icon="infocirlce"
                />
              }
              title={t('alertCapital')}
              text={t('targetRateGreaterthanCurrRate')}
              buttonAcceptText={t('ok')}
              onButtonAcceptPress={() => setShowErrorLowTargetRateModal(false)}
            />
            <ModalWindow
              testId="addOrder.targetRateFarOffMarke"
              isVisible={showErrorTargetRateFarOffMarketModal}
              icon={
                <AntDesigns
                  testId="addOrder.infoIcon"
                  color={colors.cyan.c800}
                  size={46}
                  icon="infocirlce"
                />
              }
              title={t('alertCapital')}
              text={t('targetRateTooFarOffMarket')}
              buttonAcceptText={t('ok')}
              onButtonAcceptPress={() => setShowErrorTargetRateFarOffMarketModal(false)}
            />
            <ModalWindow
              testId="addOrder.MarketOrderLive"
              isVisible={showMarketOrderLiveModal}
              icon={
                <AntDesigns
                  testId="addOrder.infoIcon"
                  color={colors.cyan.c800}
                  size={46}
                  icon="infocirlce"
                />
              }
              title={t('marketOrderLive')}
              text={t('canViewLiveOrdersIn')}
              buttonAcceptText={t('ok')}
              onButtonAcceptPress={() => {
                setShowMarketOrderLiveModal(false);
                navigation.goBack();
              }}
            />
            <LabelTextFieldWrapper>
              <Dropdown
                defaultValue={selectedCciesPair}
                items={currenciesPair}
                testId="addOrder.cciesPair"
                onChange={setSelectedCciesPair}
                placeholder={selectedCciesPair.label}
                defaultMargin={false}
                dropDownLabel={t('ccyPair') as string}
                showBorder
              />
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              <Dropdown
                defaultValue={selectedOrderType}
                items={ORDER_TYPE}
                testId="addOrder.orderType"
                onChange={setSelectedOrderType}
                placeholder={''}
                defaultMargin={false}
                dropDownLabel={t('orderType') as string}
                showBorder
              />
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              <Dropdown
                defaultValue={selectedCcy}
                items={beneficiariesInfo?.currencies}
                testId="addOrder.ccySelect"
                onChange={setSelectedCcy}
                placeholder={''}
                defaultMargin={false}
                dropDownLabel={t('ccySelect') as string}
                showBorder
              />
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              <Controller
                control={control}
                rules={{
                  maxLength: 32,
                }}
                render={({ field: { onChange, value } }) =>
                  renderTextInput({
                    value: value.toString(),
                    onChange,
                    editable:
                      (orderToUpdate && orderToUpdate?.Type !== 0 && orderToUpdate?.Type !== 1) ||
                      (selectedOrderType.value !== '0' && selectedOrderType.value !== '1'),
                    textStyle: { textAlign: 'right' },
                    label: t('ccyAmount'),
                    placeHolder: t('amountEnter'),
                    wrapperStyle: checkAddOrderTextInputError(
                      errors,
                      'ccyAmount',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'addOrder.ccyAmount',
                    keyboardType: 'decimal-pad',
                  })
                }
                name="ccyAmount"
              />
            </LabelTextFieldWrapper>

            <LabelTextFieldWrapper>
              <Controller
                control={control}
                rules={{
                  minLength: 3,
                  maxLength: 9,
                  required: true,
                }}
                render={({ field: { onChange, value } }) =>
                  renderTextInput({
                    value: value.toString(),
                    editable: true,
                    onChange,
                    textStyle: { textAlign: 'right' },
                    label: t('targetRate'),
                    placeHolder: t('amountEnter'),
                    wrapperStyle: checkAddOrderTextInputError(
                      errors,
                      'targetRate',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'addOrder.targetRate',
                    keyboardType: 'decimal-pad',
                  })
                }
                name="targetRate"
              />
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <CalendarField
                    value={new Date(value)}
                    onChange={onChange as genericFn}
                    width="100%"
                    label={t('expiryDate') as string}
                    testId="addOrder.expiryDate"
                  />
                )}
                name="expiryDate"
              />
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              <Controller
                control={control}
                rules={{
                  maxLength: 31,
                }}
                render={({ field: { onChange, value } }) =>
                  renderTextAreaInput({
                    value,
                    onChange,
                    editable: true,
                    placeHolder: t(''),
                    label: t('notesCapital'),
                    wrapperStyle: checkAddOrderTextInputError(
                      errors,
                      'notes',
                      customInputWrapperLine,
                    ),
                    multiline: true,
                    numOfLines: 3,
                    labelMode: 'dark',
                    testId: 'addOrder.notes',
                    keyboardType: 'default',
                  })
                }
                name="notes"
              />
            </LabelTextFieldWrapper>
            <View style={styles.buttonWrapper}>
              <Button
                testId="addOrder.placeOrder"
                filled
                disabled={orderToUpdate ? false : !dirtyFields.targetRate}
                onPress={() =>
                  createButtonAlert(
                    t('confirmationCapital'),
                    t('wantToSaveOrder'),
                    handleSubmit(addOrder as unknown as genericFn),
                    true,
                  )
                }
                text={t('placeOrder')}
              />
            </View>
          </ResponsiveFormWrapper>
        </KeyboardAwareScrollView>
      </ScrollViewWrapper>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: colors.grey.A100 },
  buttonWrapper: {
    alignItems: 'center',
    marginVertical: 20,
  },
  firstRowWrapper: {
    justifyContent: 'space-evenly',
    backgroundColor: colors.grey.A250,
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 8,
    flexDirection: 'row',
  },
  boxWrapper: { alignItems: 'center' },
  titleBox: { color: colors.cyan.A800, marginBottom: 5 },
});

export default AddOrder;
