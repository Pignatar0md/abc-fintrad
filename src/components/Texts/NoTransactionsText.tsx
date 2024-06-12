import React, { FC, ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fontSizes } from 'styles';

const NoTransactionsText: FC<{ customTextStyle?: object; message: string }> = ({
  message,
  customTextStyle,
}): ReactElement => {
  const customMessageStyle = [styles.text, customTextStyle];
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={customMessageStyle}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    alignItems: 'center',
    marginTop: '20%',
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.medium16,
  },
});

export default NoTransactionsText;
