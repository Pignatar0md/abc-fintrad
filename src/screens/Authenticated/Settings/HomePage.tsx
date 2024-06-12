import React, { FC, ReactElement, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { DEFAULT_HEADER_CONFIG, HOMEPAGE_OPTIONS } from 'utils/static';
import { HomePageScreenNavigationProp } from 'types/types';
import { colors, fontSizes } from 'styles';
import Line from 'components/Figures/Line';
import Checkbox from 'components/Inputs/Checkbox';
import { HomePageOption } from 'types/screens';
import { HomePageOptions } from 'interfaces/screens';
import { homePageInitState } from '../initialStates';
import { getPlaneStringData, storePlaneStringData } from 'utils/localStorage';

const HomePage: FC<HomePageScreenNavigationProp> = ({ navigation }): ReactElement => {
  const [checked, setChecked] = useState<HomePageOptions>({ ...homePageInitState, Rates: true });
  const { t } = useTranslation();

  useLayoutEffect(() => {
    const screenTitle = t('homePageTitle');
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      title: screenTitle,
    });
    async function getStoredPage() {
      const localHomePage = await getPlaneStringData('homePage_screen');
      localHomePage && setChecked({ ...homePageInitState, [localHomePage]: true });
    }
    getStoredPage();
  }, []);

  const onCheckOption = async (value: string) => {
    setChecked({ ...homePageInitState, [value]: !checked[value as HomePageOption] });
    await storePlaneStringData('homePage_screen', value);
  };

  return (
    <View style={styles.container} testID="homePage.Screen">
      {HOMEPAGE_OPTIONS.map(({ title, value }) => {
        return (
          <View key={title} testID={`homePage.${title}`}>
            <View style={styles.optionWrapper}>
              <Text testID={`homePage.tButton.title${title}`} style={styles.optionTitle}>
                {t(title)}
              </Text>
              <Checkbox
                value={checked[value as HomePageOption]}
                onPress={() => onCheckOption(value)}
                text={''}
                flexDirection="row"
              />
            </View>
            <Line />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey.A100,
  },
  optionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    justifyContent: 'space-between',
  },
  optionTitle: {
    marginLeft: 3,
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.mediumSmall14,
    color: colors.grey.c900,
    letterSpacing: 0.5,
  },
});

export default HomePage;
