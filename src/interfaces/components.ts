import { ReactElement, ReactNode } from 'react';
import { GestureResponderEvent, KeyboardTypeOptions, StyleProp } from 'react-native';
import { DropDown, TranslationLanguageCodeMap, buttonSize, labelMode } from '../types/components';
import {
  antDesignName,
  evilIconsName,
  fontAwesomeName,
  fontAwesome5Name,
  materialCommunityIconName,
  materialIconName,
  fontistoName,
} from '../types/icons';
import { DropDownBeneficiary, DropDownCountry } from './forms';

export interface IDropDown {
  items: DropDown[] | DropDownCountry[] | DropDownBeneficiary[];
  onChange: (a: DropDownCountry | any) => void;
  placeholder: string;
  defaultMargin: boolean;
  testId: string;
  dropDownLabel?: string | ReactNode;
  disabled?: boolean;
  defaultValue?: object;
  ddWidth?: string | number;
  ddHeight?: number;
  showBorder?: boolean;
}

export interface CountrySearchablePickerI {
  searchEnabled: boolean;
  value: Country;
  onChange: (country: Country) => void;
  placeHolder?: string;
  testId?: string;
}

export interface CheckBoxI {
  value?: boolean;
  onPress: (isChecked: GestureResponderEvent) => void;
  text: string | ReactNode;
  boxSize?: number;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  customTextStyle?: StyleProp<object>;
}

export interface CalendarFieldI {
  onChange: (a: string) => void;
  value: Date;
  testId: string;
  width?: string;
  label?: string;
}

export interface InputI {
  value: string;
  onChangeText: (value: string) => void;
  placeHolder: string;
  testId: string;
  label?: string;
  autoComplete?: 'off' | 'email' | 'name' | 'postal-code' | 'tel' | 'street-address' | 'username';
  labelMode?: labelMode;
  textStyle?: StyleProp<object>;
  wrapperStyle?: StyleProp<object>;
}

export interface TextInputI extends InputI {
  keyboardType: KeyboardTypeOptions;
  upperCase?: boolean;
  multiline?: boolean;
  numOfLines?: number;
  maxLength?: number;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
}

export interface ButtonI {
  onPress: () => void;
  text: string;
  testId: string;
  size?: buttonSize;
  disabled?: boolean;
  filled?: boolean;
}

export interface LightButtonI extends ButtonI {
  inverted?: boolean;
}

export interface IconButtonI {
  icon: ReactElement;
  onPress: () => void;
  testId: string;
}

export interface ImageButtonI extends IconButtonI {
  buttonText: string;
  icon: ReactElement;
  disabled: boolean;
  textSize?: number;
  textColor?: string;
}

export interface TransactionButtonI {
  testId: string;
  text: string;
  onPress: () => void;
  width: 'small' | 'medium' | 'large';
}

export interface LabelFieldI {
  testId: string;
  text: string;
  labelMode?: labelMode;
  customStyle?: StyleProp<object>;
}

export interface ModalI {
  testId: string;
  isVisible: boolean;
  icon: ReactElement;
  title: string;
  text: string;
  buttonAcceptText: string;
  onButtonAcceptPress: () => void;
  buttonCancelText?: string;
  onButtonCancelPress?: () => void;
  extraComponent?: ReactElement;
}

export interface PinComponentI {
  onSuccess: () => void;
  status: 'choose' | 'locked' | 'enter';
  dotActive: string;
  dotInactive: string;
  titleColor: string;
  colorDigits: string;
  backgroundColorDigits: string;
  backgroundColorDigitsPressed: string;
  storedPinCodeName: string;
  colorDeleteButton: string;
  colorDeleteButtonPressed: string;
  titleChoose?: string;
  titleEnter?: string | null;
  titleChoose2?: string;
}

export interface SliderItemI {
  title: string;
  text: string;
  image: ReactElement;
}

export interface IPinWrapper {
  children: ReactNode;
  background: 'light' | 'dark';
  testId: string;
}

export interface HighLabelI {
  customStyle: StyleProp<object>;
  textTitle: string;
  textValue: string;
  active: boolean;
}

export interface DropdownI {
  label: string;
  data: Array<{ label: string; value: number | string }>;
  onSelect: (item: { label: string; value: number | string }) => void;
  preSelected: { label: string };
  bordered?: boolean;
  customStyle?: StyleProp<object>;
  dropDownLabel?: string;
}

interface Icon {
  color: string;
  size: number;
  testId: string;
}

export interface EvilIconI extends Icon {
  icon: evilIconsName;
}

export interface AntDesignI extends Icon {
  icon: antDesignName;
}

export interface FontAwesome5I extends Icon {
  icon: fontAwesome5Name;
}

export interface FontAwesomeI extends Icon {
  icon: fontAwesomeName;
}

export interface FontistoI extends Icon {
  icon: fontistoName;
}

export interface MaterialIconI extends Icon {
  icon: materialIconName;
}

export interface MaterialCommunityIconI extends Icon {
  icon: materialCommunityIconName;
}

export interface Country {
  name: TranslationLanguageCodeMap | string;
}
