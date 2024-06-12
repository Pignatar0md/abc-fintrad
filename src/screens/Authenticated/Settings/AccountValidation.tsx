import React, { FC, ReactElement, useLayoutEffect, useState } from 'react';
import { Appearance, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';

import LightButton from 'components/Buttons/LightButton';
import { customInputWrapperLine } from 'components/static';

import { colors, fontSizes } from 'styles';
import { checkValidateTextInputError, renderTextInput } from 'utils/forms';
import LoadingIndicator from 'components/LoadingIndicator';
import { AccountValidationNavigationProp } from 'types/types';
import { DEFAULT_HEADER_CONFIG } from 'utils/static';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import AntDesigns from 'components/Icons/AntDesigns';
import { validatePinLetter } from 'api/ValidationRequests';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';

const AccountValidation: FC<AccountValidationNavigationProp> = ({ navigation }): ReactElement => {
  const { t } = useTranslation();
  const darkTheme = Appearance.getColorScheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [showModalSuccess, setShowModalSuccess] = useState<boolean>(false);
  const [showModalError, setShowModalError] = useState<boolean>(false);

  useLayoutEffect(() => {
    const screenTitle = t('ValidateAccount');
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
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

  const onValidatePress = async ({ code }: { code: string }) => {
    setLoading(true);
    const response = await validatePinLetter(code);
    if (typeof response?.data?.Data === 'boolean' && response?.data?.Data) {
      setShowModalSuccess(true);
      await sendInfoLog({ event: 'ValidatePinLetter', detail: 'Success' });
    } else {
      if (response?.data === 'Request failed with status code 401') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login', expired: true }],
        });
        await sendErrorLog({
          event: 'validatePinLetter onValidatePress - AccountValidation',
          detail: 'user session expired: ' + response?.data,
        });
      } else {
        await sendErrorLog({ event: 'ValidatePinLetter', detail: response?.toString() });
        setShowModalError(true);
      }
    }
    reset();
    setLoading(false);
  };

  if (loading) {
    return <LoadingIndicator background="white" testId="accountValidation.loader" size="large" />;
  }

  return (
    <View testID="accountValidation.wrapper" style={styles.container}>
      <ModalWindow
        testId={'major.ModalSuccess'}
        isVisible={showModalSuccess}
        icon={
          <AntDesigns
            testId="accountValidation.checkSuccess"
            color={colors.lightGreen.c450}
            size={46}
            icon="checkcircle"
          />
        }
        title={t('successCapital')}
        text={t('accountValidated')}
        buttonAcceptText={t('Ok')}
        onButtonAcceptPress={() => {
          setShowModalSuccess(!showModalSuccess);
          navigation.goBack();
        }}
      />
      <ModalWindow
        testId={'major.ModalError'}
        isVisible={showModalError}
        icon={
          <AntDesigns
            testId="login.exclamationError"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('errorCapital')}
        text={t('invalidCode')}
        buttonAcceptText={t('Ok')}
        onButtonAcceptPress={() => {
          setShowModalError(!showModalError);
        }}
      />
      <Text testID="validateDevice.mainText" style={styles.title}>
        {t('dontHaveFullAccess')}
      </Text>
      <Text testID="validateDevice.commentText" style={styles.comment}>
        {t('enterCodeWelcomeLetter')}
      </Text>
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          rules={{
            required: true,
            maxLength: 10,
            minLength: 1,
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
      </View>
      <View style={styles.buttonWrapper}>
        <LightButton
          size="big"
          filled
          onPress={handleSubmit(onValidatePress)}
          text={t('confirmCapital')}
          disabled={!dirtyFields.code}
          testId="validateDevice.validateButton"
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
  title: {
    marginTop: 30,
    fontSize: fontSizes.extraLarge22,
    color: colors.grey.c750,
    letterSpacing: 0.5,
    fontFamily: 'OpenSans-SemiBold',
  },
  comment: {
    marginTop: 5,
    fontSize: fontSizes.medium16,
    color: colors.grey.c600,
    letterSpacing: 0.5,
    fontFamily: 'OpenSans-Regular',
  },
  inputWrapper: {
    marginTop: 40,
  },
  buttonWrapper: {
    marginTop: 40,
    alignItems: 'center',
  },
});

export default AccountValidation;
