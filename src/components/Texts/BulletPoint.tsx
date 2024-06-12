import React, { FC, ReactElement } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors, fontSizes } from 'styles';

const BulletPoint: FC<{ text: string; title: string }> = ({ text, title }): ReactElement => {
  return (
    <View key={title} style={styles.bulletPointsContainer}>
      <Text testID="component.bulletPointText" style={styles.bulletPointText}>
        <Text style={styles.bulletPointTitle}>{title}</Text>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bulletPointsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bulletPointTitle: {
    fontSize: fontSizes.mediumSmall14,
    fontFamily: 'OpenSans-Bold',
    color: colors.grey.c750,
  },
  bulletPointText: {
    fontSize: fontSizes.mediumSmall14,
    fontFamily: 'OpenSans-Regular',
    color: colors.grey.c750,
  },
});

export default BulletPoint;
