import React, { FC, ReactElement, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Positives from 'screens/Authenticated/Balances/Positives';
import { DEFAULT_SCREEN_OPTIONS_BOTTOM_TABBAR } from 'utils/static';
import { colors, fontSizes } from 'styles';
import { getAccountBalance } from 'api/BalancesRequests';
import { AccountBalanceContext } from 'state/AccountBalanceContext';
import LoadingIndicator from 'components/LoadingIndicator';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import AntDesigns from 'components/Icons/AntDesigns';
import AllBalances from 'screens/Authenticated/Balances/AllBalances';
import Negatives from 'screens/Authenticated/Balances/Negatives';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';
import { BalancesBottomTabBar, navigateType } from 'types/types';
import { AccountBalance } from 'types/screens';

const BalancesBottomTabbar: FC<BalancesBottomTabBar> = (): ReactElement => {
  const navigation: navigateType = useNavigation();
  const Tab = createBottomTabNavigator();
  const { t } = useTranslation();
  const {
    balanceInfo,
    setBalanceSuccess,
    setBalancePositives,
    setBalanceNegatives,
    setBalanceError,
  } = useContext(AccountBalanceContext);
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  const fetchAccountBalance = async () => {
    setLoading(true);
    const response = await getAccountBalance();
    if (response?.data?.Succeeded) {
      await sendInfoLog({
        event: 'balances bottom tabbar - fetchAccountBalance',
        detail: 'successful',
      });
      const all = response?.data?.Data?.filter(({ CCY }: { CCY: string }) => CCY !== '*');
      setBalanceSuccess(all);
      const positives = response?.data?.Data?.filter(
        ({ AccountBalance }: AccountBalance) => AccountBalance > 0,
      );
      const negatives = response?.data?.Data?.filter(
        ({ AccountBalance }: AccountBalance) => AccountBalance < 0,
      );
      setBalancePositives(positives);
      setBalanceNegatives(negatives);
    } else {
      if (response?.data === 'Request failed with status code 401') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' as never, expired: true }],
        });
        await sendErrorLog({
          event: 'balances bottom tabbar - fetchAccountBalance',
          detail: 'user session expired: ' + response?.data,
        });
      } else {
        await sendErrorLog({
          event: 'balances bottom tabbar - fetchAccountBalance',
          detail: 'at trying to get balance: ' + response?.toString(),
        });
        setErrorModal(true);
        setBalanceError(response?.data?.Message);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAccountBalance();
  }, []);

  if (loading) {
    return <LoadingIndicator size={'small'} testId={'balancesBottomBar'} />;
  }

  return (
    <>
      <ModalWindow
        testId="balances.errorModal"
        isVisible={errorModal}
        icon={
          <AntDesigns
            testId="sendPayment.exclamationWarning"
            color={colors.amber.c800}
            size={46}
            icon="infocirlce"
          />
        }
        title={t('errorCapital')}
        text={balanceInfo.errorMessage}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => setErrorModal(false)}
      />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          ...DEFAULT_SCREEN_OPTIONS_BOTTOM_TABBAR,
          tabBarIcon: ({ color }) => (
            <Text
              testID={`routing.balancesBottomTabbar.${route.name}`}
              style={[styles.iconStyle, { color }]}>
              {route.name}
            </Text>
          ),
        })}
        initialRouteName="All">
        <Tab.Screen name="All" component={AllBalances} />
        <Tab.Screen name="Positive" component={Positives} />
        <Tab.Screen name="Negative" component={Negatives} />
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

export default BalancesBottomTabbar;
