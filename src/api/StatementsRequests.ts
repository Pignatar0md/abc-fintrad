import { VFX_API_URLS, URLS } from 'utils/urls';
import { START_DAY_GET_STATEMENTS, SYSTEM_NAME } from 'utils/static';
import { getPlaneObjectData, secureRetrieve } from 'utils/localStorage';
import { getLastDayOfMonth } from 'utils/helpers/dates';
import { convertStr } from 'utils/strings';
import { MESSAGE_PASSWORD, MESSAGE_USER } from '@env';
import Http from './HttpAdapter';
import { basicHeaders } from './static';

export const requestEmailWithCardFileStatements = async ({
  cardNumber,
  file,
  date,
}: {
  cardNumber: string;
  file: 'XLSX' | 'PDF';
  date: Date;
}) => {
  const HttpAdapter = new Http('message');
  const base64Str = convertStr(`${MESSAGE_USER}:${MESSAGE_PASSWORD}`, 'utf8', 'base64');
  const storedUserDetails = await getPlaneObjectData('userDetails');
  const storedBasicInfoUser = await getPlaneObjectData('userData');
  const data = JSON.stringify({
    SystemName: SYSTEM_NAME,
    CardNumber: cardNumber,
    ClientID: storedUserDetails.userDetails.ClientID,
    UserID: storedBasicInfoUser.userID,
    ExportType: file,
    Year: date.getFullYear().toString(),
    Month: (date.getMonth() + 1).toString(),
  });

  const url = VFX_API_URLS.sendCardStatementsByEmailByMonth;
  const response = await HttpAdapter.makeRequest({
    data,
    method: 'POST',
    url,
    headers: {
      Authorization: `Basic ${base64Str}`,
      ...basicHeaders,
    },
  });
  return response;
};

export const requestEmailWithCcyFileStatements = async ({
  CCY,
  file,
  date,
}: {
  CCY: string;
  file: 'XLSX' | 'PDF';
  date: Date;
}) => {
  const HttpAdapter = new Http('message');
  const base64Str = convertStr(`${MESSAGE_USER}:${MESSAGE_PASSWORD}`, 'utf8', 'base64');
  const storedUserDetails = await getPlaneObjectData('userDetails');
  const storedBasicInfoUser = await getPlaneObjectData('userData');
  let data = {
    SystemName: SYSTEM_NAME,
    CCY: CCY,
    ClientID: storedUserDetails.userDetails.ClientID,
    UserID: storedBasicInfoUser.userID,
    ExportType: file,
    StartDate: '',
    EndDate: '',
    Year: '',
    Month: '',
  };
  let url = '';
  const clearYear = date.getFullYear();
  const clearLastMonthDay = getLastDayOfMonth(clearYear, date.getMonth());
  const clearMonth = date.getMonth() + 1;
  if (CCY === '*') {
    url = VFX_API_URLS.sendCcyStatementsByEmailByMonth;
    data = {
      ...data,
      Year: clearYear.toString(),
      Month: clearMonth.toString(),
    };
  } else {
    url = VFX_API_URLS.sendCcyStatementsByEmailByRageDates;
    data = {
      ...data,
      StartDate: `${clearYear}-${clearMonth}-01`,
      EndDate: `${clearYear}-${clearMonth}-${clearLastMonthDay}`,
    };
  }
  const response = await HttpAdapter.makeRequest({
    data: JSON.stringify(data),
    method: 'POST',
    url,
    headers: {
      Authorization: `Basic ${base64Str}`,
      ...basicHeaders,
    },
  });
  return response;
};

export const getCurrencyCardStatements = async (ccyCard: { value: string }, endDate: Date) => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const startDate = new Date();
  const data = {
    CardID: ccyCard.value,
    Start_Year: startDate.getFullYear().toString(),
    Start_Month: (startDate.getMonth() + 1).toString(),
    Start_Day: START_DAY_GET_STATEMENTS,
    End_Year: endDate.getFullYear().toString(),
    End_Month: (endDate.getMonth() + 1).toString(),
    End_Day: getLastDayOfMonth(endDate.getFullYear(), endDate.getMonth()).toString(),
  };
  const response = await HttpAdapter.makeRequest({
    data,
    method: 'POST',
    url: `/${URLS.version}${VFX_API_URLS.getStatementsByCcyCardId}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getCcyStatements = async (ccy: string, endDate: Date) => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const data = {
    CCY: ccy,
    Start_Year: endDate.getFullYear().toString(),
    Start_Month: (endDate.getMonth() + 1).toString(),
    Start_Day: START_DAY_GET_STATEMENTS,
    End_Year: endDate.getFullYear().toString(),
    End_Month: (endDate.getMonth() + 1).toString(),
    End_Day: getLastDayOfMonth(endDate.getFullYear(), endDate.getMonth()).toString(),
  };
  const response = await HttpAdapter.makeRequest({
    data,
    method: 'POST',
    url: `/${URLS.version}${VFX_API_URLS.getStatementsByCcy}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};
