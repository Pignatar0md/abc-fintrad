import React, { FC, ReactElement } from 'react';
import { View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontAwesomeI } from 'interfaces/components';

const FontAwesomeIcon: FC<FontAwesomeI> = ({ icon, color, size, testId }): ReactElement => {
  return (
    <View testID={testId}>
      <FontAwesome name={icon} size={size} color={color} />
    </View>
  );
};

export default FontAwesomeIcon;
