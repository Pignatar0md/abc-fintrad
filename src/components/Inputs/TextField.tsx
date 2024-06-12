import React, { FC, ReactElement, useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import { colors, fontSizes } from 'styles';
import { TextInputI } from '../../interfaces/components';
import LabelField from '../LabelField';

const TextField: FC<TextInputI> = (props): ReactElement => {
  const {
    keyboardType,
    label,
    autoComplete,
    value,
    secureTextEntry,
    onChangeText,
    placeHolder,
    wrapperStyle,
    textStyle,
    testId,
    maxLength,
    labelMode,
    multiline,
    numOfLines,
    editable,
    upperCase,
  } = props;
  const [focused, setIsFocused] = useState<boolean>(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const iosTextStyle =
    Platform.OS === 'ios' && numOfLines
      ? { ...styles.text, minHeight: 20 * numOfLines }
      : styles.text;
  const isMultiLineTextStyle = multiline
    ? { ...iosTextStyle, textAlignVertical: 'top' }
    : iosTextStyle;

  return (
    <View testID={testId}>
      {!!label && (
        <LabelField
          testId="textField.labelField"
          text={label}
          labelMode={labelMode}
          customStyle={focused && { color: colors.cyan.A800 }}
        />
      )}
      <View style={wrapperStyle}>
        <TextInput
          testID="textField.inputField"
          style={[isMultiLineTextStyle, textStyle]}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          maxLength={maxLength}
          placeholder={placeHolder}
          autoCapitalize={upperCase ? 'characters' : 'none'}
          value={value}
          editable={editable}
          multiline={multiline}
          numberOfLines={Platform.OS === 'android' ? numOfLines : undefined}
          onFocus={handleFocus}
          secureTextEntry={secureTextEntry}
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
    paddingHorizontal: 12,
    backgroundColor: colors.grey.A100,
    fontSize: fontSizes.medium16,
    fontFamily: 'OpenSans-Regular',
  },
});

export default TextField;
