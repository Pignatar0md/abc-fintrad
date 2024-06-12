import { KeyboardTypeOptions, StyleProp } from 'react-native';
import { labelMode } from 'types/components';
import { Country } from 'react-native-country-picker-modal';
import { ContactUsInput, Country as CountryType, LoginInput } from 'types/forms';
import { Beneficiary, Currency } from './screens';

export interface TextLoginInputProps {
  value: string;
  onChange: (a: string) => void;
  placeHolder: string;
  label: LoginInput;
  testId: string;
  keyboardType: KeyboardTypeOptions;
  wrapperStyle: any;
  maxLength?: number;
  upperCase?: boolean;
  labelMode?: 'dark' | undefined;
  secureTextEntry?: boolean;
  textStyle?: StyleProp<object>;
  editable?: boolean;
}

export interface TextContactUsInputProps extends Omit<TextLoginInputProps, 'label'> {
  label: ContactUsInput;
  multiline?: boolean;
  numOfLines?: number;
}

export interface ValidateInputProps extends Omit<TextLoginInputProps, 'label'> {
  label: string | '';
}

export interface TextAddBeneficiaryInputProps {
  searchEnabled: boolean;
  value: Country;
  onChange: (country: Country) => void;
  label: string;
  labelMode: labelMode;
  placeHolder?: string;
  testId?: string;
}

export interface DropDownCountry extends CountryType {
  label: string;
  value: string;
}

export interface DropDownBeneficiary extends Beneficiary {
  label: string;
  value: string;
}

export interface DropDownCurrency extends Currency {
  label: string;
  value: string;
}
