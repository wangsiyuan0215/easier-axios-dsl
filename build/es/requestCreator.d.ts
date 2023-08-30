import { AxiosRequestConfig } from 'axios';
import type { Options, RequestInstance } from './typing';
export declare const requestCreator: <T extends unknown>({ requestInterceptors, responseInterceptors, authorizationToken, ...restOptions }: AxiosRequestConfig<any> & Options<T>) => RequestInstance<T>;
