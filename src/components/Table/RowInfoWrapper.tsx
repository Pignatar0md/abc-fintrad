import React, { FC, ReactElement, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

const RowInfoWrapper: FC<{ children: ReactNode }> = ({ children }): ReactElement => {
  return (
    <View testID="component.Wrappers.RowInfoWrapper" style={styles.container}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RowInfoWrapper;
