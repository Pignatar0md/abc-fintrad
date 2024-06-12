import Http from './HttpAdapter';
import { VFX_API_URLS, URLS } from 'utils/urls';
import { InputUserToAddBeneficiary } from 'types/screens';
import { secureRetrieve } from 'utils/localStorage';

export const getCountriesForBeneficiary = async () => {
  const HttpAdapter = new Http('backend');
  const response = await HttpAdapter.makeRequest({
    method: 'GET',
    url: `/${URLS.version}${VFX_API_URLS.countries}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });
  return response;
};

export const addNewBeneficiary = async (beneficiaryInfo: InputUserToAddBeneficiary) => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const {
    type,
    firstName,
    middleName,
    lastName,
    alias,
    email,
    ref1,
    ref2,
    paymentPurpose,
    currency,
    iban,
    addressCountry,
    payCountry,
    sortCode,
    bankName,
    accountNumber,
    swiftCode,
    routingBank,
  } = beneficiaryInfo;
  // eslint-disable-next-line no-extra-boolean-cast
  const partialName = !!middleName ? `${firstName} ${middleName}` : firstName;
  const fullName = `${partialName} ${lastName}`;
  const addressInParts = [];
  if (addressCountry) {
    if (addressCountry.length <= 35) {
      addressInParts[0] = addressCountry;
    } else if (addressCountry.length <= 70) {
      addressInParts[0] = addressCountry.substring(0, 35);
      addressInParts[1] = addressCountry.substring(35, addressCountry.length);
    } else {
      addressInParts[0] = addressCountry.substring(0, 35);
      addressInParts[1] = addressCountry.substring(35, 70);
      addressInParts[2] = addressCountry.substring(70, addressCountry.length);
    }
  }
  const data = {
    Name: fullName,
    Alias: alias,
    CCY: currency.value,
    PayCountry: payCountry.value,
    AddressCountry: addressCountry,
    Address1: addressInParts[0] || '',
    Address2: addressInParts[1] || '',
    Address3: addressInParts[2] || '',
    SortCode: sortCode,
    BankName: bankName || '',
    AccountNumber: accountNumber,
    SwiftCode: swiftCode,
    IBAN: iban,
    RoutingCode: routingBank,
    Reference1: ref1 || '',
    Reference2: ref2 || '',
    Reference3: paymentPurpose,
    EMail: email,
    IsCompany: type.label === 'Personal' ? 'false' : 'true',
  };
  const response = await HttpAdapter.makeRequest({
    data,
    method: 'POST',
    url: `/${URLS.version}${VFX_API_URLS.beneficiaries}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getBeneficiaryList = async () => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const response = await HttpAdapter.makeRequest({
    method: 'GET',
    url: `/${URLS.version}${VFX_API_URLS.beneficiaries}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getBeneficiaryById = async (ID: number) => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const response = await HttpAdapter.makeRequest({
    method: 'GET',
    url: `/${URLS.version}${VFX_API_URLS.beneficiaries}/${ID}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const updateBeneficiary = async (beneficiaryInfo: InputUserToAddBeneficiary, ID: number) => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const {
    type,
    firstName,
    middleName,
    lastName,
    alias,
    email,
    ref1,
    ref2,
    paymentPurpose,
    currency,
    iban,
    addressCountry,
    payCountry,
    sortCode,
    bankName,
    accountNumber,
    swiftCode,
    routingBank,
  } = beneficiaryInfo;
  // eslint-disable-next-line no-extra-boolean-cast
  const partialName = !!middleName ? `${firstName} ${middleName}` : firstName;
  const fullName = `${partialName} ${lastName}`;
  const addressInParts = [];
  if (addressCountry) {
    if (addressCountry.length <= 35) {
      addressInParts[0] = addressCountry;
    } else if (addressCountry.length <= 70) {
      addressInParts[0] = addressCountry.substring(0, 35);
      addressInParts[1] = addressCountry.substring(35, addressCountry.length);
    } else {
      addressInParts[0] = addressCountry.substring(0, 35);
      addressInParts[1] = addressCountry.substring(35, 70);
      addressInParts[2] = addressCountry.substring(70, addressCountry.length);
    }
  }
  const data = {
    BeneficiaryID: ID,
    Name: fullName,
    Alias: alias,
    CCY: currency.value,
    PayCountry: payCountry.value,
    AddressCountry: addressCountry || '',
    Address1: addressInParts[0] || '',
    Address2: addressInParts[1] || '',
    Address3: addressInParts[2] || '',
    SortCode: sortCode,
    AccountNumber: accountNumber,
    SwiftCode: swiftCode,
    BankName: bankName || '',
    IBAN: iban,
    RoutingCode: routingBank,
    Reference1: ref1 || '',
    Reference2: ref2 || '',
    Reference3: paymentPurpose,
    EMail: email,
    IsCompany: type.label === 'Personal' ? 'false' : 'true',
  };
  const response = await HttpAdapter.makeRequest({
    data,
    method: 'PUT',
    url: `/${URLS.version}${VFX_API_URLS.beneficiaries}/${ID}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const deleteBeneficiary = async (ID: number) => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const response = await HttpAdapter.makeRequest({
    method: 'DELETE',
    url: `/${URLS.version}${VFX_API_URLS.beneficiaries}/${ID}`,
    data: { ID },
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};
