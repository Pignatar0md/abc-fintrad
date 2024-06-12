import moment from 'moment';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import i18n from 'i18next';
import WebView from 'react-native-webview';

import LoadingIndicator from 'components/LoadingIndicator';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import AntDesigns from 'components/Icons/AntDesigns';
import LightButton from 'components/Buttons/LightButton';
import { customInputWrapperLine } from 'components/static';
import Button from 'components/Buttons/Button';
import ResponsiveFormWrapper from 'components/Wrappers/ResponsiveFormWrapper';
import MonthYearPicker from 'components/Inputs/MonthYearPicker';

import { DSECURE_SYSTEM_NAME } from '@env';
import { colors } from 'styles';
import { useDate } from 'hooks/useDate';
import { checkAddDebitCardTextInputError, renderTextInput } from 'utils/forms';
import { formatCardNumberValue, regExpCard } from 'utils/cards';
import {
  DEFAULT_ADDRESS1,
  DEFAULT_ADDRESS2,
  DEFAULT_CITY,
  DEFAULT_COUNTRYCODE,
  DEFAULT_POSTCODE,
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
} from 'utils/static';
import { getPlaneObjectData } from 'utils/localStorage';
import { addDebitCardRequest } from 'api/CardRequests';
import { request3DSWindow, validate3DSChallenge } from 'api/3DsRequests';
import { sendInfoLog } from 'api/LoggerRequests';
import { errorMessages3DS } from 'utils/static/ErrorMessages';
import { FillManuallyCardNavigationProp } from 'types/types';
import { DebitCardAdding } from 'types/api';
import { AddDebitCardResponse, Response3DS } from 'interfaces/screens';
import DeviceInfo from 'react-native-device-info';

