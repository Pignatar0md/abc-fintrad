import React, { FC, ReactElement } from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, fontSizes } from 'styles';
import { childrenToRender } from 'types/components';

const ActiveOption: FC<childrenToRender> = ({ children, color }): ReactElement => {
  return (
    <Text
      testID="component.activeOption"
      style={color ? [styles.activeOptionTitle, { color }] : styles.activeOptionTitle}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  activeOptionTitle: {
    color: colors.cyan.A800,
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.mediumSmall14,
  },
});

export default ActiveOption;
