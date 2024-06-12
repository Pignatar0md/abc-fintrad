import { VFX_API_URLS } from 'utils/urls';
import Http from './HttpAdapter';
import { getPlaneObjectData } from 'utils/localStorage';
import { LogDebug, LogError, LogInfo, LogWarning } from 'interfaces/apis';
import { getAppInfo, getDeviceInfo } from 'utils/deviceAndApp';
import { SYSTEM_NAME } from 'utils/static';
import { convertStr } from 'utils/strings';
import { LOGGER_PASSWORD, LOGGER_USER } from '@env';

const { brand, model, osName, osVersion } = getDeviceInfo();
const base64Str = convertStr(`${LOGGER_USER}:${LOGGER_PASSWORD}`, 'utf8', 'base64');

export const sendInfoLog = async (info: { event: string; detail: string }) => {
  const HttpAdapter = new Http('logger');
  const storedInfo = await getPlaneObjectData('userData');
  const data: LogInfo = {
    ClientID: storedInfo?.clientID || ' ',
    UserID: storedInfo?.userID || ' ',
    Device: `${brand} ${model}. ${osName} ${osVersion}`,
    SystemVersion: getAppInfo().buildNumber,
    LogMsg: `[${new Date().toISOString()}]: ${info.event} - Success`,
  };
  const response = await HttpAdapter.makeRequest({
    data,
    method: 'POST',
    url: `${VFX_API_URLS.sendToLogServer}/Info`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      Authorization: `Basic ${base64Str}`,
      'Access-Control-Allow-Origin': '*',
      system: SYSTEM_NAME,
    },
  });
  return response;
};

export const sendErrorLog = async (info: { event: string; detail: string }) => {
  const HttpAdapter = new Http('logger');
  const storedInfo = await getPlaneObjectData('userData');
  const data: LogError = {
    DeviceType: 'Mobile',
    DevicePlatform: osName,
    DeviceModel: model,
    DeviceVersion: osVersion + ' ',
    DeviceUuid: '',
    NavigatorUserAgent: ' ',
    Request: ' ',
    ShortLog: ' ',
    ClientID: storedInfo?.clientID || ' ',
    UserID: storedInfo?.userID || ' ',
    Device: `${brand} ${model}. ${osName} ${osVersion}`,
    SystemVersion: getAppInfo().buildNumber,
    LogMsg: `[${new Date().toISOString()}]: ${info.event} - Error: ${info.detail}`,
  };
  const response = await HttpAdapter.makeRequest({
    data,
    method: 'POST',
    url: `${VFX_API_URLS.sendToLogServer}/Error`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      Authorization: `Basic ${base64Str}`,
      'Access-Control-Allow-Origin': '*',
      system: SYSTEM_NAME,
    },
  });
  return response;
};

export const sendWarningLog = async (info: { event: string; detail: string }) => {
  const HttpAdapter = new Http('logger');
  const storedInfo = await getPlaneObjectData('userData');
  const data: LogWarning = {
    Request: info.event,
    ShortLog: ' ',
    ClientID: storedInfo?.clientID || ' ',
    UserID: storedInfo?.userID || ' ',
    Device: `${brand} ${model}. ${osName} ${osVersion}`,
    SystemVersion: getAppInfo().buildNumber,
    LogMsg: `[${new Date().toISOString()}]: ${info.event} - Warning`,
  };
  const response = await HttpAdapter.makeRequest({
    data,
    method: 'POST',
    url: `${VFX_API_URLS.sendToLogServer}/Warning`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      Authorization: `Basic ${base64Str}`,
      'Access-Control-Allow-Origin': '*',
      system: SYSTEM_NAME,
    },
  });
  return response;
};

export const sendDebugLog = async (info: { event: string; detail: string }) => {
  const HttpAdapter = new Http('logger');
  const data: LogDebug = {
    Device: `${brand} ${model}. ${osName} ${osVersion}`,
    SystemVersion: getAppInfo().buildNumber,
    LogMsg: `[${new Date().toISOString()}]: ${info.event} - Debug`,
  };
  const response = await HttpAdapter.makeRequest({
    data,
    method: 'POST',
    url: `${VFX_API_URLS.sendToLogServer}/Debug`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      Authorization: `Basic ${base64Str}`,
      'Access-Control-Allow-Origin': '*',
      system: SYSTEM_NAME,
    },
  });
  return response;
};
