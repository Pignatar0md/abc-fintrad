import React, { FC, ReactElement, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import TransparentButton from 'components/Buttons/TransparentButton';
import Line from 'components/Figures/Line';
import SwitchButton from 'components/Buttons/SwitchButton';
import IconButton from 'components/Buttons/IconButton';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import AntDesigns from 'components/Icons/AntDesigns';
import FontAwesomeIcon from 'components/Icons/FontAwesomeIcon';

import { DEFAULT_HEADER_CONFIG, SETTINGS_OPTIONS } from 'utils/static';
import { SettingsNavigationProp } from 'types/types';
import { colors, fontSizes } from 'styles';
import ActiveOption from 'components/Texts/ActiveOption';
import { ScreenSettings } from 'types/screens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesomeFive from 'components/Icons/FontAwesomeFive';
import { checkIfValidated, createButtonAlert, sendCodeAndRedirectToValidate } from 'utils/helpers';

const { grey, red, cyan, green } = colors;

const Settings: FC<SettingsNavigationProp> = ({ navigation }): ReactElement => {
  const { t } = useTranslation();
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [switch2FA, setSwitch2FA] = useState(false);
  const [modal2FAVisible, setModal2FAVisible] = useState(false);
  const [modalActive2FAVisible, setModalActive2FAVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { optionTextsWrapper, optionTitleWrapper, optionTitle, pairWrapper } = styles;

  useLayoutEffect(() => {
    const screenTitle = t('settingsCapital');
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      header: () => (
        <View style={[styles.headerWrapper, { marginTop: insets.top }]}>
          <TouchableOpacity
            style={{ marginLeft: 20 }}
            onPress={() => navigation.navigate('Sidebar')}>
            <FontAwesomeFive icon="bars" color={colors.grey.A100} size={20} testId="drawerMenu" />
          </TouchableOpacity>
          <View style={styles.headerContentWrapper}>
            <Text style={styles.headerText}>{screenTitle}</Text>
          </View>
        </View>
      ),
      title: screenTitle,
    });
  }, []);

  const navigateIfNotSecurityAuthOption = (screenName: string) => {
    if (screenName !== 'SecuritySettings') {
      navigation.navigate(screenName as ScreenSettings);
    } else {
      checkIfValidated(
        () => navigation.navigate(screenName as ScreenSettings),
        () => setShowValidateModal(true),
    )
    }
  }

  return (
    <View style={styles.container} testID="settings.Screen">
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
        testId="settings.2FACode"
        isVisible={modal2FAVisible}
        icon={
          <AntDesigns testId="settings.infoIcon" color={cyan.c800} size={46} icon="infocirlce" />
        }
        title={t('twoFactorAuth')}
        text={t('receiveTwoFactorPushNotif')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setModal2FAVisible(false)}
      />
      <ModalWindow
        testId="settings.2FACode"
        isVisible={modalActive2FAVisible}
        icon={
          <AntDesigns testId="settings.infoIcon" color={cyan.c800} size={46} icon="infocirlce" />
        }
        title={t('twoFactorDevice')}
        text={switch2FA ? t('twoFactorEnabled') : t('twoFactorDisabled')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setModalActive2FAVisible(false)}
      />
      {SETTINGS_OPTIONS.map(({ title, screenName }) => {
        return (
          <View key={title} testID={`settings.${title}`}>
            <View style={styles.optionWrapper}>
              {title !== '2faDevice' ? (
                <TransparentButton
                  customStyle={{ justifyContent: 'flex-start' }}
                  testId={`settings.enableSecurity${title}`}
                  onPress={() => navigateIfNotSecurityAuthOption(screenName)}>
                  <View style={optionTextsWrapper}>
                    <View style={optionTitleWrapper}>
                      <Text testID={`settings.tButton.title${title}`} style={optionTitle}>
                        {t(title)}
                      </Text>
                    </View>
                  </View>
                </TransparentButton>
              ) : (
                <View style={[optionTextsWrapper, { padding: 14, justifyContent: 'space-evenly' }]}>
                  <View style={[optionTitleWrapper, { alignItems: 'center' }]}>
                    <View style={[pairWrapper, { justifyContent: 'flex-start', marginTop: 5 }]}>
                      <Text testID={`settings.tButton.title${title}`} style={optionTitle}>
                        {t(title)}
                      </Text>
                      <ActiveOption color={switch2FA ? green.c750 : red.c700}>
                        {switch2FA ? ` (${t('onMayusc')})` : ` (${t('offMayusc')})`}
                      </ActiveOption>
                    </View>
                    <View
                      style={[pairWrapper, { alignItems: 'center', justifyContent: 'flex-end' }]}>
                      <SwitchButton
                        onValueChange={() => 
                            checkIfValidated(
                            () => {
                              setSwitch2FA(!switch2FA);
                              setModalActive2FAVisible(true);
                            },
                            () => setShowValidateModal(true),
                        )}
                        value={switch2FA}
                      />
                      <IconButton
                        icon={
                          <FontAwesomeIcon
                            icon={'question-circle'}
                            color={cyan.c700}
                            size={24}
                            testId={''}
                          />
                        }
                        onPress={() => setModal2FAVisible(true)}
                        testId={'settings.infoButton'}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
            <Line />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: grey.A100 },
  optionWrapper: { flexDirection: 'row', alignItems: 'center' },
  optionTextsWrapper: { marginHorizontal: 20 },
  optionTitle: {
    marginBottom: 5,
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.mediumSmall14,
    color: grey.c900,
    letterSpacing: 0.5,
  },
  optionTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pairWrapper: { width: '50%', flexDirection: 'row' },
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
});

export default Settings;
