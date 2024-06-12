import React, { FC, ReactElement, useEffect, useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import NoTransactionsText from 'components/Texts/NoTransactionsText';

import { colors, fontSizes } from 'styles';
import MaterialIcon from 'components/Icons/MaterialIcon';
import RowButton from 'components/Buttons/Statements/RowButton';
import { Swipeable } from 'react-native-gesture-handler';
import ActionButton from 'components/Table/ActionButton';
import CellExtraInfoWrapper from 'components/Wrappers/CellExtraInfoWrapper';
import { getTrades } from 'api/TradeRequests';
import moment from 'moment';
import { TradeItem } from 'types/screens';

// const DATA_2 = [
//   {
//     BuyAmount: 113.36,
//     BuyCCY: 'EUR',
//     BuySellFlag: 1,
//     CCYPair: 'GBPEUR',
//     ClientID: 'EFX1002',
//     CurrentProfitOnSpread: 1.5655048145000021,
//     DDCollected: false,
//     FeeAmount: 0,
//     FeeCCY: '',
//     Rate: 1.1336,
//     SellAmount: 100,
//     SellCCY: 'GBP',
//     Spread: 0.018023,
//     TTID: 0,
//     TradeDate: '2024-01-19 ,12:14:23',
//     TradeID: 12205,
//     UserID: 'MARCELO.P',
//     ValueDate: '2024-01-23',
//   },
//   {
//     BuyAmount: 117,
//     BuyCCY: 'EUR',
//     BuySellFlag: 0,
//     CCYPair: 'EURCAD',
//     ClientID: 'EFX1002',
//     CurrentProfitOnSpread: 2.7878439999999785,
//     DDCollected: false,
//     FeeAmount: 0,
//     FeeCCY: '',
//     Rate: 1.4865,
//     SellAmount: 173.92,
//     SellCCY: 'CAD',
//     Spread: 0.023832,
//     TTID: 0,
//     TradeDate: '2024-01-23 ,15:16:23',
//     TradeID: 12206,
//     UserID: 'MARCELO.P',
//     ValueDate: '2024-01-25',
//   },
//   {
//     BuyAmount: 120,
//     BuyCCY: 'EUR',
//     BuySellFlag: 0,
//     CCYPair: 'EURCZK',
//     ClientID: 'EFX1002',
//     CurrentProfitOnSpread: 57.192839999999705,
//     DDCollected: false,
//     FeeAmount: 0,
//     FeeCCY: '',
//     Rate: 25.1305,
//     SellAmount: 3015.66,
//     SellCCY: 'CZK',
//     Spread: 0.476607,
//     TTID: 0,
//     TradeDate: '2024-01-23 15:32:48',
//     TradeID: 12207,
//     UserID: 'MARCELO.P',
//     ValueDate: '2024-01-25',
//   },
//   {
//     BuyAmount: 233,
//     BuyCCY: 'EUR',
//     BuySellFlag: 0,
//     CCYPair: 'GBPEUR',
//     ClientID: 'EFX1002',
//     CurrentProfitOnSpread: 3.216843897699164,
//     DDCollected: false,
//     FeeAmount: 0,
//     FeeCCY: '',
//     Rate: 1.1336,
//     SellAmount: 205.54,
//     SellCCY: 'GBP',
//     Spread: 0.018023,
//     TTID: 0,
//     TradeDate: '2024-02-23 16:22:17',
//     TradeID: 12208,
//     UserID: 'LUIS',
//     ValueDate: '2024-01-25',
//   },
// ];

const Trades: FC = ({ navigation }): ReactElement => {
  const { t } = useTranslation();
  const [rowPressed, setRowPressed] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tradesList, setTradesList] = useState<{ title: string; data: TradeItem }[]>([]);

  useEffect(() => {
    const getTradesList = async () => {
      const response = await getTrades();
      if (response?.data?.Succeeded) {
        const formattedTrades = formatTradesList(response?.data?.Data);
        setTradesList(formattedTrades);
      } else {
        setErrorMessage(response?.data?.Error);
      }
    };
    getTradesList();
  }, []);

  const formatTradesList = (tradesList: TradeItem[]) => {
    const dateTradesList: { title: string; data: TradeItem }[] = [];
    const completeDates = tradesList.map((trade: TradeItem) => trade.TradeDate.split(' ')[0]); //['2024-01-10', '2024-01-10', '2024-02-11']
    const monthYearDates = completeDates.map((date: string) => date.substring(0, 7)); //['2024-01', '2024-01', '2024-02']
    const monthYearUniqueDates = [...new Set(monthYearDates)]; //['2024-01', '2024-02']
    const monthYearString = monthYearUniqueDates.map((monthYear: string) =>
      moment(monthYear, 'YYYY-MM').format('MMM YYYY'),
    ); //['Jan 2024','Feb 2024']
    monthYearString.forEach((dateString: string, index: number) => {
      const data = tradesList.filter(
        (trade) => trade.TradeDate.split(' ')[0].substring(0, 7) === monthYearUniqueDates[index],
      );
      dateTradesList.push({ title: dateString, data: data as unknown as TradeItem });
    });

    return dateTradesList;
  };

  let row = [];
  let prevOpenedRow;
  const closeRow = (index) => {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  const renderRow = ({ item, index }: { item: TradeItem; index: number }) => {
    const middle = Math.floor(item.CCYPair.length / 2);
    const ccyPair = item.CCYPair.substring(0, middle) + '/' + item.CCYPair.substring(middle);
    const isDue = moment(item.ValueDate) < moment() ? 'Due date' : 'Available';
    const tradeStatus = item.TTID > 0 ? 'Sent' : isDue;
    const isDueDate = tradeStatus === 'Due date';
    const redOrAmber = tradeStatus === 'Sent' ? colors.green.c600 : colors.amber.c800;
    const tradeStatusColor = isDueDate ? colors.red.A400 : redOrAmber;
    // cyan.A800,
    // grey.c680,
    return (
      <Swipeable
        renderRightActions={(progress, dragX) => (isDueDate ? null : renderHiddenItem({ item }))}
        onSwipeableOpen={() => closeRow(index)}
        ref={(ref) => (row[index] = ref)}>
        <RowButton onPress={() => setRowPressed(item.TradeID + '')} pressed={rowPressed}>
          <>
            <View style={styles.columnsContainer}>
              <View style={styles.firstColumn}>
                {/* first column */}
                <View style={styles.firstColumnInfoWrapper}>
                  <Text style={styles.pairWrapper}>{ccyPair}</Text>
                  <Text style={styles.creationDateWrapper}>{item.TradeDate.split(' ')[0]}</Text>
                </View>
                <View style={styles.ratesInfoWrapper}>
                  <Text style={styles.rateTextWrapper}>{t('rateCapital')}:</Text>
                  <Text style={styles.rateValueWrapper}>{item.Rate}</Text>
                </View>
              </View>
              <View style={styles.secondColumn}>
                {/* second colum */}
                <View style={styles.tradeInfoWrapper}>
                  <Text style={styles.amountCcy}>
                    {item.BuyAmount} {ccyPair.split('/')[0]}
                  </Text>
                  <Text style={styles.amountCcy}>
                    {item.SellAmount} {ccyPair.split('/')[1]}
                  </Text>
                </View>
                <View>
                  <Text style={styles.buyText}>{t('buyCapital')}</Text>
                  <Text style={[styles.buyText, { backgroundColor: colors.yellow.c800 }]}>
                    {t('sellCapital')}
                  </Text>
                </View>
              </View>
              <View style={styles.thirdColumn}>
                <MaterialIcon
                  icon={
                    isDueDate ? 'circle' : 'keyboard-arrow-right'
                    // rowOpened === item.ID.toString()
                    //   ? 'keyboard-arrow-right'
                    //   : 'keyboard-arrow-left'
                  }
                  color={isDueDate ? colors.red.A400 : colors.blueGrey.c250}
                  size={isDueDate ? 9 : 20}
                  testId={'orders.iconButton.OpenRateArrow'}
                />
              </View>
            </View>
            {rowPressed === item.TradeID.toString() && (
              <View style={styles.extraInfoWrapper}>
                <View style={styles.rowExtraInfoWrapper}>
                  <CellExtraInfoWrapper
                    title={t('valueDateMayusc')}
                    info={item.ValueDate.split(' ')[0]}
                  />
                  <CellExtraInfoWrapper
                    customWrapper={{ marginLeft: 10 }}
                    customTitle={{ color: tradeStatusColor, fontFamily: 'OpenSans-Bold' }}
                    title={tradeStatus.toUpperCase()}
                    info={''}
                  />
                </View>
                <View style={styles.rowExtraInfoWrapper}>
                  <CellExtraInfoWrapper
                    title={t('timeMayusc')}
                    info={item.ValueDate.split(' ')[1]}
                  />
                </View>
                <View style={styles.rowExtraInfoWrapper}>
                  <CellExtraInfoWrapper title={t('userMayusc')} info={item.UserID.toUpperCase()} />
                </View>
              </View>
            )}
          </>
        </RowButton>
      </Swipeable>
    );
  };

  const renderHiddenItem = ({ item }: { item: TradeItem }) => {
    const { backRightBtnRight } = styles;
    const middle = Math.floor(item.CCYPair.length / 2);
    const ccyPair = item.CCYPair.substring(0, middle) + '/' + item.CCYPair.substring(middle);
    return (
      <View style={styles.buttonsWrapper}>
        <ActionButton
          onPress={() => navigation.navigate('SendPayment', { CCY: ccyPair.split('/')[0] })}
          buttonText={t('sendPaymentCapital')}
          customStyle={backRightBtnRight}
        />
      </View>
    );
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {tradesList.length === 0 ? (
          <View style={{ flex: 1 }}>
            <NoTransactionsText
              customTextStyle={
                (!!errorMessage as boolean)
                  ? { color: colors.red.c900, marginHorizontal: 20 }
                  : undefined
              }
              message={(!!errorMessage as boolean) ? errorMessage : t('noTradesFound')}
            />
          </View>
        ) : (
          <SectionList
            sections={tradesList}
            keyExtractor={(item: TradeItem) => item.TradeID + ''}
            renderItem={renderRow}
            renderSectionHeader={({ section }) => (
              <View style={styles.monthYearContainer}>
                <Text style={styles.monthYearWrapper}>{section.title}</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.grey.A100,
    flex: 1,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: colors.blue.c999,
  },
  headerContentWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue.c999,
    width: '100%',
    height: 30,
    paddingRight: 70,
    flexDirection: 'row',
  },
  headerText: {
    color: 'white',
    fontSize: fontSizes.medium16,
    fontFamily: 'OpenSans-SemiBold',
    marginRight: 5,
  },
  buttonsWrapper: {
    alignItems: 'center',
    backgroundColor: colors.grey.A100,
    width: 72,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtnRight: {
    backgroundColor: colors.blue.c650,
    right: 2,
  },
  columnsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.grey.A100,
    borderColor: colors.grey.c200,
    borderWidth: 1,
    padding: 5,
    paddingLeft: 15,
  },
  monthYearWrapper: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: fontSizes.extraSmall10,
    color: colors.grey.c900,
  },
  monthYearContainer: { paddingVertical: 8, alignItems: 'center' },
  extraInfoWrapper: {
    flex: 2,
    backgroundColor: colors.blueGrey.c50,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.blueGrey.c100,
  },
  rowExtraInfoWrapper: { flex: 1, flexDirection: 'row', marginVertical: 3, marginRight: 5 },
  pairWrapper: {
    padding: 2,
    marginRight: 3,
    backgroundColor: colors.cyan.A800,
    color: colors.grey.A100,
    fontSize: fontSizes.small12,
    fontFamily: 'OpenSans-Bold',
  },
  creationDateWrapper: {
    marginHorizontal: 3,
    color: colors.grey.c900,
    fontSize: fontSizes.small12,
    fontFamily: 'OpenSans-SemiBold',
  },
  firstColumnInfoWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  ratesInfoWrapper: { flexDirection: 'row', marginVertical: 5 },
  rateTextWrapper: { fontFamily: 'OpenSans-SemiBold', fontSize: fontSizes.mediumSmall14 },
  rateValueWrapper: {
    fontSize: fontSizes.mediumSmall14,
    fontFamily: 'OpenSans-Regular',
    marginLeft: 5,
  },
  tradeInfoWrapper: {
    justifyContent: 'flex-start',
    marginVertical: 1,
  },
  amountCcy: {
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.mediumSmall14,
    color: colors.blue.c999,
  },
  buyText: {
    margin: 1,
    textAlign: 'center',
    fontFamily: 'OpenSans-Bold',
    fontSize: fontSizes.small12,
    minWidth: 30,
    color: colors.grey.A100,
    backgroundColor: colors.indigo.c400,
  },
  firstColumn: { flex: 1 },
  secondColumn: {
    marginTop: 16,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  thirdColumn: { width: 30, marginTop: 40, alignItems: 'center' },
});

export default Trades;
