import React, { FC, ReactElement } from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, fontSizes } from 'styles';

const TitleSection: FC<{ title: string }> = ({ title }): ReactElement => {
  return (
    <Text testID="component.TitleSection" style={styles.titleInfo}>
      {title}
    </Text>
  );
};

const styles = StyleSheet.create({
  titleInfo: {
    marginBottom: 12,
    letterSpacing: 0.6,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: fontSizes.mediumLarge18,
    color: colors.grey.c750,
  },
});

export default TitleSection;
