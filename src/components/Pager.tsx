import React, { FC, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from 'styles';

const Pager: FC<{ selected: number; amount: number }> = ({ selected, amount }): ReactElement => {
  const { bar, container } = styles;
  const customBarStyle = [bar, { backgroundColor: colors.cyan.A750 }];

  return (
    <View style={container}>
      {amount === 3 && (
        <>
          <View style={selected === 1 ? customBarStyle : bar} />
          <View style={selected === 2 ? customBarStyle : bar} />
          <View style={selected === 3 ? customBarStyle : bar} />
        </>
      )}
      {amount === 4 && (
        <>
          <View style={selected === 1 ? [customBarStyle, { width: 60 }] : [bar, { width: 60 }]} />
          <View style={selected === 2 ? [customBarStyle, { width: 60 }] : [bar, { width: 60 }]} />
          <View style={selected === 3 ? [customBarStyle, { width: 60 }] : [bar, { width: 60 }]} />
          <View style={selected === 4 ? [customBarStyle, { width: 60 }] : [bar, { width: 60 }]} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  bar: {
    width: 70,
    height: 4,
    backgroundColor: colors.grey.c250,
    marginHorizontal: 4,
    borderRadius: 2,
  },
});

export default Pager;
