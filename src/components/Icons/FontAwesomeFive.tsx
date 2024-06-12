import React, { FC, ReactElement } from 'react';
import { View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { FontAwesome5I } from 'interfaces/components';

const FontAwesomeFive: FC<FontAwesome5I> = ({ icon, color, size, testId }): ReactElement => {
  return (
    <View testID={testId}>
      <FontAwesome name={icon} size={size} color={color} />
    </View>
  );
};

export default FontAwesomeFive;