const AddDebitCardInfoManually: FC<FillManuallyCardNavigationProp> = ({
  navigation,
  route,
}): ReactElement => {
  const { showMonthYear, date, onSelectMonth, switchMonthYearPickerVisible } = useDate();
  const expiryDate = `${route?.params?.item?.expiryMonth} ${route?.params?.item?.expiryYear}`;
  const initialMonthYear = route?.params?.item?.expiryMonth ? moment(expiryDate, 'MMYY') : date;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: {
      cardNumber: formatCardNumberValue(route?.params?.item?.cardNumber || ''),
      cvv: '',
      nameOnTheCard: route?.params?.item?.holderName || '',
    },
  });
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [threeDsErrorModal, setThreeDsErrorModal] = useState<string>('');
  const [userAgent, setUserAgent] = useState<string>('');
  const [monthYear, setMonthYear] = useState<moment.Moment>(initialMonthYear);
  const [webViewHtmlSource, setWebViewHtmlSource] = useState<string>('');
  const [showErrorAddingCardModal, setShowErrorAddingCardModal] = useState<boolean>(false);
  const [badExpiryDateModal, setBadExpiryDateModal] = useState<boolean>(false);
  const [badCardNumberModal, setBadCardNumberModal] = useState<boolean>(false);
  const [showSuccessAddingCardModal, setShowSuccessAddingCardModal] = useState<boolean>(false);

  useEffect(() => {
    DeviceInfo.getUserAgent()
      .then((userAgent) => {
        setUserAgent(userAgent);
      })
      .catch((error) => console.log('error at getting user agent: ', error.toString()));
  }, []);

  const addDebitCard = async ({
    cardNumber,
    cvv,
    nameOnTheCard,
  }: {
    cardNumber: string;
    cvv: string;
    nameOnTheCard: string;
  }) => {
    const startDate = moment();
    if (monthYear < startDate) {
      setBadExpiryDateModal(true);
    } else if (!regExpCard.test(cardNumber)) {
      setBadCardNumberModal(true);
    } else {
      const month = startDate.month() + 1;
      const year = startDate.year().toString().substring(2, 4);
      const startMonthYear = month < 10 ? `0${month}${year}` : `${month}${year}`;
      const baseCCY = await getPlaneObjectData('defaultCurrency');
      const storedUserInfo = await getPlaneObjectData('userData');
      const CardNumber = cardNumber.replaceAll('-', '');
      const cardExpiration3DS = monthYear.format('YYMM');
      const language3DS = i18n.languages[1];
      const timeZone3DS = new Date().getTimezoneOffset();
      const clientID3DS = `${storedUserInfo?.clientID}|${storedUserInfo?.userID}`;
      const cardData = {
        CardNumber,
        CVV: cvv,
        StartDate: startMonthYear,
        IssueNumber: '0',
        ExpiryDate: monthYear.format('MMYY'),
        Name: nameOnTheCard,
        Address1: `${DEFAULT_ADDRESS1} ${DEFAULT_ADDRESS2}`,
        Address2: DEFAULT_CITY,
        Address3: ' ',
        PostCode: DEFAULT_POSTCODE,
        CountryCode: DEFAULT_COUNTRYCODE,
      };
      const card3DS = {
        TotalAmount: 1,
        CCY: baseCCY?.value,
        CardholderName: nameOnTheCard,
        CardExpiration: cardExpiration3DS,
        CardPan: CardNumber,
        CardCVV: cvv,
        AcceptHeader: '*/*',
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
      const response3DS: Response3DS = await request3DSWindow(card3DS);
      setLoading(true);
      if (response3DS?.data?.Success && !response3DS?.data?.Data?.Rejected) {
        await sendInfoLog({
          event: 'request3DSWindow - AddDebitCard',
          detail: `Add Debit Card 3DS: requestWindow ISOResponseCode: ${response3DS?.data?.Data?.ISOResponseCode}`,
        });
        if (response3DS?.data?.Data?.ISOResponseCode === '3D0') {
          await sendInfoLog({
            event: 'request3DSWindow - AddDebitCard',
            detail: 'success',
          });
          callToAddDebitCard(cardData, response3DS);
          reset();
        } else {
          await sendInfoLog({
            event: 'request3DSWindow - AddDebitCard',
            detail: 'Add Debit Card 3DS: Inject and submit 3DSecure form (1st)',
          });
          setWebViewHtmlSource(response3DS?.data?.Data?.iFrame as string);
          await validate3DSChallenge(
            response3DS?.data?.Data?.TransactionIdentifier,
            startDate,
            () => callToAddDebitCard(cardData, response3DS),
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
    }
  };

  const callToAddDebitCard = async (cardInfo: DebitCardAdding, response3DS: Response3DS) => {
    const responseAddingDebitCard: AddDebitCardResponse = await addDebitCardRequest(cardInfo);
    if (responseAddingDebitCard?.data?.Data?.Succeeded) {
      setSuccessfulResultVFXAPICall();
    } else {
      setNotSuccessfulResultVFXAPICall(responseAddingDebitCard, response3DS);
    }
  };

  const setSuccessfulResultVFXAPICall = async () => {
    //@LOGGER/INFO
    await sendInfoLog({
      event: 'addDebitCard',
      detail: 'The user added a debit card',
    });
    setShowSuccessAddingCardModal(true);
  };

  const setNotSuccessfulResultVFXAPICall = async (
    response: AddDebitCardResponse,
    response2: Response3DS,
  ) => {
    let errorMsg = response?.data?.Data.Message;
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
      event: 'addDebitCard',
      detail: `The user tried to add a new debit card, but got the error: ${errorMsg} ${transID}`,
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
        detail: `The user tried to add a new debit card, but got the error: statusReason=${
          response?.data?.Data?.StatusReason
        } - ${t(errorMsg)}. txID=${response?.data?.Data?.TransactionIdentifier}`,
      });
    }
    setThreeDsErrorModal(t(errorMsg) as string);
  };

  if (loading) {
    return <LoadingIndicator size={'small'} testId={''} background="white" />;
  }

  return (
    <View style={styles.container}>
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
        testId="beneficiaries.deleteWarningModal"
        isVisible={badCardNumberModal}
        icon={
          <AntDesigns
            testId="beneficiaries.questionIcon"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('errorCapital')}
        text={t('checkCardNumber')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setBadCardNumberModal(false)}
      />
      <ModalWindow
        testId="beneficiaries.deleteWarningModal"
        isVisible={badExpiryDateModal}
        icon={
          <AntDesigns
            testId="beneficiaries.questionIcon"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('errorCapital')}
        text={t('checkExpiryDate')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setBadExpiryDateModal(false)}
      />
      <ModalWindow
        testId="beneficiaries.deleteWarningModal"
        isVisible={showSuccessAddingCardModal}
        icon={
          <AntDesigns
            testId="sendPaymentDetails.checkCircle"
            color={colors.lightGreen.c450}
            size={46}
            icon="checkcircle"
          />
        }
        title={t('successCapital')}
        text={t('debitCardAdded')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setShowSuccessAddingCardModal(false)}
      />
      <ModalWindow
        testId="addDebitCardManually.errorModal"
        isVisible={showErrorAddingCardModal}
        icon={
          <AntDesigns
            testId="beneficiaries.questionIcon"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('errorCapital')}
        text={t('tryLaterContactSupport')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setShowErrorAddingCardModal(false)}
      />
      {(!webViewHtmlSource as boolean) && (
        <KeyboardAwareScrollView>
          <ResponsiveFormWrapper testId="addDebitCardManually.WrapperForm">
            <View style={styles.fieldWrapper}>
              <Controller
                control={control}
                rules={{
                  required: true,
                  minLength: 19,
                }}
                render={({ field: { onChange, value } }) => {
                  const newValue = formatCardNumberValue(value || '');
                  return renderTextInput({
                    value: newValue,
                    onChange,
                    maxLength: 23,
                    placeHolder: t('cardNumberEnter'),
                    label: t('cardNumber'),
                    wrapperStyle: checkAddDebitCardTextInputError(
                      errors,
                      'cardNumber',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'addDebitCard.CardNumber',
                    keyboardType: 'number-pad',
                  });
                }}
                name="cardNumber"
              />
            </View>
            <View style={styles.fieldWrapper}>
              <Controller
                control={control}
                rules={{
                  minLength: 3,
                  required: true,
                }}
                render={({ field: { onChange, value } }) =>
                  renderTextInput({
                    value,
                    maxLength: 3,
                    onChange,
                    placeHolder: t('cvvEnter'),
                    label: t('cvvMayusc'),
                    wrapperStyle: checkAddDebitCardTextInputError(
                      errors,
                      'cvv',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'addDebitCard.Cvv',
                    keyboardType: 'number-pad',
                  })
                }
                name="cvv"
              />
            </View>
            <View style={styles.fieldWrapper}>
              <MonthYearPicker
                format={'MM[/]YY'}
                onButtonPress={switchMonthYearPickerVisible}
                height={44}
                maxDate={moment().add(9, 'years')}
                containerFullWidth={true}
                onMonthSelected={(newDate) => {
                  onSelectMonth(newDate);
                  setMonthYear(newDate);
                }}
                month={monthYear}
                isVisible={showMonthYear}
                label={t('expiryDate') as string}
              />
            </View>
            <View style={styles.fieldWrapper}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) =>
                  renderTextInput({
                    value: route?.params?.item?.holderName ?? value,
                    onChange,
                    placeHolder: t('cardNameEnter'),
                    label: t('cardName'),
                    wrapperStyle: checkAddDebitCardTextInputError(
                      errors,
                      'nameOnTheCard',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'addDebitCard.CardName',
                    keyboardType: 'default',
                  })
                }
                name="nameOnTheCard"
              />
            </View>
            <View style={styles.buttonPairWrapper}>
              <LightButton
                inverted
                onPress={() => {
                  reset();
                  navigation.navigate('DebitCards');
                }}
                text={'Cancel'}
                testId={'paymentDetails.CancelButton'}
              />
              <Button
                disabled={
                  !(
                    dirtyFields.nameOnTheCard ||
                    (route?.params?.item?.holderName && dirtyFields.cardNumber) ||
                    (route?.params?.item?.cardNumber && dirtyFields.cvv)
                  )
                }
                testId="saveButton"
                onPress={handleSubmit(addDebitCard)}
                text={'Save'}
                filled
              />
            </View>
          </ResponsiveFormWrapper>
        </KeyboardAwareScrollView>
      )}
      {(!!webViewHtmlSource as boolean) && (
        <WebView originWhitelist={['*']} source={{ html: webViewHtmlSource }} />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey.A100,
  },
  fieldWrapper: { marginVertical: 10 },
  buttonPairWrapper: {
    marginVertical: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default AddDebitCardInfoManually;
