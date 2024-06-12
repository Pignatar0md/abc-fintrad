import { ReactNode } from 'react';
import { InputI } from 'interfaces/components';
import { DropDownBeneficiary, DropDownCountry } from 'interfaces/forms';
import { DropDown } from 'types/components';
import { TranslationLanguageCodeList } from 'components/Inputs/CountrySearchablePicker';

export type genericFn = () => void;
export type buttonSize = 'big' | 'medium' | 'small';
export type labelMode = 'light' | 'dark';
export type childrenToRender = { children: ReactNode; testId?: string; color?: string };
export type PhoneInputI = InputI;

type TranslationLanguageCode = (typeof TranslationLanguageCodeList)[number];
export type TranslationLanguageCodeMap = {
  [key in TranslationLanguageCode]: string;
};

export type DropDown = { label: string; value: string };

export type BottomButtonOptions = {
  textOpt1: string;
  textOpt2?: string;
  textOpt3?: string;
  textOpt4?: string;
  onPressOpt1: genericFn;
  onPressOpt2?: genericFn;
  onPressOpt3?: genericFn;
  onPressOpt4?: genericFn;
};

export type MonthYearPickerT = {
  onMonthSelected: (date: moment.Moment) => void;
  onButtonPress: () => void;
  isVisible: boolean;
  format: 'MMM YYYY' | 'MM[/]YY';
  maxDate?: moment.Moment;
  minDate?: moment.Moment;
  label?: string;
  month?: moment.Moment;
  containerFullWidth?: boolean;
  height?: 54 | 44;
  width?: '100%' | undefined;
};

export type TextWithPicker = {
  itemsList: DropDown[];
  value: string;
  setValue: () => void;
  preSelected: DropDown;
  setSelected: () => void;
  textEditable: boolean;
  dropDownPlaceHolder?: string;
  textPlaceHolder?: string;
  dropdownWidth?: number;
  dropdownHeight?: number;
};
