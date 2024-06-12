import React, { FC, ReactElement } from 'react';
import { View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AntDesignI } from 'interfaces/components';

const AntDesigns: FC<AntDesignI> = ({ icon, color, size, testId }): ReactElement => {
  return (
    <View testID={testId}>
      <AntDesign name={icon} size={size} color={color} />
    </View>
  );
};

export default AntDesigns;
