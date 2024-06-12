import React, { FC, ReactElement, ReactNode } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { colors } from 'styles';
import { genericFn } from 'types/components';

const { grey } = colors;

const RowButton: FC<{
  onPress: (a: string) => void;
  children: ReactNode;
  pressed: string;
  id: number;
}> = ({ onPress, children, id }): ReactElement => {
  const dynamicStyle = [
    styles.buttonRow,
    { backgroundColor: id % 2 === 0 ? grey.A100 : grey.A150 },
  ];
  return (
    <TouchableHighlight
      testID="component.Balances.RowButton"
      onPress={onPress as genericFn}
      style={dynamicStyle}
      underlayColor={colors.grey.A150}>
      {children}
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 46,
  },
});

export default RowButton;
