import React, { FC, ReactElement, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EvilIcon from '../../Icons/EvilIcon';
import { colors, fontSizes } from 'styles';
import { useTranslation } from 'react-i18next';
import { DEVICE_WIDTH } from 'utils/static';
import { navigateType } from 'types/types';
import ModalWindow from '../ModalWindow';
import AntDesigns from 'components/Icons/AntDesigns';
import { checkIfValidated, createButtonAlert, sendCodeAndRedirectToValidate } from 'utils/helpers';

const BottomButtonOptionsBeneficiaries: FC<{
  navigation: navigateType;
  searchPress: () => void;
}> = ({ navigation, searchPress }): ReactElement => {
  const { t } = useTranslation();
  const [showValidateModal, setShowValidateModal] = useState(false);
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
        <TouchableOpacity
          onPress={() => 
            checkIfValidated(
              () => navigation.navigate('AddBeneficiaryTopTabbar', { beneficiaryId: 0 }),
              () => setShowValidateModal(true),
          )}>
          <Text style={styles.textOption}>{t('addNew')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={searchPress}>
          <EvilIcon
            icon={'search'}
            color={colors.grey.c750}
            size={24}
            testId={'buttomButtonOptionsBeneficiaries.BottomButtonOptions'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: colors.grey.A100,
  },
  buttonOptionWrapper: {
    width: DEVICE_WIDTH,
    height: 60,
    paddingHorizontal: 90,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: colors.grey.c350,
  },
  textOption: {
    fontSize: fontSizes.medium16,
    fontFamily: 'OpenSans-Regular',
    color: colors.grey.c750,
  },
});

export default BottomButtonOptionsBeneficiaries;
