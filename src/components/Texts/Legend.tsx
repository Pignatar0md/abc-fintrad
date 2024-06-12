import React, { FC, ReactElement } from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, fontSizes } from 'styles';
import { childrenToRender } from 'types/components';

const Legend: FC<childrenToRender> = ({ children, testId }): ReactElement => {
  return (
    <Text testID={testId} style={styles.legend}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  legend: {
    letterSpacing: 0.5,
    fontSize: fontSizes.small12,
    fontFamily: 'OpenSans-Regular',
    color: colors.grey.c700,
  },
});

export default Legend;
