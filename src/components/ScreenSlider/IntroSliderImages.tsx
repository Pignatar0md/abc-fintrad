import React, { ReactElement } from 'react';
import Home from 'images/onboarding/Home-o.svg';
import SendMoney from 'images/onboarding/Send-money.svg';
import EasyAccess from 'images/onboarding/Easy-access.svg';
import Security from 'images/onboarding/Security.svg';
import { View } from 'react-native';
import { SliderScreens } from 'utils/Enums';

export const IntroSliderImages: { [a: string]: ReactElement } = {
  [SliderScreens.HomePage]: <Home height={200} width={100} />,
  [SliderScreens.SendMoney]: <SendMoney height={200} width={100} />,
  [SliderScreens.EasyAccess]: <EasyAccess height={200} width={100} />,
  [SliderScreens.ValidateDevice]: (
    <View style={{ width: 100, height: 110, marginVertical: 30 }}>
      <Security height={200} width={200} />
    </View>
  ),
};
