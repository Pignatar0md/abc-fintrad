import { VFX_API_URLS } from 'utils/urls';
import { CODE_PASSWORD, CODE_USER } from '@env';
import Http from './HttpAdapter';
import { getPlaneObjectData } from 'utils/localStorage';
import { basicHeaders } from './static';
import { convertStr } from 'utils/strings';
import { CommunicationOptions } from 'interfaces/apis';
import { SYSTEM_NAME } from 'utils/static';

const base64Str = convertStr(`${CODE_USER}:${CODE_PASSWORD}`, 'utf8', 'base64');
const HttpAdapter = new Http('code');

export const saveCommunicationsConfig = async (settingValues: CommunicationOptions) => {
  const { clientID, userID } = await getPlaneObjectData('userData');
  const preferences = [
    {
      NotificationType: 'Marketing',
      Channel: 'email',
      Active: settingValues.email,
    },
    {
      NotificationType: 'Marketing',
      Channel: 'push',
      Active: settingValues.push,
    },
    {
      NotificationType: 'Marketing',
      Channel: 'sms',
      Active: settingValues.sms,
    },
    {
      NotificationType: 'Marketing',
      Channel: 'post',
      Active: settingValues.post,
    },
    {
      NotificationType: 'Market reports',
      Channel: 'email',
      Active: settingValues.mailMarketReports,
    },
  ];
  const data = {
    NotificationTypeList: preferences,
    SystemName: SYSTEM_NAME,
    clientID,
    userID,
  };
  const response = await HttpAdapter.makeRequest({
    data: JSON.stringify(data),
    method: 'POST',
    url: `/${CODE_USER}${VFX_API_URLS.setCommunicationPreferences}`,
    headers: {
      Authorization: `Basic ${base64Str}`,
      ...basicHeaders,
    },
  });
  return response;
};

export const getCommunicationsConfig = async () => {
  const { clientID, userID } = await getPlaneObjectData('userData');
  const data = {
    SystemName: SYSTEM_NAME,
    clientID,
    userID,
  };
  const response = await HttpAdapter.makeRequest({
    data: JSON.stringify(data),
    method: 'POST',
    url: `/${CODE_USER}${VFX_API_URLS.getCommunicationPreferences}`,
    headers: {
      Authorization: `Basic ${base64Str}`,
      ...basicHeaders,
    },
  });
  return response;
};
