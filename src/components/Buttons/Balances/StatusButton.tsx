import React, { FC, ReactElement } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, fontSizes } from 'styles';

const StatusButton: FC<{ onPress: () => void; text: string; color: string }> = ({
  onPress,
  text,
  color,
}): ReactElement => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: color }]}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { justifyContent: 'center', borderRadius: 5, marginHorizontal: 15 },
  text: {
    color: colors.grey.A100,
    marginHorizontal: 10,
    fontFamily: 'OpenSans-Light',
    fontSize: fontSizes.small12,
  },
});

export default StatusButton;
