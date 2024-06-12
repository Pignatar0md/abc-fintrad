import React, { FC, ReactElement, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  DrawerNavigationOptions,
  useDrawerStatus,
} from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';

import RatesBottomTabbar from './BottomTabbars/RatesBottomTabbar';
import StatementsTopTabbar from './TopTabbars/StatementsTopTabbar';
import StatementsTopTabbarForMain from './TopTabbars/StatementsTopTabbarForMain';
import BalancesBottomTabbar from './BottomTabbars/BalancesBottomTabbar';
import Trades from 'screens/Authenticated/Trades/Trades';
import BeneficiariesBottomTabbar from './BottomTabbars/BeneficiariesBottomTabbar';
import PaymentsForMain from 'screens/Authenticated/Payment/PaymentsForMain';

import { ACCOUNT_OPTIONS, CARDS_OPTIONS, DEFAULT_HEADER_CONFIG } from 'utils/static';
import { SidebarNavigationProp } from 'types/types';
import { colors, fontSizes } from 'styles';
import { renderIcon, renderSidebarSubOptions } from './helpers';
import { deletePlaneData, getPlaneStringData } from 'utils/localStorage';
import { HomePageOption, LoginAuthType } from 'types/screens';
import FontAwesomeFive from 'components/Icons/FontAwesomeFive';
import IconButton from 'components/Buttons/IconButton';
import OrdersBottomTabbar from './BottomTabbars/OrdersBottomTabbar';
import { hasConfiguredPinCode } from 'utils/pin';
import { useAuthType } from 'hooks/useAuthType';
import { secureRemove } from 'utils/localStorage';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import AntDesigns from 'components/Icons/AntDesigns';

const SCREENS = {
  Rates: RatesBottomTabbar,
  Payments: PaymentsForMain,
  StatementsTopTabbar: StatementsTopTabbar,
  StatementsTopTabbarForMain: StatementsTopTabbarForMain,
  Balances: BalancesBottomTabbar,
  Trades: Trades,
  Orders: OrdersBottomTabbar,
  BeneficiaryList: BeneficiariesBottomTabbar,
};

