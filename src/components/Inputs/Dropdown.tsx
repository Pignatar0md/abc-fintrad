import React, { FC, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import LabelField from 'components/LabelField';
import MaterialIcon from 'components/Icons/MaterialIcon';
import { colors, fontSizes } from 'styles';
import { IDropDown } from 'interfaces/components';

const Dropdown: FC<IDropDown> = ({
  items,
  onChange,
  testId,
  placeholder,
  dropDownLabel,
  defaultValue,
  disabled,
  ddWidth,
  ddHeight,
  showBorder,
  defaultMargin,
}): ReactElement => {
  const mainStyle = showBorder ? styles.container : [styles.container, { borderWidth: 0 }];
  const widthMainStyle = ddWidth ? [mainStyle, { width: ddWidth }] : [mainStyle, { width: '100%' }];
  return (
    <View testID={testId} style={{ marginHorizontal: defaultMargin ? 10 : 0 }}>
      {typeof dropDownLabel === 'string' ? (
        <LabelField labelMode="dark" testId={'dropdown.Label'} text={dropDownLabel} />
      ) : (
        dropDownLabel
      )}
      <View style={widthMainStyle}>
        <SelectDropdown
          defaultValue={defaultValue}
          disabled={disabled}
          defaultButtonText={placeholder}
          buttonStyle={{
            width: '100%',
            backgroundColor: colors.grey.A100,
            height: ddHeight ?? 40,
          }}
          buttonTextStyle={{
            textAlign: 'left',
            fontSize: fontSizes.mediumSmall14,
            fontFamily: 'OpenSans-Regular',
          }}
          data={items}
          onSelect={onChange}
          buttonTextAfterSelection={(selectedItem) => selectedItem.label}
          rowTextForSelection={(item) => item.label}
          renderDropdownIcon={() => (
            <MaterialIcon
              testId="component.DropDown"
              size={20}
              icon="arrow-drop-down"
              color={colors.cyan.A800}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.blueGrey.c200,
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default Dropdown;
