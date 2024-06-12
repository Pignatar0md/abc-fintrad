import React, { FC, ReactElement, useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import Line from 'components/Figures/Line';
import BottomButtonOptionsBeneficiaryDetails from 'components/Prebuilts/BottomButtonsBar/BottomButtonOptionsBeneficiaryDetails';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import { colors, fontSizes } from 'styles';
import { Beneficiary } from 'types/state';
import { navigateType } from 'types/types';
import { getCountryName } from 'utils/helpers/Beneficiaries';
import { BeneficiariesContext } from 'state/BeneficiariesContext';

const BeneficiaryBankInfo: FC<{ beneficiaryDetails: Beneficiary }> = ({
  beneficiaryDetails,
}): ReactElement => {
  const navigation: navigateType = useNavigation();
  const { beneficiariesInfo } = useContext(BeneficiariesContext);
  const { t } = useTranslation();
  const { container, rowWrapper, textWrapper, legend, value } = styles;
  return (
    <SafeAreaWrapper>
      <ScrollView>
        <View style={container}>
          <View style={rowWrapper}>
            <View style={textWrapper}>
              <Text style={legend}>{t('currencyCapital')}</Text>
            </View>
            <View style={textWrapper}>
              <Text style={value}>{beneficiaryDetails?.CurrencyCode}</Text>
            </View>
          </View>
          <Line />
          <View style={rowWrapper}>
            <View style={textWrapper}>
              <Text style={legend}>{t('countryCapital')}</Text>
            </View>
            <View style={textWrapper}>
              <Text style={value}>
                {!!beneficiaryDetails?.AddressCountryCode &&
                  getCountryName(
                    beneficiaryDetails.AddressCountryCode,
                    beneficiariesInfo.countries,
                  )}
              </Text>
            </View>
          </View>
          <Line />
          <View style={rowWrapper}>
            <View style={textWrapper}>
              <Text style={legend}>{t('bankName')}</Text>
            </View>
            <View style={textWrapper}>
              <Text style={value}>{beneficiaryDetails?.BankName}</Text>
            </View>
          </View>
          <Line />
          <View style={rowWrapper}>
            <View style={textWrapper}>
              <Text style={legend}>{t('sortCode')}</Text>
            </View>
            <View style={textWrapper}>
              <Text style={value}>{beneficiaryDetails?.BankCode}</Text>
            </View>
          </View>
          <Line />
          <View style={rowWrapper}>
            <View style={textWrapper}>
              <Text style={legend}>{t('accountNumber')}</Text>
            </View>
            <View style={textWrapper}>
              <Text style={value}>{beneficiaryDetails?.AccountNumber}</Text>
            </View>
          </View>
          <Line />
          <View style={rowWrapper}>
            <View style={textWrapper}>
              <Text style={legend}>{t('swiftCode')}</Text>
            </View>
            <View style={textWrapper}>
              <Text style={value}>{beneficiaryDetails?.SWIFTBIC}</Text>
            </View>
          </View>
          <Line />
          <View style={rowWrapper}>
            <View style={textWrapper}>
              <Text style={legend}>{t('IBAN')}</Text>
            </View>
            <View style={textWrapper}>
              <Text style={value}>{beneficiaryDetails?.IBAN}</Text>
            </View>
          </View>
          <Line />
          <View style={rowWrapper}>
            <View style={textWrapper}>
              <Text style={legend}>{t('routingBank')}</Text>
            </View>
            <View style={textWrapper}>
              <Text style={value}>{beneficiaryDetails?.RoutingCode}</Text>
            </View>
          </View>
          <Line />
        </View>
      </ScrollView>
      <BottomButtonOptionsBeneficiaryDetails
        beneficiaryDetails={beneficiaryDetails}
        navigation={navigation}
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey.A100,
  },
  rowWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    margin: 20,
  },
  textWrapper: { flex: 1, alignItems: 'flex-start' },
  legend: {
    fontFamily: 'OpenSans-Light',
    fontSize: fontSizes.mediumLarge18,
    letterSpacing: 0.8,
  },
  value: {
    fontFamily: 'OpenSans-Light',
    fontSize: fontSizes.medium16,
    color: colors.grey.c680,
  },
});

export default BeneficiaryBankInfo;
