import React, { FC, ReactElement, useContext, useLayoutEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Swipeable } from 'react-native-gesture-handler';

import WrappedQuickLinks from 'components/Prebuilts/WrappedQuickLinks';
import BottomButtonOptionsBeneficiaries from 'components/Prebuilts/BottomButtonsBar/BottomButtonOptionsBeneficiaries';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import RowButton from 'components/Buttons/Beneficiaries/RowButton';
import RowInfoWrapper from 'components/Table/RowInfoWrapper';
import Cell from 'components/Table/Cell';
import MaterialIcon from 'components/Icons/MaterialIcon';
import Row from 'components/Table/Beneficiaries/Row';
import ActionButton from 'components/Table/ActionButton';
import Line from 'components/Figures/Line';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import FontAwesomeIcon from 'components/Icons/FontAwesomeIcon';
import LoadingIndicator from 'components/LoadingIndicator';
import NoTransactionsText from 'components/Texts/NoTransactionsText';

import { BeneficiariesContext } from 'state/BeneficiariesContext';
import { DEFAULT_HEADER_CONFIG } from 'utils/static';
import { BeneficiaryListScreenNavigationProp } from 'types/types';
import { colors } from 'styles';
import { deleteBeneficiary, getBeneficiaryList } from 'api/BeneficiariesRequests';
import { checkIfValidated, createButtonAlert, sendCodeAndRedirectToValidate } from 'utils/helpers';
import AntDesigns from 'components/Icons/AntDesigns';
import { Beneficiary } from 'types/state';
import Searchbar from 'components/Inputs/Searchbar';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';

