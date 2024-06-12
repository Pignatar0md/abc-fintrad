import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import SplashScreen from 'react-native-splash-screen';

import Sidebar from 'Routing/Sidebar';
import { navigationRef, isReadyRef } from 'Routing/RootNavigation';
import RatesBottomTabbar from 'Routing/BottomTabbars/RatesBottomTabbar';
import BalancesBottomTabbar from 'Routing/BottomTabbars/BalancesBottomTabbar';
import BeneficiariesBottomTabbar from 'Routing/BottomTabbars/BeneficiariesBottomTabbar';
import ContactUsTopTabbar from 'Routing/TopTabbars/ContactUsTopTabbar';
import AddBeneficiaryTopTabbar from 'Routing/TopTabbars/AddBeneficiaryTopTabbar';

import { AuthContextProvider } from 'state/AuthContext';
import { ContactUsContextProvider } from 'state/ContactUsContext';
import { StatementsContextProvider } from 'state/StatementsContext';
import { BeneficiariesContextProvider } from 'state/BeneficiariesContext';
import { AccountBalanceContextProvider } from 'state/AccountBalanceContext';
import { UserDetailsContextProvider } from 'state/UserDetailsContext';
import { DeviceValidationContextProvider } from 'state/DeviceValidationContext';
import { PaymentContextProvider } from 'state/PaymentContext';
import { RatesContextProvider } from 'state/RatesContext';
import { CURRENT_LANGUAGE, DEFAULT_HEADER_CONFIG } from 'utils/static';

import Login from 'screens/Unauthenticated/Login';
import RequestPin from 'screens/Unauthenticated/RequestPin';
import Payments from 'screens/Authenticated/Payment/Payments';
import IntroSlider from 'screens/Authenticated/IntroSlider';
import WebViewScreen from 'screens/WebViewScreen';
import ValidateDevice from 'screens/Authenticated/ValidateDevice';
import SecuritySettings from 'screens/Authenticated/Settings/SecuritySettings';
import SetPin from 'screens/Authenticated/Settings/SetPin';
import Trade from 'screens/Authenticated/Trades/Trade';
import Trades from 'screens/Authenticated/Trades/Trades';
import DebitCards from 'screens/Authenticated/Cards/DebitCards';
import CurrencyCards from 'screens/Authenticated/Cards/CurrencyCards';
import AccountDetails from 'screens/Authenticated/Account/AccountDetails';
import AddOrder from 'screens/Authenticated/Orders/AddOrder';
import SendPayment from 'screens/Authenticated/Payment/SendPayment';
import TopUp from 'screens/Authenticated/TopUp';
import Communication from 'screens/Authenticated/Settings/Communication';
import HomePage from 'screens/Authenticated/Settings/HomePage';
import SendPaymentDetails from 'screens/Authenticated/Payment/SendPaymentDetails';
import RequestCurrencyCard from 'screens/Authenticated/Cards/CurrencyCards/RequestCurrencyCard';
import CurrencyCardDetails from 'screens/Authenticated/Cards/CurrencyCards/CurrencyCardDetails';
import EditCcyCardMobilePhone from 'screens/Authenticated/Cards/CurrencyCards/EditCcyCardMobilePhone';
import AccountValidation from 'screens/Authenticated/Settings/AccountValidation';
import Settings from 'screens/Authenticated/Settings/Settings';

import { RootStackParamList } from 'types/types';
import { en, es, pt } from './languages';
import BackHeader from 'components/Prebuilts/Headers/BackHeader';
import StatementsTopTabbar from 'Routing/TopTabbars/StatementsTopTabbar';
import StatementsTopTabbarForMain from 'Routing/TopTabbars/StatementsTopTabbarForMain';
import BeneficiaryDetailsTopTabbar from 'Routing/TopTabbars/BeneficiaryDetailsTopTabbar';
import AddDebitCardBottomTabbar from 'Routing/BottomTabbars/AddDebitCardBottomTabbar';
import DebitCardDetails from 'screens/Authenticated/Cards/DebitCards/DebitCardDetails';
import OrdersBottomTabbar from 'Routing/BottomTabbars/OrdersBottomTabbar';
import TradesBottomTabbar from 'Routing/BottomTabbars/TradesBottomTabbar';
import { OrderContextProvider } from 'state/OrdersContext';

