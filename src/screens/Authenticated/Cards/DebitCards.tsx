import React, { FC, ReactElement, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Line from 'components/Figures/Line';
import MaterialIcon from 'components/Icons/MaterialIcon';
import NoTransactionsText from 'components/Texts/NoTransactionsText';
import TransparentButton from 'components/Buttons/TransparentButton';
import BottomButtonOption from 'components/Prebuilts/BottomButtonsBar/BottomButtonOption';

import { getDebitCards } from 'api/CardRequests';
import { DebitCardsNavigationProp } from 'types/types';
import { DEFAULT_HEADER_CONFIG } from 'utils/static';
import { colors, fontSizes } from 'styles';
import LoadingIndicator from 'components/LoadingIndicator';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';
import { DebitCard } from 'types/state';
import { debitCardItemInitialState } from '../initialStates';
import { getCardImageByType, getCardNameByType, getCardType } from 'utils/cards';

const DebitCards: FC<DebitCardsNavigationProp> = ({ navigation }): ReactElement => {
  const [debitCards, setDebitCards] = useState<DebitCard[]>([debitCardItemInitialState]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { t } = useTranslation();

  const screenTitle = t('debitCard');
  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      title: screenTitle,
    });
  }, []);

  useEffect(() => {
    const getDebitCardsInfo = async () => {
      setLoading(true);
      const response = await getDebitCards();
      if (response?.data?.Succeeded) {
        await sendInfoLog({ event: 'GetDebitCards', detail: response?.data?.Succeeded });
        response?.data?.Data.length > 0 && setDebitCards(response?.data?.Data);
      } else {
        if (response?.data === 'Request failed with status code 401') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login', expired: true }],
          });
          await sendErrorLog({
            event: 'removeBeneficiary deleteBeneficiary - Beneficiaries',
            detail: 'user session expired: ' + response?.data,
          });
        } else {
          setErrorMessage(`${t('somethingWentWrong')}. ${t('tryLaterContactSupport')}`);
          await sendErrorLog({ event: 'GetDebitCards', detail: response?.toString() });
        }
      }
      setLoading(false);
    };

    getDebitCardsInfo();
  }, []);

  const renderRow = ({ item }: { item: DebitCard }) => {
    const { ID, CardNumber } = item;
    const cardType = getCardType(item.CardNumber);
    const customImageWrapper = styles.imageShadowWrapper;
    return (
      <View key={ID} testID={`debitCardsList.${ID}`}>
        <View style={styles.optionWrapper}>
          <TransparentButton
            testId={`debitCardsList.cardButton.${CardNumber}`}
            onPress={() =>
              navigation.navigate('DebitCardDetails', { item: { ...item, Type: cardType.type } })
            }>
            <View style={customImageWrapper}>
              <Image source={getCardImageByType(cardType.type)} style={styles.cardImage} />
            </View>
            <View style={styles.optionTitleWrapper}>
              <Text testID="debitCardsList.card.title" style={styles.optionTitleCardType}>
                {getCardNameByType(cardType.type)}
              </Text>
              <Text
                testID={`debitCardsList.card.title.${CardNumber}`}
                style={styles.optionTitleCardNumber}>
                {`**** **** **** ${CardNumber.slice(-4)}`}
              </Text>
            </View>
            <MaterialIcon
              icon={'keyboard-arrow-right'}
              color={colors.blueGrey.c250}
              size={20}
              testId={'major.iconButton.OpenRateArrow'}
            />
          </TransparentButton>
        </View>
        <Line />
      </View>
    );
  };

  if (loading) {
    return <LoadingIndicator background="white" size={'small'} testId={'loadingdebitCards'} />;
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {debitCards[0]?.CardNumber === '' ? (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <NoTransactionsText
              customTextStyle={
                (!!errorMessage as boolean)
                  ? { color: colors.red.c900, marginHorizontal: 20 }
                  : undefined
              }
              message={(!!errorMessage as boolean) ? errorMessage : t('noCardsFound')}
            />
          </View>
        ) : (
          <FlatList
            data={debitCards}
            renderItem={renderRow}
            keyExtractor={(item: DebitCard) => item?.ID?.toString()}
          />
        )}
        <BottomButtonOption buttonTitle={'addDebitCard'} route={'AddDebitCardBottomTabbar'} />
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grey.A100,
  },
  optionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 10,
  },
  optionTitleWrapper: {
    flexDirection: 'column',
    alignItems: 'baseline',
  },
  optionTitleCardType: {
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.mediumSmall14,
    color: colors.grey.c900,
    letterSpacing: 0.5,
  },
  optionTitleCardNumber: {
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.mediumSmall14,
    color: colors.grey.c650,
    letterSpacing: 0.5,
  },
  cardImage: {
    backgroundColor: colors.grey.A100,
    width: 60,
    height: 40,
  },
  imageShadowWrapper: {
    backgroundColor: colors.grey.A100,
    style: { marginVertical: 5 },
    elevation: 4,
    shadowColor: colors.grey.c999,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
  },
});

export default DebitCards;
