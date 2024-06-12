import React, { FC, ReactElement, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fontSizes } from 'styles';
import { useTranslation } from 'react-i18next';
import ModalWindow from '../ModalWindow';
import FontAwesomeIcon from 'components/Icons/FontAwesomeIcon';
import { Beneficiary } from 'types/state';
import { navigateType } from 'types/types';
import { deleteBeneficiary } from 'api/BeneficiariesRequests';
import { createButtonAlert } from 'utils/helpers';
import AntDesigns from 'components/Icons/AntDesigns';
import { sendErrorLog } from 'api/LoggerRequests';

const BottomButtonOptionsBeneficiaryDetails: FC<{
  navigation: navigateType;
  beneficiaryDetails: Beneficiary;
}> = ({ navigation, beneficiaryDetails }): ReactElement => {
  const { t } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const removeBeneficiary = async () => {
    setShowDeleteModal(false);
    const response = await deleteBeneficiary(beneficiaryDetails.ID);
    if (response?.data?.Succeeded) {
      navigation.goBack();
    } else {
      if (response?.data === 'Request failed with status code 401') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login', expired: true }],
        });
        await sendErrorLog({
          event: 'beneficiaries bottombutton options - remove beneficiary',
          detail: 'user session expired: ' + response?.data,
        });
      } else {
        createButtonAlert(t('errorCapital'), t('somethingWentWrong'), () => ({}), false);
        await sendErrorLog({
          event: 'beneficiaries bottombutton options - remove beneficiary',
          detail: 'at trying to remove a beneficiary: ' + response?.toString(),
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <ModalWindow
        testId="beneficiaries.editWarningModal"
        isVisible={showEditModal}
        icon={
          <AntDesigns
            testId="settings.infoIcon"
            color={colors.cyan.c600}
            size={46}
            icon="infocirlce"
          />
        }
        title={t('verifyCapital')}
        text={t('verifyTextWarning')}
        buttonAcceptText={t('ok')}
        onButtonAcceptPress={() => {
          setShowEditModal(false);
          navigation.navigate('AddBeneficiaryTopTabbar', {
            beneficiaryId: beneficiaryDetails?.ID,
          });
        }}
      />
      <ModalWindow
        testId="beneficiaries.deleteWarningModal"
        isVisible={showDeleteModal}
        icon={
          <FontAwesomeIcon
            testId="beneficiaries.questionIcon"
            color={colors.cyan.c600}
            size={46}
            icon="question-circle"
          />
        }
        title={t('confirmationCapital')}
        text={t('deleteBenericiaryWarning')}
        buttonAcceptText={t('ok')}
        buttonCancelText={t('cancelCapital') as string}
        onButtonAcceptPress={removeBeneficiary}
        onButtonCancelPress={() => setShowDeleteModal(false)}
      />
      <View style={[styles.buttonOptionWrapper, { flex: 2 }]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('SendPayment', { beneficiary: beneficiaryDetails })}>
          <Text style={styles.textOption}>{t('sendPaymentCapital')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonOptionWrapper}>
        <TouchableOpacity onPress={() => setShowEditModal(true)}>
          <Text style={styles.textOption}>{t('editCapital')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonOptionWrapper}>
        <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
          <Text style={styles.textOption}>{t('deleteCapital')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonOptionWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    flexDirection: 'row',
    backgroundColor: colors.grey.c350,
  },
  textOption: {
    fontSize: fontSizes.medium16,
    fontFamily: 'OpenSans-Regular',
    color: colors.grey.c750,
  },
});

export default BottomButtonOptionsBeneficiaryDetails;
