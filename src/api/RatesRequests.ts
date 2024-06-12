import { VFX_API_URLS, URLS } from 'utils/urls';
import Http from './HttpAdapter';
import { secureRetrieve } from 'utils/localStorage';

export const getRates = async () => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const response = await HttpAdapter.makeRequest({
    method: 'GET',
    url: `${URLS.version}${VFX_API_URLS.getRates}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};
