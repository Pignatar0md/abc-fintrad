import React, { FC, ReactElement } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import EvilIcon from 'components/Icons/EvilIcon';
import { genericFn } from 'types/components';
import { colors } from 'styles';

const BackButton: FC<{ text: string; onPress: genericFn; color?: string }> = ({
  onPress,
  text,
  color,
}): ReactElement => {
  return (
    <View>
      <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <EvilIcon
          icon={'chevron-left'}
          color={color ?? colors.blueGrey.c500}
          size={40}
          testId={'webView.GoBack'}
        />
        <Text style={{ color: colors.blueGrey.c500, fontFamily: 'OpenSans-Regular' }}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BackButton;
