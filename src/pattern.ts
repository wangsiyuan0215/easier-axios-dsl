export const Regexp_SEPARATOR = /\s{1,}/;

export const Regexp_COMMON_PATTERN = "*";

export const Regexp_IF_DATA_IS_ARRAY = /\s\[d|(data)]\s?/;

export const Regexp_IF_DATA_IS_FORM_DATA = /\s(d|(data))\.(f|formData):/;

export const Regexp_MATCH_DATA_STRING =
  /\s+(d|data)(\.(f|formData))?:(\S*)(\s|$)/;

export const Regexp_MATCH_PATH_STRING = /\s+path:(\S*)(\s|$)/;

export const Regexp_MATCH_QUERY_STRING = /\s+(q|query):(\S*)(\s|$)/;

export const getMethodAndUrl = (requestString: string) => {
  const [method, url] = requestString.split(Regexp_SEPARATOR);
  return { method, url };
};

export const getPathKeys = (requestString: string) => {
  const [, pathKeysString] =
    requestString.match(Regexp_MATCH_PATH_STRING) || [];
  return pathKeysString?.split(",") || [];
};

export const getQueryKeys = (requestString: string) => {
  const [, , queryKeysString] =
    requestString.match(Regexp_MATCH_QUERY_STRING) || [];
  return queryKeysString?.split(",") || [];
};

export const getParamsKeys = (requestString: string) => {
  const [, , , , paramsKeysString] =
    requestString.match(Regexp_MATCH_DATA_STRING) || [];
  return paramsKeysString?.split(",") || [];
};

export const checkIsDataArray = (requestString: string) => {
  return Regexp_IF_DATA_IS_ARRAY.test(requestString);
};

export const checkIsFormData = (requestString: string) => {
  return Regexp_IF_DATA_IS_FORM_DATA.test(requestString);
};

export const checkIsPatternData = (paramsKeys: string[]): boolean => {
  return !!paramsKeys?.length && paramsKeys[0] === Regexp_COMMON_PATTERN;
};
