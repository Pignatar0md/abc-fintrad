import React, { FC, ReactElement } from 'react';
import { StyleProp, StyleSheet, Text, View } from 'react-native';
import { fontSizes } from 'styles';

const CellExtraInfoWrapper: FC<{
  title: string;
  info: string;
  customWrapper?: StyleProp<object>;
  customTitle?: StyleProp<object>;
}> = ({ title, info, customWrapper, customTitle }): ReactElement => {
  return (
    <View
      testID="component.Wrappers.CellExtraInfoWrapper"
      style={[styles.cellExtraInfoWrapper, customWrapper]}>
      <Text style={[styles.titleExtraInfo, customTitle]}>{title}</Text>
      <Text style={styles.valuesExtraInfo}>{info}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cellExtraInfoWrapper: { flex: 1, justifyContent: 'center', marginLeft: 30 },
  valuesExtraInfo: { fontFamily: 'OpenSans-Light', fontSize: fontSizes.mediumSmall14 },
  titleExtraInfo: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: fontSizes.extraSmall10,
    letterSpacing: 0.5,
  },
});

export default CellExtraInfoWrapper;
