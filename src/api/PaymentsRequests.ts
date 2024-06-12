import { secureRetrieve } from 'utils/localStorage';
import Http from './HttpAdapter';
import { VFX_API_URLS, URLS } from 'utils/urls';
import { InputUserToSendPayment } from 'types/screens';
import { formatDate } from 'utils/helpers/dates';

export const sendPayment = async (paymentInfo: InputUserToSendPayment) => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const today = new Date();
  const selectedDate = formatDate(today.toString()).split('-');
  const data = {
    PayeeID: paymentInfo.payeeId,
    Value_Year: selectedDate[2],
    Value_Month: selectedDate[1],
    Value_Day: selectedDate[0],
    CCY: paymentInfo.CCY,
    Amount: parseFloat(paymentInfo.amount.replace(/,/g, '')),
    Reference1: paymentInfo.firstReference,
    Reference2: paymentInfo.secondReference,
    Reference3: paymentInfo.paymentPurpose,
    Priority: 0,
    TradeID: 0,
  };
  const response = await HttpAdapter.makeRequest({
    data,
    method: 'POST',
    url: `/${URLS.version}${VFX_API_URLS.payments}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getPayments = async () => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const response = await HttpAdapter.makeRequest({
    method: 'GET',
    url: `/${URLS.version}${VFX_API_URLS.payments}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};
