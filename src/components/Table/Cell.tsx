import React, { FC, ReactElement } from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, fontSizes } from 'styles';

const Cell: FC<{ info: string; color?: string }> = ({ info, color }): ReactElement => {
  return (
    <Text numberOfLines={1} testID="component.Balances.Cell" style={[styles.textInfo, { color }]}>
      {info}
    </Text>
  );
};

const styles = StyleSheet.create({
  textInfo: {
    color: colors.blue.c999,
    fontSize: fontSizes.mediumLarge18,
    fontFamily: 'OpenSans-Regular',
  },
});

export default Cell;
