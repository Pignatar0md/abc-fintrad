import React, { FC, ReactElement, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { UserDetailsContext } from 'state/UserDetailsContext';
import TextInfo from 'components/Texts/AccountDetails/TextInfo';
import MaterialCommunity from 'components/Icons/MaterialCommunity';
import TextLegend from 'components/Texts/AccountDetails/TextLegend';
import ParagraphWrapper from 'components/Wrappers/AccountDetails/ParagraphWrapper';

import { AccountDetailsScreenNavigationProp } from 'types/types';
import { colors, fontSizes } from 'styles';
import {
  BANK_ACCOUNT_NAME,
  DEFAULT_HEADER_CONFIG,
  SORTCODE,
  GBP_CURRENCY_SYMBOL,
} from 'utils/static';
import { getPlaneObjectData } from 'utils/localStorage';

const AccountDetails: FC<AccountDetailsScreenNavigationProp> = ({ navigation }): ReactElement => {
  const { t } = useTranslation();
  const { userInfo } = useContext(UserDetailsContext);
  const [storedAccountNumber, setStoredAccountNumber] = useState('');
  useLayoutEffect(() => {
    const screenTitle = t('AccountDetails');
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      title: screenTitle,
    });
  }, []);

  useEffect(() => {
    async function getAccountDetailsFromStore() {
      const { userDetails } = await getPlaneObjectData('userDetails');
      if (userDetails.AccountNumber) {
        setStoredAccountNumber(userDetails.AccountNumber);
      }
    }
    getAccountDetailsFromStore();
  }, []);

  const { container } = styles;

  return (
    <View style={container} testID="acountDetails.Wrapper">
      <ParagraphWrapper customStyle={{ alignItems: 'center' }}>
        <>
          <MaterialCommunity
            testId="acountDetails.bankIcon"
            icon={'bank-outline'}
            color={colors.lightBlue.A750}
            size={fontSizes.huge30}
          />
          <TextInfo
            customStyle={{ marginLeft: 14, color: colors.lightBlue.A750 }}
            text={`${GBP_CURRENCY_SYMBOL} ${t('accountMayusc')}`}
          />
        </>
      </ParagraphWrapper>
      <ParagraphWrapper customStyle={{ flexDirection: 'column' }}>
        <>
          <TextLegend text={t('bankAccount')} />
          <TextInfo text={BANK_ACCOUNT_NAME} />
        </>
      </ParagraphWrapper>
      <ParagraphWrapper customStyle={{ flexDirection: 'column' }}>
        <>
          <TextLegend text={t('sortCode')} />
          <TextInfo text={SORTCODE} />
        </>
      </ParagraphWrapper>
      <ParagraphWrapper customStyle={{ flexDirection: 'column' }}>
        <>
          <TextLegend text={t('accountNumber')} />
          <TextInfo text={userInfo.userInformation.AccountNumber || storedAccountNumber} />
        </>
      </ParagraphWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 30,
    backgroundColor: colors.grey.A100,
  },
});

export default AccountDetails;
