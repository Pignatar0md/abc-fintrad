import React, { FC, ReactElement, useEffect, useLayoutEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import TextField from 'components/Inputs/TextField';
import AntDesigns from 'components/Icons/AntDesigns';
import SwitchButton from 'components/Buttons/SwitchButton';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import BottomButtonOptionsCardDetails from 'components/Prebuilts/BottomButtonsBar/BottomButtonOptionsCardDetails';

import {
  blockCcyCardRequest,
  activateCcyCardRequest,
  unblockCcyCardRequest,
  getCcyCardPINRequest,
  cancelCcyCardRequest,
} from 'api/CardRequests';
import { colors, fontSizes } from 'styles';
import { CurrencyCardDetailsNavigationProp } from 'types/types';
import { DEFAULT_HEADER_CONFIG } from 'utils/static';
import FontAwesomeIcon from 'components/Icons/FontAwesomeIcon';
import IconButton from 'components/Buttons/IconButton';
import { getPlaneObjectData, secureRetrieve, storePlaneObjectData } from 'utils/localStorage';
import { useAuthType } from 'hooks/useAuthType';
import { checkIfValidated, createButtonAlert, onBiometricAuthPress, sendCodeAndRedirectToValidate } from 'utils/helpers';
import { genericFn } from 'types/components';
import { CCyCard } from 'types/state';
import { ccyCardInitState } from '../../initialStates';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';

const CurrencyCardDetails: FC<CurrencyCardDetailsNavigationProp> = ({
  navigation,
  route,
}): ReactElement => {
  const { t } = useTranslation();
  const { getAuthType } = useAuthType();
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [auth, setAuth] = useState<string>('');
  const [magStripe, setMagStripe] = useState(false);
  const [contactless, setContactless] = useState(false);
  const [online, setOnline] = useState(false);
  const [password, setPassword] = useState('');
  const [pinNumber, setPinNumber] = useState('');
  const [showRequestPassModal, setShowRequestPassModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [blockConfirmModal, setBlockConfirmModal] = useState(false);
  const [ccyCardBlocked, setCcyCardBlocked] = useState(false);
  const [showErrorPassModal, setShowErrorPassModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [showInfoMagStripeModal, setShowInfoMagStripeModal] = useState(false);
  const [showInfoContactlessModal, setShowInfoContactlessModal] = useState(false);
  const [showInfoOnlineModal, setShowInfoOnlineModal] = useState(false);
  const [ccyCardItem, setCcyCardItem] = useState<CCyCard>(ccyCardInitState);

  const screenTitle = t('ccyCardDetails');
  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      title: screenTitle,
    });
  }, []);

  useEffect(() => {
    const getCcyCardPinNumber = async () => {
      route?.params?.item && (await storePlaneObjectData('ccyCardItem', route?.params?.item));
      const itemFromStore = await getPlaneObjectData('ccyCardItem');
      setCcyCardItem(itemFromStore);
      const response = await getCcyCardPINRequest(ccyCardItem?.ID);
      if (response?.data?.Data?.Success) {
        setPinNumber(response?.data?.Data?.pin);
        await sendInfoLog({
          event: 'GetCcyPinCardNumber',
          detail: `The user requested the currency card PIN (cardID: ${ccyCardItem?.ID} )`,
        });
      } else {
        await sendErrorLog({
          event: 'GetCcyPinCardNumber',
          detail: `At requesting the currency card PIN (cardID: ${ccyCardItem?.ID} )`,
        });
      }
    };
    getCcyCardPinNumber();
  }, []);

  const checkAndShowPwd = async () => {
    setShowRequestPassModal(!showRequestPassModal);
    const pass = await secureRetrieve('password');
    if (pinNumber === '') {
      createButtonAlert(t('errorCapital'), t('somethingWentWrong'));
    } else {
      pass === password
        ? createButtonAlert(t('ccyCardPin'), `${t('yourPinIs')}${pinNumber}`)
        : createButtonAlert(t('errorCapital'), t('wrongPass'));
    }
  };

  const blockCcyCard = async () => {
    const response = await blockCcyCardRequest(ccyCardItem.ID);
    if (response?.data?.Data?.Success) {
      setCcyCardBlocked(true);
      await sendInfoLog({
        event: 'BlockCcyCard',
        detail: `The user block the currency card (cardID: ${ccyCardItem.ID})`,
      });
    } else {
      await sendErrorLog({
        event: 'BlockCcyCard',
        detail: `At trying to block the currency card (cardID: ${ccyCardItem.ID})`,
      });
      setShowErrorModal(true);
    }
    setBlockConfirmModal(false);
  };

  const unblockCcyCard = async () => {
    const response = await unblockCcyCardRequest(ccyCardItem.ID);
    if (response?.data?.Data?.Success) {
      setCcyCardBlocked(false);
      await sendInfoLog({
        event: 'UnblockCcyCard',
        detail: `The user unblock the currency card (cardID: ${ccyCardItem.ID})`,
      });
    } else {
      await sendErrorLog({
        event: 'UnblockCcyCard',
        detail: `At trying to unblock the currency card (cardID: ${ccyCardItem.ID})`,
      });
      setShowErrorModal(true);
    }
    setBlockConfirmModal(false);
  };

  const activateCcyCard = async () => {
    const response = await activateCcyCardRequest(
      ccyCardItem.ID,
      ccyCardItem.ActivationCode,
      ccyCardItem.CardNumber,
    );
    if (response?.data?.Data?.Success) {
      setCcyCardBlocked(false);
      await sendInfoLog({
        event: 'ActivateCcyCard',
        detail: `The user activated the currency card (cardID: ${ccyCardItem.ID})`,
      });
    } else {
      if (response?.data === 'Request failed with status code 401') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login', expired: true }],
        });
        await sendErrorLog({
          event: ' activateCcyCard - activateCcyCardRequest - CurrencyCardDetails',
          detail: 'user session expired: ' + response?.data,
        });
      } else {
        await sendErrorLog({
          event: 'ActivateCcyCard',
          detail: `At trying to activate the currency card (cardID: ${ccyCardItem.ID})`,
        });
      }
      setShowErrorModal(true);
    }
  };

  const cancelCcyCard = async () => {
    const response = await cancelCcyCardRequest(ccyCardItem.ID);
    if (response?.data?.Data?.Success) {
      await sendInfoLog({
        event: 'CancelCcyCard',
        detail: `The user canceled the currency card (cardID: ${ccyCardItem.ID})`,
      });
      navigation.goBack();
    } else {
      await sendErrorLog({
        event: 'CancelCcyCard',
        detail: `At trying to cancel the currency card (cardID: ${ccyCardItem.ID})`,
      });
      setShowErrorModal(true);
    }
  };

  const getBiometricsActive = async () => {
    const res = await getAuthType();
    setAuth(res);
  };

  useEffect(() => {
    getBiometricsActive();
  }, []);

  const renderFastAuthButton = () => {
    let fn;
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!auth) {
      switch (auth) {
        case 'password':
          fn = () => setShowRequestPassModal(!showRequestPassModal);
          break;
        case 'pinNumber':
          fn = () =>
            navigation.push('RequestPin', {
              callback: () => createButtonAlert(t('ccyCardPin'), `${t('yourPinIs')}${pinNumber}`),
              screen: 'CurrencyCardDetails',
              from: 'CcyCardDetails',
            });
          break;
        default: //biometrics
          fn = () =>
            onBiometricAuthPress(() =>
              createButtonAlert(t('ccyCardPin'), `${t('yourPinIs')}${pinNumber}`),
            );
          break;
      }
    }
    return fn;
  };

  const renderCardNumber = () => {
    if (ccyCardItem !== null && ccyCardItem.CardNumber.match(/.{1,4}/g)) {
      return ccyCardItem.CardNumber.match(/.{1,4}/g)?.join(' ');
    }
  };

  const passwordInputStyle = {
    borderBottomWidth: 1,
    borderBottomColor: colors.cyan.c800,
    width: 300,
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <ModalWindow
          testId="sendPayment.validateDevice"
          isVisible={showValidateModal}
          icon={
            <AntDesigns
              testId="sendPayment.exclamationWarning"
              color={colors.cyan.c800}
              size={46}
              icon="infocirlce"
            />
          }
          title={t('validationCapital')}
          text={t('featureRequiresDeviceValidation')}
          buttonAcceptText={t('Validate')}
          buttonCancelText={t('skipCapital') as string}
          onButtonAcceptPress={() =>
            sendCodeAndRedirectToValidate(
              () => navigation.navigate('ValidateDevice'),
              () => setShowValidateModal(false),
              () => createButtonAlert(t('errorCapital'), t('somethingWentWrong')),
            )
          }
          onButtonCancelPress={() => setShowValidateModal(false)}
        />
        <ModalWindow
          testId="requestCcyCard.ModalCardErrorAtRequesting"
          isVisible={showErrorModal}
          icon={
            <AntDesigns
              testId="requestCcyCard.exclamationWarning"
              color={colors.cyan.c600}
              size={46}
              icon="infocirlce"
            />
          }
          title={t('errorCapital')}
          text={t('somethingWentWrong')}
          buttonAcceptText={t('ok')}
          onButtonAcceptPress={() => setShowErrorModal(!showErrorModal)}
        />
        <ModalWindow
          testId="requestCcyCard.ModalCardErrorAtRequesting"
          isVisible={showErrorPassModal}
          icon={
            <AntDesigns
              testId="requestCcyCard.exclamationWarning"
              color={colors.cyan.c600}
              size={46}
              icon="infocirlce"
            />
          }
          title={t('errorCapital')}
          text={t('wrongPass')}
          buttonAcceptText={t('ok')}
          onButtonAcceptPress={() => setShowErrorPassModal(!showErrorPassModal)}
        />
        <ModalWindow
          testId="trade.redirectWebBrowser"
          isVisible={blockConfirmModal}
          icon={
            <FontAwesomeIcon
              testId="sendPayment.exclamationWarning"
              color={colors.cyan.c700}
              size={46}
              icon="question-circle"
            />
          }
          title={ccyCardBlocked ? t('unblockCard') : t('blockCard')}
          text={ccyCardBlocked ? t('unblockCardWarning') : t('blockCardWarning')}
          buttonAcceptText="Yes"
          buttonCancelText="No"
          onButtonAcceptPress={ccyCardBlocked ? unblockCcyCard : blockCcyCard}
          onButtonCancelPress={() => setBlockConfirmModal(false)}
        />
        <ModalWindow
          testId="trade.redirectWebBrowser"
          isVisible={showInfoMagStripeModal}
          icon={
            <AntDesigns
              testId="sendPayment.exclamationWarning"
              color={colors.cyan.c700}
              size={46}
              icon="infocirlce"
            />
          }
          title={t('magStripe')}
          text={t('magstripeInfo')}
          buttonAcceptText="Ok"
          onButtonAcceptPress={() => setShowInfoMagStripeModal(false)}
        />
        <ModalWindow
          testId="trade.redirectWebBrowser"
          isVisible={showInfoContactlessModal}
          icon={
            <AntDesigns
              testId="sendPayment.exclamationWarning"
              color={colors.cyan.c700}
              size={46}
              icon="infocirlce"
            />
          }
          title={t('contactlessCapital')}
          text={t('contactlessInfo')}
          buttonAcceptText="Ok"
          onButtonAcceptPress={() => setShowInfoContactlessModal(false)}
        />
        <ModalWindow
          testId="trade.redirectWebBrowser"
          isVisible={showInfoOnlineModal}
          icon={
            <AntDesigns
              testId="sendPayment.exclamationWarning"
              color={colors.cyan.c700}
              size={46}
              icon="infocirlce"
            />
          }
          title={t('onlineCapital')}
          text={t('onlineInfo')}
          buttonAcceptText="Ok"
          onButtonAcceptPress={() => setShowInfoOnlineModal(false)}
        />
        <ModalWindow
          testId="trade.redirectWebBrowser"
          isVisible={showCancelModal}
          icon={
            <FontAwesomeIcon
              testId="sendPayment.exclamationWarning"
              color={colors.cyan.c700}
              size={46}
              icon="question-circle"
            />
          }
          title={t('confirmationCapital')}
          text={t('cardWillBeRemoved')}
          buttonAcceptText="Yes"
          buttonCancelText="No"
          onButtonAcceptPress={cancelCcyCard}
          onButtonCancelPress={() => setShowCancelModal(false)}
        />
        <ModalWindow
          testId="trade.redirectWebBrowser"
          isVisible={showRequestPassModal}
          icon={
            <AntDesigns
              testId="sendPaymentDetails.checkCircle"
              color={colors.cyan.c700}
              size={46}
              icon="checkcircle"
            />
          }
          title={t('getCcyCardPin')}
          text={t('pleaseEnterPass')}
          buttonAcceptText={t('ok')}
          buttonCancelText={t('cancelCapital') as string}
          onButtonCancelPress={() => setShowRequestPassModal(false)}
          onButtonAcceptPress={checkAndShowPwd}
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
        <View style={styles.container}>
          <View style={styles.virtualCard}>
            <Image
              source={require('../../../../../assets/img/VFXF-R_Logo-WHITE.png')}
              style={styles.vfxLogo}
            />
            <Text style={styles.cardNumberText}>{renderCardNumber()}</Text>
            <View style={styles.dataImageWrapper}>
              <View style={styles.nameDuedateContainer}>
                <Text style={styles.cardNameText}>{ccyCardItem.EmbossedName.toUpperCase()}</Text>
                <Text style={styles.cardExpiresText}>
                  {ccyCardItem.ExpiryDate.substring(0, 2)}/{ccyCardItem.ExpiryDate.substring(4)}
                </Text>
              </View>
              <View style={{ marginLeft: 5 }}>
                <Image
                  source={require('../../../../../assets/img/Mastercard-logo.jpeg')}
                  style={styles.mastercardLogo}
                />
              </View>
            </View>
          </View>
          {ccyCardItem.Status === 1 && (
            <>
              <View style={styles.switchOptionWrapper}>
                <View style={styles.switchTextIconWrapper}>
                  <Text style={styles.switchText}>{t('magStripe')}</Text>
                  <IconButton
                    onPress={() => setShowInfoMagStripeModal(true)}
                    testId="showMagStripeModal"
                    icon={
                      <AntDesigns
                        icon={'infocirlce'}
                        color={colors.cyan.c600}
                        size={20}
                        testId={'payments.iconTitle'}
                      />
                    }
                  />
                </View>
                <SwitchButton onValueChange={() => setMagStripe(!magStripe)} value={magStripe} />
              </View>
              <View style={styles.switchOptionWrapper}>
                <View style={styles.switchTextIconWrapper}>
                  <Text style={styles.switchText}>{t('contactlessCapital')}</Text>
                  <IconButton
                    onPress={() => setShowInfoContactlessModal(true)}
                    testId="showContactlessModal"
                    icon={
                      <AntDesigns
                        icon={'infocirlce'}
                        color={colors.cyan.c600}
                        size={20}
                        testId={'payments.iconTitle'}
                      />
                    }
                  />
                </View>
                <SwitchButton
                  onValueChange={() => setContactless(!contactless)}
                  value={contactless}
                />
              </View>
              <View style={styles.switchOptionWrapper}>
                <View style={styles.switchTextIconWrapper}>
                  <Text style={styles.switchText}>{t('onlineCapital')}</Text>
                  <IconButton
                    onPress={() => setShowInfoOnlineModal(true)}
                    testId="showInfoOnlineModal"
                    icon={
                      <AntDesigns
                        icon={'infocirlce'}
                        color={colors.cyan.c600}
                        size={20}
                        testId={'payments.iconTitle'}
                      />
                    }
                  />
                </View>
                <SwitchButton onValueChange={() => setOnline(!online)} value={online} />
              </View>
            </>
          )}
        </View>
        {ccyCardItem.Status ? (
          <BottomButtonOptionsCardDetails
            textOpt1={t('viewPin')}
            textOpt2={
              ccyCardBlocked ? (t('unblockCapital') as string) : (t('blockCapital') as string)
            }
            textOpt3={t('cancelCapital') as string}
            textOpt4={t('mobileCapital') as string}
            onPressOpt1={renderFastAuthButton() as genericFn}
            onPressOpt2={() => setBlockConfirmModal(!blockConfirmModal)}
            onPressOpt3={() => setShowCancelModal(!showCancelModal)}
            onPressOpt4={() =>
              navigation.navigate('EditCcyCardMobilePhone', { CardID: ccyCardItem.ID })
            }
          />
        ) : (
          <BottomButtonOptionsCardDetails
            textOpt1={t('activateCapital')}
            textOpt2={t('cancelCapital') as string}
            onPressOpt1={() => 
              checkIfValidated(
              () => activateCcyCard(),
              () => setShowValidateModal(true),
            )}
            onPressOpt2={() => 
              checkIfValidated(
              () => setShowCancelModal(!showCancelModal),
              () => setShowValidateModal(true),
            )}
          />
        )}
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  virtualCard: {
    borderRadius: 10,
    backgroundColor: colors.grey.c999,
    flexWrap: 'wrap',
    margin: 20,
    padding: 25,
    flexDirection: 'row',
    shadowColor: colors.grey.c999,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  vfxLogo: { width: 110, height: 40 },
  cardNumberText: {
    color: colors.grey.A100,
    fontSize: fontSizes.smallHuge24,
    letterSpacing: 2.5,
    marginTop: 25,
  },
  cardNameText: {
    color: colors.grey.A100,
    fontSize: fontSizes.medium16,
    marginTop: 20,
    fontFamily: 'OpenSans-Regular',
  },
  cardExpiresText: {
    color: colors.grey.A100,
    fontSize: fontSizes.medium16,
    marginTop: 10,
    fontFamily: 'OpenSans-Regular',
  },
  nameDuedateContainer: { marginRight: 70 },
  mastercardLogo: { height: 45, width: 90 },
  dataImageWrapper: { flexDirection: 'row', alignItems: 'flex-end' },
  switchOptionWrapper: {
    backgroundColor: colors.grey.A100,
    padding: 20,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchText: {
    fontSize: fontSizes.mediumLarge18,
    fontFamily: 'OpenSans-Regular',
    marginRight: 8,
    color: colors.grey.c750,
  },
  switchTextIconWrapper: { alignItems: 'center', flexDirection: 'row' },
});

export default CurrencyCardDetails;
