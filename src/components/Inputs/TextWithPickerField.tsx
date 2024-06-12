import React, { FC, ReactElement } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { colors, fontSizes } from 'styles';
import { TextWithPicker } from 'types/components';
import Dropdown from './Dropdown';

const TextWithPickerField: FC<TextWithPicker> = ({
  dropDownPlaceHolder,
  textPlaceHolder,
  itemsList,
  preSelected,
  value,
  setValue,
  setSelected,
  dropdownWidth,
  dropdownHeight,
  textEditable,
}): ReactElement => {
  return (
    <View style={styles.wrapper}>
      <Dropdown
        defaultValue={preSelected}
        items={itemsList}
        onChange={setSelected}
        ddHeight={dropdownHeight}
        showBorder={false}
        ddWidth={dropdownWidth}
        placeholder={dropDownPlaceHolder ?? ''}
        dropDownLabel={undefined}
        defaultMargin
      />
      <TextInput
        style={styles.input}
        editable={textEditable}
        placeholderTextColor={colors.grey.c650}
        keyboardType={'decimal-pad'}
        autoComplete={'off'}
        placeholder={textPlaceHolder}
        value={value}
        onChangeText={setValue}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
    width: 240,
    borderColor: colors.grey.c250,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
  },
  input: {
    width: 110,
    paddingRight: 16,
    fontSize: fontSizes.medium16,
    textAlign: 'right',
    fontFamily: 'OpenSans-Regular',
  },
});

export default TextWithPickerField;
