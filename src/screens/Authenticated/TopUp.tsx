import React, { FC, ReactElement, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import LightButton from 'components/Buttons/LightButton';
import AntDesigns from 'components/Icons/AntDesigns';
import FontAwesomeIcon from 'components/Icons/FontAwesomeIcon';
import TextField from 'components/Inputs/TextField';
import Pager from 'components/Pager';
import BottomButtonOption from 'components/Prebuilts/BottomButtonsBar/BottomButtonOption';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import NoTransactionsText from 'components/Texts/NoTransactionsText';
import TitleSection from 'components/Texts/TitleSection';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import { customInputWrapperLine } from 'components/static';
import TransparentButton from 'components/Buttons/TransparentButton';
import MaterialIcon from 'components/Icons/MaterialIcon';
import Line from 'components/Figures/Line';
import Button from 'components/Buttons/Button';
import Checkbox from 'components/Inputs/Checkbox';

import { request3DSWindow, validate3DSChallenge } from 'api/3DsRequests';
import { colors, fontSizes } from 'styles';
import { debitCardItemInitialState, poundsInitState } from './initialStates';
import {
  DEFAULT_ADDRESS1,
  DEFAULT_ADDRESS2,
  DEFAULT_CITY,
  DEFAULT_COUNTRYCODE,
  DEFAULT_HEADER_CONFIG,
  DEFAULT_POSTCODE,
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
  GBP_CURRENCY_SYMBOL,
} from 'utils/static';
import { getCardImageByType, getCardNameByType, getCardType } from 'utils/cards';
import { formatThousand } from 'utils/helpers';
import { URLS, VFX_API_URLS } from 'utils/urls';
import { getPlaneObjectData } from 'utils/localStorage';
import { currencyFormat } from 'utils/helpers/Balances';

import { addTopupRequest, getLimits } from 'api/TopUpRequests';
import { getDebitCards } from 'api/CardRequests';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';
import { TopUpNavigationProp } from 'types/types';
import { DebitCard, PoundsSelector } from 'types/state';
import { Response3DS } from 'interfaces/screens';
import { errorMessages3DS } from 'utils/static/ErrorMessages';
import { DSECURE_SYSTEM_NAME } from '@env';
import moment from 'moment';
import LoadingIndicator from 'components/LoadingIndicator';
import DeviceInfo from 'react-native-device-info';
import WebView from 'react-native-webview';

const HARDCODED_AMOUNT = '121.12';
// const HARDCODED_CARD = [{ ID: 123123, Status: 1, Type: 2, CardNumber: '1321121212121212' }];
const TopUp: FC<TopUpNavigationProp> = ({ navigation }): ReactElement => {
  const { t } = useTranslation();
  const [debitCards, setDebitCards] = useState<DebitCard[]>([debitCardItemInitialState]);
  const [processStep, setProcessStep] = useState<number>(1);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedDebitCard, setSelectedDebitCard] = useState<DebitCard>(debitCardItemInitialState);
  const [pounds, setPounds] = useState<PoundsSelector>(poundsInitState);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [amountToConfirmModal, setAmountToConfirmModal] = useState<string>('');
  const [confirmCVV, setConfirmCVV] = useState<string>('');
  const [topUpMaxLimit, setTopUpMaxLimit] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [threeDsErrorModal, setThreeDsErrorModal] = useState<string>('');
  const [userAgent, setUserAgent] = useState<string>('');
  const [showSuccessAddingTopupModal, setShowSuccessAddingTopupModal] = useState<boolean>(false);
  const [webViewHtmlSource, setWebViewHtmlSource] = useState<string>('');
  const [maxTopupLimitShowModal, setMaxTopupLimitShowModal] = useState<boolean>(false);
  const [noClientFoundShowModal, setNoClientFoundShowModal] = useState<boolean>(false);
  const [noCardShowModal, setNoCardShowModal] = useState<boolean>(false);
  const [fraudShowModal, setFraudShowModal] = useState<boolean>(false);
  const [invalidTopUpAmountShowModal, setInvalidTopUpAmountShowModal] = useState<boolean>(false);
  const [invalidCVVShowModal, setInvalidCVVShowModal] = useState<boolean>(false);
  const [cardConfirmationShowModal, setCardConfirmationShowModal] = useState<boolean>(false);
  const [noCardHolderVerificationMethodShowModal, setNoCardHolderVerificationMethod] =
    useState<boolean>(false);
  const [passedLimitShowModal, setPassedLimitShowModal] = useState<boolean>(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      title: t('topUp') as string,
    });
  }, []);

  useEffect(() => {
    DeviceInfo.getUserAgent()
      .then((userAgent) => {
        setUserAgent(userAgent);
      })
      .catch((error) => console.log('error at getting user agent: ', error.toString()));
  }, []);

  useEffect(() => {
    const getDebitCardsInfo = async () => {
      const response = await getDebitCards();
      if (response?.data?.Succeeded) {
        await sendInfoLog({ event: 'GetDebitCards', detail: response.data.Succeeded });
        response?.data?.Data.length > 0 && setDebitCards(response?.data?.Data);
      } else {
        setErrorMessage(`${t('somethingWentWrong')}. ${t('tryLaterContactSupport')}`);
        await sendErrorLog({ event: 'GetDebitCards', detail: response.data.toString() });
      }
    };
    getDebitCardsInfo();
  }, []);

  const renderRow = ({ item }: { item: DebitCard }) => {
    const { ID, CardNumber } = item;
    const cardType = getCardType(CardNumber);
    const customImageWrapper = styles.imageShadowWrapper;
    return (
      <View key={ID} testID={`debitCardsList.${ID}`}>
        <View style={styles.optionWrapper}>
          <TransparentButton
            testId={`debitCardsList.cardButton.${CardNumber}`}
            optionSelected={ID === selectedDebitCard.ID}
            onPress={() => setSelectedDebitCard(item)}>
            <View style={customImageWrapper}>
              <Image source={getCardImageByType(cardType.type)} style={styles.cardImage} />
            </View>
            <View style={styles.optionTitleWrapper}>
              <Text testID="debitCardsList.card.title" style={styles.optionTitleCardType}>
                {getCardNameByType(cardType.type)}
              </Text>
              <Text
                testID={`debitCardsList.card.title.${CardNumber}`}
                style={styles.optionTitleCardNumber}>
                {`**** **** **** ${CardNumber.slice(-4)}`}
              </Text>
            </View>
            <MaterialIcon
              icon={'keyboard-arrow-right'}
              color={colors.blueGrey.c250}
              size={20}
              testId={'major.iconButton.OpenRateArrow'}
            />
          </TransparentButton>
        </View>
        <Line />
      </View>
    );
  };

  const selectedAmountToTopup = Object.keys(pounds).find((key) => pounds[key] === true) || '0';
  const amount = selectedAmountToTopup === 'custom' ? customAmount : selectedAmountToTopup;

  const goToSlideTwo = async () => {
    if (
      Object.values(pounds).indexOf(true) === -1 ||
      (pounds.custom && Number(customAmount) <= 0)
    ) {
      setInvalidTopUpAmountShowModal(true);
    }
    const response = await getLimits();
    if (response?.data?.Succeeded) {
      const limit = response?.data?.Data?.limit;
      if (limit <= 0) {
        setPassedLimitShowModal(true);
        await sendInfoLog({
          event: 'Topup',
          detail: `The user tried to topup, but reached the allowed limit. (inputted amount:  ${amount} GBP | limit: ${limit}  GBP)`,
        });
      } else if (limit != -1 && parseFloat(amount) > parseFloat(limit)) {
        const maxLimit = formatThousand(limit.toString(), ',', 3);
        setTopUpMaxLimit(maxLimit);
        await sendInfoLog({
          event: 'Topup',
          detail: `On do a Topup the user reached the maximum limit: ${maxLimit} GBP  Amount: ${amount} GBP`,
        });
        setMaxTopupLimitShowModal(true);
      } else {
        setProcessStep(2);
      }
    } else {
      await sendErrorLog({
        event: 'Topup',
        detail: `Response from server is not successful as expected. Endpoint: ${URLS.version}${VFX_API_URLS.topupLimits}. - goToSlideTwo()`,
      });
    }
  };

  const goToSlideThree = () => {
    if (selectedDebitCard.ID === 0) {
      setNoCardShowModal(true);
    } else {
      setProcessStep(3);
    }
  };

  const goToSlideFour = async () => {
    if (!confirmCVV) {
      setInvalidCVVShowModal(true);
    } else if (confirmCVV.length !== 3 || isNaN(Number(confirmCVV))) {
      setInvalidCVVShowModal(true);
    } else {
      const amountForConfirmationFormatted = currencyFormat.format(Number(amount));
      setAmountToConfirmModal(amountForConfirmationFormatted);
      setCardConfirmationShowModal(true);
    }
  };

  const sendNow = () => {
    navigation.navigate('SendPayment', { CCY: 'ase ' });
  };

  const defineWhereToJump = () => {
    let mainButtonFn: (() => Promise<any>) | (() => void) = goToSlideTwo;
    if (processStep === 2) {
      mainButtonFn = goToSlideThree;
    } else if (processStep === 3) {
      mainButtonFn = goToSlideFour;
    }
    return mainButtonFn;
  };

  const defineTitleByCurrentStep = () => {
    const titleForStep: { [key: number]: string } = {
      1: t('selectTopUpAmount'),
      2: t('chooseCard'),
      3: t('confirmCard'),
      4: t('topupComplete'),
    };
    return titleForStep[processStep];
  };

  const confirmTopup = async () => {
    const startDate = moment();
    const baseCCY = await getPlaneObjectData('defaultCurrency');
    const storedUserInfo = await getPlaneObjectData('userData');
    const month = startDate.month() + 1;
    const year = startDate.year().toString().substring(2, 4);
    const startMonthYear = month < 10 ? `0${month}${year}` : `${month}${year}`;
    const language3DS = i18n.languages[1];
    const timeZone3DS = new Date().getTimezoneOffset();
    const clientID3DS = `${storedUserInfo?.clientID}|${storedUserInfo?.userID}`;

    const topupData = {
      CardNumber: selectedDebitCard.CardNumber,
      CVV: confirmCVV,
      ExpiryDate: selectedDebitCard.ExpiryDate,
      Name: selectedDebitCard.Name,
      StartDate: startMonthYear,
      IssueNumber: '0',
      CountryCode: DEFAULT_COUNTRYCODE,
      Address1: `${DEFAULT_ADDRESS1} ${DEFAULT_ADDRESS2}`,
      Address2: DEFAULT_CITY,
      Address3: ' ',
      PostCode: DEFAULT_POSTCODE,
    };

    const cardExpiration3DS =
      selectedDebitCard.ExpiryDate.slice(2) + selectedDebitCard.ExpiryDate.slice(0, 2);
    const amountToTopup = customAmount || pounds;

    const topup3DS = {
      TotalAmount: amountToTopup,
      AcceptHeader: '*/*',
      CCY: baseCCY?.value,
      CardholderName: selectedDebitCard.Name,
      CardExpiration: cardExpiration3DS,
      CardPan: selectedDebitCard.CardNumber,
      CardCVV: confirmCVV,
      ScreenHeight: DEVICE_HEIGHT,
      ScreenWidth: DEVICE_WIDTH,
      Language: language3DS,
      TimeZone: timeZone3DS,
      ClientID: clientID3DS,
      UserAgent: userAgent,
      JavaEnabled: false,
      JavascriptEnabled: true,
      ColorDepth: 24,
      SystemName: DSECURE_SYSTEM_NAME,
    };
    const response3DS: Response3DS = await request3DSWindow(topup3DS);
    setLoading(true);
    if (response3DS?.data?.Success && !response3DS?.data?.Data?.Rejected) {
      await sendInfoLog({
        event: 'request3DSWindow - Topup',
        detail: `Topup 3DS: requestWindow ISOResponseCode: ${response3DS?.data?.Data?.ISOResponseCode}`,
      });
      if (response3DS?.data?.Data?.ISOResponseCode === '3D0') {
        await sendInfoLog({
          event: 'request3DSWindow - Topup',
          detail: 'success',
        });
        callToAddTopup(topupData, response3DS);
      } else {
        await sendInfoLog({
          event: 'request3DSWindow - Topup',
          detail: 'Topup 3DS: Inject and submit 3DSecure form (1st)',
        });
        setWebViewHtmlSource(response3DS?.data?.Data?.iFrame as string);
        await validate3DSChallenge(
          response3DS?.data?.Data?.TransactionIdentifier,
          startDate,
          () => callToAddTopup(topupData, response3DS),
          (error: string) => {
            setThreeDsErrorModal(error);
            setWebViewHtmlSource('');
          },
          (iFrame: string) => setWebViewHtmlSource(iFrame),
        );
      }
    } else {
      setNotSuccessfulResult3DsAPICall(response3DS);
    }
    setLoading(false);
  };

  const callToAddTopup = async (cardInfo: any, response3DS: Response3DS) => {
    const responseAddingDebitCard: any = await addTopupRequest(cardInfo);
    if (responseAddingDebitCard?.data?.Data?.Succeeded) {
      setSuccessfulResultVFXAPICall();
    } else {
      setNotSuccessfulResultVFXAPICall(responseAddingDebitCard, response3DS);
    }
  };

  const setSuccessfulResultVFXAPICall = async () => {
    //@LOGGER/INFO
    await sendInfoLog({
      event: 'Topup',
      detail: 'The user made a topup',
    });
    setProcessStep(4);
    setShowSuccessAddingTopupModal(true);
  };

  const setNotSuccessfulResultVFXAPICall = async (response: any, response2: Response3DS) => {
    debugger
    let errorMsg = response?.data?.Data?.Message;
    if (response?.data?.ErrorCode === 257 || errorMsg === 'Max cards allowed this month') {
      errorMsg =
        'Monthly Debit card limit reached. Please contact customer support for more information.';
    }
    setThreeDsErrorModal(errorMsg);
    let transID = '';
    if (response2?.data?.Data !== null && response2?.data?.Data?.TransactionIdentifier)
      transID = ` (TransactionID: ${response2?.data?.Data?.TransactionIdentifier})`;
    //@LOGGER/INFO
    await sendInfoLog({
      event: 'Topup',
      detail: `The user tried to do a topup, but got the error: ${errorMsg} ${transID}`,
    });
  };

  const setNotSuccessfulResult3DsAPICall = async (response: Response3DS) => {
    const errorMsg = response?.data?.Data?.StatusReason
      ? errorMessages3DS[response?.data?.Data?.StatusReason]
      : 'requestNotProcessed';
    if (response?.data?.Data && response?.data?.Data?.TransactionIdentifier) {
      //@LOGGER/INFO
      await sendInfoLog({
        event: '3DS process',
        detail: `The user tried to do a topup, but got the error: statusReason=${
          response?.data?.Data?.StatusReason
        } - ${t(errorMsg)}. txID=${response?.data?.Data?.TransactionIdentifier}`,
      });
    }
    setThreeDsErrorModal(t(errorMsg) as string);
  };

  const customStyleForCheckbox = { fontSize: fontSizes.medium16 };

  const renderButtons = () => {
    if (!webViewHtmlSource) {
      return processStep !== 4 ? (
        <LightButton
          size="big"
          onPress={defineWhereToJump()}
          text={t('nextCapital')}
          testId="introSlider.skipButton"
        />
      ) : (
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonWrapper}>
            <LightButton
              inverted
              onPress={() => navigation.navigate('Sidebar')}
              text={t('finish')}
              testId={'paymentDetails.CancelButton'}
            />
            <Button filled onPress={sendNow} text={t('sendNow')} testId="introSlider.skipButton" />
          </View>
        </View>
      );
    }
  };

  if (loading) {
    return <LoadingIndicator size={'small'} testId={''} background="white" />;
  }

  return (
    <SafeAreaWrapper customStyle={styles.safeArea}>
      <ModalWindow
        testId="beneficiaries.deleteWarningModal"
        isVisible={showSuccessAddingTopupModal}
        icon={
          <AntDesigns
            testId="sendPaymentDetails.checkCircle"
            color={colors.lightGreen.c450}
            size={46}
            icon="checkcircle"
          />
        }
        title={t('successCapital')}
        text={t('TopupDone')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setShowSuccessAddingTopupModal(false)}
      />
      <ModalWindow
        testId="beneficiaries.deleteWarningModal"
        isVisible={!!threeDsErrorModal}
        icon={
          <AntDesigns
            testId="beneficiaries.questionIcon"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('errorCapital')}
        text={t(threeDsErrorModal)}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setThreeDsErrorModal('')}
      />
      <ModalWindow
        testId="sendPayment.noBenericiariesFound"
        isVisible={passedLimitShowModal}
        icon={
          <AntDesigns
            testId="sendPayment.exclamationWarning"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('warning')}
        text={t('topUpMaxLimitReached')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => {
          setPassedLimitShowModal(!passedLimitShowModal);
          navigation.goBack();
        }}
      />
      <ModalWindow
        testId="sendPayment.noBenericiariesFound"
        isVisible={noClientFoundShowModal}
        icon={
          <AntDesigns
            testId="sendPayment.exclamationWarning"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('alertCapital')}
        text={t('noClientFound')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setNoClientFoundShowModal(!noClientFoundShowModal)}
      />
      <ModalWindow
        testId="trade.redirectWebBrowser"
        isVisible={cardConfirmationShowModal}
        icon={
          <FontAwesomeIcon
            testId="sendPayment.exclamationWarning"
            color={colors.cyan.c700}
            size={46}
            icon="question-circle"
          />
        }
        title={t('confirmationCapital')}
        text={`${t('youReToppingUp')} ${amountToConfirmModal} ${GBP_CURRENCY_SYMBOL}.`}
        buttonAcceptText="Yes"
        buttonCancelText="No"
        onButtonAcceptPress={() => {
          confirmTopup();
          setCardConfirmationShowModal(false);
        }}
        onButtonCancelPress={() => setCardConfirmationShowModal(!cardConfirmationShowModal)}
      />
      <ModalWindow
        testId="sendPayment.noBenericiariesFound"
        isVisible={fraudShowModal}
        icon={
          <AntDesigns
            testId="sendPayment.exclamationWarning"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('errorCapital')}
        text={t('suspectedFraud')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setFraudShowModal(!fraudShowModal)}
      />
      <ModalWindow
        testId="sendPayment.noBenericiariesFound"
        isVisible={noCardHolderVerificationMethodShowModal}
        icon={
          <AntDesigns
            testId="sendPayment.exclamationWarning"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('errorCapital')}
        text={t('cardHolderVerifMethod')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() =>
          setNoCardHolderVerificationMethod(!noCardHolderVerificationMethodShowModal)
        }
      />
      <ModalWindow
        testId="sendPayment.noBenericiariesFound"
        isVisible={maxTopupLimitShowModal}
        icon={
          <AntDesigns
            testId="sendPayment.exclamationWarning"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('alertCapital')}
        text={t('maximumTopupAmount') + topUpMaxLimit + '.'}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setMaxTopupLimitShowModal(!maxTopupLimitShowModal)}
      />
      <ModalWindow
        testId="sendPayment.noBenericiariesFound"
        isVisible={noCardShowModal}
        icon={
          <AntDesigns
            testId="sendPayment.exclamationWarning"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('noCardSelected')}
        text={t('pleaseSelectCard')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setNoCardShowModal(!noCardShowModal)}
      />
      <ModalWindow
        testId="sendPayment.noBenericiariesFound"
        isVisible={invalidTopUpAmountShowModal}
        icon={
          <AntDesigns
            testId="sendPayment.exclamationWarning"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('alertCapital')}
        text={t('noValidTopUpAmount')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setInvalidTopUpAmountShowModal(!invalidTopUpAmountShowModal)}
      />
      <ModalWindow
        testId="sendPayment.noBenericiariesFound"
        isVisible={invalidCVVShowModal}
        icon={
          <AntDesigns
            testId="sendPayment.exclamationWarning"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('noCVV')}
        text={t('enterValidCvv')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setInvalidCVVShowModal(!invalidCVVShowModal)}
      />
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <TitleSection title={defineTitleByCurrentStep()} />
        </View>
        {processStep === 1 && (
          <>
            <View style={styles.checkboxWrapper}>
              <View>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    flexDirection="row"
                    value={pounds['100']}
                    onPress={() => setPounds({ ...poundsInitState, '100': !pounds['100'] })}
                    text={' £100'}
                    boxSize={fontSizes.large20}
                    customTextStyle={customStyleForCheckbox}
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    flexDirection="row"
                    value={pounds['200']}
                    onPress={() => setPounds({ ...poundsInitState, '200': !pounds['200'] })}
                    text={' £200'}
                    boxSize={fontSizes.large20}
                    customTextStyle={customStyleForCheckbox}
                  />
                </View>
              </View>
              <View>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    flexDirection="row"
                    value={pounds['500']}
                    onPress={() => setPounds({ ...poundsInitState, '500': !pounds['500'] })}
                    text={' £500'}
                    boxSize={fontSizes.large20}
                    customTextStyle={customStyleForCheckbox}
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    flexDirection="row"
                    value={pounds['1000']}
                    onPress={() => setPounds({ ...poundsInitState, '1000': !pounds['1000'] })}
                    text={' £1000'}
                    boxSize={fontSizes.large20}
                    customTextStyle={customStyleForCheckbox}
                  />
                </View>
              </View>
            </View>
            <View style={styles.customAmountOptionWrapper}>
              <Checkbox
                flexDirection="row"
                boxSize={fontSizes.large20}
                value={pounds.custom}
                onPress={() => setPounds({ ...poundsInitState, custom: !pounds.custom })}
                text={' '}
              />
              <TextField
                keyboardType="decimal-pad"
                editable={pounds.custom}
                value={pounds.custom ? customAmount : ''}
                wrapperStyle={customInputWrapperLine}
                onChangeText={(value) => setCustomAmount(value)}
                placeHolder={`max. 10,000 ${GBP_CURRENCY_SYMBOL}`}
                testId={'topUp.CustomAmount'}
              />
            </View>
            <View style={styles.loadFeeMessageWrapper}>
              <Text style={styles.loadFeeText}>
                {t('loadFee')}
                <Text style={styles.bankTransferText}>{t('bankTransfer')}</Text>
              </Text>
            </View>
          </>
        )}
        {processStep === 2 && (
          <View style={styles.debitCardListContainer}>
            {/* {HARDCODED_CARD[0]?.CardNumber === '' ? ( */}
            {debitCards[0]?.CardNumber === '' ? (
              <View style={styles.errorOrEmptyListContainer}>
                <NoTransactionsText
                  customTextStyle={
                    (!!errorMessage as boolean)
                      ? { color: colors.red.c900, marginHorizontal: 20 }
                      : undefined
                  }
                  message={(!!errorMessage as boolean) ? errorMessage : t('noCardsFound')}
                />
              </View>
            ) : (
              <FlatList
                // data={HARDCODED_CARD}
                data={debitCards}
                renderItem={renderRow}
                keyExtractor={(item: DebitCard) => item?.ID?.toString()}
              />
            )}
          </View>
        )}
        {processStep === 3 && (!webViewHtmlSource as boolean) && (
          <View style={styles.confirmationInfoWrapper}>
            <View>
              <Text style={styles.legend}>{t('cardNo')}</Text>
              <Text style={styles.value}>{selectedDebitCard.CardNumber}</Text>
            </View>
            <Line />
            <View>
              <Text style={styles.legend}>{t('ExpiryDate')}</Text>
              <Text style={styles.value}>
                {selectedDebitCard.ExpiryDate.substring(0, 2)}/
                {selectedDebitCard.ExpiryDate.substring(2, 4)}
              </Text>
            </View>
            <Line />
            <View>
              <Text style={styles.legend}>{t('CardName')}</Text>
              <Text style={styles.value}>{selectedDebitCard.Name.toUpperCase()}</Text>
            </View>
            <Line />
            <View>
              <Text style={styles.legend}>{t('addressCapital')}</Text>
              <Text style={styles.value}>
                {DEFAULT_ADDRESS1} {DEFAULT_ADDRESS2} {DEFAULT_CITY} - {DEFAULT_POSTCODE}
              </Text>
            </View>
            <Line />
            <View style={styles.cvvWrapper}>
              <Text style={styles.legend}>{t('cvvMayusc')}</Text>
              <View style={styles.cvvTextFieldWrapper}>
                <TextField
                  keyboardType={'decimal-pad'}
                  value={confirmCVV}
                  wrapperStyle={customInputWrapperLine}
                  onChangeText={setConfirmCVV}
                  placeHolder={'Enter value'}
                  testId={''}
                />
              </View>
            </View>
          </View>
        )}
        {processStep === 4 && (
          <View style={styles.topUpResultWrapper}>
            <AntDesigns
              testId="sendPaymentDetails.checkCircle"
              color={colors.lightGreen.c450}
              size={66}
              icon="checkcircle"
            />
            <Text style={styles.textResult}>{t('successCapital')}</Text>
            <View>
              <Text style={styles.textBalance}>{t('yourBalanceIs')}</Text>
              <Text style={styles.textAmountAndCcy}>
                {GBP_CURRENCY_SYMBOL} {HARDCODED_AMOUNT}
              </Text>
            </View>
          </View>
        )}
        {(!!webViewHtmlSource as boolean) && (
          <WebView originWhitelist={['*']} source={{ html: webViewHtmlSource }} />
        )}
        <View style={styles.footerWrapper}>
          <View style={styles.getRateButtonWrapper}>
            {(!webViewHtmlSource as boolean) && <Pager amount={4} selected={processStep} />}
            {renderButtons()}
          </View>
        </View>
        {processStep === 2 && (
          <BottomButtonOption buttonTitle={'addDebitCard'} route={'AddDebitCardBottomTabbar'} />
        )}
      </View>
    </SafeAreaWrapper>
  );
};
const styles = StyleSheet.create({
  safeArea: { backgroundColor: 'white' },
  container: {
    flex: 1,
    backgroundColor: colors.grey.A100,
  },
  titleContainer: { padding: 20, justifyContent: 'center', alignItems: 'center' },
  getRateButtonWrapper: { height: 80, alignItems: 'center', width: '90%', marginBottom: 30 },
  loadFeeMessageWrapper: {
    marginHorizontal: 74,
    marginTop: 20,
    marginBottom: 40,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  radioGroupWrapper: { marginHorizontal: 30, marginBottom: 20 },
  bankTransferText: {
    textDecorationLine: 'underline',
  },
  customAmountTextFieldWrapper: { marginHorizontal: 40, justifyContent: 'flex-start' },
  loadFeeText: {
    color: colors.cyan.c700,
    textAlign: 'center',
    fontSize: fontSizes.small12,
    fontFamily: 'OpenSans-SemiBold',
  },
  footerWrapper: { alignItems: 'center' },
  imageShadowWrapper: {
    backgroundColor: colors.grey.A100,
    style: { marginVertical: 5 },
    elevation: 4,
    shadowColor: colors.grey.c999,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
  },
  optionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 10,
  },
  cardImage: {
    backgroundColor: colors.grey.A100,
    width: 60,
    height: 40,
  },
  optionTitleWrapper: {
    flexDirection: 'column',
    alignItems: 'baseline',
  },
  optionTitleCardType: {
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.mediumSmall14,
    color: colors.grey.c900,
    letterSpacing: 0.5,
  },
  optionTitleCardNumber: {
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.mediumSmall14,
    color: colors.grey.c650,
    letterSpacing: 0.5,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legend: {
    fontFamily: 'OpenSans-Light',
    marginTop: 10,
    marginBottom: 5,
    fontSize: fontSizes.medium16,
    letterSpacing: 0.8,
  },
  value: {
    fontFamily: 'OpenSans-Light',
    fontSize: fontSizes.mediumSmall14,
    color: colors.grey.c600,
    marginBottom: 20,
  },
  checkboxWrapper: { justifyContent: 'space-evenly', flexDirection: 'row' },
  checkboxContainer: { marginVertical: 20 },
  customAmountOptionWrapper: { marginLeft: 75, justifyContent: 'flex-start', flexDirection: 'row' },
  confirmationInfoWrapper: { marginHorizontal: 20 },
  cvvWrapper: { marginBottom: 40 },
  cvvTextFieldWrapper: { marginTop: 10, width: 140 },
  topUpResultWrapper: { height: 420, alignItems: 'center' },
  textResult: {
    marginVertical: 20,
    fontFamily: 'Opensans-Regular',
    fontSize: fontSizes.smallHuge24,
  },
  textBalance: {
    marginTop: 40,
    fontFamily: 'Opensans-Regular',
    fontSize: fontSizes.mediumLarge18,
    color: colors.grey.c550,
  },
  textAmountAndCcy: { textAlign: 'center', marginTop: 30 },
  debitCardListContainer: { flex: 1 },
  errorOrEmptyListContainer: { flex: 1, alignItems: 'center' },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
export default TopUp;
