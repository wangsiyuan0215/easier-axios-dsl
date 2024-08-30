import { describe, it, expect } from "vitest";

import { isArray, isEmpty, isObject, omit } from "./utils";

describe("utils", () => {
  it.concurrent("should be able to check if a value is an array", async () => {
    expect(isArray([])).toBe(true);
    expect(isArray({})).toBe(false);
    expect(isArray("")).toBe(false);
    expect(isArray(1)).toBe(false);
    expect(isArray(null)).toBe(false);
    expect(isArray(undefined)).toBe(false);
  });

  it.concurrent("should be able to check if a value is empty", async () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty("")).toBe(true);
    expect(isEmpty(0)).toBe(true);
    expect(isEmpty(1)).toBe(false);
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty(false)).toBe(false);
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Map([["a", "A"]]))).toBe(false);
    expect(isEmpty(new Date())).toBe(false);
  });

  it.concurrent("should be able to check if a value is an object", async () => {
    expect(isObject([])).toBe(false);
    expect(isObject({})).toBe(true);
    expect(isObject("")).toBe(false);
    expect(isObject(1)).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
  });

  it.concurrent("should be able to omit keys from an object", async () => {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
    };

    expect(omit(obj, ["a", "b"])).toEqual({
      c: 3,
    });
  });
});
