import React, { FC, ReactElement } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import MonthSelectorCalendar from 'react-native-month-selector';
import Modal from 'react-native-modal';

import MaterialCommunity from 'components/Icons/MaterialCommunity';
import { colors, fontSizes } from 'styles';
import LabelField from 'components/LabelField';
import { MonthYearPickerT } from 'types/components';

const MonthYearPicker: FC<MonthYearPickerT> = ({
  onMonthSelected,
  month,
  format,
  onButtonPress,
  isVisible,
  width,
  height,
  label,
  containerFullWidth,
  maxDate,
}): ReactElement => {
  const { container, calendarButton } = styles;
  const customWidth = containerFullWidth ? [container, { width: '100%' }] : container;
  const customSize = height ? [customWidth, { height }] : customWidth;
  return (
    <View style={{ alignItems: 'flex-start' }}>
      {label && <LabelField labelMode="dark" testId={''} text={label} />}
      <View style={customSize}>
        <TouchableOpacity
          style={width ? [calendarButton, { width }] : calendarButton}
          onPress={onButtonPress}>
          <TextInput
            placeholder="Date"
            editable={false}
            value={month && month.format(format)}
            style={styles.calendarText}
          />
          <MaterialCommunity
            icon={'calendar-blank'}
            color={colors.cyan.A800}
            size={24}
            testId={'component.monthYearPickerField.IconButton'}
          />
        </TouchableOpacity>
        <Modal isVisible={isVisible}>
          <View style={styles.monthYearWrapper}>
            <MonthSelectorCalendar
              selectedDate={month}
              maxDate={maxDate}
              onMonthTapped={onMonthSelected}
              selectedBackgroundColor={colors.cyan.c800}
              containerStyle={styles.calendar}
              currentMonthTextStyle={styles.defaultMonth}
            />
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 54,
    width: 160,
    justifyContent: 'center',
    borderColor: colors.grey.c250,
    borderWidth: 1,
  },
  calendar: {
    shadowColor: colors.grey.c999,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  calendarButton: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthYearWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 50,
    justifyContent: 'center',
  },
  defaultMonth: { color: colors.grey.c999 },
  calendarText: {
    height: 46,
    fontSize: fontSizes.medium16,
    fontFamily: 'OpenSans-Regular',
  },
});

export default MonthYearPicker;