const Beneficiaries: FC<BeneficiaryListScreenNavigationProp> = ({ navigation }): ReactElement => {
  const { t } = useTranslation();

  const { beneficiariesInfo, setBeneficiaryListError, setBeneficiaryList } =
    useContext(BeneficiariesContext);
  const [showValidateModal, setShowValidateModal] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      header: () => <WrappedQuickLinks />,
    });
  }, []);

  const getListOfBeneficiaries = async () => {
    setLoading(true);
    const response = await getBeneficiaryList();
    if (response?.data?.Succeeded) {
      setBeneficiaryList(response.data.Data);
    } else {
      if (response.data === 'Request failed with status code 401') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login', expired: true }],
        });
        await sendErrorLog({
          event: 'getBeneficiaryList getListOfBeneficiaries - Beneficiaries',
          detail: 'user session expired: ' + response?.data,
        });
      } else {
        await sendErrorLog({
          event: 'getBeneficiaryList getListOfBeneficiaries - Beneficiaries',
          detail: 'at trying to get beneficiaries list: ' + response?.data,
        });
        setBeneficiaryListError(response.data.Message);
      }
    }
    setLoading(false);
  };

  const [userInput, setUserInput] = useState<string>('');
  const [hideSearch, setHideSearch] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<{ show: boolean; beneficiaryId: number }>({
    show: false,
    beneficiaryId: 0,
  });
  const [showDeleteModal, setShowDeleteModal] = useState<{ show: boolean; beneficiaryId: number }>({
    show: false,
    beneficiaryId: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);

  let row: number[] = [];
  let prevOpenedRow: any;
  const closeRow = (index: number) => {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  const filterData = (item: Beneficiary, index: number) => {
    if (userInput === '') {
      return (
        <Swipeable
          renderRightActions={(progress, dragX) => renderHiddenItem(item)}
          onSwipeableOpen={() => closeRow(index)}
          ref={(ref: any) => (row[index] = ref)}>
          <RowButton
            onPress={() =>
              navigation.navigate('BeneficiaryDetailsTopTabbar', { beneficiary: item })
            }
            pressed={''}
            id={index}>
            <>
              <View style={{ flex: 2 }}>
                <RowInfoWrapper>
                  <View style={styles.currencyWrapper}>
                    <Cell info={item.CurrencyCode} color={colors.grey.c750} />
                  </View>
                  <View style={styles.balanceWrapper}>
                    <Cell info={item.BeneficiaryName} color={colors.grey.c750} />
                  </View>
                  <View style={styles.dotWrapper}>
                    <MaterialIcon
                      icon={'circle'}
                      color={item.AddressValidated ? colors.green.c600 : colors.grey.c680}
                      size={9}
                      testId={'beneficiaries.Circle'}
                    />
                  </View>
                  <View style={styles.arrowWrapper}>
                    <MaterialIcon
                      icon={'keyboard-arrow-right'}
                      color={colors.blueGrey.c250}
                      size={20}
                      testId={'beneficiaries.iconButton.OpenRateArrow'}
                    />
                  </View>
                </RowInfoWrapper>
                <Line />
              </View>
            </>
          </RowButton>
        </Swipeable>
      );
    }
    if (item.BeneficiaryName.toLowerCase().includes(userInput.toLowerCase())) {
      return (
        <Swipeable
          renderRightActions={(progress, dragX) => renderHiddenItem(item)}
          onSwipeableOpen={() => closeRow(index)}
          ref={(ref: any) => (row[index] = ref)}>
          <RowButton
            onPress={() =>
              navigation.navigate('BeneficiaryDetailsTopTabbar', { beneficiary: item })
            }
            pressed={''}
            id={item.ID}>
            <>
              <View style={{ flex: 2 }}>
                <RowInfoWrapper>
                  <View style={styles.currencyWrapper}>
                    <Cell info={item.ID.toString()} color={colors.grey.c750} />
                  </View>
                  <View style={styles.balanceWrapper}>
                    <Cell info={item.BeneficiaryName} color={colors.grey.c750} />
                  </View>
                  <View style={styles.dotWrapper}>
                    <MaterialIcon
                      icon={'circle'}
                      color={item.AddressValidated ? colors.green.c600 : colors.grey.c680}
                      size={9}
                      testId={'beneficiaries.Circle'}
                    />
                  </View>
                  <View style={styles.arrowWrapper}>
                    <MaterialIcon
                      icon={'keyboard-arrow-right'}
                      color={colors.blueGrey.c250}
                      size={20}
                      testId={'beneficiaries.iconButton.OpenRateArrow'}
                    />
                  </View>
                </RowInfoWrapper>
                <Line />
              </View>
            </>
          </RowButton>
        </Swipeable>
      );
    } else {
      return <View />;
    }
  };

  const renderRow = ({ item, index }: { item: Beneficiary; index: number }) =>
    filterData(item, index);

  const renderHiddenItem = (item: Beneficiary) => {
    const { backRightBtnRight, backRightBtnCenter, backRightBtnLeft } = styles;
    return (
      <View style={styles.buttonsWrapper}>
        <ActionButton
          onPress={() =>
            navigation.navigate('SendPayment', { beneficiaryId: item.ID, CCY: item.CurrencyCode })
          }
          buttonText={t('Send payment')}
          customStyle={backRightBtnLeft}
        />
        <ActionButton
          onPress={() => 
            checkIfValidated(
              () => setShowEditModal({ show: true, beneficiaryId: item.ID }),
              () => setShowValidateModal(true),
          )}
          buttonText={t('editCapital')}
          customStyle={backRightBtnCenter}
        />
        <ActionButton
          onPress={() => setShowDeleteModal({ show: true, beneficiaryId: item.ID })}
          buttonText={t('deleteCapital')}
          customStyle={backRightBtnRight}
        />
      </View>
    );
  };

  const removeBeneficiary = async () => {
    setShowDeleteModal({ ...showDeleteModal, show: false });
    const response = await deleteBeneficiary(showDeleteModal.beneficiaryId);
    if (response?.data?.Succeeded) {
      getListOfBeneficiaries();
      await sendInfoLog({
        event: 'removeBeneficiary deleteBeneficiary - Beneficiaries',
        detail: 'User could remove a beneficiary',
      });
    } else {
      if (response.data === 'Request failed with status code 401') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login', expired: true }],
        });
        await sendErrorLog({
          event: 'removeBeneficiary deleteBeneficiary - Beneficiaries',
          detail: 'user session expired: ' + response?.data,
        });
      } else {
        await sendErrorLog({
          event: 'getBeneficiaryList getListOfBeneficiaries - Beneficiaries',
          detail: 'at trying to remove a beneficiary: ' + response?.data,
        });
        createButtonAlert(t('errorCapital'), t('somethingWentWrong'), () => ({}), false);
      }
    }
  };

  if (loading) {
    return <LoadingIndicator background="white" size={'small'} testId={'loadingCcyCards'} />;
  }

  return (
    <SafeAreaWrapper>
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
      <ModalWindow
        testId="beneficiaries.editWarningModal"
        isVisible={showEditModal.show}
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
          setShowEditModal({ ...showEditModal, show: false });
          navigation.navigate('AddBeneficiaryTopTabbar', {
            beneficiaryId: showEditModal.beneficiaryId,
          });
        }}
      />
      <ModalWindow
        testId="beneficiaries.deleteWarningModal"
        isVisible={showDeleteModal.show}
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
        onButtonCancelPress={() =>
          setShowDeleteModal({ ...showDeleteModal, show: !showDeleteModal.show })
        }
      />
      <Row testId='beneficiaries.ListContainer'>
        <View style={styles.flatListWrapper}>
          {beneficiariesInfo?.beneficiaryList?.length === 0 ? (
            <View style={{ flex: 1, backgroundColor: colors.grey.A100 }}>
              <NoTransactionsText message={t('noBeneficiariesAdded')} />
            </View>
          ) : (
            <FlatList data={beneficiariesInfo?.beneficiaryList} renderItem={renderRow} />
          )}
        </View>
      </Row>
      {hideSearch && (
        <Searchbar onChangeText={setUserInput} onPressBack={() => setHideSearch(false)} />
      )}
      {!hideSearch && (
        <BottomButtonOptionsBeneficiaries
          navigation={navigation}
          searchPress={() => setHideSearch(true)}
        />
      )}
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  flatListWrapper: { flex: 3, width: '100%' },
  rowExtraInfoWrapper: { flex: 1, flexDirection: 'row' },
  extraInfoWrapper: {
    flex: 2,
    backgroundColor: colors.blueGrey.c50,
    borderWidth: 1,
    borderColor: colors.blueGrey.c100,
  },
  currencyWrapper: { flex: 2, paddingLeft: 20, justifyContent: 'center' },
  balanceWrapper: { flex: 4, alignItems: 'flex-start' },
  dotWrapper: { flex: 1, alignItems: 'flex-end' },
  arrowWrapper: { flex: 1, alignItems: 'flex-end', marginRight: 20 },
  buttonsWrapper: {
    alignItems: 'center',
    backgroundColor: colors.grey.A100,
    width: 216,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtnLeft: {
    backgroundColor: colors.blue.c650,
    right: 146,
  },
  backRightBtnCenter: {
    backgroundColor: colors.blue.c650,
    right: 74,
  },
  backRightBtnRight: {
    backgroundColor: colors.red.A400,
    right: 2,
  },
});

export default Beneficiaries;
