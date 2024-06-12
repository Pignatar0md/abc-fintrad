import React, { FC, ReactElement, useContext, useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import LightButton from 'components/Buttons/LightButton';
import TitleSection from 'components/Texts/TitleSection';
import TextWithPickerField from 'components/Inputs/TextWithPickerField';
import ImageButton from 'components/Buttons/ImageButton';
import MaterialCommunity from 'components/Icons/MaterialCommunity';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import HighLabel from 'components/HighLabel';
import CalendarField from 'components/Inputs/CalendarField';
import ProgressBar from 'components/Prebuilts/ProgressBar';
import AntDesigns from 'components/Icons/AntDesigns';
import Checkbox from 'components/Inputs/Checkbox';
import Pager from 'components/Pager';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import Line from 'components/Figures/Line';
import LoadingIndicator from 'components/LoadingIndicator';

import { colors, fontSizes } from 'styles';
import { TradeScreenNavigationProp } from 'types/types';
import { GBP_CURRENCY_SYMBOL, DEFAULT_HEADER_CONFIG, EXECUTE_CURRENCY_TRADE } from 'utils/static';
import { TRADE_LIMITS_GBP } from 'utils/Enums';
import { formatDate } from 'utils/helpers/dates';
import { DropDown, genericFn } from 'types/components';
import { UserDetailsContext } from 'state/UserDetailsContext';
import { DropDownCurrency } from 'interfaces/forms';
import { BeneficiariesContext } from 'state/BeneficiariesContext';
import { getPlaneStringData, storePlaneStringData } from 'utils/localStorage';
import { getRateRequest } from 'api/TradeRequests';

// ToDO: unit tests, details screen.
const Trade: FC<TradeScreenNavigationProp> = ({ navigation, route }): ReactElement => {
  const BUY_AMOUNT_INIT_VALUE = '0.00';
  const INIT_TIMER = 20;

  const { t } = useTranslation();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      amountCcySell: route?.params?.balance ?? '',
      amountCcyBuy: '',
      fee: BUY_AMOUNT_INIT_VALUE,
      valueDate: new Date(),
    },
  });
  const { beneficiariesInfo } = useContext(BeneficiariesContext);
  const { userInfo } = useContext(UserDetailsContext);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reverted, setReverted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(INIT_TIMER);
  const [rateObtained, setRateObtained] = useState<string>(BUY_AMOUNT_INIT_VALUE);
  const [showNotAllowedToTradeModal, setShowNotAllowedToTradeModal] = useState<boolean>(false);
  const filteredCurrencyToBuy =
    route?.params?.CCY &&
    beneficiariesInfo?.currencies?.find((ccy) => ccy.value === route?.params?.CCY.split('/')[0]);
    const filteredCurrencyToSell =
    route?.params?.CCY &&
    beneficiariesInfo?.currencies?.find((ccy) => ccy.value === route?.params?.CCY.split('/')[1]);
  
  const preselectedCurrencyToBuyDropdown = route?.params?.CCY
    ? filteredCurrencyToBuy
    : userInfo.defaultCurrency;
    const preselectedCurrencyToSellDropdown = route?.params?.CCY
    ? filteredCurrencyToSell
    : beneficiariesInfo?.currencies[0];
  const [currToBuy, setCurrToBuy] = useState<DropDownCurrency>(
    (route?.params?.op === 'sell' ? preselectedCurrencyToSellDropdown : preselectedCurrencyToBuyDropdown) as DropDownCurrency,
  );
  const [currToReceive, setCurrToReceive] = useState<DropDown>(
    (route?.params?.op === 'sell' ? preselectedCurrencyToBuyDropdown : preselectedCurrencyToSellDropdown) as DropDownCurrency,
    );
  const [amountToBuy, setAmountToBuy] = useState<string>(
    route?.params?.balance ? `${route?.params?.balance}` : '',
  );
  const [amountToReceive, setAmountToReceive] = useState<string>('');
  const [showConfirmTradeModal, setShowConfirmTradeModal] = useState<boolean>(false);
  const [showMinAmountModal, setShowMinAmountModal] = useState<boolean>(false);
  const [showModalMessage, setShowModalMessage] = useState<boolean>(false);
  const [showNoRateModal, setShowNoRateModal] = useState<boolean>(false);
  const [processStep, setProcessStep] = useState<number>(1);

  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      title: t('tradeTitle') as string,
    });
  }, []);

  const onOkGetRateModalPress = async ({ valueDate }: { valueDate: string }) => {
    const doNotShowAgain = showModalMessage === false ? '0' : '1';
    await storePlaneStringData(EXECUTE_CURRENCY_TRADE, doNotShowAgain);
    showConfirmTradeModal && setShowConfirmTradeModal(false);
    // setLoading(true);
    // getRateAPICALL
    const data = {
      reverted: reverted,
      currency1: currToBuy.value,
      currency2: currToReceive.value,
      value: amountToBuy,
      source: route?.params.op || '', //buy = 0. sell = 1
      valueDate,
      callback: () => ({}),
    };
    const response = await getRateRequest(data);
    if (response.data.Succeeded) {
      setIsTimerActive(true);
      setProcessStep(2);
      setRateObtained('3242.23'); // fill with data from the API
      setAmountToReceive('111.00'); // fill with data from the API
    } else {
      setIsTimerActive(true);
      setProcessStep(2);
    }
    setLoading(false);
  };

  const confirmTransaction = () => {
    showConfirmTradeModal && setShowConfirmTradeModal(false);
    setIsTimerActive(true);
    setProcessStep(3);
  };

  const swapCurrencies = () => {
    setReverted(!reverted);
    setCurrToBuy(currToReceive);
    setCurrToReceive(currToBuy);
  };

  const onGetRatePress = async () => {
    const userCanTrade = userInfo.userInformation.TradingAllowed;
    if (!userCanTrade) {
      setShowNotAllowedToTradeModal(true);
      return;
    }
    const shouldShowRunTradeAgain = await getPlaneStringData(EXECUTE_CURRENCY_TRADE);
    if (shouldShowRunTradeAgain === '0') {
      setShowConfirmTradeModal(true);
    } else {
      handleSubmit(onOkGetRateModalPress as unknown as genericFn);
    }
  };

  const onCancelPress = () => callBackTimer();

  const callBackTimer = () => {
    setRateObtained(BUY_AMOUNT_INIT_VALUE);
    setIsTimerActive(false);
    setProcessStep(1);
    setTimeLeft(INIT_TIMER);
    setAmountToReceive('');
  };

  const isNotTheThirdStep = processStep !== 3;

  if (loading) {
    return <LoadingIndicator testId="login.loader" size="large" background="white" />;
  }

  return (
    <SafeAreaWrapper customStyle={isNotTheThirdStep ? styles.container : styles.infoWrapper}>
      <ModalWindow
        testId="trade.confirmCurrencyTrade"
        isVisible={showConfirmTradeModal}
        icon={
          <AntDesigns
            testId="login.exclamationWarning"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        extraComponent={
          <Checkbox
            onPress={() => setShowModalMessage(!showModalMessage)}
            value={showModalMessage}
            customTextStyle={{ color: colors.grey.c400, fontFamily: 'OpenSans-SemiBold' }}
            text={t('notShowMessageAgain') as string}
            flexDirection="row"
          />
        }
        title={t('warning')}
        text={t('tradeWarningMessage')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => handleSubmit(onOkGetRateModalPress as unknown as genericFn)}
      />
      <ModalWindow
        testId="trade.minimumAmount"
        isVisible={showMinAmountModal}
        icon={
          <AntDesigns
            testId="login.exclamationWarning"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('warning')}
        text={`${t('tradeMinAmountWarningMessage')} AUD 194.00 (${GBP_CURRENCY_SYMBOL} ${[
          TRADE_LIMITS_GBP.LOWER,
        ]})`}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setShowMinAmountModal(false)}
      />
      <ModalWindow
        testId="trade.NoPermissionToTrade"
        isVisible={showNotAllowedToTradeModal}
        icon={
          <AntDesigns
            testId="login.exclamationWarning"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('noPermissionToTrade')}
        text={t('notAllowedToTrade')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setShowNotAllowedToTradeModal(false)}
      />
      <ModalWindow
        testId="trade.noRateAvailable"
        isVisible={showNoRateModal}
        icon={
          <AntDesigns
            testId="login.exclamationWarning"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('warning')}
        text={t('notRateAvailable')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setShowNoRateModal(false)}
      />

      <KeyboardAwareScrollView style={{ width: '100%' }}>
        <ScrollView>
          <View style={styles.titleContainer}>
            <TitleSection title={isNotTheThirdStep ? t('getRate') : t('details')} />
          </View>
          <View style={isNotTheThirdStep && { alignItems: 'center' }}>
            {isNotTheThirdStep ? (
              <View style={styles.inputsContainer}>
                <View style={styles.swapAmountsContainer}>
                  <View>
                    <TextWithPickerField
                      preSelected={currToBuy}
                      itemsList={beneficiariesInfo?.currencies}
                      value={amountToBuy}
                      textEditable={processStep !== 2}
                      setValue={setAmountToBuy as genericFn}
                      setSelected={setCurrToBuy as genericFn}
                      dropdownWidth={100}
                      textPlaceHolder={t('sellAmount') as string}
                    />
                    <TextWithPickerField
                      preSelected={currToReceive}
                      itemsList={beneficiariesInfo?.currencies}
                      value={amountToReceive}
                      textEditable={processStep !== 2}
                      setValue={setAmountToReceive as genericFn}
                      setSelected={setCurrToReceive as genericFn}
                      dropdownWidth={100}
                      textPlaceHolder={t('buyAmount') as string}
                    />
                  </View>
                  <ImageButton
                    buttonText={'Swap'}
                    disabled={processStep === 2}
                    textSize={12}
                    textColor={colors.grey.c750}
                    icon={
                      <MaterialCommunity
                        icon={'swap-vertical-circle'}
                        color={processStep === 2 ? colors.cyan.c200 : colors.cyan.A800}
                        size={40}
                        testId={'trade.imageButton.swapIcon'}
                      />
                    }
                    onPress={swapCurrencies}
                    testId={'trade.SwapButton'}
                  />
                </View>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <CalendarField
                      testId="trade.valueDate"
                      value={value}
                      onChange={onChange as genericFn}
                    />
                  )}
                  name="valueDate"
                />
              </View>
            ) : (
              <View style={{ paddingHorizontal: 20 }}>
                <View style={styles.rowWrapper}>
                  <Text style={styles.legend}>{t('buyCapital')}</Text>
                  <Controller
                    control={control}
                    render={({ field: { value } }) => <Text style={styles.value}>{value}</Text>}
                    name={'amountCcyBuy'}
                  />
                </View>
                <Line />
                <View style={styles.rowWrapper}>
                  <Text style={styles.legend}>{t('sellCapital')}</Text>
                  <Controller
                    control={control}
                    render={({ field: { value } }) => <Text style={styles.value}>{value}</Text>}
                    name={'amountCcySell'}
                  />
                  {/* <Text style={styles.value}>{'b'}</Text> */}
                </View>
                <Line />
                <View style={styles.rowWrapper}>
                  <Text style={styles.legend}>{t('feeCapital')}</Text>
                  <Controller
                    control={control}
                    render={({ field: { value } }) => <Text style={styles.value}>{value}</Text>}
                    name={'fee'}
                  />
                </View>
                <Line />
                <View style={styles.rowWrapper}>
                  <Text style={styles.legend}>{t('ValueDate')}</Text>
                  <Controller
                    control={control}
                    render={({ field: { value } }) => (
                      <Text style={styles.value}>{formatDate(value.toString())}</Text>
                    )}
                    name={'valueDate'}
                  />
                </View>
                <Line />
              </View>
            )}
            <View
              style={
                isNotTheThirdStep
                  ? styles.highLabelWrapper
                  : [styles.highLabelWrapper, { marginTop: 80 }]
              }>
              <HighLabel
                customStyle={
                  processStep === 1
                    ? { backgroundColor: colors.lightBlue.c80, opacity: 0.7 }
                    : { backgroundColor: colors.lightBlue.c500 }
                }
                active={isTimerActive}
                textTitle={t('yourRateCapital')}
                textValue={rateObtained + ''}
              />
            </View>
            <View style={styles.progressBarWrapper}>
              {isNotTheThirdStep && (
                <ProgressBar active={isTimerActive} time={timeLeft} onTimeOut={callBackTimer} />
              )}
            </View>
            <View
              style={
                isNotTheThirdStep
                  ? styles.getRateButtonWrapper
                  : [styles.getRateButtonWrapper, { width: '100%' }]
              }>
              <Pager selected={processStep} amount={3} />
              {processStep === 1 ? (
                !isTimerActive && (
                  <LightButton
                    size="big"
                    onPress={onGetRatePress}
                    text={t('getRate')}
                    testId={'trade.GetRate'}
                  />
                )
              ) : processStep === 2 ? (
                <View style={styles.buttonWrapper}>
                  <LightButton
                    inverted={true}
                    onPress={onCancelPress}
                    text={t('cancelCapital')}
                    testId="introSlider.skipButton"
                  />
                  <LightButton
                    onPress={confirmTransaction}
                    text={t('confirmCapital')}
                    testId="introSlider.validateButton"
                  />
                </View>
              ) : (
                <View style={[styles.buttonWrapper, { paddingHorizontal: 20 }]}>
                  <LightButton
                    inverted={true}
                    onPress={() => console.log('finished')}
                    text={t('finish')}
                    testId="introSlider.skipButton"
                  />
                  <LightButton
                    onPress={() => console.log('sent')}
                    text={t('sendNow')}
                    testId="introSlider.validateButton"
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.grey.A100,
  },
  titleContainer: { flex: 1, paddingTop: 20, justifyContent: 'center', alignItems: 'center' },
  inputsContainer: { flex: 1, justifyContent: 'space-around' },
  swapAmountsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highLabelWrapper: { flex: 1, marginVertical: 20, width: '100%' },
  progressBarWrapper: { flex: 2, alignItems: 'center', justifyContent: 'flex-start' },
  getRateButtonWrapper: { height: 80, alignItems: 'center', width: '90%', marginBottom: 30 },
  buttonWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  rowWrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  legend: {
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.medium16,
    marginVertical: 20,
    letterSpacing: 0.8,
  },
  infoWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
    paddingHorizontal: 30,
    backgroundColor: colors.grey.A100,
  },
  value: {
    fontFamily: 'OpenSans-Light',
    fontSize: fontSizes.medium16,
    marginVertical: 20,
  },
});

export default Trade;
