import React, { FC, ReactElement } from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, fontSizes } from 'styles';

const TextLegend: FC<{ text: string }> = ({ text }): ReactElement => {
  return (
    <Text testID="component.AccountDetails.TextLegend" style={styles.textLegend}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  textLegend: {
    fontFamily: 'OpenSans-Light',
    fontSize: fontSizes.medium16,
    color: colors.grey.c600,
  },
});

export default TextLegend;
