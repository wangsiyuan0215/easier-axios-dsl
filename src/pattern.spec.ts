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
  });

  describe("getPathKeys", () => {
    it.concurrent("should extract path keys from request string", async () => {
      const requestString = "GET /api/v1/users/{userId}/posts/{postId} path:userId,postId";
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
