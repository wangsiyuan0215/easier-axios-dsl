import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  ResponseType,
} from "axios";

import { METHODS, type Method } from "./methods";

import type { InitConfig, RequestConfig, RequestInstance } from "./typing";

// 默认超时时间
const TIMEOUT_DEFAULT = 3000;

// 默认请求内容类型
const CONTENT_TYPES = {
  JSON: "application/json",
  FORM_DATA: "multipart/form-data",
};

const RESPONSE_TYPE: Record<string, ResponseType> = {
  JSON: "json",
  TEXT: "text",
  BLOB: "blob",
  ARRAY_BUFFER: "arraybuffer",
  STREAM: "stream",
  DOCUMENT: "document",
};

export const creator = ({
  // 请求拦截器
  requestInterceptors,
  // 响应拦截器
  responseInterceptors,
  // Axios 静态全局配置
  ...axiosGlobalStaticOptions
}: InitConfig): RequestInstance => {
  const instance = axios.create({
    timeout: TIMEOUT_DEFAULT,
    ...axiosGlobalStaticOptions,
  });

  // 请求拦截器
  if (requestInterceptors.length)
    instance.interceptors.request.use(...requestInterceptors);

  // 响应拦截器
  if (responseInterceptors.length)
    instance.interceptors.response.use(...responseInterceptors);

  type RestOptions = Omit<
    AxiosRequestConfig,
    "url" | "method" | "params" | "data"
  >;

  return async function request<T extends any>({
    url,
    method,
    data,
    params,
    returnResponse,
    __isFormData,
    ...restOptions
  }: RequestConfig): Promise<T | AxiosResponse<T>> {
    const {
      headers = {},
      responseType,
      ...restRuntimeOptions
    } = (restOptions || {}) as RestOptions;

    try {
      const res = await instance({
        url,
        method,
        headers: {
          ...headers,
          "Content-Type": __isFormData
            ? CONTENT_TYPES.FORM_DATA
            : (headers && headers["Content-Type"]) || CONTENT_TYPES.JSON,
        },
        ...([METHODS.POST, METHODS.PUT, METHODS.PATCH].includes(
          method as Method
        )
          ? {
              data: __isFormData
                ? Object.keys(params).reduce(
                    (acc: FormData, key) => (acc.append(key, params[key]), acc),
                    new FormData()
                  )
                : params,
            }
          : {}),
        ...([
          METHODS.GET,
          METHODS.DELETE,
          METHODS.OPTIONS,
          METHODS.HEAD,
        ].includes(method as Method)
          ? { params }
          : {}),
        ...restRuntimeOptions,
      });
      return [
        RESPONSE_TYPE.BLOB,
        RESPONSE_TYPE.STREAM,
        RESPONSE_TYPE.DOCUMENT,
        RESPONSE_TYPE.ARRAY_BUFFER,
      ].includes(responseType as ResponseType) || returnResponse
        ? res
        : res.data;
    } catch (error) {
      throw error;
    }
  };
};
