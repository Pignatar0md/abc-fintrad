import React, { FC, ReactElement, ReactNode } from 'react';
import { View } from 'react-native';

const DateAndOpTypeWrapper: FC<{ children: ReactNode }> = ({ children }): ReactElement => {
  return <View style={{ flexDirection: 'row', alignItems: 'center' }}>{children}</View>;
};

export default DateAndOpTypeWrapper;
