import { StatusCodes } from 'http-status-codes'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface ExceptionInfo {
  exceptionCode: string
  messageEn: string
  messageCn: string
  businessDomain: string
  others: unknown
}

export interface BasicResponse<T> {
  code?: StatusCodes
  data?: T
  exceptionInfo?: ExceptionInfo
  msg?: string
  pageIndex?: number
  pageSize?: number
  total?: number
}

export type OnFulfilled<T extends AxiosRequestConfig> = (value: T) => T | Promise<T>
export type OnRejected = (error: any) => any
export type Options<T> = {
  requestInterceptors: [OnFulfilled<AxiosRequestConfig>, OnRejected]
  responseInterceptors: [OnFulfilled<AxiosResponse<BasicResponse<T>>>, OnRejected]
  authorizationToken?: string
}

export type RequestInstance<T extends any> = (
  options: any,
  isFormData?: boolean
) => Promise<BasicResponse<T>>
