import { AxiosRequestConfig } from 'axios';
import { AxiosResponse } from 'axios';

declare type ArrayData = any[];

declare type AxiosConfig = AxiosRequestConfig;

export declare const G: <T extends Record<string, string>>(request: RequestInstance<any>, apis: T) => Record<keyof T, (...args: RequestParams) => Promise<any>>;

declare type MajorPayload = Payload | ArrayData;

declare type OnFulfilled<T extends AxiosRequestConfig> = (value: T) => T | Promise<T>

declare type OnRejected = (error: any) => any

declare type Options<T extends any> = {
    requestInterceptors: [OnFulfilled<AxiosRequestConfig>, OnRejected]
    responseInterceptors: [OnFulfilled<AxiosResponse<T>>, OnRejected]
}

declare type Payload = Record<string, any>;

export declare const requestCreator: <T extends unknown>({ requestInterceptors, responseInterceptors, ...axiosGlobalStaticOptions }: AxiosRequestConfig & Options<T>) => RequestInstance<T>;

declare type RequestInstance<T extends any> = (
options: any,
isFormData?: boolean
) => Promise<T>

declare type RequestParams = [MajorPayload?, Payload?, AxiosConfig?];

export { }
