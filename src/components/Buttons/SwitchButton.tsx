import React, { FC, ReactElement } from 'react';
import { Platform, Switch } from 'react-native';
import { colors } from 'styles';

const SwitchButton: FC<{ onValueChange: () => void; value: boolean }> = ({
  onValueChange,
  value,
}): ReactElement => {
  const { grey, cyan } = colors;
  const platformStyle =
    Platform.OS === 'ios' ? { transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] } : null;
  return (
    <Switch
      testID="switchButton"
      trackColor={{ false: grey.c500, true: grey.c300 }}
      thumbColor={value ? cyan.A800 : grey.c300}
      ios_backgroundColor={grey.c500}
      style={platformStyle}
      onValueChange={onValueChange}
      value={value}
    />
  );
};

export default SwitchButton;
