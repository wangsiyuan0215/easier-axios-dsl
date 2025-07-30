import axios, { AxiosRequestConfig, Method } from "axios";

import type { Options, RequestInstance } from "./typing";

// 默认超时时间
const TIMEOUT_DEFAULT = 60000;

// 默认请求内容类型
const CONTENT_TYPES = {
  JSON: "application/json",
  FORM_DATA: "multipart/form-data",
};

// 请求方法
const METHODS: Record<string, Method> = {
  GET: "GET",
  PUT: "PUT",
  POST: "POST",
  DELETE: "DELETE",
};

export const creator = <T extends any>({
  // 请求拦截器
  requestInterceptors,
  // 响应拦截器
  responseInterceptors,
  // Axios 静态全局配置
  ...axiosGlobalStaticOptions
}: AxiosRequestConfig & Options<T>): RequestInstance<T> => {
  const api = axios.create({
    timeout: TIMEOUT_DEFAULT,
    ...axiosGlobalStaticOptions,
  });

  // 请求拦截器
  if (requestInterceptors.length)
    api.interceptors.request.use(...requestInterceptors);

  // 响应拦截器
  if (responseInterceptors.length)
    api.interceptors.response.use(...responseInterceptors);

  type RestOptions = Omit<
    AxiosRequestConfig,
    "url" | "method" | "params" | "data"
  >;

  return async function request(
    {
      url,
      method,
      params,
      ...restOptions
    }: {
      url: AxiosRequestConfig["url"];
      method: AxiosRequestConfig["method"];
      params: AxiosRequestConfig["params"] | AxiosRequestConfig["data"];
    } & RestOptions,
    isFormData = false
  ) {
    const { headers = {}, ...restRuntimeOptions } = (restOptions || {}) as RestOptions;

    try {
      const { data } = await api({
        url,
        method,
        headers: {
          ...headers,
          "Content-Type": isFormData
            ? CONTENT_TYPES.FORM_DATA
            : (headers && headers["Content-Type"]) || CONTENT_TYPES.JSON,
        },
        ...(method === METHODS.POST || method === METHODS.PUT
          ? {
              data: isFormData
                ? Object.keys(params).reduce(
                    (acc: FormData, key) => (acc.append(key, params[key]), acc),
                    new FormData()
                  )
                : params,
            }
          : {}),
        ...(method === METHODS.GET || method === METHODS.DELETE
          ? { params }
          : {}),
        ...restRuntimeOptions,
      });
      return data;
    } catch (error) {
      throw error;
    }
  };
};
