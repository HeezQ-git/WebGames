"use client";
import axios from "axios";
import { getSession } from "next-auth/react";
import useSWR, { SWRConfiguration, SWRResponse } from "swr";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type FetcherOptions = {
  base?: string;
  wholeResponse?: boolean;
  timeout?: number;
};

const defaultUrlBase = process.env.NODE_ENV === 'production' ? 'https://web-games-backend.vercel.app/' : "http://localhost:8000/";

const axiosBase = async (base?: string) => {
  const session = await getSession();

  return axios.create({
    baseURL: base || defaultUrlBase,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": process.env.NODE_ENV === 'production' ? 'https://web-games-backend.vercel.app/' : "http://localhost:8000/",
      'Access-Control-Allow-Credentials': 'true',
      'Authorization': `${session?.user?.pid || ''}`,
    },
  });
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
