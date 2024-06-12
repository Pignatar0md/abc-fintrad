import React, { FC, ReactElement } from 'react';
import { StyleProp, StyleSheet, Text } from 'react-native';
import { colors, fontSizes } from 'styles';

const TextInfo: FC<{ text: string | number; customStyle?: StyleProp<object> }> = ({
  text,
  customStyle,
}): ReactElement => {
  return (
    <Text testID="component.AccountDetails.TextInfo" style={[styles.textInfo, customStyle]}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  textInfo: {
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.mediumLarge18,
    color: colors.grey.c680,
  },
});
export default TextInfo;
