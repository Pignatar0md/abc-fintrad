import React, { FC, ReactElement, useEffect, useLayoutEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import AntDesigns from 'components/Icons/AntDesigns';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import BottomButtonOptionsCardDetails from 'components/Prebuilts/BottomButtonsBar/BottomButtonOptionsCardDetails';

import { deleteDebitCardRequest } from 'api/CardRequests';
import { colors, fontSizes } from 'styles';
import { DebitCardDetailsNavigationProp } from 'types/types';
import {
  DEFAULT_ADDRESS1,
  DEFAULT_ADDRESS2,
  DEFAULT_CITY,
  DEFAULT_HEADER_CONFIG,
} from 'utils/static';
import FontAwesomeIcon from 'components/Icons/FontAwesomeIcon';
import { DebitCard } from 'types/state';
import { debitCardItemInitialState } from '../../initialStates';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';
import { getCardImageByType } from 'utils/cards';
import { getPlaneObjectData, storePlaneObjectData } from 'utils/localStorage';
import { DEFAULT_POSTCODE } from 'utils/static';

const DebitCardDetails: FC<DebitCardDetailsNavigationProp> = ({
  navigation,
  route,
}): ReactElement => {
  const { t } = useTranslation();
  const [showRequestPassModal, setShowRequestPassModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [debitCard, setDebitCard] = useState<DebitCard>(debitCardItemInitialState);

  const screenTitle = t('cardDetails');
  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      title: screenTitle,
    });
  }, []);

  useEffect(() => {
    const getDebitCardDetails = async () => {
      route?.params?.item && (await storePlaneObjectData('debitCardItem', route?.params?.item));
      const itemFromStore = await getPlaneObjectData('debitCardItem');
      setDebitCard(itemFromStore);
    };
    getDebitCardDetails();
  }, []);

  const deleteDebitCard = async () => {
    const response = await deleteDebitCardRequest(debitCard.ID.toString());
    if (response?.data?.Succeeded) {
      await sendInfoLog({
        event: 'DeleteDebitCard',
        detail: `The user deleted the debit card (cardID: ${debitCard.ID})`,
      });
      navigation.goBack();
    } else {
      await sendErrorLog({
        event: 'DeleteDebitCard',
        detail: `At trying to delete the debit card (cardID: ${debitCard.ID})`,
      });
      setShowErrorModal(true);
    }
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <ModalWindow
          testId="requestCcyCard.ModalCardErrorAtRequesting"
          isVisible={showErrorModal}
          icon={
            <AntDesigns
              testId="requestCcyCard.exclamationWarning"
              color={colors.cyan.c600}
              size={46}
              icon="infocirlce"
            />
          }
          title={t('errorCapital')}
          text={t('somethingWentWrong')}
          buttonAcceptText={t('ok')}
          onButtonAcceptPress={() => setShowErrorModal(!showErrorModal)}
        />
        <ModalWindow
          testId="trade.redirectWebBrowser"
          isVisible={showDeleteModal}
          icon={
            <FontAwesomeIcon
              testId="sendPayment.exclamationWarning"
              color={colors.cyan.c700}
              size={46}
              icon="question-circle"
            />
          }
          title={t('confirmationCapital')}
          text={t('cardWillBeRemoved')}
          buttonAcceptText="Yes"
          buttonCancelText="No"
          onButtonAcceptPress={deleteDebitCard}
          onButtonCancelPress={() => setShowDeleteModal(false)}
        />
        <ModalWindow
          testId="trade.redirectWebBrowser"
          isVisible={showRequestPassModal}
          icon={
            <AntDesigns
              testId="sendPaymentDetails.checkCircle"
              color={colors.cyan.c700}
              size={46}
              icon="checkcircle"
            />
          }
          title={t('getCcyCardPin')}
          text={t('pleaseEnterPass')}
          buttonAcceptText={t('ok')}
          onButtonAcceptPress={() => setShowRequestPassModal(false)}
        />
        <View style={styles.container}>
          <View style={styles.virtualCard}>
            <View style={styles.cardNumberTextWrapper}>
              <Text style={styles.cardNumberText}>
                {`**** **** **** ${debitCard.CardNumber.slice(-4)}`}
              </Text>
            </View>
            <View style={styles.dataImageWrapper}>
              <View style={styles.nameDueDateContainer}>
                <Text style={styles.cardNameText}>{debitCard.Name.toUpperCase()}</Text>
                <Text style={styles.cardExpiresText}>
                  {debitCard.ExpiryDate.substring(0, 2)}/{debitCard.ExpiryDate.substring(2, 4)}
                </Text>
              </View>
              <View style={styles.cardImageTypeWrapper}>
                <Image source={getCardImageByType(debitCard.Type)} style={styles.cardLogo} />
              </View>
            </View>
          </View>
          <View style={styles.vfxLocationInfoWrapper}>
            <View>
              <Text style={styles.vfxLocationInfoText}>{t('addressCapital')}</Text>
            </View>
            <View>
              <Text style={styles.vfxLocationInfoText}>
                {DEFAULT_ADDRESS1} {DEFAULT_ADDRESS2}
              </Text>
              <Text style={styles.vfxLocationInfoText}>{DEFAULT_CITY}</Text>
              <Text style={styles.vfxLocationInfoText}>{DEFAULT_POSTCODE}</Text>
            </View>
          </View>
        </View>
        <BottomButtonOptionsCardDetails
          textOpt1={t('deleteDebitCard') as string}
          onPressOpt1={() => setShowDeleteModal(true)}
        />
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.grey.A100, paddingTop: 10 },
  virtualCard: {
    height: 230,
    ali: 'center',
    borderRadius: 10,
    backgroundColor: colors.grey.c750,
    margin: 20,
    padding: 20,
    shadowColor: colors.grey.c999,
    shadowOffset: {
      width: 3,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 19,
  },
  cardNumberText: {
    color: colors.grey.A100,
    fontSize: fontSizes.smallHuge24,
    letterSpacing: 2.5,
  },
  cardNameText: {
    color: colors.grey.A100,
    marginBottom: 20,
    fontSize: fontSizes.mediumLarge18,
    fontFamily: 'OpenSans-Regular',
  },
  cardImageTypeWrapper: { flex: 1, alignItems: 'flex-end' },
  cardExpiresText: {
    color: colors.grey.A100,
    fontSize: fontSizes.medium16,
    fontFamily: 'OpenSans-Regular',
  },
  vfxLocationInfoWrapper: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginHorizontal: 5,
  },
  vfxLocationInfoText: {
    color: colors.grey.c800,
    letterSpacing: 0.4,
    fontSize: fontSizes.medium16,
  },
  cardNumberTextWrapper: { flex: 1, justifyContent: 'flex-end' },
  nameDueDateContainer: { flex: 1 },
  cardLogo: { height: 45, width: 70 },
  dataImageWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});

export default DebitCardDetails;
