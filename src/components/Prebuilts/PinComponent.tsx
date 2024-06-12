import React, { FC, ReactElement } from 'react';
import PINCode from '@haskkor/react-native-pincode';
import { PinComponentI } from 'interfaces/components';

const PinComponent: FC<PinComponentI> = ({
  onSuccess,
  status,
  titleChoose,
  dotActive,
  dotInactive,
  titleColor,
  colorDigits,
  backgroundColorDigits,
  backgroundColorDigitsPressed,
  storedPinCodeName,
  colorDeleteButton,
  colorDeleteButtonPressed,
  titleEnter,
  titleChoose2,
}): ReactElement => {
  const isChooseMode = status === 'choose';
  return (
    <PINCode
      status={status}
      pinCodeKeychainName={storedPinCodeName}
      titleChoose={titleChoose}
      titleConfirm={titleChoose2 && titleChoose2}
      titleEnter={titleEnter ?? undefined}
      stylePinCodeColorTitle={titleColor}
      finishProcess={onSuccess}
      stylePinCodeButtonCircle={{ backgroundColor: backgroundColorDigits }}
      stylePinCodeButtonNumber={colorDigits}
      stylePinCodeButtonNumberPressed={colorDeleteButton}
      stylePinCodeCircle={{ width: 20, height: 20, borderRadius: 10 }}
      iconButtonDeleteDisabled={isChooseMode ? true : false}
      buttonDeleteText=" "
      stylePinCodeColumnDeleteButton={{ marginTop: 14 }}
      stylePinCodeDeleteButtonSize={40}
      stylePinCodeDeleteButtonColorHideUnderlay={colorDeleteButton}
      stylePinCodeDeleteButtonColorShowUnderlay={colorDeleteButtonPressed}
      subtitleChoose=" "
      colorPassword={dotActive}
      numbersButtonOverlayColor={backgroundColorDigitsPressed}
      colorPasswordEmpty={dotInactive}
    />
  );
};

export default PinComponent;
