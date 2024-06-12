import React, { FC, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from 'styles';

const SubOptionDecoration: FC = (): ReactElement => (
  <View testID="component.optionDecorator" style={styles.figure} />
);

const styles = StyleSheet.create({
  figure: { marginRight: 44, height: 34, width: 4, backgroundColor: colors.cyan.A800 },
});

export default SubOptionDecoration;
