import React, { FC, ReactElement } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { colors, fontSizes } from 'styles';
import Button from '../Buttons/Button';
import { ModalI } from '../../interfaces/components';
import LightButton from '../Buttons/LightButton';
import { genericFn } from '../../types/components';

const ModalWindow: FC<ModalI> = ({
  testId,
  isVisible,
  icon,
  title,
  text,
  buttonAcceptText,
  buttonCancelText,
  onButtonAcceptPress,
  onButtonCancelPress,
  extraComponent,
}): ReactElement => {
  const renderButtonPair = () => (
    <View style={styles.buttonPairWrapper}>
      <LightButton
        inverted
        onPress={onButtonCancelPress as genericFn}
        text={buttonCancelText as string}
        testId={'paymentDetails.CancelButton'}
      />
      <Button testId="acceptButton" onPress={onButtonAcceptPress} text={buttonAcceptText} filled />
    </View>
  );

  return (
    <Modal isVisible={isVisible} testID={testId}>
      <View style={styles.container}>
        {icon}
        <Text style={styles.titleStyle}>{title}</Text>
        <Text style={styles.textStyle}>{text}</Text>
        {extraComponent && <View style={{ marginVertical: 20 }}>{extraComponent}</View>}
        {buttonCancelText ? (
          renderButtonPair()
        ) : (
          <View style={styles.buttonWrapper}>
            <Button
              testId="acceptButton"
              onPress={onButtonAcceptPress}
              text={buttonAcceptText}
              filled
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: colors.grey.A100,
  },
  titleStyle: {
    color: colors.grey.c999,
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.large20,
    marginTop: 10,
  },
  textStyle: {
    fontSize: fontSizes.mediumSmall14,
    color: colors.grey.c650,
    fontFamily: 'OpenSans-Regular',
    marginTop: 20,
    textAlign: 'center',
    width: 260,
  },
  buttonWrapper: { marginTop: 20, width: '140%', alignItems: 'center' },
  buttonPairWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 14,
  },
});

export default ModalWindow;
