import React, { FC, ReactElement } from 'react';
import { View } from 'react-native';
import { IPinWrapper } from 'interfaces/components';
import { colors } from 'styles';

const PinWrapper: FC<IPinWrapper> = ({ children, background, testId }): ReactElement => {
  const backgroundColorWrapper = background === 'light' ? colors.grey.A100 : colors.blue.c999;
  return (
    <View testID={testId} style={{ flex: 1, backgroundColor: backgroundColorWrapper }}>
      {children}
    </View>
  );
};

export default PinWrapper;
