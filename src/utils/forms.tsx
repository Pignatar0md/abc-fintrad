import React from 'react';
import { StyleProp } from 'react-native';
import { FieldErrors } from 'react-hook-form';

import TextField from 'components/Inputs/TextField';
import StatusButton from 'components/Buttons/Balances/StatusButton';
import CellExtraInfoWrapper from 'components/Wrappers/CellExtraInfoWrapper';
import { genericFn } from 'types/components';

import { TextContactUsInputProps, TextLoginInputProps, ValidateInputProps } from 'interfaces/forms';

import { PAYMENT_STATUS_COLORS } from './static';
import { en } from '../../languages';
import { colors } from 'styles';

import {
  AddBeneficiaryInput,
  AddDebitCardInput,
  ContactUsInput,
  LoginInput,
  RequestCcyCardInput,
  AddOrderInput,
  SendPaymentInput,
} from 'types/forms';
import {
  InputUserToAddBeneficiary,
  InputUserOrderToAdd,
  InputUserToAddDebitCard,
  InputUserToAuth,
  InputUserToContactUs,
  InputUserToRequestCcyCard,
  InputUserToSendPayment,
  StatusElement,
} from 'types/screens';

const textInputFieldErrorStyle = { borderWidth: 1, borderColor: colors.red.c700 };

export const checkAddDebitCardTextInputError = (
  errors: FieldErrors<InputUserToAddDebitCard>,
  input: AddDebitCardInput,
  defaultWrapperStyle: StyleProp<object>,
) => {
  return errors[input] ? textInputFieldErrorStyle : defaultWrapperStyle;
};

export const checkContactUsTextInputError = (
  errors: FieldErrors<InputUserToContactUs>,
  input: ContactUsInput,
  defaultWrapperStyle: StyleProp<object>,
) => {
  return errors[input] ? textInputFieldErrorStyle : defaultWrapperStyle;
};

export const checkLoginTextInputError = (
  errors: FieldErrors<InputUserToAuth>,
  input: LoginInput,
) => {
  return errors[input] ? textInputFieldErrorStyle : null;
};

export const checkSendPaymentTextInputError = (
  errors: FieldErrors<InputUserToSendPayment>,
  input: SendPaymentInput,
  defaultWrapperStyle: StyleProp<object>,
) => {
  return errors[input] ? textInputFieldErrorStyle : defaultWrapperStyle;
};

export const checkRequestCcyCardTextInputError = (
  errors: FieldErrors<InputUserToRequestCcyCard>,
  input: RequestCcyCardInput,
  defaultWrapperStyle: StyleProp<object>,
) => {
  return errors[input] ? textInputFieldErrorStyle : defaultWrapperStyle;
};

export const checkAddOrderTextInputError = (
  errors: FieldErrors<InputUserOrderToAdd>,
  input: AddOrderInput,
  defaultWrapperStyle: StyleProp<object>,
) => {
  return errors[input] ? textInputFieldErrorStyle : defaultWrapperStyle;
};

export const checkAddBeneficiaryTextInputError = (
  errors: FieldErrors<InputUserToAddBeneficiary>,
  input: AddBeneficiaryInput,
  defaultWrapperStyle: StyleProp<object>,
) => {
  return errors[input] ? textInputFieldErrorStyle : defaultWrapperStyle;
};

export const checkValidateTextInputError = (
  errors: FieldErrors<{ code: string }>,
  input: 'code',
  defaultWrapperStyle: StyleProp<object>,
) => (errors[input] ? textInputFieldErrorStyle : defaultWrapperStyle);

export const renderTextInput = ({
  value,
  onChange,
  upperCase,
  placeHolder,
  label,
  labelMode,
  testId,
  keyboardType,
  secureTextEntry,
  maxLength,
  wrapperStyle,
  textStyle,
  editable,
}: TextLoginInputProps | TextContactUsInputProps | ValidateInputProps) => (
  <TextField
    textStyle={textStyle}
    testId={testId}
    maxLength={maxLength && maxLength}
    upperCase={upperCase}
    keyboardType={keyboardType}
    label={label}
    labelMode={labelMode}
    wrapperStyle={wrapperStyle}
    value={value}
    onChangeText={onChange}
    editable={editable}
    placeHolder={placeHolder}
    secureTextEntry={secureTextEntry}
  />
);

