import 'intl';
import 'intl/locale-data/jsonp/en';

export const formatBalance = (balance: number) => {
  const defaultFormat = {
    roundingPriority: 'lessPrecision',
    minimumFractionDigits: 2,
    minimumSignificantDigits: 2,
  };
  const formattedBalance = new Intl.NumberFormat('en-EN', defaultFormat).format(balance);
  return formattedBalance;
};

export const currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'GBP',
});
