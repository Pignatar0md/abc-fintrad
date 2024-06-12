import React, { FC, ReactElement } from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, fontSizes } from 'styles';

const CellAmountValue: FC<{ value: string; balance: string }> = ({
  value,
  balance,
}): ReactElement => {
  const customColor = parseInt(balance) >= 0 ? colors.blue.c800 : colors.red.A200;
  return (
    <Text style={[styles.value, { color: customColor }]}>
      {value.split(' ')[0]}
      <Text style={[styles.value, { color: customColor, fontSize: fontSizes.medium16 }]}>
        {' ' + value.split(' ')[1]}
      </Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  value: {
    fontSize: fontSizes.large20,
    marginTop: 4,
    fontFamily: 'OpenSans-Regular',
  },
});

export default CellAmountValue;
