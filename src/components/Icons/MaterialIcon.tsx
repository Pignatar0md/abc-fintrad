import React, { FC, ReactElement } from 'react';
import { View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { MaterialIconI } from 'interfaces/components';

const MaterialIcon: FC<MaterialIconI> = ({ icon, color, size, testId }): ReactElement => {
  return (
    <View testID={testId}>
      <MaterialIcons name={icon} size={size} color={color} />
    </View>
  );
};

export default MaterialIcon;
