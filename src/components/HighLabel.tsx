import React, { FC, ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSizes } from 'styles';
import { HighLabelI } from '../interfaces/components';

const HighLabel: FC<HighLabelI> = ({ customStyle, textTitle, textValue, active }): ReactElement => {
  const { wrapper, text } = styles;
  const style = [wrapper, customStyle];
  return (
    <View style={active ? [style, { opacity: 1 }] : style}>
      <Text style={text}>{textTitle}:</Text>
      <Text style={text}>{textValue}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 70,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  text: {
    color: colors.grey.A100,
    fontSize: fontSizes.large20,
    fontFamily: 'OpenSans-Regular',
  },
});

export default HighLabel;
