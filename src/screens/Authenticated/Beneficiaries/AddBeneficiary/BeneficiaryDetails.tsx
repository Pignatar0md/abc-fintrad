import React, { FC, ReactElement, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import { colors } from 'styles';
import { beneficiaryDetailsInitState } from '../../initialStates';
import ScrollViewWrapper from 'components/Wrappers/ScrollViewWrapper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ResponsiveFormWrapper from 'components/Wrappers/ResponsiveFormWrapper';
import LabelTextFieldWrapper from 'components/Wrappers/LabelTextFieldWrapper';
import { checkAddBeneficiaryTextInputError, renderTextInput } from 'utils/forms';
import LightButton from 'components/Buttons/LightButton';
import { AddBeneficiaryTab, BeneficiaryDetailsInfo } from 'types/screens';
import { BENEFICIARY_TYPES } from 'utils/static';
import { getPlaneObjectData, storePlaneObjectData } from 'utils/localStorage';
import Dropdown from 'components/Inputs/Dropdown';
import { emailAddressPattern } from 'utils/helpers/RegExs';
import { DropDown } from 'types/components';
import { customInputWrapperLine } from 'components/static';

const BeneficiaryDetails: FC<AddBeneficiaryTab> = ({ jumpTo, beneficiary }): ReactElement => {
  const nameToShow = beneficiary?.BeneficiaryName?.split(' ');
  let hasMiddleName = false;
  let beneficiaryToUpdate = beneficiaryDetailsInitState;
  if (nameToShow) {
    hasMiddleName = nameToShow?.length === 3;
    beneficiaryToUpdate = {
      firstName: nameToShow[0],
      middleName: hasMiddleName ? nameToShow[1] : '',
      lastName: hasMiddleName ? nameToShow[2] : nameToShow[1],
      alias: '',
      email: beneficiary?.EMail,
      ref1: beneficiary?.Reference1,
      ref2: beneficiary?.Reference2,
      type: beneficiary?.IsCompany ? BENEFICIARY_TYPES[1].label : BENEFICIARY_TYPES[0].label,
    };
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: beneficiaryToUpdate,
  });
  useEffect(() => {
    const getSavedBeneficiaryDetails = async () => {
      const beneficiaryDetails = await getPlaneObjectData('beneficiaryDetails');
      if (beneficiaryDetails) {
        setSavedBeneficiaryDetails(beneficiaryDetails);
        setSelectedBeneficiaryType(beneficiaryDetails?.type);
      }
    };
    getSavedBeneficiaryDetails();
  }, []);
  const initType = beneficiary?.IsCompany ? BENEFICIARY_TYPES[1] : BENEFICIARY_TYPES[0];
  const [selectedBeneficiaryType, setSelectedBeneficiaryType] = useState<DropDown>(initType);
  const [savedBeneficiaryDetails, setSavedBeneficiaryDetails] = useState<BeneficiaryDetailsInfo>({
    alias: '',
    email: '',
    firstName: '',
    lastName: '',
    middleName: '',
    ref1: '',
    ref2: '',
    type: '',
  });

  const { t } = useTranslation();

  const saveAndNext = async ({
    firstName,
    middleName,
    lastName,
    alias,
    email,
    ref1,
    ref2,
  }: BeneficiaryDetailsInfo) => {
    const beneficiaryDetailsData = {
      firstName: (!!firstName as boolean) ? firstName : savedBeneficiaryDetails?.firstName,
      middleName: (!!middleName as boolean) ? middleName : savedBeneficiaryDetails?.middleName,
      lastName: (!!lastName as boolean) ? lastName : savedBeneficiaryDetails?.lastName,
      alias: (!!alias as boolean) ? alias : savedBeneficiaryDetails?.alias,
      email: (!!email as boolean) ? email : savedBeneficiaryDetails?.email,
      ref1: (!!ref1 as boolean) ? ref1 : savedBeneficiaryDetails?.ref1,
      ref2: (!!ref2 as boolean) ? ref2 : savedBeneficiaryDetails?.ref2,
      type: selectedBeneficiaryType?.label ? selectedBeneficiaryType : BENEFICIARY_TYPES[0],
    };
    const response = await storePlaneObjectData('beneficiaryDetails', beneficiaryDetailsData);
    if (response) {
      reset();
      jumpTo('second');
    }
  };

  return (
    <SafeAreaWrapper customStyle={styles.container}>
      <ScrollViewWrapper backgroundColor="white" testId="beneficiaryDetails.viewContactUsWrapper">
        <KeyboardAwareScrollView>
          <ResponsiveFormWrapper testId="beneficiaryDetails.wrapperSendPaymentForm">
            <LabelTextFieldWrapper>
              <Dropdown
                defaultValue={selectedBeneficiaryType}
                dropDownLabel={t('typeCapital') as string}
                placeholder={
                  savedBeneficiaryDetails?.firstName !== ''
                    ? savedBeneficiaryDetails?.type?.label
                    : 'Personal'
                }
                items={BENEFICIARY_TYPES}
                defaultMargin={false}
                onChange={setSelectedBeneficiaryType}
                showBorder
                testId={'beneficiaryDetails.selectedBeneficiaryType'}
              />
            </LabelTextFieldWrapper>
            <LabelTextFieldWrapper>
              <Controller
                control={control}
                rules={{
                  required: savedBeneficiaryDetails?.firstName !== '' ? false : true,
                  minLength: 2,
                  maxLength: 31,
                }}
                render={({ field: { onChange, value } }) =>
                  renderTextInput({
                    value: value || savedBeneficiaryDetails?.firstName,
                    onChange,
                    label:
                      selectedBeneficiaryType?.value === 'Personal'
                        ? t('firstName')
                        : t('userName'),
                    placeHolder: t(''),
                    wrapperStyle: checkAddBeneficiaryTextInputError(
                      errors,
                      'firstName',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'beneficiaryDetails.firstName',
                    keyboardType: 'default',
                  })
                }
                name="firstName"
              />
            </LabelTextFieldWrapper>
            {selectedBeneficiaryType?.value === 'Personal' && (
              <>
                <LabelTextFieldWrapper>
                  <Controller
                    control={control}
                    rules={{
                      maxLength: 31,
                    }}
                    render={({ field: { onChange, value } }) =>
                      renderTextInput({
                        value: value || savedBeneficiaryDetails?.middleName,
                        onChange,
                        label: t('middleName'),
                        placeHolder: t(''),
                        wrapperStyle: checkAddBeneficiaryTextInputError(
                          errors,
                          'middleName',
                          customInputWrapperLine,
                        ),
                        labelMode: 'dark',
                        testId: 'beneficiaryDetails.middleName',
                        keyboardType: 'default',
                      })
                    }
                    name="middleName"
                  />
                </LabelTextFieldWrapper>
                <LabelTextFieldWrapper>
                  <Controller
                    control={control}
                    rules={{
                      required:
                        savedBeneficiaryDetails?.lastName !== ''
                          ? false
                          : selectedBeneficiaryType?.value === 'Personal',
                      minLength: 2,
                      maxLength: 31,
                    }}
                    render={({ field: { onChange, value } }) =>
                      renderTextInput({
                        value: value || savedBeneficiaryDetails?.lastName,
                        onChange,
                        label: t('lastName'),
                        placeHolder: t(''),
                        wrapperStyle: checkAddBeneficiaryTextInputError(
                          errors,
                          'lastName',
                          customInputWrapperLine,
                        ),
                        labelMode: 'dark',
                        testId: 'beneficiaryDetails.lastName',
                        keyboardType: 'default',
                      })
                    }
                    name="lastName"
                  />
                </LabelTextFieldWrapper>
              </>
            )}
            <LabelTextFieldWrapper>
              <Controller
                control={control}
                rules={{
                  maxLength: 45,
                  pattern: emailAddressPattern,
                }}
                render={({ field: { onChange, value } }) =>
                  renderTextInput({
                    value: value || savedBeneficiaryDetails?.email,
                    onChange,
                    label: t('userEmail'),
                    placeHolder: t(''),
                    wrapperStyle: checkAddBeneficiaryTextInputError(
                      errors,
                      'email',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'beneficiaryDetails.email',
                    keyboardType: 'email-address',
                  })
                }
                name="email"
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
                    value: value || savedBeneficiaryDetails?.ref1,
                    onChange,
                    label: t('ref1'),
                    placeHolder: t(''),
                    wrapperStyle: checkAddBeneficiaryTextInputError(
                      errors,
                      'ref1',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'beneficiaryDetails.firstReference',
                    keyboardType: 'default',
                  })
                }
                name="ref1"
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
                    value: value || savedBeneficiaryDetails?.ref2,
                    onChange,
                    label: t('ref2'),
                    placeHolder: t(''),
                    wrapperStyle: checkAddBeneficiaryTextInputError(
                      errors,
                      'ref2',
                      customInputWrapperLine,
                    ),
                    labelMode: 'dark',
                    testId: 'beneficiaryDetails.secondReference',
                    keyboardType: 'default',
                  })
                }
                name="ref2"
              />
            </LabelTextFieldWrapper>
            <View style={styles.buttonWrapper}>
              <LightButton
                testId="contactUs.sendButton"
                filled
                size="big"
                disabled={
                  beneficiary || savedBeneficiaryDetails?.firstName ? false : !dirtyFields.firstName
                }
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

export default BeneficiaryDetails;
