import React, { FC, ReactElement, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { colors, fontSizes } from 'styles';
import { DEVICE_WIDTH } from 'utils/static';
import ModalWindow from '../ModalWindow';
import AntDesigns from 'components/Icons/AntDesigns';
import { checkIfValidated, createButtonAlert, sendCodeAndRedirectToValidate } from 'utils/helpers';

const BottomButtonOption: FC<{
  buttonTitle: string;
  route: 'AddDebitCardBottomTabbar' | 'RequestCcyCard' | 'AddOrder';
}> = ({ buttonTitle, route }): ReactElement => {
  const [showValidateModal, setShowValidateModal] = useState(false);
  const navigation: { navigate: (a: string) => void } = useNavigation();
  const { t } = useTranslation();

  const redirectOrAskForValidation = () => {
    if (route === 'RequestCcyCard') {
      checkIfValidated(
        () => navigation.navigate(route),
        () => setShowValidateModal(true),
      );
    } else {
      navigation.navigate(route);
    }
  };

  return (
    <View style={styles.container}>
      <ModalWindow
        testId="sendPayment.validateDevice"
        isVisible={showValidateModal}
        icon={
          <AntDesigns
            testId="sendPayment.exclamationWarning"
            color={colors.cyan.c800}
            size={46}
            icon="infocirlce"
          />
        }
        title={t('validationCapital')}
        text={t('featureRequiresDeviceValidation')}
        buttonAcceptText={t('Validate')}
        buttonCancelText={t('skipCapital') as string}
        onButtonAcceptPress={() =>
          sendCodeAndRedirectToValidate(
            () => navigation.navigate('ValidateDevice'),
            () => setShowValidateModal(false),
            () => createButtonAlert(t('errorCapital'), t('somethingWentWrong')),
          )
        }
        onButtonCancelPress={() => setShowValidateModal(false)}
      />
      <View style={styles.buttonOptionWrapper}>
        <TouchableOpacity onPress={() => redirectOrAskForValidation()}>
          <Text style={styles.textOption}>{t(buttonTitle)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grey.A100,
  },
  buttonOptionWrapper: {
    width: DEVICE_WIDTH,
    height: 60,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: colors.grey.c350,
  },
  textOption: {
    fontSize: fontSizes.medium16,
    fontFamily: 'OpenSans-Regular',
    color: colors.grey.c750,
  },
});

export default BottomButtonOption;
