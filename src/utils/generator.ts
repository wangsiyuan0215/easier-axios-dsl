/* eslint-disable prefer-regex-literals */
import qs from 'qs'
import { isArray, isEmpty, isObject, omit } from 'lodash-es'
import type { AxiosRequestConfig } from 'axios'

import type { RequestInstance } from './typing'

/* 一般情况下，使用此参数即可 */
type MajorPayload = Record<string, any> | any[]

// 仅当 data 传递数组类型，且需要传递额外的 query 或 path 时使用此参数
type OtherPayload = Record<string, any>

// Axios 运行时配置，如果需要配置此参数，请将第二个参数设置为 undefined
type AxiosConfig = AxiosRequestConfig

type RequestParams = [MajorPayload?, OtherPayload?, AxiosConfig?]

const injectPathQueriesIntoUrl = (url: string, pathQueries: Record<string, string>) =>
  url.replace(/{(.*)}/g, (_, b) => pathQueries[b])

const SEPARATOR = /\s{1,}/
const COMMON_PATTERN = '*'
const IF_DATA_IS_ARRAY = /\s\[d|(data)]\s?/
const IF_DATA_IS_FORM_DATA = /\s(d|(data))\.(f|formData):/
const MATCH_DATA_STRING = new RegExp('(?<=\\s(d|(data))(\\.(f|formData))?:)(\\S*)')
const MATCH_PATH_STRING = new RegExp('(?<=\\spath:)(\\S*)')
const MATCH_QUERY_STRING = new RegExp('(?<=\\s(q|query):)(\\S*)')

const getNewObjectByKeysFrom = (target?: OtherPayload, keys?: string[]) => {
  if (!target || !keys?.length) return {};
  return keys.reduce((acc: Record<string, any>, key: string) => ({ ...acc, [key]: target[key] }), {})
}

const apiTransfer = (request: RequestInstance<any>, requestString: string) => {
  const [method, url] = requestString.split(SEPARATOR)
  const isDataArray = IF_DATA_IS_ARRAY.test(requestString)
  const [pathKeysString] = requestString.match(MATCH_PATH_STRING) || []
  const [queryKeysString] = requestString.match(MATCH_QUERY_STRING) || []
  const [paramsKeysString] = requestString.match(MATCH_DATA_STRING) || []

  const hasPathQueries = !!pathKeysString

  const pathKeys = pathKeysString?.split(',') || []
  const queryKeys = queryKeysString?.split(',') || []

  const isFormData = !isDataArray ? IF_DATA_IS_FORM_DATA.test(requestString) : false
  const isPatternData = paramsKeysString === COMMON_PATTERN

  return (...args: RequestParams) => {
    let data
    let path
    let query
    const [majorPayload, otherPayload = {}, otherAxiosConfig = {}] = args

    if (isDataArray) {
      data = majorPayload
      path = getNewObjectByKeysFrom(otherPayload, pathKeys)
      query = getNewObjectByKeysFrom(otherPayload, queryKeys)
    } else {
      const omittedParams = omit(majorPayload, [...queryKeys, ...pathKeys])
      data =
        isPatternData || isFormData
          ? omittedParams
          : getNewObjectByKeysFrom(omittedParams, paramsKeysString?.split(',') || [])
      path = getNewObjectByKeysFrom(majorPayload, pathKeys)
      query = getNewObjectByKeysFrom(majorPayload, queryKeys)
    }
    const finalUrl = hasPathQueries ? injectPathQueriesIntoUrl(url, path) : url
    const finalQueries = !isEmpty(query) ? `?${qs.stringify(query)}` : ''

    return request(
      {
        url: `${finalUrl}${finalQueries}`,
        method: method.toLocaleUpperCase(),
        ...(isObject(data) && !isArray(data) && isEmpty(data) ? {} : { params: data }),
        ...omit(otherAxiosConfig, ['url', 'data', 'method', 'params']),
      },
      isFormData
    )
  }
}

export const generatorAPIS = <T extends Record<string, string>>(request: RequestInstance<any>, apis: T) =>
  Object.keys(apis).reduce(
    (acc, key) => ({
      ...acc,
      [key]: apiTransfer(request, apis[key]),
    }),
    {}
  ) as Record<keyof T, (...args: RequestParams) => Promise<any>>
