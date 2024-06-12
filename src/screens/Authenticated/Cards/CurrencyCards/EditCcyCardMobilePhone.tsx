import React, { FC, ReactElement, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { DEFAULT_HEADER_CONFIG, DEFAULT_IDD } from 'utils/static';

import LightButton from 'components/Buttons/LightButton';
import LoadingIndicator from 'components/LoadingIndicator';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import FontAwesomeIcon from 'components/Icons/FontAwesomeIcon';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import ResponsiveFormWrapper from 'components/Wrappers/ResponsiveFormWrapper';

import { colors, fontSizes } from 'styles';
import { EditCcyCardMobilePhoneNavigationProp } from 'types/types';
import { updateCcyCardMobileNumber } from 'api/CardRequests';
import { checkRequestCcyCardTextInputError, renderTextInput } from 'utils/forms';
import AntDesigns from 'components/Icons/AntDesigns';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';
import { customInputWrapperLine, wrapperIdd, wrapperMobileNumber } from 'components/static';

const EditCcyCardMobilePhone: FC<EditCcyCardMobilePhoneNavigationProp> = ({
  navigation,
  route,
}): ReactElement => {
  const { t } = useTranslation();
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: {
      mobileCode: '',
      mobileNumber: '',
    },
  });

  const screenTitle = t('updateMobileNumber');
  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      title: screenTitle,
    });
  }, []);

  const updateCcyCardMobile = async ({
    mobileCode,
    mobileNumber,
  }: {
    mobileCode: string;
    mobileNumber: string;
  }) => {
    setLoading(true);
    const response = await updateCcyCardMobileNumber(
      `${mobileCode}${mobileNumber}`,
      route?.params?.CardID as number,
    );
    if (response?.data?.Data?.Success) {
      await sendInfoLog({
        event: 'UpdateCcyCardMobileNumber - EditCcyCardMobilePhone Screen',
        detail: 'The user updated the currency card mobile number.',
      });
      navigation.goBack();
      reset();
    } else {
      await sendErrorLog({
        event: 'UpdateCcyCardMobileNumber - EditCcyCardMobilePhone Screen',
        detail: 'Error at trying to update the currency card mobile number.',
      });
      setShowErrorModal(true);
    }
    setLoading(false);
  };

  if (loading) {
    return <LoadingIndicator testId="editCcyCardMobileNumber.loader" size="large" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.grey.A100 }}>
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
        text={t('requestNotProcessed')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setShowErrorModal(!showErrorModal)}
      />
      <SafeAreaWrapper>
        <ModalWindow
          testId="requestCcyCard.ModalConfirmation"
          isVisible={confirmationModal}
          icon={
            <FontAwesomeIcon
              testId="requestCcyCard.exclamationWarning"
              color={colors.cyan.c600}
              size={46}
              icon="question-circle"
            />
          }
          title={t('confirmationCapital')}
          text={t('updatingCcyCardMobileNumber')}
          extraComponent={
            <>
              <Text style={styles.newMobileNumber}>{`${getValues('mobileCode')} ${getValues(
                'mobileNumber',
              )}`}</Text>
              <Text style={styles.wantToProceedText}>{t('wantToProceed')}</Text>
            </>
          }
          buttonAcceptText="Yes"
          buttonCancelText="No"
          onButtonAcceptPress={handleSubmit(updateCcyCardMobile)}
          onButtonCancelPress={() => setConfirmationModal(!confirmationModal)}
        />
        <ResponsiveFormWrapper
          justifyContent="flex-start"
          testId={'editCcyCardMobilePhone.Wrapper'}>
          <View style={styles.phoneInfoWrapper}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) =>
                renderTextInput({
                  value,
                  onChange,
                  label: t('IDD'),
                  placeHolder: DEFAULT_IDD,
                  wrapperStyle: checkRequestCcyCardTextInputError(errors, 'mobileCode', wrapperIdd),
                  labelMode: 'dark',
                  testId: 'sendPayment.mobileCode',
                  keyboardType: 'phone-pad',
                })
              }
              name="mobileCode"
            />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) =>
                renderTextInput({
                  value,
                  onChange,
                  label: t('mobileNumber'),
                  placeHolder: '',
                  wrapperStyle: checkRequestCcyCardTextInputError(
                    errors,
                    'mobileNumber',
                    wrapperMobileNumber,
                  ),
                  labelMode: 'dark',
                  testId: 'sendPayment.mobileNumber',
                  keyboardType: 'phone-pad',
                })
              }
              name="mobileNumber"
            />
          </View>

          <View style={styles.componentWrapper}>
            <LightButton
              testId="requestCcyCard.confirm"
              filled
              size="big"
              disabled={!(dirtyFields.mobileCode && dirtyFields.mobileNumber)}
              onPress={() => setConfirmationModal(!confirmationModal)}
              text={t('confirmCapital')}
            />
          </View>
        </ResponsiveFormWrapper>
      </SafeAreaWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  phoneInfoWrapper: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
  componentWrapper: {
    marginVertical: 15,
  },
  wantToProceedText: {
    color: colors.grey.c650,
    fontSize: fontSizes.medium16,
    fontFamily: 'OpenSans-Regular',
    marginTop: 15,
  },
  newMobileNumber: {
    color: colors.grey.c550,
    fontSize: fontSizes.medium16,
    fontFamily: 'OpenSans-SemiBold',
    textAlign: 'center',
  },
});

export default EditCcyCardMobilePhone;
