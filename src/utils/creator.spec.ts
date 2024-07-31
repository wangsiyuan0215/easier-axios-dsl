import { describe, it, expect, vi } from "vitest";

import { creator } from "./creator";
import type { Options } from "./typing";

describe("creator", () => {
  it.concurrent("should be able to create a request instance", async () => {
    const request = creator({
      requestInterceptors: [] as unknown as Options<any>["requestInterceptors"],
      responseInterceptors:
        [] as unknown as Options<any>["responseInterceptors"],
    });

    expect(request).toBeTypeOf("function");
  });

  it.concurrent(
    "should be able to create a request instance with interceptors",
    async () => {
      const request = creator({
        requestInterceptors: [(config) => config, (error) => error],
        responseInterceptors: [(response) => response, (error) => error],
      });

      expect(request).toBeTypeOf("function");
    }
  );

  it.concurrent(
    "should be able to create a request instance with axios global static options",
    async () => {
      const request = creator({
        requestInterceptors:
          [] as unknown as Options<any>["requestInterceptors"],
        responseInterceptors: [(response) => response, (error) => error],
        baseURL: "https://api.example.com",
      });

      const common = {
        request,
      };

      const fn = vi.spyOn(common, "request");

      common.request(
        {
          url: "/v1/users",
          method: "GET",
          params: { a: 1, b: 2 },
          headers: {
            "X-Request-Id": "123",
          },
        },
        false
      );

      expect(fn).toHaveBeenCalledWith(
        {
          url: "/v1/users",
          method: "GET",
          params: { a: 1, b: 2 },
          headers: {
            "X-Request-Id": "123",
          },
        },
        false
      );
    }
  );
});
