import React, { FC, ReactElement } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { buttonSizes, colors, fontSizes } from 'styles';
import { LightButtonI } from 'interfaces/components';

const { cyan, grey } = colors;
const { medium, big, small } = buttonSizes;

const LightButton: FC<LightButtonI> = (props): ReactElement => {
  const { textButton, button } = styles;
  const { onPress, text, disabled, testId, size, inverted } = props;
  const { c100, A800 } = cyan;
  const currentButtonStyle = disabled
    ? { ...button, backgroundColor: c100, borderColor: c100 }
    : button;
  const isMediumOrSmallButtonSize =
    size === 'medium' ? { ...currentButtonStyle, width: medium } : currentButtonStyle;
  const buttonStyle =
    size === 'big' ? { ...currentButtonStyle, width: big } : isMediumOrSmallButtonSize;

  const customButtonStyle = inverted ? [buttonStyle, { backgroundColor: grey.A100 }] : buttonStyle;
  const customTextButtonStyle = inverted ? [textButton, { color: A800 }] : textButton;
  return (
    <TouchableOpacity
      testID={testId}
      onPress={onPress}
      style={customButtonStyle}
      disabled={disabled}>
      <Text style={customTextButtonStyle}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: small,
    borderWidth: 1,
    borderColor: cyan.A800,
    backgroundColor: cyan.A800,
  },
  textButton: {
    textAlignVertical: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: grey.A100,
    padding: 10,
    fontFamily: 'OpenSans-Bold',
    fontSize: fontSizes.mediumSmall14,
  },
});

export default LightButton;
