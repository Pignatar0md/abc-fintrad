import React, { FC, ReactElement, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Line from 'components/Figures/Line';
import MaterialIcon from 'components/Icons/MaterialIcon';
import NoTransactionsText from 'components/Texts/NoTransactionsText';
import TransparentButton from 'components/Buttons/TransparentButton';
import BottomButtonOption from 'components/Prebuilts/BottomButtonsBar/BottomButtonOption';
import LoadingIndicator from 'components/LoadingIndicator';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';

import { getCurrencyCards } from 'api/CardRequests';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';
import { colors, fontSizes } from 'styles';
import { currencyCardItemInitialState } from '../initialStates';
import { CurrencyCardsNavigationProp } from 'types/types';
import { CardInfo } from 'types/screens';
import { CCyCard } from 'types/state';
import { COLORS_STATUS, DEFAULT_HEADER_CONFIG } from 'utils/static';
import { getCardImageByType, getCardType } from 'utils/cards';

const CurrencyCards: FC<CurrencyCardsNavigationProp> = ({ navigation }): ReactElement => {
  const [ccyCards, setCcyCards] = useState<CCyCard[]>([currencyCardItemInitialState]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { t } = useTranslation();

  const screenTitle = t('ccyCards');
  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      title: screenTitle,
    });
  }, []);

  useEffect(() => {
    const getCurrencyCardsInfo = async () => {
      setLoading(true);
      const response = await getCurrencyCards();
      if (response?.data?.Succeeded) {
        await sendInfoLog({ event: 'GetCurrencyCards', detail: response?.data?.Succeeded });
        setCcyCards(response?.data?.Data);
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
          await sendErrorLog({ event: 'GetCurrencyCards', detail: response?.toString() });
        }
      }
      setLoading(false);
    };

    getCurrencyCardsInfo();
  }, []);

  const renderRow = ({ item }: { item: CardInfo }) => {
    const { ID, CardNumber, Status } = item;
    const cardType = getCardType(item.CardNumber);
    return (
      <View key={ID} testID={`ccyCardsList.${ID}`}>
        <View style={styles.optionWrapper}>
          <TransparentButton
            testId={`ccyCardsList.cardButton.${CardNumber}`}
            onPress={() => navigation.navigate('CurrencyCardDetails', { item })}>
            <View style={styles.imageShadowWrapper}>
              <Image source={getCardImageByType(cardType.type)} style={styles.cardImage} />
            </View>
            <View style={styles.optionTitleWrapper}>
              <Text testID="ccyCardsList.card.title" style={styles.optionTitleCardType}>
                {t('ccyCard')}
              </Text>
              <Text
                testID={`ccyCardsList.card.title.${CardNumber}`}
                style={styles.optionTitleCardNumber}>
                {CardNumber}
              </Text>
            </View>
            <View>
              <Text
                testID={`ccyCardsList.card.title${CardNumber}`}
                style={[
                  styles.optionTitleCardType,
                  {
                    marginTop: 20,
                    color: COLORS_STATUS[Status],
                  },
                ]}>
                {item.Status ? t('activeMayusc') : t('inactiveMayusc')}
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
    return <LoadingIndicator size={'small'} testId={'loadingCcyCards'} />;
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {ccyCards[0].ClientID === '' ? (
          <View style={{ flex: 1 }}>
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
            data={ccyCards}
            renderItem={renderRow}
            keyExtractor={(item: CardInfo) => item?.ID?.toString()}
          />
        )}
        <BottomButtonOption buttonTitle={'requestNew'} route={'RequestCcyCard'} />
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
    width: 60,
    height: 40,
  },
  imageShadowWrapper: {
    elevation: 5,
    shadowColor: colors.grey.c999,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
  },
});

export default CurrencyCards;
