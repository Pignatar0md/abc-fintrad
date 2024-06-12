import React, { FC, ReactElement, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

const BalanceWrapper: FC<{ children: ReactNode; verticalmargin?: number }> = ({
  children,
  verticalmargin,
}): ReactElement => {
  return <View style={[styles.wrapper, { marginVertical: verticalmargin }]}>{children}</View>;
};

const styles = StyleSheet.create({
  wrapper: { flexDirection: 'row', justifyContent: 'space-between' },
});

export default BalanceWrapper;
