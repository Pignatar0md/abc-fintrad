import React, { FC, ReactElement } from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, fontSizes } from 'styles';

const BalanceTypeTitle: FC<{ title: string }> = ({ title }): ReactElement => {
  return <Text style={styles.title}>{title}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontFamily: 'OpenSans-SemiBold',
    color: colors.cyan.A800,
    fontSize: fontSizes.small12,
  },
});

export default BalanceTypeTitle;
