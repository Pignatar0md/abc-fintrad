import React, { FC, ReactElement } from 'react';
import { StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DEFAULT_SCREEN_OPTIONS_BOTTOM_TABBAR } from 'utils/static';

import Orders from 'screens/Authenticated/Orders/Orders';

import { fontSizes } from 'styles';
// import { OrdersListScreenNavigationProp } from 'types/types';

// const OrdersBottomTabbar: FC<OrdersListScreenNavigationProp> = (): ReactElement => {
const OrdersBottomTabbar: FC = (): ReactElement => {
  const Tab = createBottomTabNavigator();
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          ...DEFAULT_SCREEN_OPTIONS_BOTTOM_TABBAR,
          tabBarIcon: ({ color }) => (
            <Text
              testID={`routing.ordersBottomTabbar.${route.name}`}
              style={[styles.iconStyle, { color }]}>
              {route.name}
            </Text>
          ),
        })}>
        <Tab.Screen
          options={{ tabBarStyle: { display: 'none' } }}
          name="OrderList"
          component={Orders}
        />
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

export default OrdersBottomTabbar;
