import React, { FC, ReactElement, useContext, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import RowButton from 'components/Buttons/Balances/RowButton';
import MaterialIcon from 'components/Icons/MaterialIcon';
import ActionButton from 'components/Table/ActionButton';
import RowInfoWrapper from 'components/Table/RowInfoWrapper';
import CellExtraInfoWrapper from 'components/Wrappers/CellExtraInfoWrapper';

import { colors } from 'styles';
import Cell from 'components/Table/Cell';
import { navigateType } from 'types/types';
import { CurrencyBalance } from 'types/screens';
import { AccountBalanceContext } from 'state/AccountBalanceContext';
import NoTransactionsText from 'components/Texts/NoTransactionsText';
import { Swipeable } from 'react-native-gesture-handler';

const Positives: FC<{ navigation: navigateType }> = ({ navigation }): ReactElement => {
  const [rowPressed, setRowPressed] = useState<string>('');
  const { t } = useTranslation();
  const { balanceInfo } = useContext(AccountBalanceContext);
  let row: number[] = [];
  let prevOpenedRow: any;
  const closeRow = (index: number) => {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  const renderItem = ({ item, index }: { item: CurrencyBalance; index: number }) => {
    const accountBalance = item.AccountBalance + '';
    const spotBalance = item.SpotBalance + '';
    const marginAC = item.MarginAC === 0 ? item.MarginAC.toFixed(2) : item.MarginAC;
    if (item.CCY !== '*') {
      return (
        <Swipeable
          renderRightActions={(progress, dragX) => renderHiddenItem(item)}
          onSwipeableOpen={() => closeRow(index)}
          ref={(ref: any) => (row[index] = ref)}>
          <RowButton onPress={() => setRowPressed(item.CCY)} pressed={rowPressed} id={item.CCY}>
            <>
              <View style={{ flex: 2 }}>
                <RowInfoWrapper>
                  <View style={styles.currencyWrapper}>
                    <Cell info={item.CCY} />
                  </View>
                  <View style={styles.balanceWrapper}>
                    <Cell info={accountBalance} />
                  </View>
                  <View style={styles.arrowWrapper}>
                    <MaterialIcon
                      icon={'keyboard-arrow-right'}
                      color={colors.blueGrey.c250}
                      size={20}
                      testId={'major.iconButton.OpenRateArrow'}
                    />
                  </View>
                </RowInfoWrapper>
                {rowPressed === item.CCY && (
                  <View style={styles.extraInfoWrapper}>
                    <View style={styles.rowExtraInfoWrapper}>
                      <CellExtraInfoWrapper title={t('currencyMayusc')} info={item.CCY} />
                      <CellExtraInfoWrapper title={t('marginMayusc')} info={`${marginAC}`} />
                    </View>
                    <View style={styles.rowExtraInfoWrapper}>
                      <CellExtraInfoWrapper title={t('currBalanceMayusc')} info={accountBalance} />
                      <CellExtraInfoWrapper title={t('spotBalanceMayusc')} info={spotBalance} />
                    </View>
                  </View>
                )}
              </View>
            </>
          </RowButton>
        </Swipeable>
      );
    }
  };

  const renderHiddenItem = (item: { CCY: string; AccountBalance: number }) => {
    const { backRightBtnRight, backRightBtnCenter, backRightBtnLeft } = styles;
    return (
      <View style={styles.buttonsWrapper}>
        <ActionButton
          onPress={() =>
            navigation.navigate('SendPayment', { CCY: item.CCY, limit: item.AccountBalance })
          }
          buttonText={t('Send payment')}
          customStyle={backRightBtnLeft}
        />
        <ActionButton
          onPress={() => navigation.navigate('Trade', { CCY: item.CCY })}
          buttonText={t('Trade')}
          customStyle={backRightBtnCenter}
        />
        <ActionButton
          onPress={() => navigation.navigate('StatementsTopTabbarForMain', { CCY: item.CCY })}
          buttonText={t('statementsCapital')}
          customStyle={backRightBtnRight}
        />
      </View>
    );
  };

  if (balanceInfo?.positives?.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.grey.A100 }}>
        <NoTransactionsText message={t('noBalancesFound')} />
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: colors.grey.A100 }}
      testID="positives.flatList"
      data={balanceInfo.positives}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.grey.A100,
    flex: 1,
  },
  arrowWrapper: { flex: 1, alignItems: 'flex-end', marginRight: 20 },
  balanceWrapper: { flex: 2, alignItems: 'flex-end' },
  currencyWrapper: { flex: 3, paddingLeft: 20, justifyContent: 'center' },
  buttonsWrapper: {
    alignItems: 'center',
    backgroundColor: colors.grey.A100,
    width: 216,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtnLeft: {
    backgroundColor: colors.blue.c650,
    right: 146,
  },
  backRightBtnCenter: {
    backgroundColor: colors.blue.c650,
    right: 74,
  },
  backRightBtnRight: {
    backgroundColor: colors.blue.c650,
    right: 2,
  },
  rowExtraInfoWrapper: { flex: 1, flexDirection: 'row' },
  extraInfoWrapper: {
    flex: 2,
    backgroundColor: colors.blueGrey.c50,
    borderWidth: 1,
    borderColor: colors.blueGrey.c100,
  },
});

export default Positives;
