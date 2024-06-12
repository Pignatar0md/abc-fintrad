import { secureRetrieve } from 'utils/localStorage';
import Http from './HttpAdapter';
import { VFX_API_URLS, URLS } from 'utils/urls';
import { InputUserToGetRate } from 'types/screens';

export const getRateRequest = async (tradeInfo: InputUserToGetRate) => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const data = {
    CCYPair: '',
    BuySellFlag: '',
    TradeCCY: '',
    TradeAmount: '',
    ValueDate_Year: '',
    ValueDate_Month: '',
    ValueDate_Day: '',
    RequestID: '',
  };
  const response = await HttpAdapter.makeRequest({
    data,
    method: 'POST',
    url: `/${URLS.version}${VFX_API_URLS.getRate}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getTrades = async () => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const response = await HttpAdapter.makeRequest({
    method: 'GET',
    url: `/${URLS.version}${VFX_API_URLS.trades}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};
