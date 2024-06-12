import React, { FC, ReactElement } from 'react';
import { View } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { FontistoI } from 'interfaces/components';

const FontistoIcon: FC<FontistoI> = ({ icon, color, size, testId }): ReactElement => {
  return (
    <View testID={testId}>
      <Fontisto name={icon} size={size} color={color} />
    </View>
  );
};

export default FontistoIcon;
