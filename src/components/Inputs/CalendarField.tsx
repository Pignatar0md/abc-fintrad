import MaterialCommunity from 'components/Icons/MaterialCommunity';
import LabelField from 'components/LabelField';
import { CalendarFieldI } from 'interfaces/components';
import React, { FC, ReactElement, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { colors } from 'styles';
import { formatDate } from 'utils/helpers/dates';

const CalendarField: FC<CalendarFieldI> = ({
  onChange,
  value,
  testId,
  width,
  label,
}): ReactElement => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    onChange(date + '');
    hideDatePicker();
  };
  const custonWrapper = width ? [styles.wrapper, { width }] : styles.wrapper;
  return (
    <>
      {!!label && <LabelField labelMode="dark" testId={''} text={label} />}
      <View testID={testId} style={custonWrapper}>
        <TextInput editable={false} value={formatDate(value + '')} style={styles.calendarText} />
        <TouchableOpacity style={styles.calendarButton} onPress={showDatePicker}>
          <MaterialCommunity
            icon={'calendar-blank'}
            color={colors.cyan.A800}
            size={24}
            testId={'component.calendarField.IconButton'}
          />
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 54,
    width: 300,
    borderColor: colors.grey.c250,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: colors.grey.A100,
    flexDirection: 'row',
  },
  calendarButton: {
    width: 30,
    height: 30,
    marginRight: 8,
    position: 'relative',
    justifyContent: 'center',
  },
  calendarText: { marginLeft: 10, width: 180, height: 46 },
});

export default CalendarField;
