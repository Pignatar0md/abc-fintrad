import React, { FC, ReactElement, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

import BeneficiaryDetails from 'screens/Authenticated/Beneficiaries/AddBeneficiary/BeneficiaryDetails';
import BeneficiaryAddress from 'screens/Authenticated/Beneficiaries/AddBeneficiary/BeneficiaryAddress';
import BeneficiaryBankDetails from 'screens/Authenticated/Beneficiaries/AddBeneficiary/BeneficiaryBankDetails';

import { colors, fontSizes } from 'styles';
import { DEFAULT_HEADER_CONFIG } from 'utils/static';
import { useTranslation } from 'react-i18next';
import { AddBeneficiaryTopTabbarNavigationProp } from 'types/types';
import { ScreenTopTabbarProps } from 'types/routing';
import { BeneficiariesContext } from 'state/BeneficiariesContext';
import { Beneficiary } from 'types/state';
import { beneficiaryInitState } from 'screens/Authenticated/initialStates';
import { getCountriesForBeneficiary } from 'api/BeneficiariesRequests';
import { Country } from 'types/forms';
import { getCcies } from 'utils/helpers';
import { sendErrorLog } from 'api/LoggerRequests';

const { grey, cyan } = colors;

const AddBeneficiaryTopTabbar: FC<AddBeneficiaryTopTabbarNavigationProp> = ({
  navigation,
  route,
}): ReactElement => {
  const { t } = useTranslation();
  const layout = useWindowDimensions();
  const {
    beneficiariesInfo,
    setCountriesForBeneficiaries,
    setBeneficiariesError,
    setCurrenciesForBeneficiaries,
    setCurrenciesError,
  } = useContext(BeneficiariesContext);
  const [index, setIndex] = useState<number>(0);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary>(
    beneficiaryInitState as Beneficiary,
  );
  const [routes] = useState([
    { key: 'first', title: 'Details' },
    { key: 'second', title: 'Address' },
    { key: 'third', title: 'Bank details' },
  ]);

  useLayoutEffect(() => {
    const screenTitle = route?.params?.beneficiaryId ? t('editBeneficiary') : t('addBeneficiary');
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      title: screenTitle,
    });
  }, []);

  useEffect(() => {
    const filteredBeneficiary = beneficiariesInfo.beneficiaryList.find(
      (beneficiary) => beneficiary.ID === route?.params?.beneficiaryId,
    );
    setSelectedBeneficiary(filteredBeneficiary as Beneficiary);
  }, []);

  const getCountries = async () => {
    const response = await getCountriesForBeneficiary();
    if (response.data.Succeeded) {
      const formattedCountries = response.data.Data.map((country: Country) => {
        return { ...country, label: country.Name, value: country.ID };
      });
      setCountriesForBeneficiaries(formattedCountries);
    } else {
      if (response.data === 'Request failed with status code 401') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login', expired: true }],
        });
        await sendErrorLog({
          event: 'addBeneficiary top tabbar - getcountries',
          detail: 'user session expired: ' + response?.data,
        });
      } else {
        await sendErrorLog({
          event: 'addBeneficiary top tabbar - getcountries',
          detail: 'at trying to get countries: ' + response.toString(),
        });
        setBeneficiariesError(response?.data?.Error);
      }
    }
  };

  const getCurrencies = async () => {
    const currenciesToList = await getCcies(navigation);
    currenciesToList
      ? setCurrenciesForBeneficiaries(currenciesToList as [])
      : setCurrenciesError('Error');
  };

  useEffect(() => {
    getCountries();
    getCurrencies();
  }, []);

  const BeneficiaryDetailsScreen = (props: ScreenTopTabbarProps) => (
    <BeneficiaryDetails beneficiary={selectedBeneficiary} {...props} />
  );
  const BeneficiaryAddressScreen = (props: ScreenTopTabbarProps) => (
    <BeneficiaryAddress beneficiary={selectedBeneficiary} {...props} />
  );
  const BeneficiaryBankDetailsScreen = (props: ScreenTopTabbarProps) => (
    <BeneficiaryBankDetails beneficiary={selectedBeneficiary} {...props} />
  );

  const renderScene = SceneMap({
    first: BeneficiaryDetailsScreen,
    second: BeneficiaryAddressScreen,
    third: BeneficiaryBankDetailsScreen,
  });

  const customTabbar = (props: any) => (
    <TabBar
      testID="routing.BeneficiaryTabbar"
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

export default AddBeneficiaryTopTabbar;
