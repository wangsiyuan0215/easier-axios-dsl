import { omit } from "./utils";

import type { Payload, ArrayData } from "./typing";

export const getNewObjectByKeysFrom = (target?: Payload, keys?: string[]) => {
  if (!target || !keys?.length) return {};
  return keys.reduce(
    (acc: Record<string, any>, key: string) => ({ ...acc, [key]: target[key] }),
    {}
  );
};

export const getRequestParamsIfDataIsArray = (
  majorPayload: ArrayData,
  otherPayload?: Payload,
  pathKeys?: string[],
  queryKeys?: string[]
): [ArrayData, Partial<Payload>, Partial<Payload>] => {
  return [
    majorPayload,
    getNewObjectByKeysFrom(otherPayload, pathKeys),
    getNewObjectByKeysFrom(otherPayload, queryKeys),
  ];
};

export const getRequestParams = (
  majorPayload: Payload,
  isPatternData: boolean,
  isFormData: boolean,
  paramsKeys?: string[],
  pathKeys?: string[],
  queryKeys?: string[]
): [Partial<Payload>, Partial<Payload>, Partial<Payload>] => {
  const omittedParams = omit(majorPayload, [
    ...(queryKeys || []),
    ...(pathKeys || []),
  ]);
  return [
    // data
    isPatternData || isFormData
      ? omittedParams
      : getNewObjectByKeysFrom(
          omittedParams,
          paramsKeys || []
        ),
    // path
    getNewObjectByKeysFrom(majorPayload, pathKeys),
    // queries
    getNewObjectByKeysFrom(majorPayload, queryKeys),
  ];
};
