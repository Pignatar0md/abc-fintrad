import React, { FC, ReactElement } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontistoIcon from 'components/Icons/Fontisto';
import { colors, fontSizes } from 'styles';
import { CheckBoxI } from 'interfaces/components';

const { cyan, grey } = colors;

const Checkbox: FC<CheckBoxI> = ({
  text,
  value,
  onPress,
  flexDirection,
  customTextStyle,
  boxSize,
}): ReactElement => {
  const { wrapper, textStyle } = styles;
  const { A750 } = cyan;
  const customWrapper = flexDirection
    ? [wrapper, { flexDirection, marginLeft: flexDirection && flexDirection !== 'row' ? 4 : 0 }]
    : wrapper;
  return (
    <View style={customWrapper}>
      <TouchableOpacity onPress={onPress}>
        <FontistoIcon
          icon={value ? 'checkbox-active' : 'checkbox-passive'}
          color={A750}
          size={boxSize ? boxSize : fontSizes.medium16}
          testId={'component.checkbox '}
        />
      </TouchableOpacity>
      {typeof text === 'string' ? <Text style={[textStyle, customTextStyle]}>{text}</Text> : text}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  textStyle: {
    margin: 4,
    fontSize: fontSizes.mediumSmall14,
    fontFamily: 'OpenSans-Regular',
    color: grey.c750,
  },
});

export default Checkbox;
