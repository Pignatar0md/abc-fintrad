import React, { FC, ReactElement } from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, fontSizes } from 'styles';
import { LabelFieldI } from '../interfaces/components';

const LabelField: FC<LabelFieldI> = ({ testId, text, customStyle, labelMode }): ReactElement => {
  const { textLabel } = styles;
  const textLabelWithMode =
    labelMode === 'dark' ? { ...textLabel, color: colors.grey.c700 } : textLabel;
  const textLabelCustomStyle = customStyle ? [textLabelWithMode, customStyle] : textLabelWithMode;

  return (
    <Text testID={testId} style={textLabelCustomStyle}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  textLabel: {
    marginBottom: 6,
    marginLeft: 6,
    fontSize: fontSizes.mediumSmall14,
    fontFamily: 'OpenSans-Regular',
    color: colors.grey.A100,
  },
});

export default LabelField;
