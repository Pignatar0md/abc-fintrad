import { DEFAULT_ADDRESS1, DEFAULT_ADDRESS2, DEFAULT_CITY, DEFAULT_POSTCODE } from 'utils/static';
import Http from './HttpAdapter';
import { VFX_API_URLS, URLS } from 'utils/urls';
import { InputUserToRequestCcyCard } from 'types/screens';
import { getPlaneObjectData, secureRetrieve } from 'utils/localStorage';
import { DebitCardAdding } from 'types/api';

export const getDebitCards = async () => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const response = await HttpAdapter.makeRequest({
    method: 'GET',
    url: `/${URLS.version}${VFX_API_URLS.debitCards}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getCurrencyCards = async () => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const response = await HttpAdapter.makeRequest({
    method: 'GET',
    url: `/${URLS.version}${VFX_API_URLS.ccyCards}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const makeCcyCardRequest = async (userInfo: InputUserToRequestCcyCard) => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const { userDetails } = await getPlaneObjectData('userDetails');
  const { Address1, Address2, PostCode, Options } = userDetails;
  const { title, firstName, lastName, nameOnTheCard, mobileNumber } = userInfo;
  const data = {
    Title: title.label,
    FirstName: firstName,
    LastName: lastName,
    EmbossedName: nameOnTheCard,
    CountryCode: userDetails.CountryCode,
    MobileNumber: mobileNumber,
    Address1: Address1 || DEFAULT_ADDRESS1,
    Address2: Address2 || DEFAULT_ADDRESS2,
    PostCode: PostCode || DEFAULT_POSTCODE,
    City: DEFAULT_CITY,
    IsCorporate: `${Options.IsCorporate}`,
  };
  const response = await HttpAdapter.makeRequest({
    data,
    method: 'POST',
    url: `/${URLS.version}${VFX_API_URLS.ccyCards}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const addDebitCardRequest = async (cardInfo: DebitCardAdding) => {
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
  } = cardInfo;
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
    url: `/${URLS.version}${VFX_API_URLS.debitCards}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const deleteDebitCardRequest = async (cardId: string) => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const response = await HttpAdapter.makeRequest({
    method: 'DELETE',
    url: `/${URLS.version}${VFX_API_URLS.debitCards}/${cardId}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const cancelCcyCardRequest = async (ID: number) => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const response = await HttpAdapter.makeRequest({
    method: 'DELETE',
    url: `/${URLS.version}${VFX_API_URLS.ccyCards}/${ID}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const blockCcyCardRequest = async (ID: number) => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const response = await HttpAdapter.makeRequest({
    method: 'PUT',
    url: `/${URLS.version}${VFX_API_URLS.ccyCards}/block/${ID}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const unblockCcyCardRequest = async (ID: number) => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const response = await HttpAdapter.makeRequest({
    method: 'PUT',
    url: `/${URLS.version}${VFX_API_URLS.ccyCards}/unblock/${ID}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getCcyCardPINRequest = async (ID: number) => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const response = await HttpAdapter.makeRequest({
    method: 'GET',
    url: `/${URLS.version}${VFX_API_URLS.ccyCards}/pin/${ID}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const activateCcyCardRequest = async (
  ID: number,
  ActivationCode: string,
  CardNumber: string,
) => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const data = {
    CardID: ID,
    ActivationCode: ActivationCode,
    CardNumber,
  };
  const response = await HttpAdapter.makeRequest({
    data,
    method: 'PUT',
    url: `/${URLS.version}${VFX_API_URLS.ccyCards}/activate`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const updateCcyCardMobileNumber = async (CompleteMobileNumber: string, ID: number) => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const data = {
    CardID: `${ID}`,
    Mobile: `${CompleteMobileNumber}`,
  };
  const response = await HttpAdapter.makeRequest({
    data,
    method: 'PUT',
    url: `/${URLS.version}${VFX_API_URLS.ccyCards}/${ID}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};
