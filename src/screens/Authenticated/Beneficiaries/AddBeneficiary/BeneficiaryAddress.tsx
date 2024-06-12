import React, { FC, ReactElement, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import LightButton from 'components/Buttons/LightButton';
import LabelTextFieldWrapper from 'components/Wrappers/LabelTextFieldWrapper';
import ResponsiveFormWrapper from 'components/Wrappers/ResponsiveFormWrapper';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import ScrollViewWrapper from 'components/Wrappers/ScrollViewWrapper';
import { colors } from 'styles';
import { checkAddBeneficiaryTextInputError, renderTextAreaInput } from 'utils/forms';
import { getPlaneObjectData, storePlaneObjectData } from 'utils/localStorage';
import Dropdown from 'components/Inputs/Dropdown';
import { BeneficiariesContext } from 'state/BeneficiariesContext';
import { dropdownInitState } from '../../initialStates';
import { AddBeneficiaryTab } from 'types/screens';
import { Country } from 'types/forms';
import { DropDown } from 'types/components';
import { customInputWrapperLine } from 'components/static';

const BeneficiaryAddress: FC<AddBeneficiaryTab> = ({ jumpTo, beneficiary }): ReactElement => {
  const beneficiaryToUpdate = beneficiary ?? null;
  const { t } = useTranslation();
  const { beneficiariesInfo } = useContext(BeneficiariesContext);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      addressCountry: beneficiaryToUpdate
        ? `${beneficiaryToUpdate?.Address1} ${beneficiaryToUpdate?.Address2} ${beneficiaryToUpdate?.Address3}`
        : '',
    },
  });
  const [selectedCountry, setSelectedCountry] = useState<DropDown>(dropdownInitState);
  const [dropDownDefaultValue, setDropDownDefaultValue] = useState<DropDown>(dropdownInitState);
  const [savedBeneficiaryDetails, setSavedBeneficiaryDetails] = useState<{
    payCountry: { Name: string };
    addressCountry: string;
  }>({ payCountry: { Name: '' }, addressCountry: '' });

  useEffect(() => {
    const getSavedBeneficiaryDetails = async () => {
      const beneficiaryDetails = await getPlaneObjectData('beneficiaryAddress');
      if (beneficiaryDetails) {
        setSavedBeneficiaryDetails(beneficiaryDetails);
        const filteredCountry = beneficiariesInfo?.countries.find(
          (country: Country) => country.ID === beneficiaryDetails?.payCountry.ID,
        );
        setSelectedCountry({
          ...filteredCountry,
          value: beneficiaryDetails?.payCountry.ID,
          label: beneficiaryDetails?.payCountry.Name,
        });
      }
    };
    getSavedBeneficiaryDetails();
    const filteredCountry =
      beneficiaryToUpdate &&
      beneficiariesInfo?.countries.find(
        (country: Country) => country.CurrencyCode === beneficiaryToUpdate.CurrencyCode,
      );
    filteredCountry &&
      setDropDownDefaultValue({
        ...filteredCountry,
        label: filteredCountry?.Name,
        value: filteredCountry.ID,
      });
  }, []);

  const saveAndNext = async ({ addressCountry }: { addressCountry: string }) => {
    const beneficiaryAddressDetails = {
      payCountry: beneficiaryToUpdate ? dropDownDefaultValue : selectedCountry,
      addressCountry,
    };
    const response = await storePlaneObjectData('beneficiaryAddress', beneficiaryAddressDetails);
    if (response) {
      reset();
      jumpTo('third');
    }
  };

  return (
    <SafeAreaWrapper customStyle={styles.container}>
      <ScrollViewWrapper backgroundColor="white" testId="beneficiaryDetails.viewContactUsWrapper">
        <KeyboardAwareScrollView>
          <ResponsiveFormWrapper testId="addBeneficiary.wrapperAddressForm">
            <LabelTextFieldWrapper>
              <Dropdown
                testId="beneficiaryAddress.selectedCountry"
                defaultValue={dropDownDefaultValue}
                items={beneficiariesInfo?.countries}
                onChange={setSelectedCountry}
                placeholder={
                  savedBeneficiaryDetails?.addressCountry !== ''
                    ? savedBeneficiaryDetails?.payCountry?.Name
                    : 'select country'
                }
                showBorder
                dropDownLabel={'Country'}
                defaultMargin={false}
              />
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) =>
                  renderTextAreaInput({
                    value: value || savedBeneficiaryDetails?.addressCountry,
                    onChange,
                    label: t('addressCapital'),
                    placeHolder: t(''),
                    wrapperStyle: checkAddBeneficiaryTextInputError(
                      errors,
                      'addressCountry',
                      customInputWrapperLine,
                    ),

                    multiline: true,
                    numOfLines: 4,
                    secureTextEntry: false,
                    labelMode: 'dark',
                    testId: 'beneficiaryDetails.address',
                    keyboardType: 'default',
                  })
                }
                name="addressCountry"
              />
            </LabelTextFieldWrapper>
            <View style={styles.buttonWrapper}>
              <LightButton
                testId="contactUs.sendButton"
                filled
                size="big"
                disabled={beneficiary ? false : !selectedCountry.label}
                onPress={handleSubmit(saveAndNext)}
                text={t('saveCapital')}
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

export default BeneficiaryAddress;
