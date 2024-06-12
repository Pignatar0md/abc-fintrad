import React, { FC, ReactElement, useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PinWrapper from 'components/Wrappers/PinWrapper';
import AntDesigns from 'components/Icons/AntDesigns';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import PinComponent from 'components/Prebuilts/PinComponent';

import { SetPinNavigationProp } from 'types/types';
import { DEFAULT_HEADER_CONFIG } from 'utils/static';
import { hasConfiguredPinCode, removeConfiguredPinCode } from 'utils/pin';
import { colors } from 'styles';

const { cyan, grey } = colors;

const SetPin: FC<SetPinNavigationProp> = ({ navigation }): ReactElement => {
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [dynamicStatus, setDynamicStatus] = useState<'choose' | 'enter'>('choose');
  const { t } = useTranslation();

  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_CONFIG,
      headerBackTitleVisible: false,
      title: t('pinTitle') as string,
    });
  }, []);

  useEffect(() => {
    async function getLocalAuthInfo() {
      const areTherePin = await hasConfiguredPinCode('pinNumber');
      areTherePin && setDynamicStatus('enter');
    }
    getLocalAuthInfo();
  }, [dynamicStatus]);

  const isDynamicStatusEnter = dynamicStatus === 'enter';

  const onPressOkSuccess = () => {
    navigation.goBack();
    setShowSuccessModal(false);
  };

  const runSuccessBasedOnStatus = () => {
    if (isDynamicStatusEnter) {
      removeConfiguredPinCode('pinNumber');
      setDynamicStatus('choose');
    } else {
      setShowSuccessModal(true);
    }
  };

  return (
    <PinWrapper testId="screens.SetPin" background="light">
      <>
        <ModalWindow
          testId="setPin.successModal"
          isVisible={showSuccessModal}
          icon={
            <AntDesigns testId="setPin.pinSuccess" color={cyan.c800} size={46} icon="infocirlce" />
          }
          title={t('successCapital')}
          text={t('pinEnabled')}
          buttonAcceptText={t('ok')}
          onButtonAcceptPress={onPressOkSuccess}
        />
        <PinComponent
          onSuccess={() => runSuccessBasedOnStatus()}
          status={dynamicStatus}
          dotActive={cyan.A800}
          dotInactive={grey.c700}
          colorDigits={grey.c900}
          titleColor={grey.c900}
          storedPinCodeName="pinNumber"
          backgroundColorDigits={grey.A100}
          backgroundColorDigitsPressed={grey.A100}
          titleChoose={isDynamicStatusEnter ? '' : (t('setPinTitle') as string)}
          titleChoose2={t('confirmPinTitle') as string}
          titleEnter={isDynamicStatusEnter ? t('enterCurrentPinTitle') : ''}
          colorDeleteButton={grey.c700}
          colorDeleteButtonPressed={grey.c400}
        />
      </>
    </PinWrapper>
  );
};

export default SetPin;
