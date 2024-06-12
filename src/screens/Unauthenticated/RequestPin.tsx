import React, { FC, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import LinkButton from 'components/Buttons/LinkButton';
import PinWrapper from 'components/Wrappers/PinWrapper';
import PinComponent from 'components/Prebuilts/PinComponent';

import VFXLogo from 'images/VFXF-R_Logo-WHITE.svg';
import { colors } from 'styles';
import { RequestPinNavigationProp } from 'types/types';

const { cyan, blueGrey, grey, blue } = colors;

const RequestPin: FC<RequestPinNavigationProp> = ({ navigation, route }): ReactElement => {
  const { t } = useTranslation();

  const onSuccess = () => {
    route?.params?.callback && route?.params?.callback();
    route?.params?.screen && navigation.navigate(route?.params?.screen as any);
  };

  return (
    <PinWrapper testId="requestPin.PinWrapper" background="dark">
      <>
        <View style={styles.logoWrapper}>
          <VFXLogo width={180} height={100} />
        </View>
        <View style={styles.pinWrapper}>
          <PinComponent
            onSuccess={onSuccess}
            status="enter"
            dotActive={cyan.A800}
            dotInactive={blueGrey.A800}
            colorDigits={grey.A100}
            titleColor={grey.A100}
            storedPinCodeName="pinNumber"
            backgroundColorDigits={blue.c999}
            backgroundColorDigitsPressed={blue.c999}
            titleEnter={t('enterPinTitle') as string}
            colorDeleteButton={grey.A100}
            colorDeleteButtonPressed={grey.c200}
          />
        </View>
        <View style={styles.buttonWrapper}>
          {route?.params?.from === 'Login' && (
            <LinkButton
              testId="requestPin.classicLogin"
              text={t('authenticateUsingPassword')}
              onPress={() => navigation.navigate('Login')}
            />
          )}
        </View>
      </>
    </PinWrapper>
  );
};

const styles = StyleSheet.create({
  logoWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  pinWrapper: {
    flex: 3,
  },
  buttonWrapper: { flex: 1, justifyContent: 'center' },
});

export default RequestPin;
