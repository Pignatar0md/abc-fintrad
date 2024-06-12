import React, { FC, ReactElement, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from 'styles';

const { grey } = colors;

const Row: FC<{ children: ReactNode; id: number; testId: string }> = ({
  children,
  id,
  testId,
}): ReactElement => {
  const customStyle = { backgroundColor: id % 2 === 0 ? grey.A150 : grey.A100 };
  return (
    <View testID={testId} style={[styles.wrapper, customStyle]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
});

export default Row;
