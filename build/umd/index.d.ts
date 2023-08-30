import { AxiosRequestConfig } from 'axios';
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

declare type AxiosConfig = AxiosRequestConfig;

declare interface BasicResponse<T> {
    code?: StatusCodes
    data?: T
    exceptionInfo?: ExceptionInfo
    msg?: string
    pageIndex?: number
    pageSize?: number
    total?: number
}

declare interface ExceptionInfo {
    exceptionCode: string
    messageEn: string
    messageCn: string
    businessDomain: string
    others: unknown
}

export declare const G: <T extends Record<string, string>>(request: RequestInstance<any>, apis: T) => Record<keyof T, (args_0: MajorPayload, args_1?: OtherPayload | undefined, args_2?: AxiosConfig | undefined) => Promise<BasicResponse<any>>>;

declare type MajorPayload = Record<string, any> | any[];

declare type OnFulfilled<T extends AxiosRequestConfig> = (value: T) => T | Promise<T>

declare type OnRejected = (error: any) => any

declare type Options<T> = {
    requestInterceptors: [OnFulfilled<AxiosRequestConfig>, OnRejected]
    responseInterceptors: [OnFulfilled<AxiosResponse<BasicResponse<T>>>, OnRejected]
    authorizationToken?: string
}

declare type OtherPayload = Record<string, any>;

export declare const requestCreator: <T extends unknown>({ requestInterceptors, responseInterceptors, authorizationToken, ...restOptions }: AxiosRequestConfig<any> & Options<T>) => RequestInstance<T>;

declare type RequestInstance<T extends any> = (
options: any,
isFormData?: boolean
) => Promise<BasicResponse<T>>

export { }