const Sidebar: FC<SidebarNavigationProp> = ({ navigation }): ReactElement => {
  const { t } = useTranslation();
  const Drawer = createDrawerNavigator();
  const { getAuthType } = useAuthType();
  const [showCardOptions, setShowCardOptions] = useState(false);
  const [showAccountOptions, setShowAccountOptions] = useState(false);
  const [touched, setTouched] = useState<string>('');
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [authType, setAuthType] = useState<LoginAuthType>('password');
  const [subOptionSelected, setSubOptionSelected] = useState('');
  const [homePage, setHomePage] = useState<HomePageOption>('Rates' as HomePageOption);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    const getStoredPage = async () => {
      const localHomePage = await getPlaneStringData('homePage_screen');
      localHomePage && setHomePage(localHomePage as HomePageOption);
    };
    getStoredPage();
  });
  useEffect(() => {
    getBiometricsActive();
  }, []);
  const getBiometricsActive = async () => {
    const res = await getAuthType();
    setAuthType(res as LoginAuthType);
  };

  const logOut = async () => {
    await secureRemove('authToken');
    await deletePlaneData('UserDetails');
    const isPin = authType === 'pinNumber' ? 'RequestPin' : 'Login';
    const whereToNavigate = authType === 'biometrics' ? 'Login' : isPin;
    navigation.navigate(whereToNavigate);
  };

  const draweNavigatorScreenOptions = {
    headerTitleAlign: 'center',
    drawerActiveBackgroundColor: colors.blue.c999,
    drawerLabelStyle: styles.drawerLabelNavOption,
    drawerActiveTintColor: colors.grey.c150,
    drawerInactiveTintColor: colors.grey.c150,
    drawerStyle: styles.drawerNavOption,
    drawerContentStyle: { width: 210 },
    drawerItemStyle: { borderRadius: 0, paddingLeft: 10 },
  };

  const CustomDrawerContent = (
    props: DrawerContentComponentProps, //review the props type
  ) => {
    const isDrawerOpen = useDrawerStatus() === 'open';

    const toggleDrawer = () =>
      isDrawerOpen ? props.navigation.closeDrawer() : props.navigation.openDrawer();

    return (
      <>
        <View style={{ marginLeft: 30, marginTop: 24 }}>
          <ModalWindow
            testId="sendPayment.errorAtSendingThePayment"
            isVisible={showLogoutModal}
            icon={
              <AntDesigns
                testId="sendPayment.exclamationWarning"
                color={colors.amber.c800}
                size={46}
                icon="exclamationcircle"
              />
            }
            title={t('Logout')}
            text={t('sureLogOut')}
            buttonAcceptText={t('Yes')}
            buttonCancelText={t('No') as string}
            onButtonAcceptPress={() => logOut()}
            onButtonCancelPress={() => setShowLogoutModal(false)}
          />
          <IconButton
            icon={
              <FontAwesomeFive icon="bars" color={colors.grey.A100} size={20} testId="drawerMenu" />
            }
            onPress={toggleDrawer}
            testId={'sidebar.MenuButton'}
          />
        </View>
        <DrawerContentScrollView testID="routing.sideBar" {...props}>
          <DrawerItemList {...props} />
          <DrawerItem
            focused={touched === 'account'}
            activeBackgroundColor={
              touched === 'account' && showAccountOptions ? colors.cyan.A800 : undefined
            }
            label={t('accountMayusc') as string}
            labelStyle={
              touched === 'account'
                ? [styles.drawerItemLabel, { color: colors.blue.c999 }]
                : styles.drawerItemLabel
            }
            icon={() =>
              renderIcon({
                iconType: 'materialCommunity',
                testId: 'sidebar.AccountIcon',
                iconName: 'bank',
              })
            }
            style={[styles.drawerItem, { borderRadius: 0 }]}
            onPress={() => {
              showCardOptions && setShowCardOptions(!showCardOptions);
              setShowAccountOptions(!showAccountOptions);
              setTouched('account');
            }}
          />
          {showAccountOptions && (
            <View style={{ marginTop: 10 }}>
              {renderSidebarSubOptions(
                ACCOUNT_OPTIONS,
                navigation,
                setSubOptionSelected,
                subOptionSelected,
              )}
            </View>
          )}
          <DrawerItem
            label={'Payments'}
            labelStyle={styles.drawerItemLabel}
            icon={() =>
              renderIcon({
                iconType: 'materialIcon',
                iconName: 'payments',
                testId: 'sidebar.PaymentsIcon',
              })
            }
            style={styles.drawerItem}
            onPress={() => navigation.navigate('Payments')}
          />
          <DrawerItem
            focused={touched === 'cards'}
            activeBackgroundColor={
              touched === 'cards' && showCardOptions ? colors.cyan.A800 : undefined
            }
            label={t('Cards') as string}
            labelStyle={
              touched === 'cards'
                ? [styles.drawerItemLabel, { color: colors.blue.c999 }]
                : styles.drawerItemLabel
            }
            icon={() =>
              renderIcon({
                iconType: 'materialCommunity',
                testId: 'sidebar.PaymentsIcon',
                iconName: 'credit-card-outline',
              })
            }
            style={[styles.drawerItem, { borderRadius: 0 }]}
            onPress={() => {
              showAccountOptions && setShowAccountOptions(!showAccountOptions);
              setShowCardOptions(!showCardOptions);
              setTouched('cards');
            }}
          />
          {showCardOptions && (
            <View style={{ marginTop: 10 }}>
              {renderSidebarSubOptions(
                CARDS_OPTIONS,
                navigation,
                setSubOptionSelected,
                subOptionSelected,
              )}
            </View>
          )}
          <DrawerItem
            label={'Settings'}
            labelStyle={styles.drawerItemLabel}
            icon={() =>
              renderIcon({
                iconType: 'antDesign',
                iconName: 'setting',
                testId: 'sidebar.settingsIcon',
              })
            }
            style={styles.drawerItem}
            onPress={() => navigation.navigate('Settings')}
          />
          <DrawerItem
            label={t('ContactUs') as string}
            labelStyle={styles.drawerItemLabel}
            icon={() =>
              renderIcon({
                iconType: 'fontAwesome5',
                iconName: 'paper-plane',
                testId: 'sidebar.contactUsIcon',
              })
            }
            style={styles.drawerItem}
            onPress={() => navigation.navigate('ContactUsTopTabbar')}
          />
          <DrawerItem
            label={t('Logout') as string}
            labelStyle={[styles.drawerItemLabel, { color: colors.grey.A100 }]}
            icon={() =>
              renderIcon({
                iconType: 'materialCommunity',
                iconName: 'logout',
                testId: 'sidebar.AccountIcon',
              })
            }
            style={styles.drawerLogoutItem}
            onPress={() => setShowLogoutModal(true)}
          />
        </DrawerContentScrollView>
      </>
    );
  };

  const getScreenName = useMemo(() => {
    const ratesTitleOrDefault = homePage !== 'BeneficiaryList' ? homePage : 'Rates';
    const screenName = homePage === 'BeneficiaryList' ? 'Beneficiaries' : ratesTitleOrDefault;
    return screenName;
  }, [homePage]);

  const getScreenComponent = useMemo(() => {
    return homePage ? SCREENS[homePage] : RatesBottomTabbar;
  }, [homePage]);

  return (
    <Drawer.Navigator
      detachInactiveScreens={true}
      screenOptions={draweNavigatorScreenOptions as DrawerNavigationOptions}
      initialRouteName={getScreenName}
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name={getScreenName}
        component={getScreenComponent}
        options={
          {
            ...DEFAULT_HEADER_CONFIG,
            drawerLabel: t('HomePage') as string,
            drawerIcon: () =>
              renderIcon({
                iconType: 'fontAwesome5',
                iconName: 'home',
                testId: 'sidebar.HomeIcon',
              }),
          } as DrawerNavigationOptions
        }
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerItemLabel: {
    color: colors.grey.c150,
    fontSize: fontSizes.mediumSmall14,
    fontFamily: 'OpenSans-Regular',
  },
  drawerItem: { marginHorizontal: 20 },
  drawerLogoutItem: {
    backgroundColor: colors.cyan.A800,
    borderRadius: 0,
    paddingHorizontal: 16,
    marginHorizontal: 25,
  },
  drawerLabelNavOption: {
    fontSize: fontSizes.mediumSmall14,
    fontFamily: 'OpenSans-Regular',
  },
  drawerNavOption: {
    backgroundColor: colors.blue.c999,
    width: 240,
    paddingTop: 40,
  },
});

export default Sidebar;
