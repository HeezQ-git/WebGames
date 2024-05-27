"use client";
// import { useTranslation } from "react-i18next";
// import { cleanNotifications, notifications } from "@mantine/notifications";
/* eslint-disable indent */
import axios from "axios";
import useSWR, { SWRConfiguration, SWRResponse } from "swr";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type FetcherOptions = {
  base?: string;
  wholeResponse?: boolean;
  timeout?: number;
  useAbsoluteLocalhost?: boolean;
};

const defaultUrlBase = "http://localhost:8000/";

const axiosBase = (base?: string) =>
  axios.create({
    baseURL: base || defaultUrlBase,
    withCredentials: true,
    headers: {
      "X-User-Type": "STUDENT",
      "Access-Control-Allow-Origin": "http://localhost:3000",
    },
  });

export const fetcher = (method: Method, rest: FetcherOptions | void) => async (url: string, data?: any) => {
  let { base, wholeResponse, timeout } = rest || {};

  const source = axios.CancelToken.source();

  const response = await axiosBase(
    base ? base : undefined
  )({
    method,
    url,
    data: method === "GET" ? undefined : data,
    params: method === "GET" ? data : undefined,
    cancelToken: source.token,
    timeout: timeout || 2000,
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
  // const { t } = useTranslation();

  return useSWR<T | undefined>(
    [apiURL, dataToSend],
    ([url, data]: [string, object]) => fetcher(method, options?.fetcherOptions)(url, data),
    {
      shouldRetryOnError: true,
      errorRetryInterval: -1,
      errorRetryCount: 3,
      revalidateOnFocus: false,
      // eslint-disable-next-line max-params
      onErrorRetry: (error, key, cfg, revalidate, { retryCount }) => {
        // if (retryCount >= 3) {
        // cleanNotifications();
        // return notifications.show({
        //   title: t("errors:network.unknown"),
        //   message: t("errors:network.failedToFetch"),
        //   color: "red",
        //   withCloseButton: true,
        //   autoClose: 30000,
        //   withBorder: true,
        // });
        // }
        if (error.status === 404) return;
        revalidate({ retryCount });
      },
      ...options?.swrOptions,
    }
  );
};
