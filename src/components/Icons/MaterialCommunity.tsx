import React, { FC, ReactElement } from 'react';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialCommunityIconI } from 'interfaces/components';

const MaterialCommunity: FC<MaterialCommunityIconI> = ({
  icon,
  color,
  size,
  testId,
}): ReactElement => {
  return (
    <View testID={testId}>
      <MaterialCommunityIcons name={icon} size={size} color={color} />
    </View>
  );
};

export default MaterialCommunity;
