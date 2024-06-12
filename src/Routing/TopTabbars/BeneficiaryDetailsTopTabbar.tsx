import React, { FC, ReactElement, useContext, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

import BeneficiaryGeneralInfo from 'screens/Authenticated/Beneficiaries/BeneficiaryGeneralInfo';
import BeneficiaryBankInfo from 'screens/Authenticated/Beneficiaries/BeneficiaryBankInfo';
import { colors, fontSizes } from 'styles';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import { BeneficiaryDetailsTopTabbarNavigationProp } from 'types/types';
import { DEFAULT_HEADER_CONFIG } from 'utils/static';
import { useTranslation } from 'react-i18next';
import BackHeader from 'components/Prebuilts/Headers/BackHeader';
import TextInfo from 'components/Texts/AccountDetails/TextInfo';
import { Beneficiary } from 'types/state';

const { grey, cyan } = colors;

const BeneficiaryDetailsTopTabbar: FC<BeneficiaryDetailsTopTabbarNavigationProp> = ({
  navigation,
  route,
}): ReactElement => {
  const { t } = useTranslation();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState<number>(0);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary>();
  const [routes] = useState([
    { key: 'first', title: 'General' },
    { key: 'second', title: 'Bank' },
  ]);

  const BeneficiaryGeneralInfoComponent = () => (
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    <BeneficiaryGeneralInfo beneficiaryDetails={selectedBeneficiary!} />
  );
  const BeneficiaryBankInfoComponent = () => (
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    <BeneficiaryBankInfo beneficiaryDetails={selectedBeneficiary!} />
  );

  useLayoutEffect(() => {
    const beneficiaryInfo = route?.params.beneficiary;
    setSelectedBeneficiary(beneficiaryInfo as Beneficiary);
    const screenTitle = t('detailsCapital');
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      title: screenTitle,
      header: () => (
        <>
          <BackHeader title={t('detailsCapital')} />
          <View style={styles.customHeaderWrapper}>
            <TextInfo
              text={beneficiaryInfo?.BeneficiaryName as string}
              customStyle={styles.textName}
            />
            <TextInfo
              text={beneficiaryInfo?.AddressValidated ? 'active' : 'inactive'}
              customStyle={
                beneficiaryInfo?.AddressValidated
                  ? styles.textStatus
                  : [styles.textStatus, { color: 'red' }]
              }
            />
          </View>
        </>
      ),
    });
  }, []);

  const renderScene = SceneMap({
    first: BeneficiaryGeneralInfoComponent,
    second: BeneficiaryBankInfoComponent,
  });

  const customTabbar = (props: any) => (
    <TabBar
      testID="routing.BeneficiaryDetailsTabbar"
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
  textName: { color: 'black', fontSize: fontSizes.large20, fontFamily: 'OpenSans-Regular' },
  textStatus: { color: 'green', fontSize: fontSizes.mediumSmall14, fontFamily: 'OpenSans-Regular' },
  customHeaderWrapper: {
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: colors.grey.A150,
  },
});

export default BeneficiaryDetailsTopTabbar;
