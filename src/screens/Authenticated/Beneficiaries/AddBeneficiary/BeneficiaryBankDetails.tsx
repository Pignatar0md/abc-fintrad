import React, { FC, ReactElement, useCallback, useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from 'styles';
import {
  beneficiaryBankDetailsInitState,
  countryInitState,
  dropdownInitState,
} from '../../initialStates';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import ScrollViewWrapper from 'components/Wrappers/ScrollViewWrapper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ResponsiveFormWrapper from 'components/Wrappers/ResponsiveFormWrapper';
import LabelTextFieldWrapper from 'components/Wrappers/LabelTextFieldWrapper';
import { checkAddBeneficiaryTextInputError, renderTextInput } from 'utils/forms';
import LightButton from 'components/Buttons/LightButton';
import { AddBeneficiaryTab } from 'types/screens';
import { addNewBeneficiary, updateBeneficiary } from 'api/BeneficiariesRequests';
import { deletePlaneData, getPlaneObjectData } from 'utils/localStorage';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';
import { BeneficiariesContext } from 'state/BeneficiariesContext';
import Dropdown from 'components/Inputs/Dropdown';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import AntDesigns from 'components/Icons/AntDesigns';
import { DropDownCountry } from 'interfaces/forms';
import { Country } from 'types/forms';
import { createButtonAlert } from 'utils/helpers';
import FontAwesomeIcon from 'components/Icons/FontAwesomeIcon';
import { navigateType } from 'types/types';
import { DropDown } from 'types/components';
import { defineRoutingBankFieldLabel, returnApiErrorMessage } from 'utils/helpers/Beneficiaries';
import {
  checkInvalidFields,
  checkRequiredFields,
  checkValidationsForCanada,
  setPayTypeCode,
} from 'utils/helpers/BeneficiaryFormValidation';
import { BENEFICIARY_TYPES } from 'utils/static';
import { customInputWrapperLine } from 'components/static';

const BeneficiaryBankDetails: FC<AddBeneficiaryTab> = ({ beneficiary, jumpTo }): ReactElement => {
  const beneficiaryDetailsInfo = {
    accountNumber: beneficiary?.AccountNumber,
    swiftCode: beneficiary?.SWIFTBIC,
    iban: beneficiary?.IBAN,
    routingBank: beneficiary?.RoutingCode,
    sortCode: beneficiary?.BankCode,
    bankName: beneficiary?.BankName,
    paymentPurpose: beneficiary?.Reference3,
    transitNumber: '',
  };
  let beneficiaryToUpdateDefaultInfo: object = {};
  if (beneficiary?.ID) {
    const nameToShow = beneficiary?.BeneficiaryName?.split(' ');
    const hasMiddleName = nameToShow?.length === 3;
    beneficiaryToUpdateDefaultInfo = {
      type: beneficiary?.IsCompany ? BENEFICIARY_TYPES[1].label : BENEFICIARY_TYPES[0].label,
      firstName: nameToShow[0],
      middleName: hasMiddleName ? nameToShow[1] : '',
      lastName: hasMiddleName ? nameToShow[2] : nameToShow[1],
      alias: '',
      email: beneficiary?.EMail,
      ref1: beneficiary?.Reference1,
      ref2: beneficiary?.Reference2,
      addressCountry: `${beneficiary?.Address1} ${beneficiary?.Address2} ${beneficiary?.Address3}`,
      payCountry: beneficiary?.PayCountryCode,
    };
  }
  const beneficiaryToUpdate = beneficiary
    ? { ...beneficiaryToUpdateDefaultInfo, ...beneficiaryDetailsInfo }
    : beneficiaryBankDetailsInitState;
  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: beneficiaryToUpdate,
  });
  const navigation: navigateType = useNavigation();
  const { t } = useTranslation();
  const { beneficiariesInfo } = useContext(BeneficiariesContext);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [errorRequestTitle, setErrorRequestTitle] = useState<string>('');
  const [returnedBeneficiaryID, setReturnedBeneficiaryID] = useState<string>('');
  const [errorRequestMessage, setErrorRequestMessage] = useState<string>('');
  const [displayValidationModal, setDisplayValidationModal] = useState<boolean>(false);
  const [showAddBeneficiaryModal, setShowAddBeneficiaryModal] = useState<boolean>(false);
  const [displaySuccessBeneficiaryModal, setDisplaySuccessBeneficiaryModal] =
    useState<boolean>(false);
  const [validationOkFn, setValidationOkFn] = useState<number>(0); // 0-dismiss, 1-props.jumpTo('second')
  const [localPayType, setLocalPayType] = useState<number>(0);
  const [accountNumberLabel, setAccountNumberLabel] = useState<string>(
    t('accountNumber') as string,
  );
  const [storedBeneficiaryAddress, setStoredBeneficiaryAddress] = useState<{
    addressCountry: string;
    payCountry: DropDownCountry;
  }>({
    addressCountry: '',
    payCountry: countryInitState,
  });
  const filteredCountry =
    beneficiary?.PayCountryCode &&
    beneficiariesInfo?.countries?.find(
      (country: Country) => beneficiary.PayCountryCode === country.ID,
    );
  const filteredCurrency =
    beneficiary?.CurrencyCode &&
    beneficiariesInfo?.currencies?.find((ccy) => ccy.value === beneficiary.CurrencyCode);
  const preselectedCountryDrodown = beneficiary?.PayCountryCode
    ? filteredCountry
    : countryInitState;
  const preselectedCurrencyDropdown = beneficiary?.CurrencyCode
    ? filteredCurrency
    : dropdownInitState;
  const [selectedCurrency, setSelectedCurrency] = useState<DropDown>(
    preselectedCurrencyDropdown as DropDown,
  );
  const [selectedCountry, setSelectedCountry] = useState<DropDownCountry>(
    preselectedCountryDrodown as DropDownCountry,
  );

  const getInfoFromPreviousForms = useCallback(async () => {
    const beneficiaryAddress = await getPlaneObjectData('beneficiaryAddress');
    setStoredBeneficiaryAddress(beneficiaryAddress);
  }, []);

  const [swiftDisabled, setSwiftDisabled] = useState<boolean>(false);
  const [ibanDisabled, setIbanDisabled] = useState<boolean>(false);
  const [accountNumberDisabled, setAccountNumberDisabled] = useState<boolean>(false);
  const [sortCodeDisabled, setSortCodeDisabled] = useState<boolean>(false);
  useEffect(() => {
    getInfoFromPreviousForms();
  }, [getInfoFromPreviousForms]);

  useEffect(() => {
    if (
      (selectedCurrency?.value !== 'GBP' && selectedCountry?.value === 'GB') ||
      (selectedCurrency.value !== 'CAD' && selectedCurrency.value !== 'USD')
    ) {
      setSwiftDisabled(false);
      setIbanDisabled(false);
      setAccountNumberDisabled(false);
      setSortCodeDisabled(false);
    } else {
      if (localPayType !== undefined && selectedCountry?.value === 'GB') {
        setLocalPayType(0);
      } else {
        setLocalPayType(selectedCountry?.PayType);
      }
      setPayTypeCode(
        localPayType,
        setSwiftDisabled,
        setIbanDisabled,
        setAccountNumberDisabled,
        setSortCodeDisabled,
      );
    }
  }, [selectedCountry]);

  useEffect(() => {
    const countryToSet = setCountryBasedOnSelectedCcy(selectedCurrency?.value) || countryInitState;
    if (
      localPayType !== undefined &&
      selectedCurrency?.value !== 'GBP' &&
      selectedCountry?.value === 'GB'
    ) {
      setLocalPayType(0);
    } else {
      setLocalPayType(selectedCountry?.PayType);
    }
    if (selectedCurrency?.value === 'MXN') {
      setAccountNumberLabel(t('accountNumberCLABE') as string);
    } else if (selectedCurrency?.value === 'NGN') {
      setAccountNumberLabel(t('NUBAN') as string);
    }
    setSelectedCountry(countryToSet!);
  }, [selectedCurrency, beneficiariesInfo?.countries, t]);

  const setCountryBasedOnSelectedCcy = (ccy: string) => {
    const setCountry = beneficiariesInfo?.countries?.find((country: Country) => {
      const newZealandCcySelected =
        ccy === 'NZD' ? country.ID === 'NZ' : country.CurrencyCode === selectedCurrency?.value;
      const uSCcySelected = ccy === 'USD' ? country.ID === 'US' : newZealandCcySelected;
      return uSCcySelected;
    });
    return setCountry;
  };

  const saveBeneficiary = async ({
    sortCode,
    accountNumber,
    swiftCode,
    iban,
    routingBank,
    transitNumber,
    bankName,
  }: {
    sortCode: string;
    accountNumber: string;
    swiftCode: string;
    iban: string;
    routingBank: string;
    transitNumber?: string;
    bankName?: string;
  }) => {
    setShowAddBeneficiaryModal(false);
    const beneficiaryDetails = await getPlaneObjectData('beneficiaryDetails');
    !beneficiary?.ID && !beneficiaryDetails && jumpTo('first');
    const beneficiaryAddress = await getPlaneObjectData('beneficiaryAddress');
    !beneficiary?.ID && !beneficiaryAddress && jumpTo('second');
    let localSortCode;
    if (selectedCountry?.ID !== 'CA') {
      localSortCode = sortCode;
    } else {
      localSortCode = transitNumber;
    }
    let beneficiaryInfoToSend = null;
    if (beneficiary?.ID) {
      beneficiaryInfoToSend = {
        ...beneficiaryToUpdate,
        ...beneficiaryDetails,
        ...beneficiaryAddress,
      };
    } else {
      beneficiaryInfoToSend = {
        ...beneficiaryDetails,
        ...beneficiaryAddress,
      };
    }
    const beneficiaryData = {
      ...beneficiaryInfoToSend,
      currency: selectedCurrency,
      bankCountry: selectedCountry,
      sortCode: localSortCode,
      accountNumber,
      swiftCode,
      bankName,
      iban,
      routingBank,
    };
    const isValid = validateFields();
    if (!isValid) {
      setDisplayValidationModal(true);
      return;
    }
    let response;
    if (beneficiary) {
      response = await updateBeneficiary(beneficiaryData, beneficiary.ID);
    } else {
      response = await addNewBeneficiary(beneficiaryData);
    }
    if (response.data.Succeeded) {
      reset();
      setReturnedBeneficiaryID(response.data.Data.BeneficiaryID);
      await deletePlaneData('beneficiaryDetails');
      await deletePlaneData('beneficiaryAddress');
      setDisplaySuccessBeneficiaryModal(true);
      await sendInfoLog(
        beneficiary
          ? { event: 'Update Beneficiary', detail: 'Success' }
          : { event: 'Add Beneficiary', detail: 'Success' },
      );
    } else {
      setErrorRequestTitle(t('errorCapital') as string);
      await sendErrorLog({
        event: `Couldn't add/update beneficiary: ${JSON.stringify(response.data.Message)}`,
        detail: 'Error',
      });
      const errorMessages = {
        title: {
          processing: t('beneficiaryBeingProcessed'),
        },
        content: {
          processing: t('processingBeneficiaryMessage'),
          invalidIban: t('notValidIBAN'),
          invalidSwift: t('notValidSwiftCode'),
          invalidAccountNumber: t('notValidAccountNumber'),
          invalidSortCode: t('notValidSortCode'),
          invalidBranchCode: t('notValidBranchCode'),
          invalidCountry: t('notValidCountry'),
        },
      };
      returnApiErrorMessage(
        response?.data?.Data?.Errors[0]?.Field,
        setErrorRequestTitle,
        setErrorRequestMessage,
        errorMessages,
        selectedCountry?.ID,
      );
      createButtonAlert(errorRequestTitle, errorRequestMessage, () => ({}), false);
    }
  };

  const validateFields = () => {
    let valid = true;
    const errorMessagesInvalid = [
      t('swift811chars'),
      t('onlyNumAndCharSwiftCode'),
      t('notValidIBAN'),
    ];
    const requiredMessages = [t('countryIsRequired'), t('addressIsRequired')];
    const canadaErrorMessages = [
      t('branchCodeRequired'),
      t('institutionBankRequired'),
      t('invalidBankCode'),
      t('invalidBranchCode'),
      t('transitNumberRequired'),
      t('invalidTransitNumber'),
      t('swiftCodeRequired'),
    ];

    valid = checkRequiredFields(
      selectedCurrency?.label,
      selectedCountry?.value,
      storedBeneficiaryAddress.addressCountry,
      setValidationMessage,
      () => setValidationOkFn(1),
      requiredMessages,
    );

    valid = checkInvalidFields(
      getValues('swiftCode'),
      getValues('iban'),
      selectedCountry?.ID,
      setValidationMessage,
      errorMessagesInvalid,
    );

    if (selectedCountry?.value === 'CA') {
      valid = checkValidationsForCanada(
        getValues('swiftCode'),
        getValues('sortCode'),
        getValues('transitNumber'),
        selectedCountry?.value,
        setValidationMessage,
        canadaErrorMessages,
      );
    }
    return valid;
  };

  return (
    <SafeAreaWrapper customStyle={styles.container}>
      <ModalWindow
        testId={''}
        isVisible={displaySuccessBeneficiaryModal}
        icon={
          <FontAwesomeIcon
            testId="beneficiaries.questionIcon"
            color={colors.cyan.c600}
            size={46}
            icon="question-circle"
          />
        }
        title={beneficiary ? t('beneficiaryEditedSuccessfully') : t('beneficiarySavedSuccessfully')}
        text={t('likeToSendPayment')}
        buttonAcceptText={'Ok'}
        buttonCancelText={t('cancelCapital') as string}
        onButtonAcceptPress={() =>
          navigation.navigate('SendPayment', {
            beneficiaryId: beneficiary?.ID ?? returnedBeneficiaryID,
          })
        }
        onButtonCancelPress={() => navigation.navigate('BeneficiariesTabbar')}
      />
      <ModalWindow
        testId={''}
        isVisible={showAddBeneficiaryModal}
        icon={
          <FontAwesomeIcon
            testId="beneficiaries.questionIcon"
            color={colors.cyan.c600}
            size={46}
            icon="question-circle"
          />
        }
        title={t('confirmationCapital')}
        text={t('saveBeneficiaryConfirmationMessage')}
        buttonAcceptText={'Ok'}
        buttonCancelText={t('cancelCapital') as string}
        onButtonAcceptPress={handleSubmit(saveBeneficiary)}
        onButtonCancelPress={() => setShowAddBeneficiaryModal(false)}
      />
      <ModalWindow
        testId={''}
        isVisible={displayValidationModal}
        icon={
          <AntDesigns
            testId="login.exclamationError"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('errorCapital')}
        text={validationMessage}
        buttonAcceptText={'Ok'}
        onButtonAcceptPress={
          validationOkFn === 0 ? () => setDisplayValidationModal(false) : () => jumpTo('second')
        }
      />
      <ScrollViewWrapper backgroundColor="white" testId="beneficiaryDetails.viewContactUsWrapper">
        <KeyboardAwareScrollView>
          <ResponsiveFormWrapper testId="beneficiaryDetails.wrapperSendPaymentForm">
            <LabelTextFieldWrapper>
              <Controller
                control={control}
                rules={{
                  required: true,
                  minLength: 3,
                  maxLength: 30,
                }}
                render={({ field: { onChange, value } }) =>
                  renderTextInput({
                    value,
                    onChange,
                    label: t('paymentPurpose'),
                    placeHolder: t(''),
                    wrapperStyle: checkAddBeneficiaryTextInputError(
                      errors,
                      'paymentPurpose',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'beneficiaryDetails.paymentPurpose',
                    keyboardType: 'default',
                  })
                }
                name="paymentPurpose"
              />
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              <Dropdown
                defaultValue={selectedCurrency}
                items={beneficiariesInfo?.currencies}
                onChange={setSelectedCurrency}
                placeholder={'select currency'}
                defaultMargin={false}
                dropDownLabel={t('currencyCapital') as string}
                showBorder
                testId={'beneficiaryBankDetails.selectedCurrency'}
              />
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              <Dropdown
                testId={'beneficiaryBankDetails.selectedCountry'}
                defaultValue={selectedCountry}
                items={beneficiariesInfo?.countries}
                onChange={setSelectedCountry}
                placeholder={'select country'}
                defaultMargin={false}
                dropDownLabel={t('countryCapital') as string}
                showBorder
              />
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              <Controller
                control={control}
                rules={{
                  maxLength: 32,
                }}
                render={({ field: { onChange, value } }) =>
                  renderTextInput({
                    value,
                    onChange,
                    label: t('bankName'),
                    placeHolder: t(''),
                    wrapperStyle: checkAddBeneficiaryTextInputError(
                      errors,
                      'bankName',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'beneficiaryDetails.bankName',
                    keyboardType: 'default',
                  })
                }
                name="bankName"
              />
            </LabelTextFieldWrapper>

            <LabelTextFieldWrapper>
              <Controller
                control={control}
                rules={{
                  minLength: 3,
                  maxLength: 9,
                  required: localPayType === 2 && selectedCountry.value === 'CA',
                }}
                render={({ field: { onChange, value } }) =>
                  renderTextInput({
                    value,
                    editable:
                      (selectedCurrency.value !== 'CAD' && selectedCurrency.value !== 'USD') ||
                      sortCodeDisabled,
                    onChange,
                    label:
                      selectedCurrency?.value === 'CAD'
                        ? t('InstitutionBanknumber')
                        : t('sortCode'),
                    placeHolder: t(''),
                    wrapperStyle: checkAddBeneficiaryTextInputError(
                      errors,
                      'sortCode',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'beneficiaryDetails.sortCode',
                    keyboardType: 'default',
                  })
                }
                name="sortCode"
              />
            </LabelTextFieldWrapper>
            {selectedCurrency?.value === 'CAD' && (
              <LabelTextFieldWrapper>
                <Controller
                  control={control}
                  rules={{
                    minLength: 5,
                  }}
                  render={({ field: { onChange, value } }) =>
                    renderTextInput({
                      value,
                      onChange,
                      label: t('transitNumber'),
                      placeHolder: t(''),
                      wrapperStyle: checkAddBeneficiaryTextInputError(
                        errors,
                        'transitNumber',
                        customInputWrapperLine,
                      ),
                      labelMode: 'dark',
                      testId: 'beneficiaryDetails.transitNumber',
                      keyboardType: 'default',
                    })
                  }
                  name="transitNumber"
                />
              </LabelTextFieldWrapper>
            )}
            <LabelTextFieldWrapper>
              <Controller
                control={control}
                rules={{
                  maxLength: 31,
                  required: localPayType === 1 || localPayType === 2,
                }}
                render={({ field: { onChange, value } }) =>
                  renderTextInput({
                    value,
                    onChange,
                    editable: !accountNumberDisabled,
                    label: accountNumberLabel,
                    placeHolder: t(''),
                    wrapperStyle: checkAddBeneficiaryTextInputError(
                      errors,
                      'accountNumber',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'beneficiaryDetails.accountNumber',
                    keyboardType: 'default',
                  })
                }
                name="accountNumber"
              />
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              <Controller
                control={control}
                rules={{
                  maxLength: selectedCountry?.label !== 'BWP' ? 11 : 0,
                  required:
                    selectedCountry.ID === 'MXN' ||
                    selectedCountry.ID === 'NGN' ||
                    selectedCountry.ID === 'BWP' ||
                    swiftDisabled ||
                    selectedCountry?.value === 'CA',
                  minLength:
                    selectedCurrency?.value === 'BWP' ? 6 : selectedCountry?.value === 'CA' ? 5 : 8,
                }}
                render={({ field: { onChange, value } }) =>
                  renderTextInput({
                    value,
                    onChange,
                    editable: swiftDisabled,
                    label: selectedCountry?.label === 'BWP' ? t('branchCode') : t('swiftCode'),
                    placeHolder: t(''),
                    wrapperStyle: checkAddBeneficiaryTextInputError(
                      errors,
                      'swiftCode',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'beneficiaryDetails.swiftCode',
                    keyboardType: 'default',
                  })
                }
                name="swiftCode"
              />
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              <Controller
                control={control}
                rules={{
                  required: localPayType === 0,
                  maxLength: 34,
                }}
                render={({ field: { onChange, value } }) =>
                  renderTextInput({
                    value,
                    onChange,
                    editable: ibanDisabled,
                    label: t('ibanMayusc'),
                    placeHolder: t(''),
                    wrapperStyle: checkAddBeneficiaryTextInputError(
                      errors,
                      'iban',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'beneficiaryDetails.iban',
                    keyboardType: 'default',
                  })
                }
                name="iban"
              />
            </LabelTextFieldWrapper>
            {selectedCurrency?.value !== 'CNY' && (
              <LabelTextFieldWrapper>
                <Controller
                  control={control}
                  rules={{
                    minLength: 3,
                    maxLength: 15,
                    required: selectedCurrency?.value === 'AUD',
                  }}
                  render={({ field: { onChange, value } }) => {
                    return renderTextInput({
                      value,
                      onChange,
                      label: defineRoutingBankFieldLabel(
                        selectedCurrency?.value,
                        [t('routingBank'), t('fedWireAbaCode'), t('IFSCCode'), t('CNAPSCode')],
                        selectedCountry?.value,
                      ),
                      placeHolder: t(''),
                      wrapperStyle: checkAddBeneficiaryTextInputError(
                        errors,
                        'routingBank',
                        customInputWrapperLine,
                      ),
                      labelMode: 'dark',
                      testId: 'beneficiaryDetails.routingBank',
                      keyboardType: 'default',
                    });
                  }}
                  name="routingBank"
                />
              </LabelTextFieldWrapper>
            )}
            <View style={styles.buttonWrapper}>
              <LightButton
                testId="contactUs.sendButton"
                filled
                size="big"
                disabled={
                  beneficiary ? false : !(selectedCurrency?.value && selectedCountry?.value)
                }
                onPress={() => setShowAddBeneficiaryModal(true)}
                text={beneficiary ? t('updateCapital') : t('saveCapital')}
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
  buttonWrapper: {
    marginVertical: 20,
  },
});

export default BeneficiaryBankDetails;
