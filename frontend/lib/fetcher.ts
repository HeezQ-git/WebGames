"use client";
import axios from "axios";
import toast from "react-hot-toast";
import useSWR, { SWRConfiguration, SWRResponse } from "swr";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type FetcherOptions = {
  base?: string;
  wholeResponse?: boolean;
  timeout?: number;
  useAbsoluteLocalhost?: boolean;
};

const defaultUrlBase = process.env.NODE_ENV === 'production' ? 'https://web-games-backend.vercel.app/' : "http://localhost:8000/";

const axiosBase = (base?: string) =>
  axios.create({
    baseURL: base || defaultUrlBase,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": process.env.NODE_ENV === 'production' ? 'https://web-games-backend.vercel.app' : "http://localhost:8000/",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH",
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token, Application, ResponseType, Set-Cookie',
      'Access-Control-Expose-Headers': 'Set-Cookie Cookie',
    },
  });

export const fetcher = (method: Method, rest: FetcherOptions | void) => async (url: string, data?: any) => {
  let { base, wholeResponse, timeout } = rest || {};

  // eslint-disable-next-line import/no-named-as-default-member
  const source = axios.CancelToken.source();

  const response = await axiosBase(
    base ? base : undefined
  )({
    method,
    url,
    data: method === "GET" ? undefined : data,
    params: method === "GET" ? data : undefined,
    cancelToken: source.token,
    timeout: timeout || 6000,
  });

  return wholeResponse ? response : response?.data;
};

export const useFetcherSWR = <T>(
  method: Method,
  apiURL: string,
  dataToSend?: object,
  options?: {
    swrOptions?: SWRConfiguration;
    fetcherOptions?: FetcherOptions;
  } | void
): SWRResponse<T | undefined, any> => {

  const { surpressError } = dataToSend || {} as any;

  return useSWR<T | undefined>(
    [apiURL, dataToSend],
    ([url, data]: [string, object]) => fetcher(method, options?.fetcherOptions)(url, data),
    {
      shouldRetryOnError: true,
      errorRetryInterval: 3000,
      errorRetryCount: 3,
      revalidateOnFocus: true,
      // eslint-disable-next-line max-params
      onErrorRetry: (error, key, cfg, revalidate, { retryCount }) => {
        if (surpressError) return;

        if (retryCount >= 3) {
          toast.dismiss();
          return toast.error('Failed to fetch data', {
            duration: 5000,
          });
        }
        if (error.status === 404) return;
        revalidate({ retryCount });
      },
      ...options?.swrOptions,
    }
  );
};
