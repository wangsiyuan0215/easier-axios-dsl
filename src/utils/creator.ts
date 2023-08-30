import axios, { AxiosRequestConfig, Method } from 'axios'

import type { BasicResponse, Options, RequestInstance } from './typing'

// 默认超时时间
const TIMEOUT = {
    DEFAULT: 60000,
    UPLOADING: 5 * 60000,
  }
  
  // 默认请求内容类型
  const CONTENT_TYPES = {
    JSON: 'application/json',
    FORM_DATA: 'multipart/form-data',
  }
  
  // 请求方法
  const METHODS: Record<string, Method> = {
    GET: 'GET',
    PUT: 'PUT',
    POST: 'POST',
    DELETE: 'DELETE',
  }
  
  export const creator = <T extends any>({
    // 请求拦截器
    requestInterceptors,
    // 响应拦截器
    responseInterceptors,
    // 如果需要 auth token 的话，指定 token 的 localStorage 的 key 
    authorizationToken,
    // axios 配置
    ...restOptions
  }: AxiosRequestConfig & Options<T>): RequestInstance<T> => {
    const api = axios.create({
      timeout: TIMEOUT.DEFAULT, // 请求 60s 超时
      ...restOptions,
    })
  
    // 请求拦截器
    if (requestInterceptors.length) api.interceptors.request.use(...requestInterceptors)
  
    // 响应拦截器
    if (responseInterceptors.length) api.interceptors.response.use(...responseInterceptors)
  
    return function request(
      { method, url, params, responseType },
      isFormData = false
    ): Promise<BasicResponse<T>> {
      let authorization: string = ''
      if (authorizationToken) {
        try {
          authorization = localStorage.getItem(authorizationToken) ?? ''
        } catch (error) {
          authorization = ''
        }
      }
      return api({
        url,
        method,
        data:
          method === METHODS.POST || method === METHODS.PUT
            ? isFormData
              ? Object.keys(params).reduce(
                  (acc: FormData, key) => (
                    // eslint-disable-next-line no-sequences
                    acc.append(key, params[key]), acc
                  ),
                  new FormData()
                )
              : params
            : undefined,
        params: method === METHODS.GET || method === METHODS.DELETE ? params : null,
        headers: {
          ...(authorizationToken ? { authorization } : {}),
          'Content-Type': isFormData ? CONTENT_TYPES.FORM_DATA : CONTENT_TYPES.JSON,
        },
        ...(responseType ? { responseType } : {}),
      }).then((res) => res.data)
    }
  }
  