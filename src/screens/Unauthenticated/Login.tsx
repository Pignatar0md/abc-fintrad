import React, { FC, ReactElement, useContext, useState, useCallback, useEffect } from 'react';
import { Alert, Linking, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';

import { AuthContext } from 'state/AuthContext';
import { UserDetailsContext } from 'state/UserDetailsContext';
import { detailsRequest, loginRequest } from 'api/AuthRequests';

import Button from 'components/Buttons/Button';
import IconButton from 'components/Buttons/IconButton';
import LabelTextFieldWrapper from 'components/Wrappers/LabelTextFieldWrapper';
import LinkButton from 'components/Buttons/LinkButton';
import LoadingIndicator from 'components/LoadingIndicator';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import ScrollViewWrapper from 'components/Wrappers/ScrollViewWrapper';
import EvilIcon from 'components/Icons/EvilIcon';
import AntDesigns from 'components/Icons/AntDesigns';
import ResponsiveFormWrapper from 'components/Wrappers/ResponsiveFormWrapper';

import { checkLoginTextInputError, renderTextInput } from 'utils/forms';
import { VFX_WEBAPP_SERVICES, VFX_WEBLINKS_SITES, VFX_WEBS_RESOURCES } from 'utils/urls';

import VFXLogo from 'images/VFXF-R_Logo-WHITE.svg';
import { colors, fontSizes } from 'styles';
import { LoginScreenNavigationProp } from 'types/types';
import { getPlaneObjectData, secureRetrieve } from 'utils/localStorage';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { genericFn } from 'types/components';
import { InputUserToAuth, LoginAuthType } from 'types/screens';
import { useAuthType } from 'hooks/useAuthType';
import { getAppMetadata, getCcies, getLatestAppVersion, onBiometricAuthPress } from 'utils/helpers';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';
import { LOGIN_ACCOUNT_LOCKED_OUT, LOGIN_INVALID_PASSWORD } from 'utils/static/ErrorMessages';
import { BeneficiariesContext } from 'state/BeneficiariesContext';
import { getBeneficiaryList, getCountriesForBeneficiary } from 'api/BeneficiariesRequests';
import { Country } from 'types/forms';
import { Beneficiary } from 'types/state';
import { removeConfiguredPinCode } from 'utils/pin';

const Login: FC<LoginScreenNavigationProp> = ({ navigation, route }): ReactElement => {
  const { logoWrapper, buttonWrapper, buttonLinkWrapper } = styles;
  const { authInfo, loginUserError, loginUserSuccess, resetErrorMessage } = useContext(AuthContext);
  const {
    setCountriesForBeneficiaries,
    setBeneficiariesError,
    setCurrenciesForBeneficiaries,
    setCurrenciesError,
    setBeneficiaryListError,
    setBeneficiaryList,
  } = useContext(BeneficiariesContext);
  const { userDetailsSetInfo, userDetailsSetDefaultCcy } = useContext(UserDetailsContext);
  const { getAuthType } = useAuthType();
  const [authType, setAuthType] = useState<LoginAuthType>('password');
  const [urlToUpdate, setUrlToUpdate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [sessionExpiredModal, setSessionExpiredModal] = useState<boolean>(false);
  const [updateAppModal, setUpdateAppModal] = useState<boolean>(false);
  const [errorCanadianLoginModal, setErrorCanadianLoginModal] = useState<boolean>(false);
  const [upToDateApp, setUpToDateApp] = useState<boolean>(true);
  const [showWarningForgotPass, setShowWarningForgotPass] = useState<boolean>(false);
  const { t } = useTranslation();
  const requestPinArgs = {
    callback: () => localAuthenticate(),
    from: 'Login',
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isDirty },
  } = useForm({
    defaultValues: {
      userId: '',
      clientId: '',
      password: '',
    },
  });

  const getBiometricsActive = async () => {
    // await removeConfiguredPinCode('pinNumber'); //uncomment in case of debugging
    const res = await getAuthType();
    setAuthType(res as LoginAuthType);
    const authTypeIsBiometrics =
      res === 'biometrics' ? onBiometricAuthPress(localAuthenticate) : null;
    res !== 'pinNumber' ? authTypeIsBiometrics : navigation.navigate('RequestPin', requestPinArgs);
  };

  const checkUserNeedUpdateApp = async () => {
    const appInfo = await getAppMetadata();
    const lastestVersion = await getLatestAppVersion();
    setUrlToUpdate(appInfo.urlToUpdate);
    // const response = await checkAppVersion({ appVersion: appInfo.currentVersion }); //call get /appversion. response true ? upToDate : show message
    // appInfo.currentVersion < lastestVersion && setUpdateAppModal(true);
    // if (response.data) {
    const lastVersionNumber = parseInt(lastestVersion.replace('.', ''));
    const currVersionNumber = parseInt(appInfo.currentVersion.replace('.', ''));
    if (lastVersionNumber === currVersionNumber) {
      setUpToDateApp(true);
    } else {
      setUpToDateApp(false);
      setUpdateAppModal(true);
    }
  };

  const openStoreToUpdate = () => {
    Linking.canOpenURL(urlToUpdate)
      .then(() => {
        Linking.openURL(urlToUpdate);
      })
      .catch(() => Alert.alert(`Error at opening the URL: ${urlToUpdate}`));
  };

  useEffect(() => {
    if (route?.expired) {
      setSessionExpiredModal(true);
    }
    getBiometricsActive();
    checkUserNeedUpdateApp();
  }, []);

  const toggleRedirectAlert = React.useCallback(() => {
    setShowWarningForgotPass(!showWarningForgotPass);
  }, [showWarningForgotPass]);

  const toggleErrorAlert = useCallback(() => {
    resetErrorMessage();
  }, [reset, resetErrorMessage]);

  const loginUser = async ({ userId, clientId, password, authType }: InputUserToAuth) => {
    const didLoginRequest = Date.now();
    setLoading(true);
    const { data } = await loginRequest({ userId, clientId, password, authType });
    await sendInfoLog({
      event: 'Login',
      detail: 'EasyFX User tried to login on VFX app.',
    });
    if (data?.Succeeded) {
      const isCanadian =
        (data.Data.Data.BrokerID !== 0 && data.Data.Data.BrokerID === 'CAN') ?? false;
      if (isCanadian) {
        await sendInfoLog({
          event: 'processLoginData - Helpers Api',
          detail: 'Canadian account tried to login on VFX mobile app.',
        });
        setErrorCanadianLoginModal(true);
      }
      setLoading(false);
      await sendInfoLog({ event: 'Login', detail: 'Success' });
      const { Data, JWToken } = data.Data;
      loginUserSuccess(JWToken, navigation);
      const userDetails = await detailsRequest();
      const combinedUserInformation = { ...Data, ...userDetails.data.Data };
      userDetailsSetInfo(combinedUserInformation);
      const isBiometricsAuthMessageLog =
        authType === 'biometrics'
          ? `Login - Success using BIOMETRICS | Duration: ${Date.now() - didLoginRequest} ms`
          : `Login - Success | Duration: ${Date.now() - didLoginRequest} ms`;
      const successMessageLog =
        authType !== 'password' && authType !== 'biometrics'
          ? `Login - Success using PIN | Duration: ${Date.now() - didLoginRequest} ms`
          : isBiometricsAuthMessageLog;
      const successInfoLog = {
        event: 'ClientDetails',
        detail: successMessageLog,
      };
      await userDetailsSetDefaultCcy(userDetails.data.Data.BaseCCY);
      await getCurrencies();
      await getCountries();
      await getListOfBeneficiaries();
      (await userDetails.data.Succeeded)
        ? sendInfoLog(successInfoLog)
        : sendErrorLog({ event: 'ClientDetails', detail: userDetails.toString() });
      reset();
    } else {
      setLoading(false);
      await sendErrorLog({ event: 'Login', detail: data.toString() });
      if (data.Message === LOGIN_ACCOUNT_LOCKED_OUT) {
        loginUserError(t('accountLocked'));
      } else if (data.Message === LOGIN_INVALID_PASSWORD) {
        loginUserError(t('checkDetailsAndTryAgain'));
      } else {
        loginUserError(t('checkYourCredentials'));
      }
    }
  };

  const getCurrencies = async () => {
    const currenciesToList = await getCcies(navigation);
    currenciesToList
      ? setCurrenciesForBeneficiaries(currenciesToList as [])
      : setCurrenciesError('Error');
  };

  const getCountries = async () => {
    const response = await getCountriesForBeneficiary();
    if (response.data.Succeeded) {
      const formattedCountries = response.data.Data.map((country: Country) => {
        return { ...country, label: country.Name, value: country.ID };
      });
      setCountriesForBeneficiaries(formattedCountries);
    } else {
      setBeneficiariesError(response.data.Error);
    }
  };

  const getListOfBeneficiaries = async () => {
    const response = await getBeneficiaryList();
    if (response.data.Succeeded) {
      const formattedBeneficiaries = response.data.Data.map((beneficiary: Beneficiary) => {
        return { ...beneficiary, label: beneficiary.BeneficiaryName, value: beneficiary.ID };
      });
      setBeneficiaryList(formattedBeneficiaries);
    } else {
      setBeneficiaryListError(response.data.Message);
    }
  };

  const redirect = (forgotPass: boolean) => {
    let url = `${VFX_WEBS_RESOURCES.webPage}${VFX_WEBLINKS_SITES.signUp}`;
    if (forgotPass) {
      url = `${VFX_WEBS_RESOURCES.webApp}${VFX_WEBAPP_SERVICES.forgotPassword}`;
      toggleRedirectAlert();
    }
    navigation.navigate('WebViewScreen', {
      url,
    });
  };

  const localAuthenticate = async () => {
    const { clientID, userID } = await getPlaneObjectData('userData');
    const pass = await secureRetrieve('password');
    if (pass) {
      loginUser({
        clientId: clientID,
        userId: userID,
        password: pass,
        authType,
      });
    }
  };

  const renderFastAuthButton = () => {
    if (authType !== 'password') {
      const isBiometrics = authType === 'biometrics' ? true : false;
      return (
        <View style={{ marginTop: 15 }}>
          <LinkButton
            testId="login.fastLogin"
            text={isBiometrics ? t('loginWithBiometrics') : t('authenticateWithPin')}
            onPress={
              isBiometrics
                ? () => onBiometricAuthPress(localAuthenticate)
                : () => navigation.navigate('RequestPin', requestPinArgs)
            }
          />
        </View>
      );
    }
  };

  if (loading) {
    return <LoadingIndicator testId="login.loader" size="large" />;
  }

  return (
    <SafeAreaWrapper>
      <ScrollViewWrapper testId="login.viewWrapper">
        <View style={styles.headerWrapper}>
          <IconButton
            testId="login.contactUsIconButton"
            onPress={() => navigation.navigate('ContactUsTopTabbar')}
            icon={
              !isDirty ? (
                <EvilIcon
                  testId="login.contactUsIcon"
                  icon={'sc-telegram'}
                  color={colors.cyan.A800}
                  size={fontSizes.huge30}
                />
              ) : (
                <View testID="login.contactUsIconSpace" style={{ height: 24 }} />
              )
            }
          />
        </View>
        <KeyboardAwareScrollView>
          <>
            <View style={logoWrapper}>
              <VFXLogo width={180} height={100} />
            </View>

            <ResponsiveFormWrapper testId="login.wrapperLoginForm">
              <LabelTextFieldWrapper>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) =>
                    renderTextInput({
                      value,
                      upperCase: true,
                      onChange: onChange as genericFn,
                      placeHolder: t('exClientId'),
                      label: t('clientId'),
                      wrapperStyle: checkLoginTextInputError(errors, 'clientId'),
                      testId: 'login.clientId',
                      keyboardType: 'default',
                    })
                  }
                  name="clientId"
                />
              </LabelTextFieldWrapper>
              <LabelTextFieldWrapper>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) =>
                    renderTextInput({
                      value,
                      upperCase: true,
                      onChange: onChange as genericFn,
                      placeHolder: t('exUserId'),
                      wrapperStyle: checkLoginTextInputError(errors, 'userId'),
                      label: t('userId'),
                      testId: 'login.userId',
                      keyboardType: 'default',
                    })
                  }
                  name="userId"
                />
              </LabelTextFieldWrapper>
              <LabelTextFieldWrapper>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                    minLength: 4,
                  }}
                  render={({ field: { onChange, value } }) =>
                    renderTextInput({
                      value,
                      onChange: onChange as genericFn,
                      placeHolder: t('password'),
                      wrapperStyle: checkLoginTextInputError(errors, 'password'),
                      label: t('password'),
                      testId: 'login.password',
                      keyboardType: 'default',
                      secureTextEntry: true,
                    })
                  }
                  name="password"
                />
              </LabelTextFieldWrapper>

              <View style={buttonWrapper}>
                <ModalWindow
                  testId="login.redirectWebBrowser"
                  isVisible={sessionExpiredModal}
                  icon={
                    <AntDesigns
                      testId="login.exclamationWarning"
                      color={colors.amber.c800}
                      size={46}
                      icon="exclamationcircle"
                    />
                  }
                  title={t('alertCapital')}
                  text={t('yourSessionHasExpired')}
                  buttonAcceptText={t('ok')}
                  onButtonAcceptPress={() => setSessionExpiredModal(false)}
                />
                <ModalWindow
                  testId="login.redirectWebBrowser"
                  isVisible={showWarningForgotPass}
                  icon={
                    <AntDesigns
                      testId="login.exclamationWarning"
                      color={colors.amber.c800}
                      size={46}
                      icon="exclamationcircle"
                    />
                  }
                  title={t('warning')}
                  text={t('redirectToBrowser')}
                  buttonAcceptText={t('ok')}
                  onButtonAcceptPress={() => redirect(true)}
                />
                <ModalWindow
                  testId="login.errorMessage"
                  isVisible={!!authInfo.errorMessage}
                  icon={
                    <AntDesigns
                      testId="login.exclamationError"
                      color={colors.amber.c800}
                      size={46}
                      icon="exclamationcircle"
                    />
                  }
                  title={t('loginAlert')}
                  text={authInfo.errorMessage}
                  buttonAcceptText={t('ok')}
                  onButtonAcceptPress={toggleErrorAlert}
                />

                <ModalWindow
                  testId="login.errorMessageCanadianModal"
                  isVisible={errorCanadianLoginModal}
                  icon={
                    <AntDesigns
                      testId="login.exclamationError"
                      color={colors.amber.c800}
                      size={46}
                      icon="exclamationcircle"
                    />
                  }
                  title={t('loginAlert')}
                  text={t('notAvailableForCanada')}
                  buttonAcceptText={t('ok')}
                  onButtonAcceptPress={() => setErrorCanadianLoginModal(false)}
                />
                <ModalWindow
                  testId="login.errorMessage"
                  isVisible={updateAppModal}
                  icon={
                    <AntDesigns
                      testId="login.exclamationError"
                      color={colors.amber.c800}
                      size={46}
                      icon="exclamationcircle"
                    />
                  }
                  title={t('warning')}
                  text={t('updateVfxApp')}
                  buttonAcceptText={t('ok')}
                  buttonCancelText={t('updateCapital') as string}
                  onButtonAcceptPress={() => setUpdateAppModal(!updateAppModal)}
                  onButtonCancelPress={openStoreToUpdate}
                />
                <Button
                  testId="login.signUpButton"
                  onPress={() => redirect(false)}
                  text={t('signUp')}
                />
                <Button
                  testId="login.loginButton"
                  filled
                  disabled={
                    !(
                      dirtyFields.clientId &&
                      dirtyFields.userId &&
                      dirtyFields.password &&
                      upToDateApp
                    )
                  }
                  onPress={handleSubmit(loginUser)}
                  text={t('login')}
                />
              </View>
            </ResponsiveFormWrapper>
            <View style={buttonLinkWrapper}>
              <LinkButton
                testId="login.forgotPassword"
                text={t('forgotPassword')}
                onPress={toggleRedirectAlert}
              />
              {renderFastAuthButton()}
            </View>
          </>
        </KeyboardAwareScrollView>
      </ScrollViewWrapper>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    alignItems: 'flex-end',
    margin: 10,
  },
  logoWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    marginTop: 24,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  buttonLinkWrapper: {
    flex: 1,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Login;
