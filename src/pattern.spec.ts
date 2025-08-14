import { describe, it, expect } from "vitest";

import {
  getMethodAndUrl,
  getPathKeys,
  getQueryKeys,
  getParamsKeys,
  checkIsDataArray,
  checkIsFormData,
  checkIsPatternData,
} from "./pattern";

describe("pattern", () => {
  describe("getMethodAndUrl", () => {
    it.concurrent("should extract method and URL from request string", async () => {
      const requestString = "GET /api/v1/users";
      const result = getMethodAndUrl(requestString);

      expect(result).toEqual({
        method: "GET",
        url: "/api/v1/users",
      });
    });

    it.concurrent("should handle POST requests", async () => {
      const requestString = "POST /api/v1/users d:name,email";
      const result = getMethodAndUrl(requestString);

      expect(result).toEqual({
        method: "POST",
        url: "/api/v1/users",
      });
    });

    it.concurrent("should handle PUT requests", async () => {
      const requestString = "PUT /api/v1/users/{id} path:id d:name";
      const result = getMethodAndUrl(requestString);

      expect(result).toEqual({
        method: "PUT",
        url: "/api/v1/users/{id}",
      });
    });

    it.concurrent("should handle DELETE requests", async () => {
      const requestString = "DELETE /api/v1/users/{id} path:id";
      const result = getMethodAndUrl(requestString);

      expect(result).toEqual({
        method: "DELETE",
        url: "/api/v1/users/{id}",
      });
    });

    it.concurrent("should handle complex URLs", async () => {
      const requestString = "GET /api/v1/users/{userId}/posts/{postId} path:userId,postId q:page,size";
      const result = getMethodAndUrl(requestString);

      expect(result).toEqual({
        method: "GET",
        url: "/api/v1/users/{userId}/posts/{postId}",
      });
    });

    it.concurrent("should handle URLs with query parameters", async () => {
      const requestString = "GET /api/v1/users?page=1&size=10 q:sort,order";
      const result = getMethodAndUrl(requestString);

      expect(result).toEqual({
        method: "GET",
        url: "/api/v1/users?page=1&size=10",
      });
    });

    it.concurrent("should handle URLs without leading slash", async () => {
      const requestString = "GET api/v1/users";
      const result = getMethodAndUrl(requestString);

      expect(result).toEqual({
        method: "GET",
        url: "api/v1/users",
      });
    });

    it.concurrent("should handle URLs with path parameters without leading slash", async () => {
      const requestString = "GET api/v1/users/{id} path:id";
      const result = getMethodAndUrl(requestString);

      expect(result).toEqual({
        method: "GET",
        url: "api/v1/users/{id}",
      });
    });

    it.concurrent("should handle complex URLs without leading slash", async () => {
      const requestString = "GET api/v1/users/{userId}/posts/{postId} path:userId,postId";
      const result = getMethodAndUrl(requestString);

      expect(result).toEqual({
        method: "GET",
        url: "api/v1/users/{userId}/posts/{postId}",
      });
    });

    // 异常情况测试 - HTTP 方法相关
    it.concurrent("should throw error for invalid HTTP method", async () => {
      const requestString = "INVALID /api/v1/users";
      
      expect(() => {
        getMethodAndUrl(requestString);
      }).toThrow(/Invalid method: INVALID/);
    });

    it.concurrent("should throw error for empty method", async () => {
      const requestString = " /api/v1/users";
      
      expect(() => {
        getMethodAndUrl(requestString);
      }).toThrow(/Invalid method: /);
    });

    it.concurrent("should throw error for missing method", async () => {
      const requestString = "/api/v1/users";
      
      expect(() => {
        getMethodAndUrl(requestString);
      }).toThrow(/Invalid method: \/api\/v1\/users/);
    });

    it.concurrent("should handle case-insensitive method", async () => {
      const requestString = "get /api/v1/users";
      const result = getMethodAndUrl(requestString);

      expect(result).toEqual({
        method: "get",
        url: "/api/v1/users",
      });
    });

    // 异常情况测试 - URL 相关
    it.concurrent("should throw error for empty URL", async () => {
      const requestString = "GET ";
      
      expect(() => {
        getMethodAndUrl(requestString);
      }).toThrow(/Invalid url: /);
    });

    it.concurrent("should throw error for whitespace-only URL", async () => {
      const requestString = "GET   ";
      
      expect(() => {
        getMethodAndUrl(requestString);
      }).toThrow(/Invalid url: /);
    });

    it.concurrent("should handle URL with spaces in request string", async () => {
      const requestString = "GET /api/v1/users with spaces";
      const result = getMethodAndUrl(requestString);

      expect(result).toEqual({
        method: "GET",
        url: "/api/v1/users",
      });
    });

    it.concurrent("should throw error for URL with invalid characters", async () => {
      const requestString = "GET /api/v1/users@#$%";
      
      expect(() => {
        getMethodAndUrl(requestString);
      }).toThrow(/Invalid url: \/api\/v1\/users@#\$%/);
    });

    it.concurrent("should throw error for URL with invalid path parameter format", async () => {
      const requestString = "GET /api/v1/users/{invalid-param}";
      
      expect(() => {
        getMethodAndUrl(requestString);
      }).toThrow(/Invalid url: \/api\/v1\/users\/\{invalid-param\}/);
    });

    it.concurrent("should throw error for URL with empty path parameter", async () => {
      const requestString = "GET /api/v1/users/{}";
      
      expect(() => {
        getMethodAndUrl(requestString);
      }).toThrow(/Invalid url: \/api\/v1\/users\/\{\}/);
    });

    it.concurrent("should throw error for URL with path parameter starting with number", async () => {
      const requestString = "GET /api/v1/users/{1param}";
      
      expect(() => {
        getMethodAndUrl(requestString);
      }).toThrow(/Invalid url: \/api\/v1\/users\/\{1param\}/);
    });

    it.concurrent("should throw error for URL with consecutive slashes", async () => {
      const requestString = "GET //api/v1/users";
      
      expect(() => {
        getMethodAndUrl(requestString);
      }).toThrow(/Invalid url: \/\/api\/v1\/users/);
    });

    it.concurrent("should throw error for URL ending with slash", async () => {
      const requestString = "GET /api/v1/users/";
      
      expect(() => {
        getMethodAndUrl(requestString);
      }).toThrow(/Invalid url: \/api\/v1\/users\//);
    });

    it.concurrent("should handle URL with spaces in query parameter", async () => {
      const requestString = "GET /api/v1/users?page=1&invalid param=value";
      const result = getMethodAndUrl(requestString);

      expect(result).toEqual({
        method: "GET",
        url: "/api/v1/users?page=1&invalid",
      });
    });

    it.concurrent("should throw error for URL with only query parameter", async () => {
      const requestString = "GET ?page=1";
      
      expect(() => {
        getMethodAndUrl(requestString);
      }).toThrow(/Invalid url: \?page=1/);
    });

    it.concurrent("should handle URL with invalid domain format", async () => {
      const requestString = "GET invalid-domain/users";
      const result = getMethodAndUrl(requestString);

      expect(result).toEqual({
        method: "GET",
        url: "invalid-domain/users",
      });
    });

    it.concurrent("should handle URL with spaces in path segment", async () => {
      const requestString = "GET /api/v1/users/path with spaces";
      const result = getMethodAndUrl(requestString);

      expect(result).toEqual({
        method: "GET",
        url: "/api/v1/users/path",
      });
    });

    // 边界情况测试
    it.concurrent("should handle URL with single character path", async () => {
      const requestString = "GET /a";
      const result = getMethodAndUrl(requestString);

      expect(result).toEqual({
        method: "GET",
        url: "/a",
      });
    });

    it.concurrent("should handle URL with single path parameter", async () => {
      const requestString = "GET /{a}";
      const result = getMethodAndUrl(requestString);

      expect(result).toEqual({
        method: "GET",
        url: "/{a}",
      });
    });

    it.concurrent("should handle URL with underscore in path", async () => {
      const requestString = "GET /api_v1/users";
      const result = getMethodAndUrl(requestString);

      expect(result).toEqual({
        method: "GET",
        url: "/api_v1/users",
      });
    });

    it.concurrent("should handle URL with hyphen in path", async () => {
      const requestString = "GET /api-v1/users";
      const result = getMethodAndUrl(requestString);

      expect(result).toEqual({
        method: "GET",
        url: "/api-v1/users",
      });
    });

    it.concurrent("should handle URL with dot in path", async () => {
      const requestString = "GET /api.v1/users";
      const result = getMethodAndUrl(requestString);

      expect(result).toEqual({
        method: "GET",
        url: "/api.v1/users",
      });
    });

    it.concurrent("should handle URL with numbers in path", async () => {
      const requestString = "GET /api/v1/users/123";
      const result = getMethodAndUrl(requestString);

      expect(result).toEqual({
        method: "GET",
        url: "/api/v1/users/123",
      });
    });
  });

  describe("getPathKeys", () => {
    it.concurrent("should extract path keys from request string", async () => {
      const requestString = "GET /api/v1/users/{userId}/posts/{postId} path:userId,postId";
      const result = getPathKeys(requestString);

      expect(result).toEqual(["userId", "postId"]);
    });

    it.concurrent("should return * when multiple path keys", async () => {
      const requestString = "GET /api/v1/users/{userId}/posts/{postId} path:* path:userId,postId";
      const result = getPathKeys(requestString);

      expect(result).toEqual(["*"]);
    });

    it.concurrent("should return `userId and postId` when multiple path keys and the format of first `path` is invalid", async () => {
      const requestString = "GET /api/v1/users/{userId}/posts/{postId} path* path:userId,postId";
      const result = getPathKeys(requestString);

      expect(result).toEqual(["userId", "postId"]);
    });

    it.concurrent("should handle single path key", async () => {
      const requestString = "GET /api/v1/users/{id} path:id";
      const result = getPathKeys(requestString);

      expect(result).toEqual(["id"]);
    });

    it.concurrent("should return empty array when no path keys", async () => {
      const requestString = "GET /api/v1/users";
      const result = getPathKeys(requestString);

      expect(result).toEqual([]);
    });

    it.concurrent("should handle path keys with spaces", async () => {
      const requestString = "GET /api/v1/users/{userId}/posts/{postId} path:userId,postId";
      const result = getPathKeys(requestString);

      expect(result).toEqual(["userId", "postId"]);
    });

    it.concurrent("should handle empty path keys", async () => {
      const requestString = "GET /api/v1/users path:";
      const result = getPathKeys(requestString);

      expect(result).toEqual([""]);
    });
  });

  describe("getQueryKeys", () => {
    it.concurrent("should extract query keys from request string", async () => {
      const requestString = "GET /api/v1/users q:page,size";
      const result = getQueryKeys(requestString);

      expect(result).toEqual(["page", "size"]);
    });

    it.concurrent("should return * when multiple query keys", async () => {
      const requestString = "GET /api/v1/users q:* q:page,size";
      const result = getQueryKeys(requestString);

      expect(result).toEqual(["*"]);
    });

    it.concurrent("should return `page and size` when multiple query keys and the format of first `q` is invalid", async () => {
      const requestString = "GET /api/v1/users q* q:page,size";
      const result = getQueryKeys(requestString);

      expect(result).toEqual(["page", "size"]);
    });

    it.concurrent("should handle single query key", async () => {
      const requestString = "GET /api/v1/users q:page";
      const result = getQueryKeys(requestString);

      expect(result).toEqual(["page"]);
    });

    it.concurrent("should return empty array when no query keys", async () => {
      const requestString = "GET /api/v1/users";
      const result = getQueryKeys(requestString);

      expect(result).toEqual([]);
    });

    it.concurrent("should handle query keys with spaces", async () => {
      const requestString = "GET /api/v1/users q:page,size";
      const result = getQueryKeys(requestString);

      expect(result).toEqual(["page", "size"]);
    });

    it.concurrent("should handle empty query keys", async () => {
      const requestString = "GET /api/v1/users q:";
      const result = getQueryKeys(requestString);

      expect(result).toEqual([""]);
    });

    it.concurrent("should handle query with 'query' keyword", async () => {
      const requestString = "GET /api/v1/users query:page,size";
      const result = getQueryKeys(requestString);

      expect(result).toEqual(["page", "size"]);
    });
  });

  describe("getParamsKeys", () => {
    it.concurrent("should extract params keys from request string", async () => {
      const requestString = "POST /api/v1/users d:name,email";
      const result = getParamsKeys(requestString);

      expect(result).toEqual(["name", "email"]);
    });

    it.concurrent("should handle single param key", async () => {
      const requestString = "POST /api/v1/users d:name";
      const result = getParamsKeys(requestString);

      expect(result).toEqual(["name"]);
    });

    it.concurrent("should return empty array when no params keys", async () => {
      const requestString = "GET /api/v1/users";
      const result = getParamsKeys(requestString);

      expect(result).toEqual([]);
    });

    it.concurrent("should return * when multiple params keys", async () => {
      const requestString = "POST /api/v1/users d:* d:name,email d:file,description";
      const result = getParamsKeys(requestString);

      expect(result).toEqual(["*"]);
    })

    it.concurrent("should return `name and email` when multiple params keys and the format of first `d` is invalid", async () => {
      const requestString = "POST /api/v1/users d* d:name,email d:file,description";
      const result = getParamsKeys(requestString);

      expect(result).toEqual(["name", "email"]);
    })

    it.concurrent("should handle params keys with spaces", async () => {
      const requestString = "POST /api/v1/users d:name,email";
      const result = getParamsKeys(requestString);

      expect(result).toEqual(["name", "email"]);
    });

    it.concurrent("should handle empty params keys", async () => {
      const requestString = "POST /api/v1/users d:";
      const result = getParamsKeys(requestString);

      expect(result).toEqual([""]);
    });

    it.concurrent("should handle data keyword", async () => {
      const requestString = "POST /api/v1/users data:name,email";
      const result = getParamsKeys(requestString);

      expect(result).toEqual(["name", "email"]);
    });

    it.concurrent("should handle form data params", async () => {
      const requestString = "POST /api/v1/upload d.f:file,description";
      const result = getParamsKeys(requestString);

      expect(result).toEqual(["file", "description"]);
    });

    it.concurrent("should handle data.formData keyword", async () => {
      const requestString = "POST /api/v1/upload data.formData:file,description";
      const result = getParamsKeys(requestString);

      expect(result).toEqual(["file", "description"]);
    });
  });

  describe("checkIsDataArray", () => {
    it.concurrent("should return true for array data pattern", async () => {
      const requestString = "POST /api/v1/users [d]";
      const result = checkIsDataArray(requestString);

      expect(result).toBe(true);
    });

    it.concurrent("should return true for array data with data keyword", async () => {
      const requestString = "POST /api/v1/users [data]";
      const result = checkIsDataArray(requestString);

      expect(result).toBe(true);
    });

    it.concurrent("should return false for non-array data", async () => {
      const requestString = "POST /api/v1/users d:name,email";
      const result = checkIsDataArray(requestString);

      expect(result).toBe(false);
    });

    it.concurrent("should return false for GET request", async () => {
      const requestString = "GET /api/v1/users q:page,size";
      const result = checkIsDataArray(requestString);

      expect(result).toBe(false);
    });

    it.concurrent("should return false for empty string", async () => {
      const requestString = "";
      const result = checkIsDataArray(requestString);

      expect(result).toBe(false);
    });

    it.concurrent("should handle array data with spaces", async () => {
      const requestString = "POST /api/v1/users [d] ";
      const result = checkIsDataArray(requestString);

      expect(result).toBe(true);
    });
  });

  describe("checkIsFormData", () => {
    it.concurrent("should return true for form data pattern", async () => {
      const requestString = "POST /api/v1/upload d.f:file,description";
      const result = checkIsFormData(requestString);

      expect(result).toBe(true);
    });

    it.concurrent("should return true for form data with data keyword", async () => {
      const requestString = "POST /api/v1/upload data.f:file,description";
      const result = checkIsFormData(requestString);

      expect(result).toBe(true);
    });

    it.concurrent("should return true for form data with formData keyword", async () => {
      const requestString = "POST /api/v1/upload d.formData:file,description";
      const result = checkIsFormData(requestString);

      expect(result).toBe(true);
    });

    it.concurrent("should return true for form data with data.formData keyword", async () => {
      const requestString = "POST /api/v1/upload data.formData:file,description";
      const result = checkIsFormData(requestString);

      expect(result).toBe(true);
    });

    it.concurrent("should return false for regular data", async () => {
      const requestString = "POST /api/v1/users d:name,email";
      const result = checkIsFormData(requestString);

      expect(result).toBe(false);
    });

    it.concurrent("should return false for GET request", async () => {
      const requestString = "GET /api/v1/users q:page,size";
      const result = checkIsFormData(requestString);

      expect(result).toBe(false);
    });

    it.concurrent("should return false for empty string", async () => {
      const requestString = "";
      const result = checkIsFormData(requestString);

      expect(result).toBe(false);
    });

    it.concurrent("should return false for array data", async () => {
      const requestString = "POST /api/v1/users [d]";
      const result = checkIsFormData(requestString);

      expect(result).toBe(false);
    });
  });

  describe("checkIsPatternData", () => {
    it.concurrent("should return true for wildcard pattern", async () => {
      const paramsKeys = ["*"];
      const result = checkIsPatternData(paramsKeys);

      expect(result).toBe(true);
    });

    it.concurrent("should return false for specific keys", async () => {
      const paramsKeys = ["name", "email"];
      const result = checkIsPatternData(paramsKeys);

      expect(result).toBe(false);
    });

    it.concurrent("should return false for empty array", async () => {
      const paramsKeys: string[] = [];
      const result = checkIsPatternData(paramsKeys);

      expect(result).toBe(false);
    });

    it.concurrent("should return false for null/undefined", async () => {
      expect(checkIsPatternData(null as any)).toBe(false);
      expect(checkIsPatternData(undefined as any)).toBe(false);
    });

    it.concurrent("should return false for non-wildcard first element", async () => {
      const paramsKeys = ["name", "*"];
      const result = checkIsPatternData(paramsKeys);

      expect(result).toBe(false);
    });

    it.concurrent("should return true for wildcard with other elements", async () => {
      const paramsKeys = ["*", "name", "email"];
      const result = checkIsPatternData(paramsKeys);

      expect(result).toBe(true);
    });
  });
});
