import React, { FC, ReactElement } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fontSizes } from 'styles';
import EvilIcon from '../../Icons/EvilIcon';
import { genericFn } from 'types/components';

const BackHeader: FC<{ title: string; extraIcon?: ReactElement }> = ({
  title,
  extraIcon,
}): ReactElement => {
  const navigation: { openDrawer: genericFn; closeDrawer: genericFn; goBack: genericFn } =
    useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { marginTop: insets.top }]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <EvilIcon icon="chevron-left" color={colors.grey.A100} size={40} testId="drawerMenu" />
      </TouchableOpacity>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{title}</Text>
        {extraIcon}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    backgroundColor: colors.blue.c999,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleWrapper: {
    width: '86%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    marginRight: 5,
    color: colors.grey.A100,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: fontSizes.medium16,
  },
});

export default BackHeader;