const App = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  useEffect(() => {
    Platform.OS === 'android' && SplashScreen.hide();
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      lng: CURRENT_LANGUAGE,
      fallbackLng: [CURRENT_LANGUAGE, 'en-GB'],
      resources: {
        en: { translation: en },
        es: { translation: es },
        pt: { translation: pt },
      },
    })
    .then(() => 'great')
    .catch((error: { message: string }) => error.message);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          isReadyRef.current = true;
        }}>
        <AuthContextProvider>
          <ContactUsContextProvider>
            <DeviceValidationContextProvider>
              <UserDetailsContextProvider>
                <StatementsContextProvider>
                  <BeneficiariesContextProvider>
                    <AccountBalanceContextProvider>
                      <PaymentContextProvider>
                        <RatesContextProvider>
                          <OrderContextProvider>
                            <Stack.Navigator screenOptions={{ headerShown: false }}>
                              <Stack.Screen name={'Login'} component={Login} />
                              <Stack.Screen
                                name={'AddDebitCardBottomTabbar'}
                                options={{
                                  ...DEFAULT_HEADER_CONFIG,
                                  title: 'Add card',
                                }}
                                component={AddDebitCardBottomTabbar}
                              />
                              <Stack.Screen name={'Sidebar'} component={Sidebar} />
                              <Stack.Screen
                                name={'AccountValidation'}
                                component={AccountValidation}
                              />
                              <Stack.Screen name={'RequestPin'} component={RequestPin} />
                              <Stack.Screen
                                name={'StatementsTopTabbar'}
                                component={StatementsTopTabbar}
                              />
                              <Stack.Screen
                                name={'StatementsTopTabbarForMain'}
                                component={StatementsTopTabbarForMain}
                              />
                              <Stack.Screen name={'CurrencyCards'} component={CurrencyCards} />
                              <Stack.Screen name={'Settings'} component={Settings} />
                              <Stack.Screen
                                name={'CurrencyCardDetails'}
                                component={CurrencyCardDetails}
                              />
                              <Stack.Screen
                                name={'DebitCardDetails'}
                                component={DebitCardDetails}
                              />
                            <Stack.Screen
                              name={'Orders'}
                              component={OrdersBottomTabbar}
                              options={{
                                ...DEFAULT_HEADER_CONFIG,
                                title: 'Orders',
                              }}
                            />
                              <Stack.Screen
                                name={'RequestCcyCard'}
                                component={RequestCurrencyCard}
                              />
                              <Stack.Screen name={'AddOrder'} component={AddOrder} />
                              <Stack.Screen
                                name={'EditCcyCardMobilePhone'}
                                component={EditCcyCardMobilePhone}
                              />
                              <Stack.Screen name={'HomePage'} component={HomePage} />
                              <Stack.Screen name={'Communication'} component={Communication} />
                              <Stack.Screen name={'TopUp'} component={TopUp} />
                              <Stack.Screen name={'WebViewScreen'} component={WebViewScreen} />
                              <Stack.Screen
                                name={'Rates'}
                                component={RatesBottomTabbar}
                                options={{
                                  header: () => (
                                    <>
                                      <BackHeader title={'Rates'} />
                                    </>
                                  ),
                                  headerShown: true,
                                }}
                              />
                              <Stack.Screen
                                name={'ContactUsTopTabbar'}
                                component={ContactUsTopTabbar}
                              />
                              <Stack.Screen
                                name={'AddBeneficiaryTopTabbar'}
                                component={AddBeneficiaryTopTabbar}
                              />
                              <Stack.Screen
                                name={'BeneficiaryDetailsTopTabbar'}
                                component={BeneficiaryDetailsTopTabbar}
                              />
                              <Stack.Screen name={'IntroSlider'} component={IntroSlider} />
                              <Stack.Screen name={'Trade'} component={Trade} />
                              <Stack.Screen
                                name={'Balances'}
                                component={BalancesBottomTabbar}
                                options={{
                                  ...DEFAULT_HEADER_CONFIG,
                                  title: 'Balances',
                                }}
                              />
                              <Stack.Screen
                                name={'BeneficiaryList'}
                                component={BeneficiariesBottomTabbar}
                                options={{
                                  ...DEFAULT_HEADER_CONFIG,
                                  title: 'Beneficiaries',
                                }}
                              />
                              <Stack.Screen
                                name={'Orders'}
                                component={OrdersBottomTabbar}
                                options={{
                                  ...DEFAULT_HEADER_CONFIG,
                                  title: 'Orders',
                                }}
                              />
                              <Stack.Screen name={'Trades'} component={Trades} />
                              <Stack.Screen name={'Payments'} component={Payments} />
                              <Stack.Screen name={'ValidateDevice'} component={ValidateDevice} />
                              <Stack.Screen
                                name={'SecuritySettings'}
                                component={SecuritySettings}
                              />
                              <Stack.Screen name={'SetPin'} component={SetPin} />
                              <Stack.Screen name={'SendPayment'} component={SendPayment} />
                              <Stack.Screen name={'AccountDetails'} component={AccountDetails} />
                              <Stack.Screen name={'DebitCards'} component={DebitCards} />
                              <Stack.Screen
                                name={'SendPaymentDetails'}
                                component={SendPaymentDetails}
                              />
                            </Stack.Navigator>
                          </OrderContextProvider>
                        </RatesContextProvider>
                      </PaymentContextProvider>
                    </AccountBalanceContextProvider>
                  </BeneficiariesContextProvider>
                </StatementsContextProvider>
              </UserDetailsContextProvider>
            </DeviceValidationContextProvider>
          </ContactUsContextProvider>
        </AuthContextProvider>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
