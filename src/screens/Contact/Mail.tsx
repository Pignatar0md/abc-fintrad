import React, { FC, ReactElement, useCallback, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';

import PhoneField from 'components/Inputs/PhoneField';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import AntDesigns from 'components/Icons/AntDesigns';
import LightButton from 'components/Buttons/LightButton';
import LoadingIndicator from 'components/LoadingIndicator';
import ScrollViewWrapper from 'components/Wrappers/ScrollViewWrapper';
import LabelTextFieldWrapper from 'components/Wrappers/LabelTextFieldWrapper';
import ResponsiveFormWrapper from 'components/Wrappers/ResponsiveFormWrapper';

import {
  checkContactUsTextInputError,
  isValidEmail,
  isValidPhone,
  renderTextAreaInput,
  renderTextInput,
} from 'utils/forms';

import { colors } from 'styles';
import { ContactUsContext } from 'state/ContactUsContext';
import { sendEmail } from 'api/ContactUsRequests';
import { antDesignName } from 'types/icons';
import { customInputWrapperLine } from 'components/static';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { InputUserToContactUs } from 'types/screens';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';

const Mail: FC = (): ReactElement => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: {
      userName: '',
      userEmail: '',
      userPhone: '',
      message: '',
    },
  });
  const { contactUsInfo, sendMessageError, resetErrorMessage } = useContext(ContactUsContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccessfulMessageSendingModal, setShowSuccessfulMessageSendingModal] =
    useState<boolean>(false);
  const [showInvalidEmailModal, setShowInvalidEmailModal] = useState<boolean>(false);

  const toggleErrorAlert = useCallback(() => {
    resetErrorMessage();
    reset();
  }, [resetErrorMessage, reset]);

  const togglePressOk = () => {
    reset();
    setShowSuccessfulMessageSendingModal(false);
  };

  const sendMessageTo = async ({
    userName,
    userEmail,
    userPhone,
    message,
  }: InputUserToContactUs) => {
    const validEmail = isValidEmail(userEmail);
    const validPhone = isValidPhone(userPhone);
    if (!validEmail) {
      setShowInvalidEmailModal(true);
      return;
    }
    setLoading(true);

    const response = await sendEmail({ userName, userEmail, userPhone, message });
    if (response?.data?.Success) {
      await sendInfoLog({ event: 'SendEmail', detail: 'Success' });
      setShowSuccessfulMessageSendingModal(true);
    } else {
      await sendErrorLog({ event: 'SendEmail', detail: response.data.toString() });
      sendMessageError(t('sendEmailTryAgain'));
    }
    setLoading(false);
  };

  const renderIcon = (testId: string, iconName: antDesignName) => (
    <AntDesigns testId={testId} color={colors.cyan.c800} size={46} icon={iconName} />
  );

  if (loading) {
    return <LoadingIndicator background="white" testId="contactUs.loader" size="large" />;
  }

  return (
    <SafeAreaWrapper>
      <ScrollViewWrapper backgroundColor="white" testId="contactUs.viewContactUsWrapper">
        <KeyboardAwareScrollView>
          <ResponsiveFormWrapper testId="contactUs.wrapperContactUsForm">
            <LabelTextFieldWrapper>
              <Controller
                control={control}
                rules={{
                  required: true,
                  minLength: 2,
                }}
                render={({ field: { onChange, value } }) =>
                  renderTextInput({
                    value,
                    onChange,
                    placeHolder: t('exName'),
                    wrapperStyle: checkContactUsTextInputError(
                      errors,
                      'userName',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    label: t('userName'),
                    testId: 'contactUs.userName',
                    keyboardType: 'default',
                  })
                }
                name="userName"
              />
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              <Controller
                control={control}
                rules={{
                  required: true,
                  minLength: 8,
                }}
                render={({ field: { onChange, value } }) =>
                  renderTextInput({
                    value,
                    onChange,
                    placeHolder: t('exEmail'),
                    label: t('userEmail'),
                    wrapperStyle: checkContactUsTextInputError(
                      errors,
                      'userEmail',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'contactUs.email',
                    keyboardType: 'email-address',
                  })
                }
                name="userEmail"
              />
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              <Controller
                control={control}
                rules={{
                  required: true,
                  minLength: 6,
                  maxLength: 18,
                }}
                render={({ field: { onChange, value } }) => (
                  <PhoneField
                    value={value}
                    onChangeText={onChange}
                    placeHolder={t('exPhone')}
                    testId="contactUs.userPhone"
                    label={t('userPhone') as string}
                    wrapperStyle={checkContactUsTextInputError(
                      errors,
                      'userPhone',
                      customInputWrapperLine,
                    )}
                    labelMode="dark"
                  />
                )}
                name="userPhone"
              />
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) =>
                  renderTextAreaInput({
                    value,
                    onChange,
                    placeHolder: t('exMessage'),
                    label: t('message'),
                    testId: 'contactUs.message',
                    wrapperStyle: checkContactUsTextInputError(
                      errors,
                      'message',
                      customInputWrapperLine,
                    ),
                    multiline: true,
                    numOfLines: 4,
                    keyboardType: 'default',
                    secureTextEntry: false,
                  })
                }
                name="message"
              />
            </LabelTextFieldWrapper>
            <View style={styles.buttonWrapper}>
              <ModalWindow
                testId="contactUs.SuccessfulMessageSending"
                isVisible={showSuccessfulMessageSendingModal}
                icon={renderIcon('contactUs.checkSuccess', 'checkcircle')}
                title={t('thankYou')}
                text={t('willBeContacted')}
                buttonAcceptText={t('ok')}
                onButtonAcceptPress={togglePressOk}
              />
              <ModalWindow
                testId="contactUs.invalidEmail"
                isVisible={!!showInvalidEmailModal}
                icon={renderIcon('login.exclamationError', 'exclamationcircle')}
                title={t('errorCapital')}
                text={t('invalidEmail')}
                buttonAcceptText={t('ok')}
                onButtonAcceptPress={() => setShowInvalidEmailModal(false)}
              />
              <ModalWindow
                testId="contactUs.errorMessage"
                isVisible={!!contactUsInfo.errorMessage}
                icon={renderIcon('login.exclamationError', 'exclamationcircle')}
                title={t('errorCapital')}
                text={contactUsInfo.errorMessage}
                buttonAcceptText={t('ok')}
                onButtonAcceptPress={toggleErrorAlert}
              />
              <LightButton
                testId="contactUs.sendButton"
                filled
                size="big"
                disabled={
                  !(
                    dirtyFields.message &&
                    dirtyFields.userEmail &&
                    dirtyFields.userPhone &&
                    dirtyFields.userName
                  )
                }
                onPress={handleSubmit(sendMessageTo)}
                text={t('Send')}
              />
            </View>
          </ResponsiveFormWrapper>
        </KeyboardAwareScrollView>
      </ScrollViewWrapper>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    marginTop: 20,
  },
});

export default Mail;
