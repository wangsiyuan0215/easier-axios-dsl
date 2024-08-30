import { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface ExceptionInfo {
  exceptionCode: string
  messageEn: string
  messageCn: string
  businessDomain: string
  others: unknown
}

export type OnFulfilled<T extends AxiosRequestConfig> = (value: T) => T | Promise<T>
export type OnRejected = (error: any) => any
export type Options<T extends any> = {
  requestInterceptors: [OnFulfilled<AxiosRequestConfig>, OnRejected]
  responseInterceptors: [OnFulfilled<AxiosResponse<T>>, OnRejected]
}

export type RequestInstance<T extends any> = (
  options: any,
  isFormData?: boolean
) => Promise<T>
