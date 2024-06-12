import { URLS, VFX_API_URLS } from 'utils/urls';
import Http from './HttpAdapter';
import { secureRetrieve } from 'utils/localStorage';
import { UpdateAddOrder } from 'types/api';
import { formatDate } from 'utils/helpers/dates';
import axios from 'axios';
import { BACKEND_URL } from '@env';

export const getOrdersList = async () => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const response = await HttpAdapter.makeRequest({
    method: 'GET',
    url: `/${URLS.version}${VFX_API_URLS.orders}`,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const addNewOrder = async ({ order }: UpdateAddOrder) => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const expiryDate = formatDate(order.expiryDate).split('-');
  const data = {
    OrderType: order.orderType,
    CCYPair: order.ccyPair,
    TargetCCY: order.targetCcy,
    TargetAmount: order.ccyAmount === '' ? '0' : order.ccyAmount,
    TargetRate: order.targetRate,
    ExpiryDateYear: expiryDate[2],
    ExpiryDateMonth: expiryDate[1],
    ExpiryDateDay: expiryDate[0],
    Note: order.notes,
  };
  const url = `${URLS.version}${VFX_API_URLS.orders}`;
  try {
    const response = await axios.post(`${BACKEND_URL}${url}`, data, {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error: any) {
    return error.response.data.Message;
  }
};

export const updateOrder = async ({ order }: UpdateAddOrder, ID: number) => {
  const token = await secureRetrieve('authToken');
  const expiryDate = order.expiryDate.split('-');
  const data = {
    OrderID: ID.toString(),
    OrderType: order.orderType,
    CCYPair: order.ccyPair,
    TargetCCY: order.targetCcy,
    TargetAmount: order.ccyAmount === '' ? '0' : order.ccyAmount,
    TargetRate: order.targetRate,
    ExpiryDateYear: expiryDate[0],
    ExpiryDateMonth: expiryDate[1],
    ExpiryDateDay: expiryDate[2],
    Note: order.notes,
  };
  const url = `${URLS.version}${VFX_API_URLS.orders}`;
  try {
    const response = await axios.put(`${BACKEND_URL}${url}`, data, {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error: any) {
    return error.response.data.Message;
  }
};

export const deleteOrder = async (ID: number) => {
  const HttpAdapter = new Http('backend');
  const token = await secureRetrieve('authToken');
  const response = await HttpAdapter.makeRequest({
    method: 'DELETE',
    url: `/${URLS.version}${VFX_API_URLS.orders}/${ID}`,
    data: { ID },
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};
