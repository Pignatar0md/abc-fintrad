import React, { FC, ReactElement } from 'react';
import CountryPicker from 'react-native-country-picker-modal';
import TextField from './TextField';
import { StyleSheet, View } from 'react-native';
import { colors } from 'styles';
import { CountrySearchablePickerI } from 'interfaces/components';

export const TranslationLanguageCodeList = [
  'common',
  'cym',
  'deu',
  'fra',
  'hrv',
  'ita',
  'jpn',
  'nld',
  'por',
  'rus',
  'spa',
  'svk',
  'fin',
  'zho',
  'isr',
] as const;

const CountrySeachablePicker: FC<CountrySearchablePickerI> = ({
  searchEnabled,
  value,
  onChange,
  testId,
  placeHolder,
}): ReactElement => {
  return (
    <View style={styles.container} testID={testId}>
      <TextField
        keyboardType={'default'}
        value={value.name as string}
        editable={false}
        onChangeText={() => console.log('Function not implemented.')}
        placeHolder={placeHolder as string}
        testId={'countrySearchablePicker.InputText'}
      />
      {searchEnabled && (
        <CountryPicker
          onSelect={onChange}
          withFilter
          modalProps={{ transparent: true }}
          countryCode={'ID'}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.blueGrey.c200,
    borderWidth: 1,
    paddingRight: 15,
    justifyContent: 'space-between',
  },
});

export default CountrySeachablePicker;
