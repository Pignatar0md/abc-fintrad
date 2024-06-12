import React, { FC, ReactElement } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useTranslation } from 'react-i18next';

import Button from 'components/Buttons/Button';
import IntroSliderItem from 'components/ScreenSlider/IntroSliderItem';
import { IntroSliderImages } from 'components/ScreenSlider/IntroSliderImages';

import { fontSizes, colors } from 'styles';
import { IntroSliderScreenNavigationProp } from 'types/types';
import { SLIDER_WAS_SHOWN, introSlides } from 'utils/static';
import { storePlaneStringData } from 'utils/localStorage';
import { sendSMS } from 'api/ValidationRequests';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import { SliderScreenItem } from 'types/screens';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';

const IntroSlider: FC<IntroSliderScreenNavigationProp> = ({ navigation }): ReactElement => {
  const { t } = useTranslation();

  const renderItem = ({ item }: { item: SliderScreenItem }): ReactElement => {
    const { title, text } = item;
    const slideImage = IntroSliderImages[title];
    return <IntroSliderItem image={slideImage} title={title} text={text} />;
  };

  const renderNextButton = () => (
    <View style={styles.customButtonNextWrapper}>
      <Text style={styles.customButtonNextText}>{t('continue')}</Text>
    </View>
  );

  const onPressNextButton = async (
    sliderShownFlag: '0' | '1',
    screenToNavigate: 'Sidebar' | 'ValidateDevice',
  ) => {
    if (sliderShownFlag === '1') {
      const response = await sendSMS();
      (await response.data)
        ? sendInfoLog({ event: 'SendSMS', detail: 'Success' })
        : sendErrorLog({ event: 'SendSMS', detail: response.toString() });
    }
    await storePlaneStringData(SLIDER_WAS_SHOWN, sliderShownFlag);
    navigation.navigate(screenToNavigate);
  };

  const renderValidateButton = (): ReactElement => (
    <View style={styles.buttonWrapper}>
      <Button
        onPress={() => onPressNextButton('0', 'Sidebar')}
        text={t('skip')}
        testId="introSlider.skipButton"
      />
      <Button
        filled
        onPress={() => onPressNextButton('1', 'ValidateDevice')}
        text={t('validate')}
        testId="introSlider.validateButton"
      />
    </View>
  );

  return (
    <SafeAreaWrapper>
      <AppIntroSlider
        testID="introSlider.slider"
        renderItem={renderItem}
        data={introSlides}
        dotStyle={{ backgroundColor: colors.blueGrey.A800 }}
        renderNextButton={renderNextButton}
        activeDotStyle={{ backgroundColor: colors.cyan.A800 }}
        renderDoneButton={renderValidateButton}
        bottomButton
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  buttonNext: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customButtonNextText: {
    textAlignVertical: 'center',
    textAlign: 'center',
    color: colors.grey.A100,
    padding: 10,
    fontFamily: 'OpenSans-Bold',
    fontSize: fontSizes.large20,
  },
  customButtonNextWrapper: {
    alignSelf: 'center',
    width: '60%',
    borderWidth: 1,
    borderColor: colors.cyan.A800,
    backgroundColor: colors.cyan.A800,
  },
});

export default IntroSlider;
