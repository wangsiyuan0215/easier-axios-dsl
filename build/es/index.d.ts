import { AxiosRequestConfig } from 'axios';
import { AxiosResponse } from 'axios';

declare type ArrayData = any[];

export declare const init: (config: InitConfig) => {
    generatorAPIS: <T extends Record<string, string>>(apis: T) => Record<keyof T, <U extends any>(...args: RequestParams) => Promise<U>>;
    requestInstance: RequestInstance;
};

declare type InitConfig = AxiosRequestConfig & Options;

declare type MajorPayload = Payload | ArrayData;

declare type OnFulfilled<T extends AxiosRequestConfig> = (
value: T
) => T | Promise<T>;

declare type OnRejected = (error: any) => any;

declare type Options = {
    requestInterceptors: [OnFulfilled<AxiosRequestConfig>, OnRejected];
    responseInterceptors: [OnFulfilled<AxiosResponse>, OnRejected];
};

declare type Payload = Record<string, any>;

declare type RequestConfig = AxiosRequestConfig & {
    __isFormData?: boolean;
    returnResponse?: boolean;
};

declare type RequestInstance = <T extends any>(
options: RequestConfig
) => Promise<T | AxiosResponse<T>>;

declare type RequestParams = [MajorPayload?, Payload?, RequestConfig?];

export { }
