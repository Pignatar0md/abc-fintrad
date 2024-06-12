import React, { FC, ReactElement } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { buttonSizes, colors, fontSizes } from 'styles';
import { ButtonI } from '../../interfaces/components';

const { cyan, blue, grey } = colors;
const { medium, big, small } = buttonSizes;

const Button: FC<ButtonI> = (props): ReactElement => {
  const { textButton, button } = styles;
  const { onPress, text, disabled, filled, testId, size } = props;
  const currentButtonStyle = disabled
    ? button
    : { ...button, backgroundColor: cyan.A800, borderColor: cyan.A800 };
  const currentTextButton = !filled ? { ...textButton, color: cyan.A800 } : textButton;
  const composedButtonStyle = !filled
    ? { ...button, backgroundColor: blue.c999, borderColor: cyan.A800 }
    : currentButtonStyle;
  const isMediumOrSmallButtonSize =
    size === 'medium' ? { ...composedButtonStyle, width: medium } : composedButtonStyle;
  const buttonStyle =
    size === 'big' ? { ...composedButtonStyle, width: big } : isMediumOrSmallButtonSize;

  return (
    <TouchableOpacity testID={testId} onPress={onPress} style={buttonStyle} disabled={disabled}>
      <Text style={currentTextButton}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: small,
    borderWidth: 1,
    borderColor: cyan.c950,
    backgroundColor: cyan.c950,
  },
  textButton: {
    textAlignVertical: 'center',
    textAlign: 'center',
    color: grey.A100,
    padding: 10,
    fontFamily: 'OpenSans-Bold',
    fontSize: fontSizes.mediumSmall14,
  },
});

export default Button;
