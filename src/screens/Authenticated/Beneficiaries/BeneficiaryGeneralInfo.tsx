import React, { FC, ReactElement, useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import Line from 'components/Figures/Line';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import { colors, fontSizes } from 'styles';
import { Beneficiary } from 'types/state';
import BottomButtonOptionsBeneficiaryDetails from 'components/Prebuilts/BottomButtonsBar/BottomButtonOptionsBeneficiaryDetails';
import { navigateType } from 'types/types';
import { BeneficiariesContext } from 'state/BeneficiariesContext';
import { getCountryName } from 'utils/helpers/Beneficiaries';

const BeneficiaryGeneralInfo: FC<{ beneficiaryDetails: Beneficiary }> = ({
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
              <Text style={legend}>{t('userName')}</Text>
            </View>
            <View style={textWrapper}>
              <Text style={value}>{beneficiaryDetails?.BeneficiaryName}</Text>
            </View>
          </View>
          <Line />
          <View style={rowWrapper}>
            <View style={textWrapper}>
              <Text style={legend}>{t('aliasCapital')}</Text>
            </View>
            <View style={textWrapper}>
              <Text style={value}>{beneficiaryDetails?.Alias}</Text>
            </View>
          </View>
          <Line />
          <View style={rowWrapper}>
            <View style={textWrapper}>
              <Text style={legend}>{t('userEmail')}</Text>
            </View>
            <View style={textWrapper}>
              <Text style={value}>{beneficiaryDetails?.EMail}</Text>
            </View>
          </View>
          <Line />
          <View style={rowWrapper}>
            <View style={textWrapper}>
              <Text style={legend}>{t('addressCapital')}</Text>
            </View>
            <View style={textWrapper}>
              <Text style={value}>
                {`${beneficiaryDetails?.Address1} ${beneficiaryDetails?.Address2} ${beneficiaryDetails?.Address3}`}
              </Text>
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
              <Text style={legend}>{t('ref1')}</Text>
            </View>
            <View style={textWrapper}>
              <Text style={value}>{beneficiaryDetails?.Reference1}</Text>
            </View>
          </View>
          <Line />
          <View style={rowWrapper}>
            <View style={textWrapper}>
              <Text style={legend}>{t('ref2')}</Text>
            </View>
            <View style={textWrapper}>
              <Text style={value}>{beneficiaryDetails?.Reference2}</Text>
            </View>
          </View>
          <Line />
          <View style={rowWrapper}>
            <View style={textWrapper}>
              <Text style={legend}>{t('paymentPurpose')}</Text>
            </View>
            <View style={textWrapper}>
              <Text style={value}>{beneficiaryDetails?.Reference3}</Text>
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

export default BeneficiaryGeneralInfo;
