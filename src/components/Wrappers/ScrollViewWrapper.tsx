import React, { FC, ReactElement, ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { colors } from 'styles';

const ScrollViewWrapper: FC<{ children: ReactNode; testId: string; backgroundColor?: 'white' }> = ({
  children,
  testId,
  backgroundColor,
}): ReactElement => {
  const { blue, grey } = colors;
  const isWhite = backgroundColor === 'white';
  return (
    <ScrollView style={{ backgroundColor: isWhite ? grey.A100 : blue.c999 }} testID={testId}>
      {children}
    </ScrollView>
  );
};

export default ScrollViewWrapper;
