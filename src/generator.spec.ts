import { describe, it, expect, vi } from "vitest";

import { init } from "./generator";
import { getNewObjectByKeysFrom, getRequestParamsIfDataIsArray, getRequestParams } from "./params";
import { injectPathQueriesIntoUrl, getUrlWithoutQueries } from "./utils";

// Mock the creator function
vi.mock("./creator", () => ({
  creator: vi.fn(() => vi.fn().mockResolvedValue({ data: { success: true } })),
}));

describe("generator", () => {
  describe("getNewObjectByKeysFrom", () => {
    it.concurrent("should be able to get new object by keys", async () => {
      const object = {
        a: 1,
        b: 2,
        c: 3,
      };

      const keys = ["a", "c"];

      const newObject = getNewObjectByKeysFrom(object, keys);

      expect(newObject).toEqual({
        a: 1,
        c: 3,
      });
    });

    it.concurrent(
      "should be able to get empty object if target is empty",
      async () => {
        const object = {};
        const keys = ["a", "c"];

        const newObject = getNewObjectByKeysFrom(object, keys);

        expect(newObject).toEqual({});
      }
    );

    it.concurrent(
      "should be able to get empty object if keys are empty",
      async () => {
        const object = {
          a: 1,
          b: 2,
          c: 3,
        };
        const keys: any[] = [];

        const newObject = getNewObjectByKeysFrom(object, keys);

        expect(newObject).toEqual({});
      }
    );

    it.concurrent(
      "should be able to get empty object if target and keys are empty",
      async () => {
        const object = {};
        const keys: any[] = [];

        const newObject = getNewObjectByKeysFrom(object, keys);

        expect(newObject).toEqual({});
      }
    );

    it.concurrent(
      "should be able to get new object by keys with different types",
      async () => {
        const object = {
          a: 1,
          b: "2",
          c: true,
        };
        const keys = ["a", "b"];

        const newObject = getNewObjectByKeysFrom(object, keys);

        expect(newObject).toEqual({
          a: 1,
          b: "2",
        });
      }
    );

    it.concurrent("should handle null/undefined target", async () => {
      expect(getNewObjectByKeysFrom(undefined, ["a"])).toEqual({});
      expect(getNewObjectByKeysFrom(undefined, ["a"])).toEqual({});
    });

    it.concurrent("should handle null/undefined keys", async () => {
      const object = { a: 1, b: 2 };
      expect(getNewObjectByKeysFrom(object, undefined)).toEqual({});
      expect(getNewObjectByKeysFrom(object, undefined)).toEqual({});
    });

    it.concurrent("should handle getNewObjectByKeysFrom with multiple keys", async () => {
      const target = { a: 1, b: 2, c: 3, d: 4, e: 5 };
      const keys = ["a", "c", "e"];

      const result = getNewObjectByKeysFrom(target, keys);

      expect(result).toEqual({ a: 1, c: 3, e: 5 });
    });
  });

  describe("injectPathQueriesIntoUrl", () => {
    it.concurrent("should be able to inject path queries into url", async () => {
      const url = "/api/v1/users/{userId}/posts/{postId}";
      const pathQueries = {
        userId: "1",
        postId: "2",
      };

      const newUrl = injectPathQueriesIntoUrl(url, pathQueries);

      expect(newUrl).toBe("/api/v1/users/1/posts/2");
    });

    it.concurrent(
      "should be able to inject path queries into url with multiple same queries",
      async () => {
        const url = "/api/v1/users/{userId}/posts/{userId}";
        const pathQueries = {
          userId: "1",
        };

        const newUrl = injectPathQueriesIntoUrl(url, pathQueries);

        expect(newUrl).toBe("/api/v1/users/1/posts/1");
      }
    );

    it.concurrent(
      "should be able to inject path queries into url with no queries",
      async () => {
        const url = "/api/v1/users";
        const pathQueries = {};

        const newUrl = injectPathQueriesIntoUrl(url, pathQueries);

        expect(newUrl).toBe("/api/v1/users");
      }
    );

    it.concurrent(
      "should be able to inject path queries into url with no path queries",
      async () => {
        const url = "/api/v1/users";
        const pathQueries = {
          userId: "1",
        };

        const newUrl = injectPathQueriesIntoUrl(url, pathQueries);

        expect(newUrl).toBe("/api/v1/users");
      }
    );

    it.concurrent(
      "should be able to inject path queries into url with no path queries and no queries",
      async () => {
        const url = "/api/v1/users";
        const pathQueries = {};

        const newUrl = injectPathQueriesIntoUrl(url, pathQueries);

        expect(newUrl).toBe("/api/v1/users");
      }
    );

    it.concurrent("should handle complex path patterns", async () => {
      const url = "/api/v1/{type}/{id}/sub/{subId}";
      const pathQueries = {
        type: "users",
        id: "123",
        subId: "456",
      };

      const newUrl = injectPathQueriesIntoUrl(url, pathQueries);

      expect(newUrl).toBe("/api/v1/users/123/sub/456");
    });
  });

  describe("getUrlWithoutQueries", () => {
    it.concurrent("should be able to get url without queries", async () => {
      const url = "/api/v1/users?userId=1&postId=2";

      const newUrl = getUrlWithoutQueries(url);

      expect(newUrl).toBe("/api/v1/users");
    });

    it.concurrent(
      "should be able to get url without queries with no queries",
      async () => {
        const url = "/api/v1/users";

        const newUrl = getUrlWithoutQueries(url);

        expect(newUrl).toBe("/api/v1/users");
      }
    );

    it.concurrent(
      "should be able to get url without queries with no queries and no path queries",
      async () => {
        const url = "/api/v1/users";

        const newUrl = getUrlWithoutQueries(url);

        expect(newUrl).toBe("/api/v1/users");
      }
    );

    it.concurrent("should handle multiple query parameters", async () => {
      const url = "/api/v1/users?page=1&size=10&sort=name&order=asc";

      const newUrl = getUrlWithoutQueries(url);

      expect(newUrl).toBe("/api/v1/users");
    });

    it.concurrent("should handle empty query string", async () => {
      const url = "/api/v1/users?";

      const newUrl = getUrlWithoutQueries(url);

      expect(newUrl).toBe("/api/v1/users");
    });
  });

  describe("getRequestParamsIfDataIsArray", () => {
    it.concurrent(
      "should be able to get request params if data is array",
      async () => {
        const majorPayload = [1, 2, 3];
        const otherPayload = {
          c: 5,
          d: 6,
        };
        const pathKeys = ["c"];
        const queryKeys = ["d"];

        const [data, path, query] = getRequestParamsIfDataIsArray(
          majorPayload,
          otherPayload,
          pathKeys,
          queryKeys
        );

        expect(data).toEqual([1, 2, 3]);
        expect(path).toEqual({ c: 5 });
        expect(query).toEqual({ d: 6 });
      }
    );

    it.concurrent(
      "should be able to get request params if data is array with no other payload",
      async () => {
        const majorPayload = [1, 2, 3];
        const otherPayload = {};
        const pathKeys = ["a", "b"];
        const queryKeys: any[] = [];

        const [data, path, query] = getRequestParamsIfDataIsArray(
          majorPayload,
          otherPayload,
          pathKeys,
          queryKeys
        );

        expect(data).toEqual([1, 2, 3]);
        expect(path).toEqual({});
        expect(query).toEqual({});
      }
    );

    it.concurrent(
      "should be able to get request params if data is array with no path keys",
      async () => {
        const majorPayload = [1, 2, 3];
        const otherPayload = {
          c: 5,
          d: 6,
        };
        const pathKeys: any[] = [];
        const queryKeys = ["c", "d"];

        const [data, path, query] = getRequestParamsIfDataIsArray(
          majorPayload,
          otherPayload,
          pathKeys,
          queryKeys
        );

        expect(data).toEqual([1, 2, 3]);
        expect(path).toEqual({});
        expect(query).toEqual({ c: 5, d: 6 });
      }
    );

    it.concurrent("should handle undefined otherPayload", async () => {
      const majorPayload = [1, 2, 3];
      const pathKeys = ["a"];
      const queryKeys = ["b"];

      const [data, path, query] = getRequestParamsIfDataIsArray(
        majorPayload,
        undefined,
        pathKeys,
        queryKeys
      );

      expect(data).toEqual([1, 2, 3]);
      expect(path).toEqual({});
      expect(query).toEqual({});
    });
  });

  describe("getRequestParams", () => {
    it.concurrent("should be able to get request params", async () => {
      const majorPayload = { a: 1, b: 2, c: 3, d: 4, e: 5 };
      const isPatternData = false;
      const isFormData = false;
      const paramsKeysString = ["a", "b"];
      const pathKeys = ["c", "d"];
      const queryKeys = ["e"];

      const [data, path, query] = getRequestParams(
        majorPayload,
        isPatternData,
        isFormData,
        paramsKeysString,
        pathKeys,
        queryKeys
      );

      expect(data).toEqual({ a: 1, b: 2 });
      expect(path).toEqual({ c: 3, d: 4 });
      expect(query).toEqual({ e: 5 });
    });

    it.concurrent(
      "should be able to get request params if data is pattern data",
      async () => {
        const majorPayload = { a: 1, b: 2, c: 3, d: 4, e: 5 };
        const isPatternData = true;
        const isFormData = false;
        const paramsKeysString = ["a", "b"];
        const pathKeys = ["c", "d"];
        const queryKeys = ["e"];

        const [data, path, query] = getRequestParams(
          majorPayload,
          isPatternData,
          isFormData,
          paramsKeysString,
          pathKeys,
          queryKeys
        );

        expect(data).toEqual({ a: 1, b: 2 });
        expect(path).toEqual({ c: 3, d: 4 });
        expect(query).toEqual({ e: 5 });
      }
    );

    it.concurrent(
      "should be able to get request params if data is form data",
      async () => {
        const majorPayload = { a: 1, b: 2, c: 3, d: 4, e: 5 };
        const isPatternData = false;
        const isFormData = true;

        const [data, path, query] = getRequestParams(
          majorPayload,
          isPatternData,
          isFormData
        );

        expect(data).toEqual({ a: 1, b: 2, c: 3, d: 4, e: 5 });
        expect(path).toEqual({});
        expect(query).toEqual({});
      }
    );

    it.concurrent("should handle empty paramsKeys", async () => {
      const majorPayload = { a: 1, b: 2 };
      const isPatternData = false;
      const isFormData = false;
      const paramsKeysString: string[] = [];
      const pathKeys: string[] = [];
      const queryKeys: string[] = [];

      const [data, path, query] = getRequestParams(
        majorPayload,
        isPatternData,
        isFormData,
        paramsKeysString,
        pathKeys,
        queryKeys
      );

      expect(data).toEqual({});
      expect(path).toEqual({});
      expect(query).toEqual({});
    });

    it.concurrent("should handle pattern data with wildcard", async () => {
      const majorPayload = { a: 1, b: 2, c: 3 };
      const isPatternData = true;
      const isFormData = false;
      const paramsKeysString = ["*"];
      const pathKeys: string[] = [];
      const queryKeys: string[] = [];

      const [data, path, query] = getRequestParams(
        majorPayload,
        isPatternData,
        isFormData,
        paramsKeysString,
        pathKeys,
        queryKeys
      );

      expect(data).toEqual({ a: 1, b: 2, c: 3 });
      expect(path).toEqual({});
      expect(query).toEqual({});
    });

    it.concurrent("should handle form data with pattern data", async () => {
      const majorPayload = { a: 1, b: 2, c: 3 };
      const isPatternData = true;
      const isFormData = true;
      const paramsKeysString = ["*"];
      const pathKeys: string[] = [];
      const queryKeys: string[] = [];

      const [data, path, query] = getRequestParams(
        majorPayload,
        isPatternData,
        isFormData,
        paramsKeysString,
        pathKeys,
        queryKeys
      );

      expect(data).toEqual({ a: 1, b: 2, c: 3 });
      expect(path).toEqual({});
      expect(query).toEqual({});
    });
  });

  describe("init function", () => {
    it.concurrent("should create request instance and generatorAPIS", async () => {
      const result = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      expect(result).toHaveProperty("generatorAPIS");
      expect(result).toHaveProperty("requestInstance");
      expect(result.generatorAPIS).toBeTypeOf("function");
      expect(result.requestInstance).toBeTypeOf("function");
    });

    it.concurrent("should generate APIs correctly", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        getUser: "GET /api/v1/users",
        createUser: "POST /api/v1/users d:name,email",
        updateUser: "PUT /api/v1/users/{id} path:id d:name,email",
      };

      const generatedAPIs = generatorAPIS(apis);

      expect(generatedAPIs).toHaveProperty("getUser");
      expect(generatedAPIs).toHaveProperty("createUser");
      expect(generatedAPIs).toHaveProperty("updateUser");
      expect(generatedAPIs.getUser).toBeTypeOf("function");
      expect(generatedAPIs.createUser).toBeTypeOf("function");
      expect(generatedAPIs.updateUser).toBeTypeOf("function");
    });

    it.concurrent("should handle empty APIs object", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {};

      const generatedAPIs = generatorAPIS(apis);

      expect(generatedAPIs).toEqual({});
    });

    it.concurrent("should handle complex API patterns", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        getUserPosts: "GET /api/v1/users/{userId}/posts q:page,size path:userId",
        uploadFile: "POST /api/v1/upload d.f:file,description",
        batchUpdate: "POST /api/v1/users/batch [d] q:dryRun",
      };

      const generatedAPIs = generatorAPIS(apis);

      expect(generatedAPIs).toHaveProperty("getUserPosts");
      expect(generatedAPIs).toHaveProperty("uploadFile");
      expect(generatedAPIs).toHaveProperty("batchUpdate");
    });

    it.concurrent("should handle API with empty data object", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        simpleGet: "GET /api/v1/users",
      };

      const generatedAPIs = generatorAPIS(apis);

      expect(generatedAPIs).toHaveProperty("simpleGet");
      expect(generatedAPIs.simpleGet).toBeTypeOf("function");
    });

    it.concurrent("should handle API with wildcard pattern", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        wildcardPost: "POST /api/v1/users d:*",
      };

      const generatedAPIs = generatorAPIS(apis);

      expect(generatedAPIs).toHaveProperty("wildcardPost");
      expect(generatedAPIs.wildcardPost).toBeTypeOf("function");
    });

    it.concurrent("should handle API with form data pattern", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        formDataPost: "POST /api/v1/upload d.f:file,description",
      };

      const generatedAPIs = generatorAPIS(apis);

      expect(generatedAPIs).toHaveProperty("formDataPost");
      expect(generatedAPIs.formDataPost).toBeTypeOf("function");
    });
  });

  describe("完整API调用测试", () => {
    it.concurrent("should handle complete API call flow", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        getUser: "GET /api/v1/users/{id} path:id q:include",
        createUser: "POST /api/v1/users d:name,email",
        updateUser: "PUT /api/v1/users/{id} path:id d:name,email",
        deleteUser: "DELETE /api/v1/users/{id} path:id",
        uploadFile: "POST /api/v1/upload d.f:file,description",
        batchUpdate: "POST /api/v1/users/batch [d] q:dryRun",
        wildcardPost: "POST /api/v1/users d:*",
      };

      const generatedAPIs = generatorAPIS(apis);

      // Test all API functions exist
      expect(generatedAPIs).toHaveProperty("getUser");
      expect(generatedAPIs).toHaveProperty("createUser");
      expect(generatedAPIs).toHaveProperty("updateUser");
      expect(generatedAPIs).toHaveProperty("deleteUser");
      expect(generatedAPIs).toHaveProperty("uploadFile");
      expect(generatedAPIs).toHaveProperty("batchUpdate");
      expect(generatedAPIs).toHaveProperty("wildcardPost");

      // Test all are functions
      expect(generatedAPIs.getUser).toBeTypeOf("function");
      expect(generatedAPIs.createUser).toBeTypeOf("function");
      expect(generatedAPIs.updateUser).toBeTypeOf("function");
      expect(generatedAPIs.deleteUser).toBeTypeOf("function");
      expect(generatedAPIs.uploadFile).toBeTypeOf("function");
      expect(generatedAPIs.batchUpdate).toBeTypeOf("function");
      expect(generatedAPIs.wildcardPost).toBeTypeOf("function");
    });

    it.concurrent("should handle API calls with different parameter combinations", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        simpleGet: "GET /api/v1/users",
        getWithQuery: "GET /api/v1/users q:page,size",
        getWithPath: "GET /api/v1/users/{id} path:id",
        getWithPathAndQuery: "GET /api/v1/users/{id}/posts q:page,size path:id",
        postWithData: "POST /api/v1/users d:name,email",
        postWithFormData: "POST /api/v1/upload d.f:file,description",
        postWithArray: "POST /api/v1/users/batch [d]",
        postWithWildcard: "POST /api/v1/users d:*",
      };

      const generatedAPIs = generatorAPIS(apis);

      // Test that all functions exist and are callable
      expect(generatedAPIs.simpleGet).toBeTypeOf("function");
      expect(generatedAPIs.getWithQuery).toBeTypeOf("function");
      expect(generatedAPIs.getWithPath).toBeTypeOf("function");
      expect(generatedAPIs.getWithPathAndQuery).toBeTypeOf("function");
      expect(generatedAPIs.postWithData).toBeTypeOf("function");
      expect(generatedAPIs.postWithFormData).toBeTypeOf("function");
      expect(generatedAPIs.postWithArray).toBeTypeOf("function");
      expect(generatedAPIs.postWithWildcard).toBeTypeOf("function");
    });
  });

  describe("apiStringToRequest function tests", () => {
    it.concurrent("should handle GET request without parameters", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        simpleGet: "GET /api/v1/users",
      };

      const generatedAPIs = generatorAPIS(apis);
      const apiFunction = generatedAPIs.simpleGet;

      // Test function signature
      expect(apiFunction).toBeTypeOf("function");
      
      // Test actual function call
      const result = await apiFunction();
      expect(result).toEqual({ data: { success: true } });
    });

    it.concurrent("should handle GET request with query parameters", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        getWithQuery: "GET /api/v1/users q:page,size",
      };

      const generatedAPIs = generatorAPIS(apis);
      const apiFunction = generatedAPIs.getWithQuery;

      expect(apiFunction).toBeTypeOf("function");
      
      // Test with query parameters
      const result = await apiFunction({ page: 1, size: 10 });
      expect(result).toEqual({ data: { success: true } });
    });

    it.concurrent("should handle GET request with path parameters", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        getWithPath: "GET /api/v1/users/{id} path:id",
      };

      const generatedAPIs = generatorAPIS(apis);
      const apiFunction = generatedAPIs.getWithPath;

      expect(apiFunction).toBeTypeOf("function");
      
      // Test with path parameters
      const result = await apiFunction({ id: 123 });
      expect(result).toEqual({ data: { success: true } });
    });

    it.concurrent("should handle POST request with data", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        postWithData: "POST /api/v1/users d:name,email",
      };

      const generatedAPIs = generatorAPIS(apis);
      const apiFunction = generatedAPIs.postWithData;

      expect(apiFunction).toBeTypeOf("function");
      
      // Test with data
      const result = await apiFunction({ name: "John", email: "john@example.com" });
      expect(result).toEqual({ data: { success: true } });
    });

    it.concurrent("should handle POST request with form data", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        postWithFormData: "POST /api/v1/upload d.f:file,description",
      };

      const generatedAPIs = generatorAPIS(apis);
      const apiFunction = generatedAPIs.postWithFormData;

      expect(apiFunction).toBeTypeOf("function");
      
      // Test with form data
      const result = await apiFunction({ file: "test.txt", description: "Test file" });
      expect(result).toEqual({ data: { success: true } });
    });

    it.concurrent("should handle POST request with array data", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        postWithArray: "POST /api/v1/users/batch [d]",
      };

      const generatedAPIs = generatorAPIS(apis);
      const apiFunction = generatedAPIs.postWithArray;

      expect(apiFunction).toBeTypeOf("function");
      
      // Test with array data
      const result = await apiFunction([1, 2, 3], { extra: "data" });
      expect(result).toEqual({ data: { success: true } });
    });

    it.concurrent("should handle POST request with wildcard pattern", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        postWithWildcard: "POST /api/v1/users d:*",
      };

      const generatedAPIs = generatorAPIS(apis);
      const apiFunction = generatedAPIs.postWithWildcard;

      expect(apiFunction).toBeTypeOf("function");
      
      // Test with wildcard pattern
      const result = await apiFunction({ name: "John", email: "john@example.com", age: 30 });
      expect(result).toEqual({ data: { success: true } });
    });

    it.concurrent("should handle complex API with all parameter types", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        complexApi: "POST /api/v1/users/{userId}/posts/{postId} path:userId,postId q:page,size d:title,content",
      };

      const generatedAPIs = generatorAPIS(apis);
      const apiFunction = generatedAPIs.complexApi;

      expect(apiFunction).toBeTypeOf("function");
    });

    it.concurrent("should handle API with empty data object", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        emptyDataApi: "GET /api/v1/users",
      };

      const generatedAPIs = generatorAPIS(apis);
      const apiFunction = generatedAPIs.emptyDataApi;

      expect(apiFunction).toBeTypeOf("function");
      
      // Test with empty data object
      const result = await apiFunction({});
      expect(result).toEqual({ data: { success: true } });
    });

    it.concurrent("should handle API with non-empty data object", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        nonEmptyDataApi: "POST /api/v1/users d:name,email",
      };

      const generatedAPIs = generatorAPIS(apis);
      const apiFunction = generatedAPIs.nonEmptyDataApi;

      expect(apiFunction).toBeTypeOf("function");
      
      // Test with non-empty data object
      const result = await apiFunction({ name: "John", email: "john@example.com" });
      expect(result).toEqual({ data: { success: true } });
    });

    it.concurrent("should handle API with array data", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        arrayDataApi: "POST /api/v1/users/batch [d]",
      };

      const generatedAPIs = generatorAPIS(apis);
      const apiFunction = generatedAPIs.arrayDataApi;

      expect(apiFunction).toBeTypeOf("function");
    });

    it.concurrent("should handle API with form data flag", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        formDataApi: "POST /api/v1/upload d.f:file,description",
      };

      const generatedAPIs = generatorAPIS(apis);
      const apiFunction = generatedAPIs.formDataApi;

      expect(apiFunction).toBeTypeOf("function");
    });

    it.concurrent("should handle API without form data flag", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        nonFormDataApi: "POST /api/v1/users d:name,email",
      };

      const generatedAPIs = generatorAPIS(apis);
      const apiFunction = generatedAPIs.nonFormDataApi;

      expect(apiFunction).toBeTypeOf("function");
      
      // Test without form data flag
      const result = await apiFunction({ name: "John", email: "john@example.com" });
      expect(result).toEqual({ data: { success: true } });
    });

    it.concurrent("should handle API with returnResponse config", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        returnResponseApi: "GET /api/v1/users",
      };

      const generatedAPIs = generatorAPIS(apis);
      const apiFunction = generatedAPIs.returnResponseApi;

      expect(apiFunction).toBeTypeOf("function");
      
      // Test with returnResponse config
      const result = await apiFunction({}, {}, { returnResponse: true });
      expect(result).toEqual({ data: { success: true } });
    });

    it.concurrent("should handle API with other axios config", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        axiosConfigApi: "GET /api/v1/users",
      };

      const generatedAPIs = generatorAPIS(apis);
      const apiFunction = generatedAPIs.axiosConfigApi;

      expect(apiFunction).toBeTypeOf("function");
      
      // Test with other axios config
      const result = await apiFunction({}, {}, { timeout: 5000, headers: { 'X-Custom': 'value' } });
      expect(result).toEqual({ data: { success: true } });
    });

    it.concurrent("should handle API with array data and empty other payload", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        arrayDataEmptyPayloadApi: "POST /api/v1/users/batch [d]",
      };

      const generatedAPIs = generatorAPIS(apis);
      const apiFunction = generatedAPIs.arrayDataEmptyPayloadApi;

      expect(apiFunction).toBeTypeOf("function");
      
      // Test with array data and empty other payload
      const result = await apiFunction([1, 2, 3]);
      expect(result).toEqual({ data: { success: true } });
    });

    it.concurrent("should handle API with path and query parameters", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        pathAndQueryApi: "GET /api/v1/users/{id}/posts q:page,size path:id",
      };

      const generatedAPIs = generatorAPIS(apis);
      const apiFunction = generatedAPIs.pathAndQueryApi;

      expect(apiFunction).toBeTypeOf("function");
      
      // Test with path and query parameters
      const result = await apiFunction({ id: 123, page: 1, size: 10 });
      expect(result).toEqual({ data: { success: true } });
    });

    it.concurrent("should handle API with complex data structure", async () => {
      const { generatorAPIS } = init({
        requestInterceptors: [vi.fn(), vi.fn()],
        responseInterceptors: [vi.fn(), vi.fn()],
      });

      const apis = {
        complexDataApi: "POST /api/v1/users d:name,profile",
      };

      const generatedAPIs = generatorAPIS(apis);
      const apiFunction = generatedAPIs.complexDataApi;

      expect(apiFunction).toBeTypeOf("function");
      
      // Test with complex data structure
      const result = await apiFunction({ 
        name: "John", 
        profile: { age: 30, city: "New York" } 
      });
      expect(result).toEqual({ data: { success: true } });
    });
  });
});
