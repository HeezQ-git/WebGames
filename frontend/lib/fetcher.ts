"use client";
import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import useSWR, { SWRConfiguration, SWRResponse } from "swr";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type FetcherOptions = {
  base?: string;
  wholeResponse?: boolean;
  timeout?: number;
};

const defaultUrlBase = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://web-games-backend.vercel.app/' : 'http://localhost:8000/');

let signingOut = false;

const handleInvalidSession = async () => {
  if (signingOut) return;
  signingOut = true;
  await signOut({ redirect: false });
  window.location.reload();
};

const axiosBase = async (base?: string) => {
  const session = await getSession();

  const instance = axios.create({
    baseURL: base || defaultUrlBase,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      'Authorization': `${session?.user?.pid || ''}`,
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.data?.code === 'INVALID_SESSION') {
        handleInvalidSession();
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

export const fetcher = (method: Method, rest: FetcherOptions | void) => async (url: string, data?: any) => {
  let { base, wholeResponse, timeout } = rest || {};

  // eslint-disable-next-line import/no-named-as-default-member
  const source = axios.CancelToken.source();

  const gotAxiosBase = await axiosBase(
    base ? base : undefined
  );

  const response = await gotAxiosBase({
    method,
    url,
    data,
    cancelToken: source.token,
    timeout: timeout || 30000,
  });

  return wholeResponse ? response : response?.data;
};

export const useFetcherSWR = <T>(
  method: Method,
  apiURL?: string,
  dataToSend?: object,
  options?: {
    swrOptions?: SWRConfiguration;
    fetcherOptions?: FetcherOptions;
  } | void
): SWRResponse<T | undefined, any> => {

  return useSWR<T | undefined>(
    [apiURL, dataToSend],
    ([url, data]: [string, object]) => (apiURL ? fetcher(method, options?.fetcherOptions)(url, data) : undefined),
    {
      shouldRetryOnError: true,
      errorRetryInterval: 9000,
      errorRetryCount: 3,
      revalidateOnFocus: true,
      keepPreviousData: true,
      ...options?.swrOptions,
    }
  );
};
