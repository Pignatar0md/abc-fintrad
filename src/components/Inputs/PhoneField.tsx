import React, { FC, ReactElement, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors, fontSizes } from 'styles';
import { PhoneInputI } from 'types/components';

import LabelField from '../LabelField';

const PhoneField: FC<PhoneInputI> = (props): ReactElement => {
  const {
    label,
    autoComplete,
    value,
    onChangeText,
    placeHolder,
    wrapperStyle,
    textStyle,
    testId,
    labelMode,
  } = props;
  const [focused, setIsFocused] = useState<boolean>(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <View testID={testId}>
      {!!label && (
        <LabelField
          testId="phoneField.labelField"
          text={label}
          labelMode={labelMode}
          customStyle={focused && { color: colors.cyan.A800 }}
        />
      )}
      <View style={wrapperStyle}>
        <TextInput
          testID="phoneField.inputField"
          style={[styles.text, textStyle]}
          keyboardType="phone-pad"
          autoComplete={autoComplete}
          placeholder={placeHolder}
          value={value}
          onFocus={handleFocus}
          onChangeText={onChangeText}
          onBlur={handleBlur}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    padding: 8,
    backgroundColor: colors.grey.A100,
    fontSize: fontSizes.medium16,
    fontFamily: 'OpenSans-Regular',
  },
});

export default PhoneField;
