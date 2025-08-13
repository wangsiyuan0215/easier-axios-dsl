import { describe, it, expect } from "vitest";

import { isArray, isEmpty, isObject, omit, injectPathQueriesIntoUrl, getUrlWithoutQueries } from "./utils";

describe("utils", () => {
  describe("isArray", () => {
    it.concurrent("should return true for arrays", async () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(["a", "b", "c"])).toBe(true);
      expect(isArray([null, undefined])).toBe(true);
      expect(isArray(new Array())).toBe(true);
    });

    it.concurrent("should return false for non-arrays", async () => {
      expect(isArray({})).toBe(false);
      expect(isArray("")).toBe(false);
      expect(isArray("array")).toBe(false);
      expect(isArray(1)).toBe(false);
      expect(isArray(0)).toBe(false);
      expect(isArray(null)).toBe(false);
      expect(isArray(undefined)).toBe(false);
      expect(isArray(true)).toBe(false);
      expect(isArray(false)).toBe(false);
      expect(isArray(() => {})).toBe(false);
      expect(isArray(new Date())).toBe(false);
      expect(isArray(new Map())).toBe(false);
      expect(isArray(new Set())).toBe(false);
    });
  });

  describe("isEmpty", () => {
    it.concurrent("should return true for null/undefined", async () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it.concurrent("should return false for boolean values", async () => {
      expect(isEmpty(true)).toBe(false);
      expect(isEmpty(false)).toBe(false);
    });

    it.concurrent("should handle numbers", async () => {
      expect(isEmpty(0)).toBe(true);
      expect(isEmpty(1)).toBe(false);
      expect(isEmpty(-1)).toBe(false);
      expect(isEmpty(3.14)).toBe(false);
      expect(isEmpty(NaN)).toBe(true);
      expect(isEmpty(Infinity)).toBe(false);
      expect(isEmpty(-Infinity)).toBe(false);
    });

    it.concurrent("should handle strings", async () => {
      expect(isEmpty("")).toBe(true);
      expect(isEmpty("   ")).toBe(true);
      expect(isEmpty("hello")).toBe(false);
      expect(isEmpty("0")).toBe(false);
      expect(isEmpty("false")).toBe(false);
    });

    it.concurrent("should handle arrays", async () => {
      expect(isEmpty([])).toBe(true);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty([""])).toBe(false);
      expect(isEmpty([null])).toBe(false);
    });

    it.concurrent("should handle objects", async () => {
      expect(isEmpty({})).toBe(true);
      expect(isEmpty({ a: 1 })).toBe(false);
      expect(isEmpty({ a: "" })).toBe(false);
      expect(isEmpty({ a: null })).toBe(false);
    });

    it.concurrent("should handle Map and Set", async () => {
      expect(isEmpty(new Map())).toBe(true);
      expect(isEmpty(new Map([["a", "A"]]))).toBe(false);
      expect(isEmpty(new Set())).toBe(true);
      expect(isEmpty(new Set([1, 2, 3]))).toBe(true);
    });

    it.concurrent("should handle other types", async () => {
      expect(isEmpty(new Date())).toBe(false);
      expect(isEmpty(() => {})).toBe(true);
      expect(isEmpty(Symbol())).toBe(false);
      expect(isEmpty(BigInt(0))).toBe(false);
    });
  });

  describe("isObject", () => {
    it.concurrent("should return true for objects", async () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
      expect(isObject(new Object())).toBe(true);
      expect(isObject(Object.create(null))).toBe(true);
    });

    it.concurrent("should return true for functions", async () => {
      expect(isObject(() => {})).toBe(true);
      expect(isObject(function() {})).toBe(true);
      expect(isObject(async () => {})).toBe(true);
    });

    it.concurrent("should return false for non-objects", async () => {
      expect(isObject([])).toBe(false);
      expect(isObject("")).toBe(false);
      expect(isObject("string")).toBe(false);
      expect(isObject(1)).toBe(false);
      expect(isObject(0)).toBe(false);
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject(true)).toBe(false);
      expect(isObject(false)).toBe(false);
      expect(isObject(new Date())).toBe(false);
      expect(isObject(new Map())).toBe(false);
    });
  });

  describe("omit", () => {
    it.concurrent("should omit specified keys from object", async () => {
      const obj = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
      };

      expect(omit(obj, ["a", "c"])).toEqual({
        b: 2,
        d: 4,
      });
    });

    it.concurrent("should return new object", async () => {
      const obj = { a: 1, b: 2 };
      const result = omit(obj, ["a"]);

      expect(result).toEqual({ b: 2 });
      expect(result).not.toBe(obj);
    });

    it.concurrent("should handle empty keys array", async () => {
      const obj = { a: 1, b: 2 };
      expect(omit(obj, [])).toEqual({ a: 1, b: 2 });
    });

    it.concurrent("should handle non-existent keys", async () => {
      const obj = { a: 1, b: 2 };
      expect(omit(obj, ["c", "d"])).toEqual({ a: 1, b: 2 });
    });

    it.concurrent("should handle empty object", async () => {
      const obj = {};
      expect(omit(obj, ["a", "b"])).toEqual({});
    });

    it.concurrent("should handle all keys", async () => {
      const obj = { a: 1, b: 2 };
      expect(omit(obj, ["a", "b"])).toEqual({});
    });

    it.concurrent("should handle duplicate keys", async () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, ["a", "a", "b"])).toEqual({ c: 3 });
    });
  });

  describe("injectPathQueriesIntoUrl", () => {
    it.concurrent("should inject path queries into URL", async () => {
      const url = "/api/v1/users/{userId}/posts/{postId}";
      const pathQueries = {
        userId: "123",
        postId: "456",
      };

      const result = injectPathQueriesIntoUrl(url, pathQueries);

      expect(result).toBe("/api/v1/users/123/posts/456");
    });

    it.concurrent("should handle single path parameter", async () => {
      const url = "/api/v1/users/{id}";
      const pathQueries = { id: "123" };

      const result = injectPathQueriesIntoUrl(url, pathQueries);

      expect(result).toBe("/api/v1/users/123");
    });

    it.concurrent("should handle multiple same parameters", async () => {
      const url = "/api/v1/users/{id}/profile/{id}";
      const pathQueries = { id: "123" };

      const result = injectPathQueriesIntoUrl(url, pathQueries);

      expect(result).toBe("/api/v1/users/123/profile/123");
    });

    it.concurrent("should handle URL without path parameters", async () => {
      const url = "/api/v1/users";
      const pathQueries = { id: "123" };

      const result = injectPathQueriesIntoUrl(url, pathQueries);

      expect(result).toBe("/api/v1/users");
    });

    it.concurrent("should handle empty pathQueries", async () => {
      const url = "/api/v1/users/{id}";
      const pathQueries = {};

      const result = injectPathQueriesIntoUrl(url, pathQueries);

      expect(result).toBe("/api/v1/users/undefined");
    });

    it.concurrent("should handle complex nested paths", async () => {
      const url = "/api/v1/{type}/{id}/sub/{subId}/detail/{detailId}";
      const pathQueries = {
        type: "users",
        id: "123",
        subId: "456",
        detailId: "789",
      };

      const result = injectPathQueriesIntoUrl(url, pathQueries);

      expect(result).toBe("/api/v1/users/123/sub/456/detail/789");
    });

    it.concurrent("should handle special characters in values", async () => {
      const url = "/api/v1/users/{name}";
      const pathQueries = { name: "john-doe" };

      const result = injectPathQueriesIntoUrl(url, pathQueries);

      expect(result).toBe("/api/v1/users/john-doe");
    });

    it.concurrent("should handle numeric values", async () => {
      const url = "/api/v1/users/{id}";
      const pathQueries = { id: "123" };

      const result = injectPathQueriesIntoUrl(url, pathQueries);

      expect(result).toBe("/api/v1/users/123");
    });
  });

  describe("getUrlWithoutQueries", () => {
    it.concurrent("should remove query parameters from URL", async () => {
      const url = "/api/v1/users?page=1&size=10";
      const result = getUrlWithoutQueries(url);

      expect(result).toBe("/api/v1/users");
    });

    it.concurrent("should handle URL without query parameters", async () => {
      const url = "/api/v1/users";
      const result = getUrlWithoutQueries(url);

      expect(result).toBe("/api/v1/users");
    });

    it.concurrent("should handle URL with empty query string", async () => {
      const url = "/api/v1/users?";
      const result = getUrlWithoutQueries(url);

      expect(result).toBe("/api/v1/users");
    });

    it.concurrent("should handle complex query parameters", async () => {
      const url = "/api/v1/users?page=1&size=10&sort=name&order=asc&filter=active";
      const result = getUrlWithoutQueries(url);

      expect(result).toBe("/api/v1/users");
    });

    it.concurrent("should handle URL with hash", async () => {
      const url = "/api/v1/users?page=1#section";
      const result = getUrlWithoutQueries(url);

      expect(result).toBe("/api/v1/users");
    });

    it.concurrent("should handle URL with multiple question marks", async () => {
      const url = "/api/v1/users?page=1?invalid";
      const result = getUrlWithoutQueries(url);

      expect(result).toBe("/api/v1/users");
    });

    it.concurrent("should handle empty string", async () => {
      const url = "";
      const result = getUrlWithoutQueries(url);

      expect(result).toBe("");
    });

    it.concurrent("should handle URL with only query string", async () => {
      const url = "?page=1&size=10";
      const result = getUrlWithoutQueries(url);

      expect(result).toBe("");
    });
  });
});
