import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export interface ExceptionInfo {
  exceptionCode: string;
  messageEn: string;
  messageCn: string;
  businessDomain: string;
  others: unknown;
}

export type OnFulfilled<T extends AxiosRequestConfig> = (
  value: T
) => T | Promise<T>;
export type OnRejected = (error: any) => any;
export type Options = {
  requestInterceptors: [OnFulfilled<AxiosRequestConfig>, OnRejected];
  responseInterceptors: [OnFulfilled<AxiosResponse>, OnRejected];
};
export type InitConfig = AxiosRequestConfig & Options;

export type RequestConfig = AxiosRequestConfig & {
  __isFormData?: boolean;
  returnResponse?: boolean;
};

export type RequestInstance = <T extends any>(
  options: RequestConfig
) => Promise<T | AxiosResponse<T>>;

type Payload = Record<string, any>;
type ArrayData = any[];
type MajorPayload = Payload | ArrayData;

type RequestParams = [MajorPayload?, Payload?, RequestConfig?];
