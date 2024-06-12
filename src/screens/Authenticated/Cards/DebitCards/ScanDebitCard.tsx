import React, { FC, ReactElement, useState, useEffect } from 'react';
import { Image, View, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CardScanner, { CardScannerResponse } from 'rn-card-scanner';

import { colors, fontSizes } from 'styles';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import { requestCameraPermission } from 'utils/helpers/PermissionsRequests';

const ScanDebitCard: FC = (): ReactElement => {
  const navigation: { navigate: (a: string) => void } = useNavigation();
  const [cardScannerActive, setCardScannerActive] = useState<boolean>(false);

  const scanCard = (card: CardScannerResponse) => {
    navigation.navigate('Fill manually', { item: card });
  };

  useEffect(() => {
    Platform.OS === 'android' && requestCameraPermission();
  }, []);

  return (
    <SafeAreaWrapper>
      {!cardScannerActive && (
        <View style={styles.container}>
          <TouchableOpacity onPress={() => setCardScannerActive(true)}>
            <Image
              source={require('../../../../../assets/img/scanCard.png')}
              style={{ width: 300, height: 200 }}
            />
          </TouchableOpacity>
        </View>
      )}
      {cardScannerActive && <CardScanner style={{ flex: 1 }} didCardScan={scanCard} />}
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
  optionTitle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.mediumSmall14,
    color: colors.grey.c900,
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

export default ScanDebitCard;
