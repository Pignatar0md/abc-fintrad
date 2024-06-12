import React, { FC, ReactElement } from 'react';
import { StyleProp, StyleSheet, Text } from 'react-native';
import { fontSizes } from 'styles';

const DateInfo: FC<{ value: string; customStyle?: StyleProp<object> }> = ({
  value,
  customStyle,
}): ReactElement => {
  return <Text style={[styles.container, customStyle]}>{value}</Text>;
};

const styles = StyleSheet.create({
  container: {
    fontSize: fontSizes.small12,
    fontFamily: 'OpenSans-SemiBold',
    marginRight: 6,
  },
});

export default DateInfo;
