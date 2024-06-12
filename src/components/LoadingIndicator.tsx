import React, { FC, ReactElement } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from 'styles';

const LoadingIndicator: FC<{
  size: 'small' | 'large';
  testId: string;
  background?: 'white' | undefined;
}> = ({ size, testId, background }): ReactElement => {
  const { container } = styles;
  const customContainer = background
    ? [container, { backgroundColor: colors.grey.A100 }]
    : container;
  return (
    <View style={customContainer} testID={testId}>
      <ActivityIndicator size={size} color={colors.cyan.A800} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: colors.blue.c999,
  },
});

export default LoadingIndicator;
