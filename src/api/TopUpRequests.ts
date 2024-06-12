import Http from './HttpAdapter';
import { VFX_API_URLS, URLS } from 'utils/urls';
import { secureRetrieve } from 'utils/localStorage';

export const getLimits = async () => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const response = await HttpAdapter.makeRequest({
    method: 'GET',
    url: `/${URLS.version}${VFX_API_URLS.topupLimits}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const addTopupRequest = async (topupInfo: any) => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const {
    CardNumber,
    CVV,
    Name,
    ExpiryDate,
    StartDate,
    IssueNumber,
    Address1,
    Address2,
    Address3,
    PostCode,
    CountryCode,
  } = topupInfo;
  const data = {
    CardNumber: CardNumber,
    CVV,
    StartDate,
    IssueNumber,
    ExpiryDate: ExpiryDate,
    Name,
    Address1,
    Address2,
    Address3,
    PostCode,
    CountryCode,
  };
  const response = await HttpAdapter.makeRequest({
    data,
    method: 'POST',
    url: `/${URLS.version}${VFX_API_URLS.debitCards}/topup`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};
  