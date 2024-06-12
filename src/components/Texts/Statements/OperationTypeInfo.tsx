import React, { FC, ReactElement } from 'react';
import { StyleProp, StyleSheet, Text } from 'react-native';
import { colors, fontSizes } from 'styles';

const OperationTypeInfo: FC<{ value: string; customStyle?: StyleProp<object> }> = ({
  value,
  customStyle,
}): ReactElement => {
  return <Text style={[styles.value, customStyle]}>{value}</Text>;
};

const styles = StyleSheet.create({
  value: {
    color: colors.grey.A100,
    fontSize: fontSizes.small12,
    backgroundColor: colors.cyan.c600,
    fontFamily: 'OpenSans-SemiBold',
    padding: 2,
    marginRight: 8,
  },
});

export default OperationTypeInfo;
