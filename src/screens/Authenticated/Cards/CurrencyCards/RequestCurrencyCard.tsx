import React, { FC, ReactElement, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import LightButton from 'components/Buttons/LightButton';
import LabelTextFieldWrapper from 'components/Wrappers/LabelTextFieldWrapper';
import ResponsiveFormWrapper from 'components/Wrappers/ResponsiveFormWrapper';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import ScrollViewWrapper from 'components/Wrappers/ScrollViewWrapper';
import FontAwesomeIcon from 'components/Icons/FontAwesomeIcon';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import AntDesigns from 'components/Icons/AntDesigns';
import LabelField from 'components/LabelField';
import CountrySeachablePicker from 'components/Inputs/CountrySearchablePicker';
import Checkbox from 'components/Inputs/Checkbox';
import LinkButton from 'components/Buttons/LinkButton';

import {
  DEFAULT_ADDRESS1,
  DEFAULT_ADDRESS2,
  DEFAULT_CITY,
  DEFAULT_HEADER_CONFIG,
  DEFAULT_IDD,
  DEFAULT_POSTCODE,
  TITLES,
} from 'utils/static';
import { checkRequestCcyCardTextInputError, renderTextInput } from 'utils/forms';
import { RequestCcyCardScreenNavigationProp } from 'types/types';
import { colors, fontSizes } from 'styles';
import { makeCcyCardRequest } from 'api/CardRequests';
import { VFX_WEBLINKS_SITES, VFX_WEBS_RESOURCES } from 'utils/urls';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';
import { Country } from 'interfaces/components';
import Dropdown from 'components/Inputs/Dropdown';
import { customInputWrapperLine, wrapperIdd, wrapperMobileNumber } from 'components/static';

const RequestCurrencyCard: FC<RequestCcyCardScreenNavigationProp> = ({
  navigation,
}): ReactElement => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      nameOnTheCard: '',
      mobileCode: '',
      mobileNumber: '',
    },
  });

  const [title, setTitle] = useState(TITLES[0]);
  const [acceptsCardFee, setAcceptCardFee] = useState<boolean>(false);
  const [acceptsTermsAndConds, setAcceptsTermsAndConds] = useState<boolean>(false);
  const [acceptsPrivacyPolicy, setAcceptsPrivacyPolicy] = useState<boolean>(false);
  const [beOlderThanThirdTeen, setBeOlderThanThirdTeen] = useState<boolean>(false);
  const [termsAndConditionsModal, setTermsAndConditionsModal] = useState<boolean>(false);
  const [cardRequestedModal, setCardRequestedModal] = useState<boolean>(false);
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errorMessageModal, setErrorMessageModal] = useState<string>('');

  useLayoutEffect(() => {
    const screenTitle = t('requestCcyCard');

    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      title: screenTitle,
    });
  }, []);

  const requestCcyCard = async ({
    firstName,
    lastName,
    nameOnTheCard,
    mobileCode,
    mobileNumber,
  }: {
    firstName: string;
    lastName: string;
    nameOnTheCard: string;
    mobileCode: string;
    mobileNumber: string;
  }) => {
    setConfirmationModal(!confirmationModal);
    const response = await makeCcyCardRequest({
      title,
      firstName,
      lastName,
      nameOnTheCard,
      mobileCode,
      mobileNumber,
    });
    if (typeof response !== 'string' && response?.data?.Data?.Success) {
      reset();
      await sendInfoLog({
        event: 'CurrencyCardRequest',
        detail: 'The user requested a new currency card.',
      });
      setCardRequestedModal(!cardRequestedModal);
    } else {
      let err = '';
      if (
        typeof response.data.ErrorMsg != 'undefined' &&
        response.data.ErrorMsg.indexOf('insufficient funds') !== -1
      ) {
        err = 'There are insufficient funds to cover the new card fee. Please top up.';
        await sendErrorLog({
          event: 'CurrencyCardRequest',
          detail: 'The user had no funds do request a new card',
        });
      } else {
        err = 'Unable to process your request. Please contact Customer Support.';
      }
      setErrorMessageModal(err);
      setShowErrorModal(!showErrorModal);
    }
  };

  const redirect = (termsAndConditions: boolean) => {
    let url;
    if (termsAndConditions) {
      url = `${VFX_WEBS_RESOURCES.webPage}${VFX_WEBLINKS_SITES.termsAndConditions}`;
    } else {
      url = `${VFX_WEBS_RESOURCES.webPage}${VFX_WEBLINKS_SITES.privacyPolicy}`;
    }
    navigation.navigate('WebViewScreen', {
      url,
    });
  };

  return (
    <SafeAreaWrapper customStyle={styles.container}>
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
        text={t('orderingCcyCardName')}
        extraComponent={
          <>
            <Text style={styles.embossedCardName}>{getValues('nameOnTheCard').toUpperCase()}</Text>
            <Text style={styles.wantToProceedText}>{t('wantToProceed')}</Text>
          </>
        }
        buttonAcceptText="Yes"
        buttonCancelText="No"
        onButtonAcceptPress={handleSubmit(requestCcyCard)}
        onButtonCancelPress={() => setConfirmationModal(!confirmationModal)}
      />
      <ModalWindow
        testId="requestCcyCard.ModalRedirection"
        isVisible={termsAndConditionsModal}
        icon={
          <AntDesigns
            testId="requestCcyCard.exclamationWarning"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('warning')}
        text={t('redirectToBrowser')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => {
          setTermsAndConditionsModal(false);
          redirect(true);
        }}
      />
      <ModalWindow
        testId="requestCcyCard.ModalCardRequested"
        isVisible={cardRequestedModal}
        icon={
          <AntDesigns
            testId="requestCcyCard.exclamationWarning"
            color={colors.cyan.c600}
            size={46}
            icon="infocirlce"
          />
        }
        title={t('cardRequest')}
        text={t('cardSentToYourAddress')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => {
          setCardRequestedModal(!cardRequestedModal);
          navigation.goBack();
        }}
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
        text={errorMessageModal}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setShowErrorModal(!showErrorModal)}
      />
      <ScrollViewWrapper backgroundColor="white" testId="requestCcyCard.viewContactUsWrapper">
        <KeyboardAwareScrollView>
          <View style={styles.beneficiaryLabelButtonWrapper}>
            <LabelField
              customStyle={{ fontFamily: 'OpenSans-Regular' }}
              testId="requestCcyCard.labelField"
              text={t('countryCapital')}
              labelMode={'dark'}
            />
          </View>
          <View style={{ marginHorizontal: 30 }}>
            <CountrySeachablePicker
              searchEnabled={false}
              placeHolder={'United Kingdom'}
              value={'' as unknown as Country}
              onChange={() => console.log('Function not implemented.')}
            />
          </View>
          <View style={styles.beneficiaryLabelButtonWrapper}>
            <Dropdown
              placeholder={TITLES[0].label}
              showBorder
              defaultValue={TITLES[0]}
              items={TITLES}
              onChange={setTitle}
              dropDownLabel={t('titleCapital')}
              defaultMargin={false}
            />
          </View>
          <ResponsiveFormWrapper testId="requestCcyCard.wrapperSendPaymentForm">
            <LabelTextFieldWrapper>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) =>
                  renderTextInput({
                    value,
                    onChange,
                    label: t('firstName'),
                    placeHolder: '',
                    wrapperStyle: checkRequestCcyCardTextInputError(
                      errors,
                      'firstName',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'sendPayment.firstName',
                    keyboardType: 'default',
                  })
                }
                name="firstName"
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
                    onChange,
                    label: t('lastName'),
                    placeHolder: '',
                    wrapperStyle: checkRequestCcyCardTextInputError(
                      errors,
                      'lastName',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'sendPayment.lastName',
                    keyboardType: 'default',
                  })
                }
                name="lastName"
              />
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              {renderTextInput({
                value: '',
                onChange: () => '',
                editable: false,
                label: t('address1'),
                placeHolder: DEFAULT_ADDRESS1,
                wrapperStyle: checkRequestCcyCardTextInputError(
                  errors,
                  'address1',
                  customInputWrapperLine,
                ),
                labelMode: 'dark',
                testId: 'sendPayment.address1',
                keyboardType: 'default',
              })}
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              {renderTextInput({
                value: '',
                onChange: () => '',
                editable: false,
                label: t('address2'),
                placeHolder: DEFAULT_ADDRESS2,
                wrapperStyle: checkRequestCcyCardTextInputError(
                  errors,
                  'address2',
                  customInputWrapperLine,
                ),
                labelMode: 'dark',
                testId: 'sendPayment.address2',
                keyboardType: 'default',
              })}
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              {renderTextInput({
                value: '',
                onChange: () => '',
                editable: false,
                label: t('cityCapital'),
                placeHolder: DEFAULT_CITY,
                wrapperStyle: checkRequestCcyCardTextInputError(
                  errors,
                  'city',
                  customInputWrapperLine,
                ),
                labelMode: 'dark',
                testId: 'sendPayment.city',
                keyboardType: 'default',
              })}
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              {renderTextInput({
                value: '',
                onChange: () => '',
                editable: false,
                label: t('postCode'),
                placeHolder: DEFAULT_POSTCODE,
                wrapperStyle: checkRequestCcyCardTextInputError(
                  errors,
                  'postCode',
                  customInputWrapperLine,
                ),
                labelMode: 'dark',
                testId: 'sendPayment.postCode',
                keyboardType: 'default',
              })}
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) =>
                  renderTextInput({
                    value,
                    onChange,
                    label: t('nameOnTheCard'),
                    placeHolder: '',
                    wrapperStyle: checkRequestCcyCardTextInputError(
                      errors,
                      'nameOnTheCard',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'sendPayment.nameOnTheCard',
                    keyboardType: 'default',
                  })
                }
                name="nameOnTheCard"
              />
            </LabelTextFieldWrapper>
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
                    wrapperStyle: checkRequestCcyCardTextInputError(
                      errors,
                      'mobileCode',
                      wrapperIdd,
                    ),
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
              <Checkbox
                flexDirection="row"
                onPress={() => setAcceptCardFee(!acceptsCardFee)}
                text={t('cardsRequestFee')}
                value={acceptsCardFee}
              />
            </View>
            <View style={styles.componentWrapper}>
              <Checkbox
                flexDirection="row"
                onPress={() => setAcceptsTermsAndConds(!acceptsTermsAndConds)}
                text={t('acceptsTermsAndConds')}
                value={acceptsTermsAndConds}
              />
            </View>
            <View style={styles.componentWrapper}>
              <Checkbox
                flexDirection="row"
                onPress={() => setAcceptsPrivacyPolicy(!acceptsPrivacyPolicy)}
                text={t('acceptsPrivacyPolicy')}
                value={acceptsPrivacyPolicy}
              />
            </View>
            <View style={styles.componentWrapper}>
              <Checkbox
                flexDirection="row"
                onPress={() => setBeOlderThanThirdTeen(!beOlderThanThirdTeen)}
                text={t('cardIsForSomeoneOlderThanThirdteen')}
                value={beOlderThanThirdTeen}
              />
            </View>
            <View style={styles.componentWrapper}>
              <LightButton
                testId="requestCcyCard.confirm"
                filled
                size="big"
                disabled={
                  !(
                    dirtyFields.firstName &&
                    dirtyFields.lastName &&
                    dirtyFields.mobileCode &&
                    dirtyFields.mobileNumber &&
                    dirtyFields.nameOnTheCard &&
                    acceptsCardFee &&
                    acceptsTermsAndConds &&
                    acceptsPrivacyPolicy &&
                    beOlderThanThirdTeen
                  )
                }
                onPress={() => setConfirmationModal(!confirmationModal)}
                text={t('confirmCapital')}
              />
            </View>
            <View style={styles.componentWrapper}>
              <LinkButton
                testId="requestCcyCard.seeTermsAndConditions"
                text={t('termsAndConditions')}
                onPress={() => setTermsAndConditionsModal(true)}
              />
            </View>
            <View style={styles.componentWrapper}>
              <LinkButton
                testId="requestCcyCard.seePrivacyPolicy"
                text={t('privacyPolicy')}
                onPress={() => redirect(false)}
              />
            </View>
          </ResponsiveFormWrapper>
        </KeyboardAwareScrollView>
      </ScrollViewWrapper>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: colors.grey.A100 },
  titleContainer: { height: 80, justifyContent: 'center', alignItems: 'center' },
  beneficiaryLabelButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  addButtonText: { color: colors.cyan.c800 },
  componentWrapper: {
    marginVertical: 15,
  },
  dropDownContainer: { alignItems: 'center', paddingBottom: 30 },
  limitInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingRight: 120,
    marginBottom: 8,
  },
  limitLegend: {
    color: colors.grey.c600,
    fontSize: fontSizes.medium16,
    fontFamily: 'OpenSans-Regular',
  },
  phoneInfoWrapper: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
  wantToProceedText: {
    color: colors.grey.c650,
    fontSize: fontSizes.medium16,
    fontFamily: 'OpenSans-Regular',
    marginTop: 15,
  },
  embossedCardName: {
    color: colors.grey.c550,
    fontSize: fontSizes.medium16,
    fontFamily: 'OpenSans-SemiBold',
    textAlign: 'center',
  },
});

export default RequestCurrencyCard;
