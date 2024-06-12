import React, { FC, ReactElement, ReactNode } from 'react';
import { FlexAlignType, StyleSheet, Text, View } from 'react-native';
import { fontSizes } from 'styles';

const BodyCell: FC<{
  children: ReactNode | string;
  size: 'large' | 'medium' | 'small';
  color: string;
  alignment: 'center' | 'right' | 'left';
}> = ({ children, size, color, alignment }): ReactElement => {
  const { textStyle, container } = styles;
  const sizes = { large: 3, medium: 2, small: 1 };
  const customSize = sizes[size];
  const alignments = { center: 'center', left: 'flex-start', right: 'flex-end' };
  const customAlignment = alignments[alignment] as FlexAlignType;

  const content =
    typeof children === 'string' ? (
      <Text testID="component.BodyCellString" style={[textStyle, { color }]}>
        {children}
      </Text>
    ) : (
      children
    );
  const customStyle = [container, { flex: customSize, alignItems: customAlignment }];
  return (
    <View style={customStyle} testID="component.BodyCellView">
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: fontSizes.mediumSmall14,
    fontFamily: 'OpenSans-Light',
  },
});

export default BodyCell;
