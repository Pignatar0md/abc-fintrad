import React, { FC, ReactElement, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { useTranslation } from 'react-i18next';

import AllStatements from 'screens/Authenticated/Statements/AllStatements';
import VfxCardStatements from 'screens/Authenticated/Statements/VfxCardStatements';

import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import WrappedQuickLinks from 'components/Prebuilts/WrappedQuickLinks';
import DrawerHeader from 'components/Prebuilts/Headers/DrawerHeader';

import { colors, fontSizes } from 'styles';
import { StatementsTopTabbarNavigationProp } from 'types/types';
import { DEFAULT_HEADER_CONFIG } from 'utils/static';

const { grey, cyan } = colors;

const StatementsTopTabbar: FC<StatementsTopTabbarNavigationProp> = ({
  navigation,
  route,
}): ReactElement => {
  const { t } = useTranslation();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState<number>(0);
  const [routes] = useState([
    { key: 'first', title: 'All' },
    { key: 'second', title: 'VFX Card' },
  ]);
  const AllComponent = () => <AllStatements route={route} />;
  const VfxCardComponent = () => <VfxCardStatements />;

  useLayoutEffect(() => {
    const screenTitle = t('statementsCapital');
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      title: screenTitle,
      header: () => (
        <>
          <DrawerHeader title={t('statementsCapital')} />
          <WrappedQuickLinks />
        </>
      ),
    });
  }, []);

  const renderScene = SceneMap({
    first: AllComponent,
    second: VfxCardComponent,
  });

  const customTabbar = (props: any) => (
    <TabBar
      testID="routing.StatementsTabbar"
      {...props}
      renderLabel={({ route, focused }) => (
        <Text style={[styles.textTabbar, { color: focused ? cyan.c700 : grey.c750 }]}>
          {route.title}
        </Text>
      )}
      indicatorStyle={styles.tabbarStyle}
      style={styles.tabbarStyle}
    />
  );

  return (
    <SafeAreaWrapper>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={customTabbar}
        initialLayout={{ width: layout.width }}
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  tabbarStyle: { backgroundColor: grey.A100 },
  textTabbar: {
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.mediumSmall14,
  },
});

export default StatementsTopTabbar;
