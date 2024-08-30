/* eslint-disable prefer-regex-literals */
import { stringify } from "qs";
import type { AxiosRequestConfig } from "axios";
import { isArray, isEmpty, isObject, omit } from "./utils";

import type { RequestInstance } from "./typing";

type Payload = Record<string, any>;
type ArrayData = any[];
type MajorPayload = Payload | ArrayData;
type AxiosConfig = AxiosRequestConfig;

type RequestParams = [MajorPayload?, Payload?, AxiosConfig?];

export const injectPathQueriesIntoUrl = (
  url: string,
  pathQueries: Record<string, string>
) => url.replace(/{([^{]*)}/g, (_, b) => pathQueries[b]);

const SEPARATOR = /\s{1,}/;
const COMMON_PATTERN = "*";
const IF_DATA_IS_ARRAY = /\s\[d|(data)]\s?/;
const IF_DATA_IS_FORM_DATA = /\s(d|(data))\.(f|formData):/;
const MATCH_DATA_STRING = /\s+(d|data)(\.(f|formData))?:(\S*)(\s|$)/;
const MATCH_PATH_STRING = /\s+path:(\S*)(\s|$)/;
const MATCH_QUERY_STRING = /\s+(q|query):(\S*)(\s|$)/;

export const getNewObjectByKeysFrom = (target?: Payload, keys?: string[]) => {
  if (!target || !keys?.length) return {};
  return keys.reduce(
    (acc: Record<string, any>, key: string) => ({ ...acc, [key]: target[key] }),
    {}
  );
};

export const getUrlWithoutQueries = (url: string) => {
  const [baseUrl] = url.split("?");
  return baseUrl;
};

export const getRequestParamsIfDataIsArray = (
  majorPayload: ArrayData,
  otherPayload?: Payload,
  pathKeys?: string[],
  queryKeys?: string[]
): [ArrayData, Partial<Payload>, Partial<Payload>] => {
  return [
    majorPayload,
    getNewObjectByKeysFrom(otherPayload, pathKeys),
    getNewObjectByKeysFrom(otherPayload, queryKeys),
  ];
};

export const getRequestParams = (
  majorPayload: Payload,
  isPatternData: boolean,
  isFormData: boolean,
  paramsKeysString?: string,
  pathKeys?: string[],
  queryKeys?: string[]
): [Partial<Payload>, Partial<Payload>, Partial<Payload>] => {
  const omittedParams = omit(majorPayload, [
    ...(queryKeys || []),
    ...(pathKeys || []),
  ]);
  return [
    // data
    isPatternData || isFormData
      ? omittedParams
      : getNewObjectByKeysFrom(
          omittedParams,
          paramsKeysString?.split(",") || []
        ),
    // path
    getNewObjectByKeysFrom(majorPayload, pathKeys),
    // queries
    getNewObjectByKeysFrom(majorPayload, queryKeys),
  ];
};

export const apiTransfer = (
  request: RequestInstance<any>,
  requestString: string
) => {
  const [method, url] = requestString.split(SEPARATOR);
  const isDataArray = IF_DATA_IS_ARRAY.test(requestString);
  const [, pathKeysString] = requestString.match(MATCH_PATH_STRING) || [];
  const [, , queryKeysString] = requestString.match(MATCH_QUERY_STRING) || [];
  const [, , , , paramsKeysString] =
    requestString.match(MATCH_DATA_STRING) || [];

  const hasPathQueries = !!pathKeysString;

  const pathKeys = pathKeysString?.split(",") || [];
  const queryKeys = queryKeysString?.split(",") || [];

  const isFormData = !isDataArray
    ? IF_DATA_IS_FORM_DATA.test(requestString)
    : false;
  const isPatternData = paramsKeysString === COMMON_PATTERN;

  return (...args: RequestParams) => {
    const [majorPayload, otherPayload = {}, otherAxiosConfig = {}] = args;

    const [data, path, query] = isDataArray
      ? getRequestParamsIfDataIsArray(
          majorPayload as any[],
          otherPayload,
          pathKeys,
          queryKeys
        )
      : getRequestParams(
          majorPayload!,
          isPatternData,
          isFormData,
          paramsKeysString,
          pathKeys,
          queryKeys
        );

    const finalUrl = hasPathQueries ? injectPathQueriesIntoUrl(url, path) : url;
    const finalQueries = !isEmpty(query) ? `?${stringify(query)}` : "";

    return request(
      {
        url: `${getUrlWithoutQueries(finalUrl)}${finalQueries}`,
        method: method.toLocaleUpperCase(),
        ...(isObject(data) && !isArray(data) && isEmpty(data)
          ? {}
          : { params: data }),
        ...omit(otherAxiosConfig, ["url", "data", "method", "params"]),
      },
      isFormData
    );
  };
};

export const generatorAPIS = <T extends Record<string, string>>(
  request: RequestInstance<any>,
  apis: T
) =>
  Object.keys(apis).reduce(
    (acc, key) => ({
      ...acc,
      [key]: apiTransfer(request, apis[key]),
    }),
    {}
  ) as Record<keyof T, (...args: RequestParams) => Promise<any>>;
