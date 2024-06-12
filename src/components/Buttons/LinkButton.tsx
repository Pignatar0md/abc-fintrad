import React, { FC, ReactElement } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fontSizes } from 'styles';
import { ButtonI } from '../../interfaces/components';

const LinkButton: FC<ButtonI> = ({ testId, text, onPress }): ReactElement => (
  <TouchableOpacity testID={testId} onPress={onPress} style={styles.button}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
  buttonText: {
    color: colors.cyan.A800,
    fontSize: fontSizes.mediumSmall14,
    fontFamily: 'OpenSans-Light',
    textDecorationColor: colors.cyan.A800,
    textDecorationLine: 'underline',
  },
});

export default LinkButton;
