import React, { FC, ReactElement, ReactNode } from 'react';
import { GestureResponderEvent, TouchableHighlight } from 'react-native';
import { colors } from 'styles';

const RowButton: FC<{
  children: ReactNode;
  onPress: (a: GestureResponderEvent) => void;
  pressed?: string;
}> = ({ children, onPress }): ReactElement => {
  return (
    <TouchableHighlight
      testID="component.Statements.RowButton"
      onPress={onPress}
      underlayColor={colors.grey.c150}>
      {children}
    </TouchableHighlight>
  );
};

export default RowButton;
