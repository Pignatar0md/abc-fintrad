import 'intl';
import 'intl/locale-data/jsonp/en';

export const formatDate = (date: string) => {
  const selectedDate = new Date(date);
  const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(selectedDate);
  const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(selectedDate);
  const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(selectedDate);
  return `${day}-${month}-${year}`;
};

export const convertMsToMMSS = (milliseconds: number) => {
  const padTo2Digits = (num: number) => num.toString().padStart(2, '0');
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);

  seconds = seconds % 60;
  minutes = seconds >= 30 ? minutes + 1 : minutes;
  minutes = minutes % 60;
  return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
};

export const getLastDayOfMonth = (year: number, month: number) => {
  const date = new Date(year, month + 1, 0);
  return date.getDate();
};
