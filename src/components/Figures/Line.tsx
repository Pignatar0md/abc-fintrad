import React, { FC, ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from 'styles';

const Line: FC = (): ReactElement => {
  return <View testID="lineComponent" style={styles.line} />;
};

const styles = StyleSheet.create({
  line: {
    borderBottomColor: colors.grey.c400,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default Line;
