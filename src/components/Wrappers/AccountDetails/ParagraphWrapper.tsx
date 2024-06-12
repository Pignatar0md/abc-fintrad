import React, { FC, ReactElement, ReactNode } from 'react';
import { StyleProp, StyleSheet, View } from 'react-native';

const ParagraphWrapper: FC<{ children: ReactNode; customStyle: StyleProp<object> }> = ({
  children,
  customStyle,
}): ReactElement => {
  return (
    <View
      testID="component.AccountDetails.ParagraphWrapper"
      style={[styles.paragraphWrapper, customStyle]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  paragraphWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginLeft: 10,
    marginVertical: 15,
  },
});

export default ParagraphWrapper;
