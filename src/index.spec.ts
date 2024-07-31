import { describe, it, expect } from "vitest";

import { G, requestCreator } from "./index";

describe("requestCreator", () => {
  it.concurrent("should be a function", async () => {
    expect(requestCreator).toBeTypeOf("function");
  });
});

describe("G", () => {
  it.concurrent("should be a function", async () => {
    expect(G).toBeTypeOf("function");
  });
});
