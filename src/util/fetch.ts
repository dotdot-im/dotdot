import { useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

import { API_URL } from '../constants';

export type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export const CSRF_HEADER = 'x-csrf-token';
let csrfToken = '';

export type FetchError = {
  status: number,
  message: string,
  errors: string[],
};

type FetchReturn<T> = [
  boolean,
  T | null,
  FetchError | null,
];

axios.defaults.withCredentials = true;

function useFetch<T>(path: string, method: FetchMethod, body?: any): FetchReturn<T> {
  const [error, setError] = useState<FetchError | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [response, setResponse] = useState<T | null>(null);

  useEffect(() => {
    const sendRequest = async () => {
      try {
        const data = await fetchResource(path, method, body);
        setResponse(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    sendRequest();

  }, [path, method, body,]);

  return [loading, response, error];
};

export const fetchResource = async (path: string, method: FetchMethod, body?: any) => {
  if (!path) {
    throw new Error(`'url' is required for fetching data`);
  }

  const url = `${API_URL}${path}`;
  const options: AxiosRequestConfig = {
    url,
    method,
    data: body,
    timeout: 6000,
    withCredentials: true,
    xsrfHeaderName: CSRF_HEADER,
    headers: {},
  };

  if (csrfToken.length > 0) {
    options.headers[CSRF_HEADER] = csrfToken;
  }

  try {
    const response = await axios(options);

    if (response.headers[CSRF_HEADER]) {
      csrfToken = response.headers[CSRF_HEADER];
    }

    return await response.data;
  } catch (error) {
    if (error.response) {
      console.warn('useFetch error', error.response);
      const returnError: FetchError = {
        status: error.response.status,
        message: error.response.data ? error.response.data.errors.join(', ') : error.message,
        errors: error.response.data.errors,
      };
      throw returnError;
    } else {
      console.warn('useFetch error', error);
      const returnError: FetchError = {
        status: 500,
        message: error.message,
        errors: [error.message]
      };
      throw returnError;
    }
  }


};

export default useFetch;