import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { RequestParams, Service } from '../types/api';
import { URLS } from 'utils/urls';

class Http {
  endpoint: AxiosInstance;

  constructor(service: Service) {
    this.endpoint = axios.create({
      baseURL: URLS[service],
      timeout: 10000,
    });
  }

  makeRequest = async ({ method, url, data, headers }: RequestParams) => {
    const requestOptions: AxiosRequestConfig = {
      method,
      url,
      headers,
    };
    const completeDataRequestOptions = data ? { ...requestOptions, data } : requestOptions;
    try {
      const response: AxiosResponse = await this.endpoint(completeDataRequestOptions);
      return response;
    } catch (error: any) {
      return { data: error.message };
    }
  };
}

export default Http;
