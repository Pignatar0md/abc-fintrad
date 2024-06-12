import React, { FC, ReactElement, useLayoutEffect, useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Line from 'components/Figures/Line';
import ScrollViewWrapper from 'components/Wrappers/ScrollViewWrapper';
import LightButton from 'components/Buttons/LightButton';
import LabelField from 'components/LabelField';
import TransparentButton from 'components/Buttons/TransparentButton';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import AntDesigns from 'components/Icons/AntDesigns';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import TitleSection from 'components/Texts/TitleSection';
import ResponsiveFormWrapper from 'components/Wrappers/ResponsiveFormWrapper';
import LabelTextFieldWrapper from 'components/Wrappers/LabelTextFieldWrapper';

import { colors, fontSizes } from 'styles';
import { DEFAULT_HEADER_CONFIG } from 'utils/static';
import { beneficiaryInitState, dropdownInitState } from '../initialStates';
import { BeneficiariesContext } from 'state/BeneficiariesContext';
import { DropDownBeneficiary, DropDownCurrency } from 'interfaces/forms';
import { SendPaymentScreenNavigationProp } from 'types/types';
import { Beneficiary } from 'types/state';
import { checkSendPaymentTextInputError, renderTextInput } from 'utils/forms';
import { UserDetailsContext } from 'state/UserDetailsContext';
import { checkIfValidated, createButtonAlert, sendCodeAndRedirectToValidate } from 'utils/helpers';
import { sendInfoLog } from 'api/LoggerRequests';
import { customInputWrapperLine } from 'components/static';
import Dropdown from 'components/Inputs/Dropdown';

const SendPayment: FC<SendPaymentScreenNavigationProp> = ({ navigation, route }): ReactElement => {
  const { t } = useTranslation();
  const { userInfo } = useContext(UserDetailsContext);
  const { beneficiariesInfo } = useContext(BeneficiariesContext);
  const [showNotFoundBeneficiariesModal, setShowNotFoundBeneficiariesModal] = useState(false);
  const [showValidateModal, setShowValidateModal] = useState(false);
  const defaultSelectedBeneficiary = route?.params?.beneficiary ?? {
    ...beneficiaryInitState,
    ...dropdownInitState,
  };
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<DropDownBeneficiary>(
    defaultSelectedBeneficiary as DropDownBeneficiary
  );
  const receivedCCY =
    beneficiariesInfo?.currencies?.find((ccy) => ccy.value === route?.params?.CCY) ||
    (route?.params?.CCY && {
      label: route?.params?.CCY,
      value: route?.params?.CCY,
    }) ||
    userInfo.defaultCurrency;
  const [selectedCcy, setSelectedCcy] = useState<DropDownCurrency>(receivedCCY as DropDownCurrency);

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: {
      amount: '',
      firstReference: '',
      secondReference: '',
      paymentPurpose: '',
    },
  });

  const findBeneficiariesByCcy = () => {
    const beneficiariesWithSelectedCcy = beneficiariesInfo?.beneficiaryList.filter(
      (beneficiary: Beneficiary) => beneficiary.CurrencyCode === selectedCcy.value,
    );
    return beneficiariesWithSelectedCcy.length;
  };

  const findBeneficiariesByID = async () => {
    const beneficiariesWithSelectedCcy = beneficiariesInfo?.beneficiaryList.filter(
      (beneficiary: Beneficiary) => beneficiary.ID === route?.params?.beneficiaryId,
    );
    const defaultOrFound = route?.params?.CCY
      ? (beneficiariesWithSelectedCcy[0] as DropDownBeneficiary)
      : defaultSelectedBeneficiary;
    setSelectedBeneficiary(defaultOrFound as DropDownBeneficiary);
    if (findBeneficiariesByCcy() === 0) {
      setShowNotFoundBeneficiariesModal(true);
      await sendInfoLog({
        event: 'findBeneficiariesByID - SendPayment Screen',
        detail: 'Beneficiary not found with that id.',
      });
    }
  };

  useEffect(() => {
    findBeneficiariesByID();
  }, []);

  useLayoutEffect(() => {
    const screenTitle = t('sendPaymentCapital');

    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      title: screenTitle,
    });
  }, []);

  const sendPaymentTo = async ({
    amount,
    firstReference,
    secondReference,
    paymentPurpose,
  }: {
    amount: string;
    firstReference: string;
    secondReference: string;
    paymentPurpose: string;
  }) => {
    navigation.navigate('SendPaymentDetails', {
      amount,
      firstReference: firstReference !== '' ? firstReference : selectedBeneficiary.Reference1,
      secondReference: secondReference !== '' ? secondReference : selectedBeneficiary.Reference2,
      paymentPurpose: paymentPurpose !== '' ? paymentPurpose : selectedBeneficiary.Reference3,
      selectedBeneficiary,
      selectedCcy,
      limit: route?.params?.limit || '',
    });
  };

  const setDropdownPlaceHolderBeneficiary = () => {
    const placeHolder =
      selectedBeneficiary && selectedBeneficiary?.value !== ''
        ? selectedBeneficiary?.label
        : 'select beneficiary';
    return placeHolder;
  };

  return (
    <SafeAreaWrapper customStyle={styles.container}>
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
        testId="sendPayment.noBenericiariesFound"
        isVisible={showNotFoundBeneficiariesModal}
        icon={
          <AntDesigns
            testId="sendPayment.exclamationWarning"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('warning')}
        text={t('noBeneficiariesFound') + selectedCcy.label}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setShowNotFoundBeneficiariesModal(false)}
      />
      <ScrollViewWrapper backgroundColor="white" testId="sendPayment.viewContactUsWrapper">
        <KeyboardAwareScrollView>
          <View style={styles.titleContainer}>
            <TitleSection title={t('beneficiaryAndAmount')} />
          </View>

          <View style={[styles.titleContainer, { alignItems: 'stretch' }]}>
            <View style={styles.dropDownContainer}>
              <Dropdown
                testId="sendPayment.selectedCcy"
                defaultValue={selectedCcy}
                items={beneficiariesInfo?.currencies}
                onChange={setSelectedCcy}
                placeholder={selectedCcy?.label as string}
                showBorder
                defaultMargin={false}
              />
            </View>
            <View style={styles.limitInfoWrapper}>
              <Text style={styles.limitLegend}>{t('limit')}</Text>
              <Text style={styles.limitLegend}>{route?.params?.limit}</Text>
            </View>
            <View style={{ width: '100%' }}>
              <Line />
            </View>
          </View>
          <View style={{ paddingHorizontal: 30 }}>
            <Dropdown
              defaultMargin={false}
              testId="sendPayment.selectedBeneficiary"
              items={beneficiariesInfo?.beneficiaryList}
              onChange={setSelectedBeneficiary}
              showBorder
              placeholder={setDropdownPlaceHolderBeneficiary()}
              dropDownLabel={
                <View style={styles.beneficiaryLabelButtonWrapper}>
                  <LabelField
                    testId="textField.labelField"
                    text={t('beneficiaryCapital')}
                    labelMode={'dark'}
                  />
                  <TransparentButton
                    testId={'sendPayment.AddBeneficiaryButton'}
                    onPress={() =>
                      checkIfValidated(
                        () => navigation.navigate('AddBeneficiaryTopTabbar', { beneficiaryId: 0 }),
                        () => setShowValidateModal(true),
                      )
                    }>
                    <Text style={styles.addButtonText}>+ {t('add')}</Text>
                  </TransparentButton>
                </View>
              }
            />
          </View>
          <ResponsiveFormWrapper testId="sendPayment.wrapperSendPaymentForm">
            <LabelTextFieldWrapper>
              <Controller
                control={control}
                rules={{
                  required: true,
                  maxLength: 15,
                }}
                render={({ field: { onChange, value } }) =>
                  renderTextInput({
                    value,
                    onChange,
                    textStyle: { textAlign: 'right' },
                    label: t('amountCapital'),
                    placeHolder: t('amountEnter'),
                    wrapperStyle: checkSendPaymentTextInputError(
                      errors,
                      'amount',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'sendPayment.amount',
                    keyboardType: 'decimal-pad',
                  })
                }
                name="amount"
              />
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              <Controller
                control={control}
                rules={{
                  maxLength: 35,
                }}
                render={({ field: { onChange, value } }) =>
                  renderTextInput({
                    value: value || selectedBeneficiary?.Reference1,
                    onChange,
                    label: t('firstReference'),
                    placeHolder: t('firstReferenceEnter'),
                    wrapperStyle: checkSendPaymentTextInputError(
                      errors,
                      'firstReference',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'sendPayment.firstReference',
                    keyboardType: 'default',
                  })
                }
                name="firstReference"
              />
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              <Controller
                control={control}
                rules={{
                  maxLength: 35,
                }}
                render={({ field: { onChange, value } }) =>
                  renderTextInput({
                    value: value || selectedBeneficiary?.Reference2,
                    onChange,
                    label: t('secondReference'),
                    placeHolder: t('secondReferenceEnter'),
                    wrapperStyle: checkSendPaymentTextInputError(
                      errors,
                      'secondReference',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'sendPayment.secondReference',
                    keyboardType: 'default',
                  })
                }
                name="secondReference"
              />
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              <Controller
                control={control}
                rules={{
                  required: selectedBeneficiary?.Reference3 !== '' ? false : true,
                  maxLength: 30,
                }}
                render={({ field: { onChange, value } }) =>
                  renderTextInput({
                    value: value || selectedBeneficiary?.Reference3,
                    onChange,
                    label: t('paymentPurpose'),
                    placeHolder: t('paymentPurposeEnter'),
                    wrapperStyle: checkSendPaymentTextInputError(
                      errors,
                      'paymentPurpose',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'sendPayment.paymentPurpose',
                    keyboardType: 'default',
                  })
                }
                name="paymentPurpose"
              />
            </LabelTextFieldWrapper>
            <View style={styles.buttonWrapper}>
              <LightButton
                testId="sendPayment.sendButton"
                filled
                size="big"
                disabled={
                  !(
                    dirtyFields.amount &&
                    (dirtyFields.paymentPurpose || selectedBeneficiary?.Reference3) &&
                    !!selectedBeneficiary?.value
                  )
                }
                onPress={handleSubmit(sendPaymentTo)}
                text={t('send')}
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
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: { color: colors.cyan.c800 },
  buttonWrapper: {
    marginTop: 20,
  },
  dropDownContainer: { padding: 30 },
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
});

export default SendPayment;
