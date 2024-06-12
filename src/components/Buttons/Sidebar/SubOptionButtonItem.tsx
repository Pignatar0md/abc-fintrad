import React, { FC, ReactElement } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from 'styles';

const SubOptionButtonItem: FC<{
  text: string;
  onPress: () => void;
  testId?: string;
  bright: boolean;
}> = ({ text, onPress, testId, bright }): ReactElement => (
  <TouchableOpacity testID={testId} onPress={onPress}>
    <Text style={bright ? [styles.text, { color: colors.cyan.A200 }] : styles.text}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  text: { color: colors.grey.c150, fontFamily: 'OpenSans-Light' },
});

export default SubOptionButtonItem;
