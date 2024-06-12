import React, { FC, ReactElement } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SliderItemI } from 'interfaces/components';
import { colors, fontSizes } from 'styles';

const IntroSliderItem: FC<SliderItemI> = ({ title, text, image }): ReactElement => {
  const { slideSheet, textContentWrapper, titleStyle, textStyle } = styles;
  return (
    <View testID="sliderItem.generalWrapper" style={slideSheet}>
      {image}
      <View testID="sliderItem.textWrapper" style={textContentWrapper}>
        <Text style={titleStyle}>{title}</Text>
        <Text style={textStyle}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slideSheet: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '10%',
    backgroundColor: colors.blue.c999,
  },
  textContentWrapper: {
    marginTop: '15%',
    paddingHorizontal: '20%',
    alignItems: 'center',
  },
  titleStyle: {
    fontSize: fontSizes.huge30,
    fontFamily: 'OpenSans-SemiBold',
    color: colors.cyan.A800,
    marginBottom: 30,
  },
  textStyle: {
    color: colors.grey.A100,
    fontSize: fontSizes.medium16,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
  },
});

export default IntroSliderItem;
