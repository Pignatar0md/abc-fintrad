import React, { FC, ReactElement } from 'react';
import { StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AddDebitCardInfoManually from 'screens/Authenticated/Cards/DebitCards/AddDebitCardInfoManually';
import ScanDebitCard from 'screens/Authenticated/Cards/DebitCards/ScanDebitCard';

import { SCREEN_OPTIONS_NO_QUICKLINKS_BOTTOM_TABBAR } from 'utils/static';
import { fontSizes } from 'styles';

const AddDebitCardBottomTabbar: FC = (): ReactElement => {
  const Tab = createBottomTabNavigator();
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          ...SCREEN_OPTIONS_NO_QUICKLINKS_BOTTOM_TABBAR,
          tabBarIcon: ({ color }) => (
            <Text
              testID={`routing.beneficiariesBottomTabbar.${route.name}`}
              style={[styles.iconStyle, { color }]}>
              {route.name}
            </Text>
          ),
        })}>
        <Tab.Screen name="Scan card" component={ScanDebitCard} />
        <Tab.Screen name="Fill manually" component={AddDebitCardInfoManually} />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    marginTop: 10,
    lineHeight: 19,
    letterSpacing: 0.6,
    fontSize: fontSizes.mediumSmall14,
    fontFamily: 'OpenSans-Regular',
  },
});

export default AddDebitCardBottomTabbar;
