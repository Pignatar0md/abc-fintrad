import { Platform } from 'react-native';
import { VFX_API_URLS, URLS } from 'utils/urls';
import Http from './HttpAdapter';
import { CURRENT_LANGUAGE } from 'utils/static';
import { secureRetrieve, secureStore, storePlaneObjectData } from 'utils/localStorage';
import { InputUserToAuth } from 'types/screens';
import { processLoginData } from 'utils/helpers/Apis';

export const loginRequest = async ({ userId, clientId, password }: InputUserToAuth) => {
  const HttpAdapter = new Http('backend');
  const data = {
    ClientID: clientId,
    UserID: userId,
    Password: password,
    Language: CURRENT_LANGUAGE,
    SourceSystem: Platform.OS,
  };
  const response = await HttpAdapter.makeRequest({
    data,
    method: 'POST',
    url: VFX_API_URLS.getAuthToken,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
  if (response?.data?.Succeeded) {
    processLoginData(response?.data?.Data);
    await secureStore('password', password);
    await storePlaneObjectData('userData', {
      clientID: clientId,
      userID: userId,
    });
  }
  return response;
};

export const detailsRequest = async () => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const response = await HttpAdapter.makeRequest({
    method: 'GET',
    url: `/${URLS.version}${VFX_API_URLS.getUserDetails}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};
