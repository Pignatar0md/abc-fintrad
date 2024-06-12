import React, { FC, ReactElement } from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, fontSizes } from 'styles';

const HeaderCell: FC<{ flex: number; align: 'center' | 'right' | 'left'; text: string }> = ({
  flex,
  align,
  text,
}): ReactElement => {
  return (
    <Text testID="component.HeaderCell" style={[styles.text, { textAlign: align, flex }]}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.medium16,
    color: colors.grey.c650,
  },
});

export default HeaderCell;
