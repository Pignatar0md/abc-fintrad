import React, { FC, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import QuickLinks from 'Routing/QuickLinks';
import { colors } from 'styles';

const WrappedQuickLinks: FC = (): ReactElement => (
  <View style={styles.wrapper}>
    <QuickLinks />
  </View>
);

const styles = StyleSheet.create({
  wrapper: { backgroundColor: colors.grey.A250, paddingBottom: 10 },
});

export default WrappedQuickLinks;
