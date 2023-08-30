import type { AxiosRequestConfig } from 'axios';
import type { BasicResponse, RequestInstance } from './typing';
type MajorPayload = Record<string, any> | any[];
type OtherPayload = Record<string, any>;
type AxiosConfig = AxiosRequestConfig;
export declare const generatorAPIS: <T extends Record<string, string>>(request: RequestInstance<any>, apis: T) => Record<keyof T, (args_0: MajorPayload, args_1?: OtherPayload | undefined, args_2?: AxiosConfig | undefined) => Promise<BasicResponse<any>>>;
export {};
