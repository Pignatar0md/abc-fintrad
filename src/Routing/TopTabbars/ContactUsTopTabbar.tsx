import React, { FC, ReactElement, useLayoutEffect, useState } from 'react';
import { Appearance, useWindowDimensions, Text, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTranslation } from 'react-i18next';

import ContactInfo from 'screens/Contact/ContactInfo';
import ContactUs from 'screens/Contact/Mail';
import FAQs from 'screens/Contact/FAQs';

import { colors, fontSizes } from 'styles';
import { DEFAULT_HEADER_CONFIG } from 'utils/static';
import { ContactUsTopTabbarNavigationProp } from 'types/types';

const { grey, cyan } = colors;

const ContactUsTopTabbar: FC<ContactUsTopTabbarNavigationProp> = ({ navigation }): ReactElement => {
  const darkTheme = Appearance.getColorScheme();
  const layout = useWindowDimensions();
  const { t } = useTranslation();
  const [index, setIndex] = useState<number>(0);
  const [routes] = useState([
    { key: 'first', title: 'Mail' },
    { key: 'second', title: 'FAQs' },
    { key: 'third', title: 'Contact' },
  ]);

  const ContactUsComponent = () => <ContactUs />;
  const FAQsComponent = () => <FAQs />;
  const ContactInfoComponent = () => <ContactInfo />;

  const renderScene = SceneMap({
    first: ContactUsComponent,
    second: FAQsComponent,
    third: ContactInfoComponent,
  });

  useLayoutEffect(() => {
    const screenTitle = t('ContactUs');
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      title: screenTitle,
    });
  }, []);

  const customTabbar = (props: any) => (
    <TabBar
      testID="routing.ContactUsTabbar"
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
    <>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={customTabbar}
        initialLayout={{ width: layout.width }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  tabbarStyle: { backgroundColor: grey.A100 },
  textTabbar: {
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.mediumSmall14,
  },
});

export default ContactUsTopTabbar;
