import React, { FC, ReactElement } from 'react';
import { TouchableOpacity } from 'react-native';
import { IconButtonI } from 'interfaces/components';

const IconButton: FC<IconButtonI> = ({ icon, onPress, testId }): ReactElement => {
  return (
    <TouchableOpacity testID={testId} onPress={onPress}>
      {icon}
    </TouchableOpacity>
  );
};

export default IconButton;
