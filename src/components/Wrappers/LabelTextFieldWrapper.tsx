import React, { FC, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { childrenToRender } from 'types/components';

const LabelTextFieldWrapper: FC<childrenToRender> = ({ children }): ReactElement => {
  return (
    <View testID="wrapper" style={styles.wrapper}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 6,
  },
});

export default LabelTextFieldWrapper;
