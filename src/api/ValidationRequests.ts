import Http from './HttpAdapter';
import { URLS, VFX_API_URLS } from 'utils/urls';
import { getPlaneObjectData, secureRetrieve } from 'utils/localStorage';
import { SYSTEM_NAME } from 'utils/static';
import { convertStr } from 'utils/strings';
import { CODE_PASSWORD, CODE_USER } from '@env';
import { basicHeaders } from './static';
import { Platform } from 'react-native';

const base64Str = convertStr(`${CODE_USER}:${CODE_PASSWORD}`, 'utf8', 'base64');
const basicData = {
  type: 'SMS',
  system: SYSTEM_NAME,
};

export const sendSMS = async () => {
  const { clientID, userID } = await getPlaneObjectData('userData');
  const HttpAdapter = new Http('code');
  const data = {
    ...basicData,
    clientID,
    userID,
  };

  const response = await HttpAdapter.makeRequest({
    data,
    method: 'POST',
    url: `/${CODE_USER}${VFX_API_URLS.requestAuthCode}`,
    headers: {
      Authorization: `Basic ${base64Str}`,
      ...basicHeaders,
    },
  });
  return response;
};

export const validateReceivedCode = async (code: string) => {
  const { clientID, userID } = await getPlaneObjectData('userData');
  const HttpAdapter = new Http('code');
  const data = {
    ...basicData,
    code,
    clientID,
    userID,
  };
  const response = await HttpAdapter.makeRequest({
    data,
    method: 'POST',
    url: `/${CODE_USER}${VFX_API_URLS.validateAuthCode}`,
    headers: {
      Authorization: `Basic ${base64Str}`,
      ...basicHeaders,
    },
  });
  return response;
};

export const validatePinLetter = async (pinLetter: string) => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const response = await HttpAdapter.makeRequest({
    method: 'GET',
    url: `/${URLS.version}${VFX_API_URLS.validatePinLetter}?pin=${pinLetter}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const checkAppVersion = async ({ appVersion }: { appVersion: string }) => {
  const HttpAdapter = new Http('backend');
  const platform = Platform.OS === 'ios' ? 'iphone' : Platform.OS;
  const args = `?Platform=${platform}&AppName=${SYSTEM_NAME}&AppVersion=${appVersion}`;
  const response = await HttpAdapter.makeRequest({
    method: 'GET',
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    url: `${VFX_API_URLS.getAppVersionValid}${args}`,
  });
  return response;
};
