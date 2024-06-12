import React, { FC, ReactElement, useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { DEFAULT_HEADER_CONFIG } from 'utils/static';
import { CommunicationScreenNavigationProp } from 'types/types';
import { colors, fontSizes } from 'styles';
import Checkbox from 'components/Inputs/Checkbox';
import Legend from 'components/Texts/Legend';
import LightButton from 'components/Buttons/LightButton';
import { getCommunicationsConfig, saveCommunicationsConfig } from 'api/SettingsRequests';
import LoadingIndicator from 'components/LoadingIndicator';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';
import AntDesigns from 'components/Icons/AntDesigns';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import { AxiosResponse } from 'axios';

const Communication: FC<CommunicationScreenNavigationProp> = ({ navigation }): ReactElement => {
  const [mailMarketReports, setMailMarketReports] = useState(false);
  const [postMarketing, setPostMarketing] = useState(false);
  const [pushMarketing, setPushMarketing] = useState(false);
  const [smsMarketing, setSmsMarketing] = useState(false);
  const [emailMarketing, setEmailMarketing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [allOptions, setallOptions] = useState(false);
  const { t } = useTranslation();

  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
    });
  }, []);

  useEffect(() => {
    const getCommunicationSettings = async () => {
      const response: AxiosResponse = await getCommunicationsConfig();
      if (response.status === 200) {
        await sendInfoLog({ event: 'getCommunicationSettings', detail: 'success' });
        if (response.data.HasSetNotificationsPreferences) {
          setMailMarketReports(response.data.NotificationsTypeState[0].Active);
          setPostMarketing(response.data.NotificationsTypeState[1].Active);
          setPushMarketing(response.data.NotificationsTypeState[2].Active);
          setSmsMarketing(response.data.NotificationsTypeState[3].Active);
          setEmailMarketing(response.data.NotificationsTypeState[4].Active);
        } else {
          setallOptions(true);
        }
      } else {
        await sendErrorLog({ event: 'getCommunicationSettings', detail: response.data.toString() });
        setShowErrorModal(true);
      }
    };
    getCommunicationSettings();
  }, []);

  const onPressAllOptions = () => {
    setallOptions(!allOptions);
    setMailMarketReports(!mailMarketReports);
    setPostMarketing(!postMarketing);
    setPushMarketing(!pushMarketing);
    setSmsMarketing(!smsMarketing);
    setEmailMarketing(!emailMarketing);
  };

  const saveCommunicationSettings = async () => {
    setLoading(true);
    const response: AxiosResponse = await saveCommunicationsConfig({
      mailMarketReports,
      post: postMarketing,
      push: pushMarketing,
      sms: smsMarketing,
      email: emailMarketing,
    });
    if (response.status === 200) {
      setShowSuccessModal(true);
      await sendInfoLog({ event: 'saveCommunicationSettings', detail: 'success' });
    } else {
      setShowErrorModal(true);
      await sendErrorLog({ event: 'saveCommunicationSettings', detail: response.data.toString() });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <LoadingIndicator
        size={'small'}
        testId={'CommunicationSettings.Loading'}
        background="white"
      />
    );
  }

  return (
    <View style={styles.container} testID="homePage.Screen">
      <ModalWindow
        testId="trade.redirectWebBrowser"
        isVisible={showErrorModal}
        icon={
          <AntDesigns
            testId="sendPayment.exclamationWarning"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('errorCapital')}
        text={t('settingsCommunicationsError')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setShowErrorModal(false)}
      />
      <ModalWindow
        testId="trade.redirectWebBrowser"
        isVisible={showSuccessModal}
        icon={
          <AntDesigns
            testId="sendPayment.exclamationWarning"
            color={colors.cyan.c800}
            size={46}
            icon="infocirlce"
          />
        }
        title={t('communicationCapital')}
        text={t('settingsCommunicationsSuccess')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setShowSuccessModal(false)}
      />
      <Text testID="securitySettings.titleText" style={styles.titleStyle}>
        {t('communicationPreferences')}
      </Text>
      <View style={styles.bodyWrapper} testID="securitySettings.titleWrapper">
        <Legend testId="securitySettings.subtitleText">{t('marketingCapital')}</Legend>
        <View style={styles.checkboxRow}>
          <View style={styles.optionWrapper}>
            <Checkbox
              onPress={() => setPostMarketing(!postMarketing)}
              text="post"
              value={postMarketing}
            />
          </View>
          <View style={styles.optionWrapper}>
            <Checkbox
              onPress={() => setPushMarketing(!pushMarketing)}
              text="push"
              value={pushMarketing}
            />
          </View>
          <View style={styles.optionWrapper}>
            <Checkbox
              onPress={() => setSmsMarketing(!smsMarketing)}
              text="sms"
              value={smsMarketing}
            />
          </View>
          <View style={styles.optionWrapper}>
            <Checkbox
              onPress={() => setEmailMarketing(!emailMarketing)}
              text="email"
              value={emailMarketing}
            />
          </View>
        </View>
      </View>
      <View style={styles.bodyWrapper} testID="securitySettings.titleWrapper">
        <Legend testId="communication.subtitleText">{t('marketReports')}</Legend>
        <View style={styles.checkboxRow}>
          <View style={styles.optionWrapper}>
            <Checkbox
              onPress={() => setMailMarketReports(!mailMarketReports)}
              text="email"
              value={mailMarketReports}
            />
          </View>
        </View>
      </View>
      <View
        style={[styles.bodyWrapper, { marginTop: 5, marginBottom: 20 }]}
        testID="securitySettings.titleWrapper">
        <View style={styles.checkboxRow}>
          <View style={[styles.optionWrapper, { flexDirection: 'row' }]}>
            <Checkbox
              onPress={onPressAllOptions}
              text={t('allOptionsOn')}
              value={allOptions}
              flexDirection="row"
              customTextStyle={{ color: colors.grey.c999, fontFamily: 'OpenSans-SemiBold' }}
            />
          </View>
        </View>
      </View>
      <LightButton
        size="big"
        onPress={() => saveCommunicationSettings()}
        filled
        text={t('saveCapital')}
        testId="communication.saveButton"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: colors.grey.A100,
  },
  titleStyle: {
    fontSize: fontSizes.large20,
    color: colors.grey.c900,
    marginBottom: 6,
    fontFamily: 'OpenSans-SemiBold',
    letterSpacing: 0.5,
  },
  bodyWrapper: { marginTop: 20 },
  optionWrapper: {
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionTitle: {
    fontFamily: 'OpenSans-Regular',
    marginTop: 6,
    fontSize: fontSizes.mediumSmall14,
    color: colors.grey.c680,
    letterSpacing: 0.5,
  },
});

export default Communication;
