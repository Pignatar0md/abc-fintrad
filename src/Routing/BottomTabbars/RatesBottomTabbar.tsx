import React, { FC, ReactElement } from 'react';
import { Appearance, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import EvilIcon from 'components/Icons/EvilIcon';
import { fontSizes } from 'styles';
import { DEFAULT_SCREEN_OPTIONS_BOTTOM_TABBAR } from 'utils/static';
import { RatesNavigationProp } from 'types/types';

import Major from 'screens/Authenticated/Rates/Major';
import Fav from 'screens/Authenticated/Rates/Fav';
import Minor from 'screens/Authenticated/Rates/Minor';
import Exotic from 'screens/Authenticated/Rates/Exotic';
import All from 'screens/Authenticated/Rates/All';

const RatesBottomTabbar: FC<RatesNavigationProp> = (): ReactElement => {
  const darkTheme = Appearance.getColorScheme();
  const Tab = createBottomTabNavigator();
  const routeNameTextStyle = {
    marginTop: 10,
    lineHeight: 19,
    letterSpacing: 0.4,
    fontSize: fontSizes.mediumSmall14,
    fontFamily: 'OpenSans-SemiBold',
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          ...DEFAULT_SCREEN_OPTIONS_BOTTOM_TABBAR,
          tabBarIcon: ({ color }) => {
            if (route.name === 'Search') {
              return (
                <View style={{ marginTop: 5 }}>
                  <EvilIcon icon={'search'} color={color} size={26} testId={'iconSearch'} />
                </View>
              );
            }
            return <Text style={[routeNameTextStyle, { color }]}>{route.name}</Text>;
          },
        })}
        initialRouteName="Major">
        <Tab.Screen name="Fav" component={Fav} />
        <Tab.Screen name="Major" component={Major} />
        <Tab.Screen name="Minor" component={Minor} />
        <Tab.Screen name="Exotic" component={Exotic} />
        <Tab.Screen name="Search" component={All} />
      </Tab.Navigator>
    </>
  );
};

export default RatesBottomTabbar;
