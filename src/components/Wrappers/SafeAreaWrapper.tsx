import React, { FC, ReactElement, ReactNode } from 'react';
import { SafeAreaView, StyleProp } from 'react-native';

const SafeAreaWrapper: FC<{ children: ReactNode; customStyle?: StyleProp<object> }> = ({
  children,
  customStyle,
}): ReactElement => {
  return <SafeAreaView style={[{ flex: 1 }, customStyle]}>{children}</SafeAreaView>;
};

export default SafeAreaWrapper;
