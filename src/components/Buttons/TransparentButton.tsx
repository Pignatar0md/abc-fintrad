import React, { FC, ReactElement, ReactNode } from 'react';
import { TouchableOpacity, StyleSheet, StyleProp } from 'react-native';
import { colors } from 'styles';

const TransparentButton: FC<{
  children: ReactNode;
  testId: string;
  onPress: () => void;
  optionSelected?: boolean;
  customStyle?: StyleProp<object>;
}> = ({ children, testId, onPress, optionSelected, customStyle }): ReactElement => {
  const { topic } = styles;

  const pressedTopic = optionSelected ? [topic, { backgroundColor: colors.grey.c200 }] : topic;
  const customContainer = customStyle ? [pressedTopic, customStyle] : pressedTopic;

  return (
    <TouchableOpacity testID={testId} onPress={onPress} style={customContainer}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  topic: {
    padding: 14,
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default TransparentButton;
