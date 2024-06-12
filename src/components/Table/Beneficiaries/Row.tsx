import React, { FC, ReactElement, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from 'styles';

const Row: FC<{ children: ReactNode; testId: string }> = ({ children, testId }): ReactElement => {
  return <View testID={testId} style={styles.wrapper}>{children}</View>;
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grey.A100,
  },
});

export default Row;
