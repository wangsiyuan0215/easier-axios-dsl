/* eslint-disable prefer-regex-literals */
import { stringify } from "qs";
import type { Method } from "axios";

import { creator } from "./creator";
import { getRequestParamsIfDataIsArray, getRequestParams } from "./params";
import {
  getMethodAndUrl,
  getPathKeys,
  getQueryKeys,
  getParamsKeys,
  checkIsDataArray,
  checkIsFormData,
  checkIsPatternData,
} from "./pattern";
import {
  isArray,
  isEmpty,
  isObject,
  omit,
  injectPathQueriesIntoUrl,
  getUrlWithoutQueries,
} from "./utils";

import type { InitConfig, RequestInstance, RequestParams } from "./typing";

const apiStringToRequest = (
  instance: RequestInstance,
  requestString: string
) => {
  const pathKeys = getPathKeys(requestString);
  const queryKeys = getQueryKeys(requestString);
  const paramsKeys = getParamsKeys(requestString);

  const __HAS_PATH_QUERIES = !!pathKeys.length;
  const __IS_DATA_ARRAY = checkIsDataArray(requestString);
  const __IS_FORM_DATA = !__IS_DATA_ARRAY
    ? checkIsFormData(requestString)
    : false;
  const __IS_PATTERN_DATA = checkIsPatternData(paramsKeys);

  return <U extends any>(...args: RequestParams) => {
    const [majorPayload, otherPayload = {}, otherAxiosConfig = {}] = args;

    const [data, path, query] = __IS_DATA_ARRAY
      ? getRequestParamsIfDataIsArray(
          majorPayload as any[],
          otherPayload,
          pathKeys,
          queryKeys
        )
      : getRequestParams(
          majorPayload!,
          __IS_PATTERN_DATA,
          __IS_FORM_DATA,
          paramsKeys,
          pathKeys,
          queryKeys
        );

    const { method, url } = getMethodAndUrl(requestString);

    const finalUrl = __HAS_PATH_QUERIES
      ? injectPathQueriesIntoUrl(url, path)
      : url;
    const finalQueries = !isEmpty(query) ? `?${stringify(query)}` : "";

    return instance<U>({
      url: `${getUrlWithoutQueries(finalUrl)}${finalQueries}`,
      method: method.toLocaleUpperCase() as Method,
      ...(isObject(data) && !isArray(data) && isEmpty(data)
        ? {}
        : { params: data }),
      ...omit(otherAxiosConfig, [
        "url",
        "data",
        "method",
        "params",
        "returnResponse",
      ]),
      ...(__IS_FORM_DATA ? { __isFormData: __IS_FORM_DATA } : {}),
      ...(otherAxiosConfig.returnResponse ? { returnResponse: true } : {}),
    });
  };
};

export const init = (config: InitConfig) => {
  const instance = creator(config);

  const generatorAPIS = <T extends Record<string, string>>(apis: T) =>
    Object.keys(apis).reduce(
      (acc, key) => ({
        ...acc,
        [key]: apiStringToRequest(instance, apis[key]),
      }),
      {}
    ) as Record<keyof T, <U extends any>(...args: RequestParams) => Promise<U>>;

  return {
    generatorAPIS,
    requestInstance: instance,
  };
};
