import React, { FC, ReactElement } from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, fontSizes } from 'styles';
import { genericFn } from 'types/components';

const ActionButton: FC<{
  onPress: (a: string) => void;
  buttonText: string;
  customStyle: StyleProp<object>;
}> = ({ onPress, buttonText, customStyle }): ReactElement => {
  return (
    <TouchableOpacity
      testID="component.Balances.ActionButton"
      style={[styles.backRightBtn, customStyle]}
      onPress={onPress as genericFn}>
      <Text style={styles.backTextButton}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backTextButton: {
    color: colors.grey.A100,
    fontFamily: 'OpenSans-Bold',
    fontSize: fontSizes.extraSmall10,
    textAlign: 'center',
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    maxHeight: 72,
    width: 70,
  },
});

export default ActionButton;
