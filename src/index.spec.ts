import { describe, it, expect } from "vitest";

import type { Options } from "./typing";
import { init } from "./index";

describe("index", () => {
  it.concurrent("should export init function", async () => {
    expect(init).toBeTypeOf("function");
  });

  it.concurrent(
    "should return an object with generatorAPIS and requestInstance",
    async () => {
      const result = init({
        requestInterceptors: [] as unknown as Options["requestInterceptors"],
        responseInterceptors: [] as unknown as Options["responseInterceptors"],
      });

      expect(result).toHaveProperty("generatorAPIS");
      expect(result).toHaveProperty("requestInstance");
      expect(result.generatorAPIS).toBeTypeOf("function");
      expect(result.requestInstance).toBeTypeOf("function");
    }
  );
});
