import React, { FC, ReactElement, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

const SubOptionWrapper: FC<{ children: ReactNode }> = ({ children }): ReactElement => (
  <View testID="component.Wrappers.SubOptionWrapper" style={styles.container}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 30,
  },
});

export default SubOptionWrapper;
