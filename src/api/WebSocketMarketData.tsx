import Http from './HttpAdapter';
import { getPlaneObjectData } from 'utils/localStorage';
import { VFX_API_URLS } from 'utils/urls';
import { convertStr } from 'utils/strings';
import { WS_MARKETDATA_PASSWORD, WS_MARKETDATA_SYSTEM, WS_MARKETDATA_USER } from '@env';

export const registerToMarketData = async () => {
  const base64Str = convertStr(`${WS_MARKETDATA_USER}:${WS_MARKETDATA_PASSWORD}`, 'utf8', 'base64');
  const HttpAdapter = new Http('wsMarketData');
  const storedInfo = await getPlaneObjectData('userData');
  const paramsToSend = {
    ClientID: `${storedInfo.clientID}_${storedInfo.userID}`,
    System: WS_MARKETDATA_SYSTEM,
  };
  const response = await HttpAdapter.makeRequest({
    url: `${VFX_API_URLS.wsMarketDataAuthenticate}`,
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8',
      Authorization: `Basic ${base64Str}`,
    },
    data: paramsToSend,
  });
  return response;
};