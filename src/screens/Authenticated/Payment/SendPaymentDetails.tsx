import React, { FC, ReactElement, useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Line from 'components/Figures/Line';
import Button from 'components/Buttons/Button';
import TextField from 'components/Inputs/TextField';
import AntDesigns from 'components/Icons/AntDesigns';
import LightButton from 'components/Buttons/LightButton';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import LoadingIndicator from 'components/LoadingIndicator';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';

import { DEFAULT_HEADER_CONFIG } from 'utils/static';
import { createButtonAlert, onBiometricAuthPress } from 'utils/helpers';
import { secureRetrieve } from 'utils/localStorage';
import { sendPayment } from 'api/PaymentsRequests';
import { colors, fontSizes } from 'styles';
import { useAuthType } from 'hooks/useAuthType';
import { SendPaymentDetailsScreenNavigationProp } from 'types/types';
import { genericFn } from 'types/components';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';

const SendPaymentDetails: FC<SendPaymentDetailsScreenNavigationProp> = ({
  navigation,
  route,
}): ReactElement => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showErrorSendingPaymentModal, setShowErrorSendingPaymentModal] = useState<boolean>(false);
  const [showWrongPasswordModal, setShowWrongPasswordModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [auth, setAuth] = useState<string>('');
  const { getAuthType } = useAuthType();

  const screenTitle = t('sendPaymentCapital');
  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      title: screenTitle,
    });
  }, []);

  const getBiometricsActive = async () => {
    const res = await getAuthType();
    setAuth(res);
  };

  useEffect(() => {
    getBiometricsActive();
  }, []);

  const passwordInputStyle = {
    borderBottomWidth: 1,
    borderBottomColor: colors.cyan.c800,
    width: 300,
  };

  const makePaymentSending = async () => {
    //@LOGGER/INFO
    await sendInfoLog({ event: 'Payment - Started', detail: 'makePaymentSending' });
    const startPayment = Date.now(); //For log "Payment Duration time"
    setLoading(true);
    const paymentData = {
      amount: route?.params?.amount || '',
      firstReference: route?.params?.firstReference || '',
      secondReference: route?.params?.secondReference || '',
      paymentPurpose: route?.params?.paymentPurpose || '',
      payeeId: route?.params?.selectedBeneficiary.value + '',
      CCY: route?.params?.selectedCcy?.value || '',
    };
    const response = await sendPayment(paymentData);

    setLoading(false);
    if (response?.data?.Succeeded) {
      //@LOGGER/INFO
      await sendInfoLog({
        event: 'makePaymentSending',
        detail: `Payment - Successfully sent | CCY: ${paymentData.CCY} | PayeeID: ${
          paymentData.payeeId
        } | Amount: ${paymentData.amount} | ${route?.params?.limit} | Duration: ${
          Date.now() - startPayment
        } ms`,
      });
      setShowSuccessModal(true);
    } else {
      if (response?.data === 'Request failed with status code 401') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login', expired: true }],
        });
        await sendErrorLog({
          event: 'makePaymentSending sendPayment - SendPaymentDetails',
          detail: 'user session expired: ' + response?.data,
        });
      } else {
        //@LOGGER/INFO
        await sendErrorLog({
          event: 'makePaymentSending sendPayment - SendPaymentDetails',
          detail: `The user tried to do a payment, but got the error: ${response?.toString()} v1/Payments SendPaymentDetails makePaymentSending`,
        });
        setShowErrorSendingPaymentModal(true);
      }
    }
  };

  const onOkSuccessPress = () => {
    setShowSuccessModal(false);
    navigation.navigate('Sidebar');
  };

  const onPressPasswordEntered = async () => {
    const stored = await secureRetrieve('password');
    setShowPasswordModal(false);
    if (stored === password) {
      makePaymentSending();
    } else {
      createButtonAlert(t('errorCapital'), t('wrongPass'));
    }
  };

  const renderFastAuthButton = () => {
    let text;
    let fn;
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!auth) {
      switch (auth) {
        case 'password':
          fn = () => setShowPasswordModal(true);
          text = password.length > 0 && !showPasswordModal ? t('confirmCapital') : 'Ok';
          break;
        case 'pinNumber':
          fn = () =>
            navigation.push('RequestPin', {
              callback: makePaymentSending,
              from: 'SendPaymentDetails',
              screen: 'SendPaymentDetails',
            });
          text = t('Ok');
          break;
        default:
          fn = onBiometricAuthPress(makePaymentSending);
          text = t('Ok');
          break;
      }
    }
    return (
      <Button
        filled
        onPress={fn as genericFn}
        text={text as string}
        testId="sendPaymentDetails.PositiveButton"
      />
    );
  };

  if (loading) {
    return <LoadingIndicator testId="login.loader" size="large" />;
  }

  return (
    <SafeAreaWrapper>
      {!!auth && auth === 'password' && (
        <ModalWindow
          testId="sendPaymentDetails.EnterPassword"
          isVisible={showPasswordModal}
          icon={
            <AntDesigns
              testId="sendPaymentDetails.checkCircle"
              color={colors.cyan.c800}
              size={46}
              icon="checkcircle"
            />
          }
          title={screenTitle}
          text={t('pleaseEnterPass')}
          buttonAcceptText={t('ok')}
          buttonCancelText={t('cancelCapital') as string}
          onButtonAcceptPress={onPressPasswordEntered}
          extraComponent={
            <TextField
              textStyle={passwordInputStyle}
              value={password}
              onChangeText={setPassword}
              placeHolder={t('password')}
              secureTextEntry
              keyboardType={'default'}
              testId={'paymentDetails.PasswordInput'}
            />
          }
        />
      )}
      <ModalWindow
        testId="sendPaymentDetails.wrongPass"
        isVisible={showWrongPasswordModal}
        icon={
          <AntDesigns
            testId="sendPaymentDetails.exclamationWarning"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('warning')}
        text={t('wrongPass')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setShowWrongPasswordModal(false)}
      />
      <ModalWindow
        testId="sendPayment.errorAtSendingThePayment"
        isVisible={showErrorSendingPaymentModal}
        icon={
          <AntDesigns
            testId="sendPayment.exclamationWarning"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('errorCapital')}
        text={t('errorSendingPaymentTitle')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setShowErrorSendingPaymentModal(false)}
      />
      <ModalWindow
        testId="sendPaymentDetails.success"
        isVisible={showSuccessModal}
        icon={
          <AntDesigns
            testId="sendPaymentDetails.successIcon"
            color={colors.lightGreen.c450}
            size={46}
            icon="checkcircle"
          />
        }
        title={t('successCapital')}
        text={t('paymentSuccessful')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={onOkSuccessPress}
      />
      <View style={styles.container}>
        <Text style={styles.screenTitle}>{t('confirmPayment')}</Text>
        <Line />
        <View style={styles.rowWrapper}>
          <Text style={styles.legend}>{t('currencyCapital')}</Text>
          <Text style={styles.value}>{route?.params?.selectedCcy?.label}</Text>
        </View>
        <Line />
        <View style={styles.rowWrapper}>
          <Text style={styles.legend}>{t('countryCapital')}</Text>
          <Text style={styles.value}>{route?.params?.selectedBeneficiary?.PayCountryCode}</Text>
        </View>
        <Line />
        <View style={styles.rowWrapper}>
          <Text style={styles.legend}>{t('beneficiaryCapital')}</Text>
          <Text style={styles.value}>{route?.params?.selectedBeneficiary?.label}</Text>
        </View>
        <Line />
        <View style={styles.rowWrapper}>
          <Text style={styles.legend}>{t('amountCapital')}</Text>
          <Text style={styles.value}>{route?.params?.amount}</Text>
        </View>
        <Line />
        {!!route?.params?.selectedBeneficiary?.Address1 && (
          <>
            <View style={styles.rowWrapper}>
              <Text style={styles.legend}>{t('sortCode')}</Text>
              <Text style={styles.value}>{route?.params?.selectedBeneficiary?.Address1}</Text>
            </View>
            <Line />
          </>
        )}
        {!!route?.params?.selectedCcy?.RoutingCode && (
          <>
            <View style={styles.rowWrapper}>
              <Text style={styles.legend}>{t('sortCode')}</Text>
              <Text style={styles.value}>{route?.params?.selectedBeneficiary?.RoutingCode}</Text>
            </View>
            <Line />
          </>
        )}
        {!!route?.params?.selectedBeneficiary?.AccountNumber && (
          <>
            <View style={styles.rowWrapper}>
              <Text style={styles.legend}>{t('accountNumber')}</Text>
              <Text style={styles.value}>{route?.params?.selectedBeneficiary?.AccountNumber}</Text>
            </View>
            <Line />
          </>
        )}
        {!!route?.params?.selectedBeneficiary?.SWIFTBIC && (
          <>
            <View style={styles.rowWrapper}>
              <Text style={styles.legend}>{t('swiftCode')}</Text>
              <Text style={styles.value}>{route?.params?.selectedBeneficiary?.SWIFTBIC}</Text>
            </View>
            <Line />
          </>
        )}
        {!!route?.params?.selectedBeneficiary?.IBAN && (
          <>
            <View style={styles.rowWrapper}>
              <Text style={styles.legend}>{t('IBAN')}</Text>
              <Text style={styles.value}>{route.params.selectedBeneficiary.IBAN}</Text>
            </View>
            <Line />
          </>
        )}
        <View style={styles.rowWrapper}>
          <Text style={styles.legend}>{t('paymentPurpose')}</Text>
          <Text style={styles.value}>{route?.params?.paymentPurpose}</Text>
        </View>
        <Line />
        <View style={styles.buttonWrapper}>
          <LightButton
            inverted
            onPress={() => navigation.navigate('Sidebar')}
            text={'Cancel'}
            testId={'paymentDetails.CancelButton'}
          />
          {renderFastAuthButton()}
          {/* <Button
            filled
            onPress={
              password.length > 0 && !showPasswordModal
                ? () => setShowSuccessModal(true)
                : () => setShowPasswordModal(true)
            }
            text={password.length > 0 && !showPasswordModal ? 'Confirm' : 'Ok'}
            testId="sendPaymentDetails.PositiveButton"
          /> */}
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
    paddingHorizontal: 30,
    backgroundColor: colors.grey.A100,
  },
  screenTitle: {
    textAlign: 'center',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: fontSizes.large20,
    marginBottom: 20,
  },
  rowWrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  legend: {
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.mediumLarge18,
    marginVertical: 20,
    letterSpacing: 0.8,
  },
  value: {
    fontFamily: 'OpenSans-Light',
    fontSize: fontSizes.medium16,
    marginVertical: 20,
  },
  buttonWrapper: {
    flex: 1,
    alignItems: 'flex-end',
    marginBottom: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

export default SendPaymentDetails;
