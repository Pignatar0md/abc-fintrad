import React, { FC, ReactElement, ReactNode } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { colors } from 'styles';
import { genericFn } from 'types/components';

const RowButton: FC<{
  onPress: (a: string) => void;
  children: ReactNode;
  pressed: string;
  id: string;
}> = ({ onPress, children, pressed, id }): ReactElement => {
  return (
    <TouchableHighlight
      testID="component.Balances.RowButton"
      onPress={onPress as genericFn}
      style={[styles.buttonRow, { height: pressed === id ? 150 : 50 }]}
      underlayColor={colors.grey.A150}>
      {children}
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grey.A100,
    justifyContent: 'flex-start',
    height: 50,
  },
});

export default RowButton;
