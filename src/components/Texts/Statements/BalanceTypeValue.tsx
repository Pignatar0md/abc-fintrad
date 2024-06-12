import React, { FC, ReactElement } from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, fontSizes } from 'styles';

const BalanceTypeValue: FC<{ value: string }> = ({ value }): ReactElement => {
  return <Text style={styles.textValue}>{value}</Text>;
};

const styles = StyleSheet.create({
  textValue: {
    fontFamily: 'OpenSans-SemiBold',
    color: colors.cyan.A800,
    fontSize: fontSizes.small12,
  },
});

export default BalanceTypeValue;
