import React, { FC, ReactElement } from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, fontSizes } from 'styles';

const ContentSection: FC<{ text: string }> = ({ text }): ReactElement => {
  return (
    <Text testID="component.ContentSection" style={styles.paragraph}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    letterSpacing: 0.75,
    marginBottom: 5,
    fontSize: fontSizes.mediumSmall14,
    fontFamily: 'OpenSans-Regular',
    color: colors.grey.c750,
  },
});

export default ContentSection;
