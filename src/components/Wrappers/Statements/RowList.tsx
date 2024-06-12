import React, { FC, ReactElement, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from 'styles';

const RowList: FC<{ id: string; children: ReactNode; isPressed: boolean }> = ({
  id,
  children,
  isPressed,
}): ReactElement => {
  const backColor = parseInt(id) % 2 === 0 ? colors.grey.A100 : colors.grey.A250;
  const altBackColor = isPressed ? colors.grey.c120 : backColor;
  return <View style={[styles.wrapper, { backgroundColor: altBackColor }]}>{children}</View>;
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
  },
});

export default RowList;
