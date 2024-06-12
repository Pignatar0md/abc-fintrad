import moment from 'moment';
import { useState } from 'react';

export const useDate = () => {
  const [showMonthYear, setShowMonthYear] = useState(false);
  const [date, setDate] = useState<moment.Moment>(moment());

  const onSelectMonth = (selectedDate: moment.Moment) => {
    setDate(selectedDate);
    setShowMonthYear(!showMonthYear);
  };

  const switchMonthYearPickerVisible = () => setShowMonthYear(!showMonthYear);

  return {
    showMonthYear,
    setShowMonthYear,
    date,
    onSelectMonth,
    switchMonthYearPickerVisible,
  };
};
