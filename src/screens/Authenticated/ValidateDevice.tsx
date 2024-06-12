import React, { FC, ReactElement, useContext, useLayoutEffect, useState } from 'react';
import { Appearance, StyleSheet, Text, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import ModalWindow from 'components/Prebuilts/ModalWindow';
import AntDesigns from 'components/Icons/AntDesigns';
import LinkButton from 'components/Buttons/LinkButton';
import LightButton from 'components/Buttons/LightButton';
import LoadingIndicator from 'components/LoadingIndicator';

import { colors, fontSizes } from 'styles';
import { ValidateDeviceNavigationProp } from 'types/types';
import { DeviceValidationContext } from 'state/DeviceValidationContext';
import { checkValidateTextInputError, renderTextInput } from 'utils/forms';
import { sendSMS, validateReceivedCode } from 'api/ValidationRequests';
import { DEFAULT_HEADER_CONFIG, DEVICE_VALIDATED } from 'utils/static';
import { antDesignName } from 'types/icons';
import { customInputWrapperLine } from 'components/static';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';
import BackButton from 'components/Buttons/BackButton';
import { storePlaneStringData } from 'utils/localStorage';

const ValidateDevice: FC<ValidateDeviceNavigationProp> = ({ navigation }): ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const [codeResent, setCodeResent] = useState<boolean>(false);
  const [showValidDeviceModal, setShowValidDeviceModal] = useState<boolean>(false);
  const { t } = useTranslation();
  const darkTheme = Appearance.getColorScheme();
  const { deviceValidationInfo, resetErrorMessage, validateMessageError } =
    useContext(DeviceValidationContext);

  useLayoutEffect(() => {
    const screenTitle = t('ValidateDevice');
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      headerLeft: () => <BackButton onPress={() => navigation.navigate('Settings')} text={''} />,
      title: screenTitle,
    });
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: {
      code: '',
    },
  });

  const redirect = () => {
    setShowValidDeviceModal(false);
    navigation.navigate('SecuritySettings');
  };

  const onValidatePress = async ({ code }: { code: string }) => {
    setLoading(true);
    const response = await validateReceivedCode(code);
    if (typeof response.data === 'boolean' && response.data) {
      setShowValidDeviceModal(true);
      await storePlaneStringData(DEVICE_VALIDATED, '1');
      await sendInfoLog({ event: 'ValidateSMSCode', detail: 'Success' });
    } else {
      await sendErrorLog({ event: 'ValidateSMSCode', detail: response.toString() });
      validateMessageError(response.data);
    }
    reset();
    setLoading(false);
  };

  const onResendPress = async () => {
    setLoading(true);
    reset();
    const response = await sendSMS();
    if (typeof response.data !== 'boolean') {
      await sendErrorLog({ event: 'SendSMS', detail: response.toString() });
      validateMessageError(response.data);
    } else {
      await sendInfoLog({ event: 'SendSMS', detail: 'Success' });
    }
    setLoading(false);
    setCodeResent(true);
  };

  const pressOkInvalidCode = () => {
    reset();
    resetErrorMessage();
  };

  const pressOkCodeResent = () => {
    reset();
    setCodeResent(false);
  };

  const renderIcon = (testId: string, iconName: antDesignName) => (
    <AntDesigns testId={testId} color={colors.cyan.c800} size={46} icon={iconName} />
  );

  if (loading) {
    return <LoadingIndicator background="white" testId="login.loader" size="large" />;
  }

  return (
    <View testID="validateDevice.wrapper" style={styles.container}>
      <Text testID="validateDevice.mainText" style={styles.text}>
        {t('SmsSent')}
      </Text>
      <Controller
        control={control}
        rules={{
          required: true,
          maxLength: 6,
          minLength: 6,
        }}
        render={({ field: { onChange, value } }) =>
          renderTextInput({
            value,
            onChange,
            placeHolder: t('EnterCode'),
            label: '',
            wrapperStyle: checkValidateTextInputError(errors, 'code', customInputWrapperLine),
            testId: 'validateDevice.inputCode',
            keyboardType: 'number-pad',
          })
        }
        name="code"
      />
      <View style={styles.buttonWrapper}>
        <ModalWindow
          testId="validateDevice.invalidCode"
          isVisible={!!deviceValidationInfo.errorMessage}
          icon={renderIcon('validateDevice.exclamationWarning', 'infocirlce')}
          title={t('authorization')}
          text={t('invalidCode')}
          buttonAcceptText={t('ok')}
          onButtonAcceptPress={pressOkInvalidCode}
        />
        <ModalWindow
          testId="validateDevice.deviceValid"
          isVisible={showValidDeviceModal}
          icon={renderIcon('validateDevice.exclamationWarning', 'infocirlce')}
          title={t('authorization')}
          text={'Device validated'}
          buttonAcceptText={t('ok')}
          onButtonAcceptPress={redirect}
        />
        <ModalWindow
          testId="validateDevice.codeResent"
          isVisible={codeResent}
          icon={renderIcon('validateDevice.exclamationWarning', 'infocirlce')}
          title={t('authorisationSMS')}
          text={t('codeResent')}
          buttonAcceptText={t('ok')}
          onButtonAcceptPress={pressOkCodeResent}
        />
        <LightButton
          size="big"
          onPress={handleSubmit(onValidatePress)}
          filled
          disabled={!dirtyFields.code}
          text={t('Validate')}
          testId="validateDevice.validateButton"
        />
      </View>
      <View style={styles.buttonWrapper}>
        <LinkButton
          text={t('ResendSMS')}
          onPress={onResendPress}
          testId="validateDevice.resendSmsButton"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingTop: 20,
    backgroundColor: colors.grey.A100,
    paddingHorizontal: 30,
  },
  text: {
    marginVertical: 30,
    fontSize: fontSizes.mediumSmall14,
    lineHeight: 20,
    letterSpacing: 0.5,
    fontFamily: 'OpenSans-Light',
  },
  buttonWrapper: {
    marginTop: 30,
    alignItems: 'center',
  },
});

export default ValidateDevice;
