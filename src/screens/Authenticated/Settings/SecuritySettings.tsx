import React, { FC, ReactElement, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BiometryTypes } from 'react-native-biometrics';
import { useIsFocused } from '@react-navigation/native';

import Line from 'components/Figures/Line';
import Legend from 'components/Texts/Legend';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import AntDesigns from 'components/Icons/AntDesigns';
import ActiveOption from 'components/Texts/ActiveOption';
import SwitchButton from 'components/Buttons/SwitchButton';
import MaterialCommunity from 'components/Icons/MaterialCommunity';
import TransparentButton from 'components/Buttons/TransparentButton';

import { SecuritySettingsNavigationProp } from 'types/types';
import { fontSizes, colors } from 'styles';
import { AuthContext } from 'state/AuthContext';
import { DEFAULT_HEADER_CONFIG, SECURITY_SETTINGS_OPTIONS } from 'utils/static';
import { checkUserBiometrics, createKeys, isSensorAvailable } from 'utils/biometrics';
import { hasConfiguredPinCode, removeConfiguredPinCode } from 'utils/pin';
import { getPlaneStringData } from 'utils/localStorage';
import { sendInfoLog } from 'api/LoggerRequests';

const SecuritySettings: FC<SecuritySettingsNavigationProp> = ({ navigation }): ReactElement => {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const { authInfo, switchActiveBiometrics } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [biometricAuthType, setBiometricAuthType] = useState<string | null>(null);
  const [switchBiometrics, setSwitchBiometrics] = useState(false);
  const [thereArePin, setThereArePin] = useState(false);

  const isFaceId = biometricAuthType === BiometryTypes.FaceID;
  const modalComment = isFaceId ? t('faceIdEnabled') : t('fingerprintEnabled');

  useLayoutEffect(() => {
    const screenTitle = t('securityTitle');
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      title: screenTitle,
    });
  }, []);

  useEffect(() => {
    async function getLocalAuthInfo() {
      const result = await isSensorAvailable();
      const areTherePin = await hasConfiguredPinCode('pinNumber');
      const biometricsResult = await getPlaneStringData('isUsingBiometrics');
      biometricsResult && switchActiveBiometrics(!!parseInt(biometricsResult));
      areTherePin && setSwitchBiometrics(true);
      setThereArePin(areTherePin);
      setBiometricAuthType(result || null);
    }
    getLocalAuthInfo();
  }, [isFocused]);

  useEffect(() => {
    async function upadteAuthTypeSet() {
      await sendInfoLog({
        event: 'upadteAuthTypeSet - SecuritySettings Screen',
        detail: `User has set authentication to ${switchBiometrics ? 'biometrics' : 'standard'}`,
      });
    }
    upadteAuthTypeSet();
  }, [switchBiometrics]);

  const redirect = () => navigation.navigate('SetPin');

  const onBiometricAuthPress = async () => {
    const result = await checkUserBiometrics();
    await createKeys();
    if (result) {
      await sendInfoLog({
        event: 'onBiometricAuthPress - SecuritySettings Screen',
        detail: 'User has set biometrics as authentication type.',
      });
      await removeConfiguredPinCode('pinNumber');
      setShowModal(true);
    }
  };

  const onPressOkModal = () => {
    setShowModal(false);
    switchActiveBiometrics(true);
    setSwitchBiometrics(true);
  };

  const onPressSwitchBiometrics = async () => {
    setSwitchBiometrics(!switchBiometrics);
    switchActiveBiometrics(!authInfo.isBiometricsActive);
  };

  const faceIdIcon = (
    <MaterialCommunity
      testId="securitySettings.faceId"
      icon={'face-recognition'}
      color={colors.grey.c650}
      size={40}
    />
  );

  const renderSwitchButton = () => {
    const someSecurityMethodActive = authInfo.isBiometricsActive || thereArePin;
    if (someSecurityMethodActive) {
      return (
        (authInfo.isBiometricsActive || thereArePin) && (
          <View testID="securitySettings.switchButtonWrapper" style={styles.biometricsWrapper}>
            <View testID="securitySettings.switchButtonTextsWrapper">
              <Text style={styles.optionTitle}>{t('turnOff')}</Text>
              <Legend testId="securitySettings.switchBiometrics">{t('turnOffBiometrics')}</Legend>
            </View>
            <SwitchButton value={!switchBiometrics} onValueChange={onPressSwitchBiometrics} />
          </View>
        )
      );
    }
  };

  const renderActiveTag = (isBiometricTitle: boolean) => {
    if (isBiometricTitle && authInfo.isBiometricsActive) {
      return <ActiveOption> ({t('activeMayusc')})</ActiveOption>;
    }
    if (!isBiometricTitle && thereArePin) {
      return <ActiveOption> ({t('activeMayusc')})</ActiveOption>;
    }
  };

  return (
    <View style={styles.container} testID="securitySettings.Screen">
      <ModalWindow
        testId="securitySettings.invalidCode"
        isVisible={showModal}
        icon={
          <AntDesigns
            testId="securitySettings.biometricsSuccess"
            color={colors.cyan.c800}
            size={46}
            icon="infocirlce"
          />
        }
        title={t('successCapital')}
        text={modalComment}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={onPressOkModal}
      />
      <View style={styles.headerWrapper} testID="securitySettings.titleWrapper">
        <Text testID="securitySettings.titleText" style={styles.titleStyle}>
          {t('securitySettings')}
        </Text>
        <Legend testId="securitySettings.subtitleText">{t('securityLegend')}</Legend>
      </View>
      <Line />
      {SECURITY_SETTINGS_OPTIONS.map(({ title, icon }, index) => {
        const isBiometricTitle = title === 'fingerprintTitle';
        const onPress = isBiometricTitle ? onBiometricAuthPress : redirect;
        const dynamicTitle = !isFaceId ? title : t('faceIdTitle');
        const dynamicIcon = !isFaceId ? icon : faceIdIcon;
        return (
          <View key={title} testID={`securitySettings.${title}`}>
            <View style={styles.optionWrapper}>
              <TransparentButton
                customStyle={{ justifyContent: 'flex-start' }}
                testId={`securitySettings.enableSecurity${title}`}
                onPress={onPress}>
                {index === 0 ? dynamicIcon : icon}
                <View style={styles.optionTextsWrapper}>
                  <View style={styles.biometricsTextsWrapper}>
                    <Text
                      testID={`securitySettings.tButton.title${title}`}
                      style={styles.optionTitle}>
                      {t(`${index === 0 ? dynamicTitle : title}`)}
                    </Text>
                    {renderActiveTag(isBiometricTitle)}
                  </View>
                  <Legend testId={`securitySettings.tButton.subtitle${title}`}>
                    {t('tapToActivate')}
                  </Legend>
                </View>
              </TransparentButton>
            </View>
            <Line />
          </View>
        );
      })}
      {renderSwitchButton()}
      <Line />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.grey.A100 },
  titleStyle: {
    fontSize: fontSizes.medium16,
    color: colors.grey.c900,
    marginBottom: 6,
    fontFamily: 'OpenSans-Regular',
    letterSpacing: 0.5,
  },
  headerWrapper: { margin: 20 },
  optionWrapper: { flexDirection: 'row', alignItems: 'center' },
  optionTitle: {
    marginBottom: 5,
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.mediumSmall14,
    color: colors.grey.c900,
    letterSpacing: 0.5,
  },
  optionTextsWrapper: { marginLeft: 20 },
  biometricsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  biometricsTextsWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
});

export default SecuritySettings;
