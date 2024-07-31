import { describe, it, expect, vi } from "vitest";

import {
  getNewObjectByKeysFrom,
  injectPathQueriesIntoUrl,
  getUrlWithoutQueries,
  getRequestParamsIfDataIsArray,
  getRequestParams,
  apiTransfer,
  generatorAPIS,
} from "./generator";

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
});

describe("getRequestParams", () => {
  it.concurrent("should be able to get request params", async () => {
    const majorPayload = { a: 1, b: 2, c: 3, d: 4, e: 5 };
    const isPatternData = false;
    const isFormData = false;
    const paramsKeysString = "a,b";
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
      const paramsKeysString = "a,b";
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
});

describe("apiTransfer", () => {
  it.concurrent(
    "should be able to transfer api request by GET without queries and path",
    async () => {
      const request = vi.fn((a) => a);
      const requestString = "GET /api/v1/users/post";

      const api = apiTransfer(request, requestString);

      api();

      expect(request).toBeCalledWith(
        {
          method: "GET",
          url: "/api/v1/users/post",
        },
        false
      );
    }
  );

  it.concurrent(
    "should be able to transfer api request by GET and queries",
    async () => {
      const request = vi.fn((a) => a);
      const requestString = "GET /api/v1/users/post q:userId,postId";

      const api = apiTransfer(request, requestString);

      api({ userId: 1, postId: 2 });

      expect(request).toBeCalledWith(
        {
          method: "GET",
          url: "/api/v1/users/post?userId=1&postId=2",
        },
        false
      );
    }
  );

  it.concurrent(
    "should be able to transfer api request by GET and path params",
    async () => {
      const request = vi.fn((a) => a);
      const requestString =
        "GET /api/v1/users/{userId}/posts/{postId} path:userId,postId";

      const api = apiTransfer(request, requestString);

      api({ userId: 1, postId: 2 });

      expect(request).toBeCalledWith(
        {
          method: "GET",
          url: "/api/v1/users/1/posts/2",
        },
        false
      );
    }
  );

  it.concurrent("should be able to transfer api request by POST", async () => {
    const request = vi.fn();
    const requestString = "POST /api/v1/users d:a,b,c";

    const api = apiTransfer(request, requestString);

    api({ a: 1, b: 2, c: 3 });

    expect(request).toBeCalledWith(
      {
        url: "/api/v1/users",
        method: "POST",
        params: { a: 1, b: 2, c: 3 },
      },
      false
    );
  });

  it.concurrent(
    "should be able to transfer api request by POST with form data",
    async () => {
      const request = vi.fn();
      const requestString = "POST /api/v1/users d.f:a,b,c";

      const api = apiTransfer(request, requestString);

      api({ a: 1, b: 2, c: 3 });

      expect(request).toBeCalledWith(
        {
          url: "/api/v1/users",
          method: "POST",
          params: { a: 1, b: 2, c: 3 },
        },
        true
      );
    }
  );

  it.concurrent(
    "should be able to transfer api request by POST which type of data is array",
    async () => {
      const request = vi.fn();
      const requestString = "POST /api/v1/users [d]";

      const api = apiTransfer(request, requestString);

      api([1, 2, 3]);

      expect(request).toBeCalledWith(
        {
          url: "/api/v1/users",
          method: "POST",
          params: [1, 2, 3],
        },
        false
      );
    }
  );

  it.concurrent(
    "should be able to transfer api request by POST which type of data is array and with queries",
    async () => {
      const request = vi.fn();
      const requestString = "POST /api/v1/users [d] q:a,b";

      const api = apiTransfer(request, requestString);

      api([1, 2, 3], { a: 1, b: 2, c: 3 });

      expect(request).toBeCalledWith(
        {
          url: "/api/v1/users?a=1&b=2",
          method: "POST",
          params: [1, 2, 3],
        },
        false
      );
    }
  );

  it.concurrent(
    "should be able to transfer api request by POST which type of data is array and with path params",
    async () => {
      const request = vi.fn();
      const requestString = "POST /api/v1/users/{a}/{b} [d] path:a,b";

      const api = apiTransfer(request, requestString);

      api([1, 2, 3], { a: 1, b: 2, c: 3 });

      expect(request).toBeCalledWith(
        {
          url: "/api/v1/users/1/2",
          method: "POST",
          params: [1, 2, 3],
        },
        false
      );
    }
  );

  it.concurrent(
    "should be able to transfer api request by POST which type of data is array and with queries and path params",
    async () => {
      const request = vi.fn();
      const requestString = "POST /api/v1/users/{a}/{b} [d] path:a,b q:c,d";

      const api = apiTransfer(request, requestString);

      api([1, 2, 3], { a: 1, b: 2, c: 3, d: 4 });

      expect(request).toBeCalledWith(
        {
          url: "/api/v1/users/1/2?c=3&d=4",
          method: "POST",
          params: [1, 2, 3],
        },
        false
      );
    }
  );

  it.concurrent(
    "should be able to transfer api request by POST with pattern data",
    async () => {
      const request = vi.fn();
      const requestString = "POST /api/v1/users d:*";

      const api = apiTransfer(request, requestString);

      api({ a: 1, b: 2, c: 3, d: 4 });

      expect(request).toBeCalledWith(
        {
          url: "/api/v1/users",
          method: "POST",
          params: { a: 1, b: 2, c: 3, d: 4 },
        },
        false
      );
    }
  );

  it.concurrent(
    "should be able to transfer api request by POST with some items in data",
    async () => {
      const request = vi.fn();
      const requestString = "POST /api/v1/users d:b,d";

      const api = apiTransfer(request, requestString);

      api({ a: 1, b: 2, c: 3, d: 4 });

      expect(request).toBeCalledWith(
        {
          url: "/api/v1/users",
          method: "POST",
          params: { b: 2, d: 4 },
        },
        false
      );
    }
  );
});

describe("generatorAPIS", () => {
  it.concurrent("should be able to generate apis with no apis", async () => {
    const request = vi.fn();
    const apis = {};

    const api = generatorAPIS(request, apis);

    expect(api).toEqual({});
  });

  it.concurrent("should be able to generate apis with one api", async () => {
    const request = vi.fn();
    const apis = {
      getUser: "GET /api/v1/users",
    };

    const api = generatorAPIS(request, apis);

    expect(api).toHaveProperty("getUser");
    expect(api.getUser).toBeTypeOf("function");
  });

  it.concurrent(
    "should be able to generate apis with multiple apis",
    async () => {
      const request = vi.fn();
      const apis = {
        getUser: "GET /api/v1/users",
        createUser: "POST /api/v1/users",
      };

      const api = generatorAPIS(request, apis);

      expect(api).toHaveProperty("getUser");
      expect(api.getUser).toBeTypeOf("function");
      expect(api).toHaveProperty("createUser");
      expect(api.createUser).toBeTypeOf("function");
    }
  );
});
