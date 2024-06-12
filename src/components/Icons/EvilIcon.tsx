import React, { FC, ReactElement } from 'react';
import { View } from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { EvilIconI } from 'interfaces/components';

const EvilIcon: FC<EvilIconI> = ({ icon, color, size, testId }): ReactElement => {
  return (
    <View testID={testId}>
      <EvilIcons name={icon} size={size} color={color} />
    </View>
  );
};

export default EvilIcon;
