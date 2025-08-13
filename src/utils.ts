export const isArray = (params: any) => {
  return Object.prototype.toString.call(params) === "[object Array]";
};

export function isEmpty(value: any) {
  // 1. 检查 null 或 undefined
  if (value == null) return true;

  // 2. 检查布尔值
  if (typeof value === "boolean") return false;

  // 3. 检查数字（NaN, Infinity 视为非空）
  if (typeof value === "number") return isNaN(value) || value === 0;

  // 4. 检查字符串
  if (typeof value === "string") return value.trim().length === 0;

  // 5. 检查数组
  if (isArray(value)) return value.length === 0;

  // 6. 检查对象
  if (isObject(value)) return Object.keys(value).length === 0;

  // 7. 检查 Map 和 Set
  if (value instanceof Map || value instanceof Set) return value.size === 0;

  // 8. 其他类型一律视为空
  return false;
}

export const isObject = (value: any) => {
  return (
    value !== null &&
    (typeof value === "object" || typeof value === "function") &&
    !isArray(value) &&
    !(value instanceof Date) &&
    !(value instanceof Map)
  );
};

export const omit = (obj: Record<string, any>, keys: string[]) => {
  const newObj = { ...obj };
  keys.forEach((key) => {
    delete newObj[key];
  });
  return newObj;
};

export const injectPathQueriesIntoUrl = (
  url: string,
  pathQueries: Record<string, string>
) => url.replace(/{([^{]*)}/g, (_, b) => pathQueries[b]);

export const getUrlWithoutQueries = (url: string) => {
  const [baseUrl] = url.split("?");
  return baseUrl;
};