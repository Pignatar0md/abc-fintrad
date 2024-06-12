import React, { FC, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { DEVICE_XSMALL } from 'utils/static';

const ResponsiveFormWrapper: FC<{
  children: ReactNode;
  testId: string;
  justifyContent?: 'center' | 'flex-start';
}> = ({ children, testId, justifyContent }) => {
  const { container } = styles;
  const responsiveFormWrapper = DEVICE_XSMALL ? { ...container, flex: 3 } : container;
  const customJustifyContent = justifyContent
    ? { ...responsiveFormWrapper, justifyContent }
    : responsiveFormWrapper;

  return (
    <View testID={testId} style={customJustifyContent}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: 'stretch',
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 30,
  },
});

export default ResponsiveFormWrapper;
