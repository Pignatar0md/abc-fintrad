import React, { FC, ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, fontSizes } from 'styles';

const ContactInfo: FC = (): ReactElement => {
  const { t } = useTranslation();
  const { title, phoneNumber, supportTimes, container } = styles;
  return (
    <View testID="contactInfo.wrapper" style={container}>
      <Text testID="contactInfo.title" style={title}>
        {t('cantFindAnswer')}
      </Text>
      <Text testID="contactInfo.phoneNumber" style={phoneNumber}>
        {t('contactPhoneNumber')}
      </Text>
      <Text testID="contactInfo.supportTimeInfo" style={supportTimes}>
        {t('contactSupportTime')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey.A100,
    padding: 30,
  },
  title: {
    fontSize: fontSizes.mediumSmall14,
    fontFamily: 'OpenSans-Regular',
    letterSpacing: 0.7,
    marginBottom: 8,
    color: colors.grey.c680,
  },
  phoneNumber: {
    fontSize: fontSizes.extraLarge22,
    fontFamily: 'OpenSans-Regular',
    color: colors.cyan.A800,
  },
  supportTimes: {
    fontSize: fontSizes.mediumSmall14,
    marginVertical: 8,
    fontFamily: 'OpenSans-Bold',
    letterSpacing: 0.7,
    color: colors.grey.c800,
  },
});

export default ContactInfo;