export const renderTextAreaInput = ({
  value,
  onChange,
  placeHolder,
  label,
  testId,
  keyboardType,
  secureTextEntry,
  multiline,
  numOfLines,
  wrapperStyle,
}: TextContactUsInputProps) => (
  <TextField
    testId={testId}
    keyboardType={keyboardType}
    label={label}
    wrapperStyle={wrapperStyle}
    value={value}
    labelMode="dark"
    multiline={multiline}
    numOfLines={numOfLines}
    onChangeText={onChange}
    placeHolder={placeHolder}
    secureTextEntry={secureTextEntry}
  />
);

export const isValidEmail = (email: string) =>
  /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email,
  );

export const isValidPhone = (phone: string) =>
  // eslint-disable-next-line no-useless-escape
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone);

export const renderElement = ({ element, color, text, onPress }: StatusElement) => {
  return element === 'btn' ? (
    <StatusButton text={text} onPress={onPress as genericFn} color={color} />
  ) : (
    <CellExtraInfoWrapper
      customWrapper={{ alignItems: 'flex-end', marginRight: 15 }}
      customTitle={{ color }}
      title={text}
      info={''}
    />
  );
};

const renderStatusComponent = (
  approvalLevel: number,
  receiverUsername: string,
  senderUsername: string,
  userApprovalLevel: number,
) => {
  const btnElem: StatusElement = {
    element: 'btn',
    color: PAYMENT_STATUS_COLORS['1'],
    text: en.approveMayusc,
    onPress: () => console.log(`approve ${approvalLevel} press`),
  };
  const tagElem: StatusElement = {
    element: 'tag',
    color: PAYMENT_STATUS_COLORS['3'],
    text: `Approval ${approvalLevel}`,
  };
  return userApprovalLevel === approvalLevel && senderUsername !== receiverUsername
    ? renderElement(btnElem)
    : renderElement(tagElem);
};

export const renderStatusElement = (
  status: number,
  receiverUsername: string,
  senderUsername: string,
  userApprovalLevel?: number,
) => {
  let elementToRender = null;
  switch (status) {
    case 0:
      elementToRender = renderStatusComponent(
        1,
        receiverUsername,
        senderUsername,
        userApprovalLevel as number,
      );
      break;
    case 1:
      elementToRender = renderStatusComponent(
        2,
        receiverUsername,
        senderUsername,
        userApprovalLevel as number,
      );
      break;
    case 5:
      elementToRender = renderElement({
        element: 'tag',
        color: PAYMENT_STATUS_COLORS['5'],
        text: en.insufficientFundsMayusc,
      });
      break;
    case 6:
      elementToRender = renderElement({
        element: 'tag',
        color: PAYMENT_STATUS_COLORS['6'],
        text: en.awaitingApprovalMayusc,
      });
      break;
    case 7:
      elementToRender = renderElement({
        element: 'tag',
        color: PAYMENT_STATUS_COLORS['7'],
        text: en.pendingMayusc,
      });
      break;
    case 8:
      elementToRender = renderElement({
        element: 'tag',
        color: PAYMENT_STATUS_COLORS['8'],
        text: en.inProcessMayusc,
      });
      break;
    case 9:
      elementToRender = renderElement({
        element: 'tag',
        color: PAYMENT_STATUS_COLORS['9'],
        text: en.sentMayusc,
      });
      break;
    default: //2
      elementToRender = renderElement({
        element: 'tag',
        color: PAYMENT_STATUS_COLORS['2'],
        text: en.sentMayusc,
      });
      break;
  }
  return elementToRender;
};
