import React, { FC, ReactElement } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fontSizes } from 'styles';
import { ImageButtonI } from 'interfaces/components';

const ImageButton: FC<ImageButtonI> = ({
  buttonText,
  icon,
  onPress,
  testId,
  textSize,
  textColor,
  disabled,
}): ReactElement => {
  const { basicTextStyle } = styles;
  const customTextStyle =
    textSize && textColor
      ? [basicTextStyle, { fontSize: textSize, color: textColor }]
      : basicTextStyle;
  return (
    <TouchableOpacity disabled={disabled} testID="home.quickLinkButton" onPress={onPress}>
      <View style={styles.container}>
        <View testID={testId} style={styles.imageTextWrapper}>
          {icon}
        </View>
        <Text style={customTextStyle}>{buttonText}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  imageTextWrapper: {
    backgroundColor: colors.grey.A100,
    width: 55,
    height: 55,
    borderRadius: 28,
    margin: 12,
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  basicTextStyle: {
    fontSize: fontSizes.extraSmall10,
    lineHeight: 14,
    color: colors.grey.c550,
    fontFamily: 'OpenSans-SemiBold',
  },
});

export default ImageButton;
