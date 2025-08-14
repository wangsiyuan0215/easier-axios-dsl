import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";

import { creator } from "./creator";
import type { Options } from "./typing";

// Mock axios
vi.mock("axios");
const mockedAxios = vi.mocked(axios);

// Mock FormData for Node.js environment
class MockFormData {
  private data: Record<string, any> = {};
  
  append(key: string, value: any) {
    this.data[key] = value;
  }
  
  get(key: string) {
    return this.data[key];
  }
}

vi.stubGlobal('FormData', MockFormData);

describe("creator", () => {
  let mockAxiosInstance: any;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Create mock axios instance
    mockAxiosInstance = vi.fn();
    mockAxiosInstance.interceptors = {
      request: {
        use: vi.fn(),
      },
      response: {
        use: vi.fn(),
      },
    };
    
    // Mock axios.create to return our mock instance
    (mockedAxios.create as any).mockReturnValue(mockAxiosInstance);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("基本功能测试", () => {
    it("should create a request instance with default configuration", () => {
      const request = creator({
        requestInterceptors: [] as unknown as Options["requestInterceptors"],
        responseInterceptors: [] as unknown as Options["responseInterceptors"],
      });

      expect(request).toBeTypeOf("function");
      expect(mockedAxios.create).toHaveBeenCalledWith({
        timeout: 3000,
      });
    });

    it("should create a request instance with custom axios options", () => {
      const customOptions = {
        baseURL: "https://api.example.com",
        timeout: 30000,
        headers: { "X-Custom": "value" },
      };

      creator({
        requestInterceptors: [] as unknown as Options["requestInterceptors"],
        responseInterceptors: [] as unknown as Options["responseInterceptors"],
        ...customOptions,
      });

      expect(mockedAxios.create).toHaveBeenCalledWith({
        timeout: 30000,
        baseURL: "https://api.example.com",
        headers: { "X-Custom": "value" },
      });
    });
  });

  describe("拦截器测试", () => {
    it("should set up request interceptors when provided", () => {
      const requestInterceptor = vi.fn((config) => config);
      const requestErrorInterceptor = vi.fn((error) => error);

      creator({
        requestInterceptors: [requestInterceptor, requestErrorInterceptor],
        responseInterceptors: [] as unknown as Options["responseInterceptors"],
      });

      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledWith(
        requestInterceptor,
        requestErrorInterceptor
      );
    });

    it("should set up response interceptors when provided", () => {
      const responseInterceptor = vi.fn((response) => response);
      const responseErrorInterceptor = vi.fn((error) => error);

      creator({
        requestInterceptors: [] as unknown as Options["requestInterceptors"],
        responseInterceptors: [responseInterceptor, responseErrorInterceptor],
      });

      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledWith(
        responseInterceptor,
        responseErrorInterceptor
      );
    });

    it("should not set up interceptors when arrays are empty", () => {
      creator({
        requestInterceptors: [] as unknown as Options["requestInterceptors"],
        responseInterceptors: [] as unknown as Options["responseInterceptors"],
      });

      expect(mockAxiosInstance.interceptors.request.use).not.toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).not.toHaveBeenCalled();
    });
  });

  describe("HTTP 方法测试", () => {
    let request: any;

    beforeEach(() => {
      request = creator({
        requestInterceptors: [] as unknown as Options["requestInterceptors"],
        responseInterceptors: [] as unknown as Options["responseInterceptors"],
      });

      // Mock successful response
      mockAxiosInstance.mockResolvedValue({ data: { success: true } });
    });

    it("should handle GET requests with query parameters", async () => {
      const params = { page: 1, size: 10 };
      
      await request({
        url: "/api/users",
        method: "GET",
        params,
      });

      expect(mockAxiosInstance).toHaveBeenCalledWith({
        url: "/api/users",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        params,
      });
    });

    it("should handle POST requests with JSON data", async () => {
      const data = { name: "John", age: 30 };
      
      await request({
        url: "/api/users",
        method: "POST",
        params: data,
      });

      expect(mockAxiosInstance).toHaveBeenCalledWith({
        url: "/api/users",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data,
      });
    });

    it("should handle PUT requests with JSON data", async () => {
      const data = { id: 1, name: "John Updated" };
      
      await request({
        url: "/api/users/1",
        method: "PUT",
        params: data,
      });

      expect(mockAxiosInstance).toHaveBeenCalledWith({
        url: "/api/users/1",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        data,
      });
    });

    it("should handle DELETE requests with query parameters", async () => {
      const params = { reason: "inactive" };
      
      await request({
        url: "/api/users/1",
        method: "DELETE",
        params,
      });

      expect(mockAxiosInstance).toHaveBeenCalledWith({
        url: "/api/users/1",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        params,
      });
    });
  });

  describe("FormData 处理测试", () => {
    let request: any;

    beforeEach(() => {
      request = creator({
        requestInterceptors: [] as unknown as Options["requestInterceptors"],
        responseInterceptors: [] as unknown as Options["responseInterceptors"],
      });

      mockAxiosInstance.mockResolvedValue({ data: { success: true } });
    });

    it("should handle POST requests with FormData", async () => {
      const data = { file: "test.txt", description: "test file" };
      
      await request(
        {
          url: "/api/upload",
          method: "POST",
          params: data,
          __isFormData: true,
        }
      );

      expect(mockAxiosInstance).toHaveBeenCalledWith({
        url: "/api/upload",
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: expect.any(FormData),
      });
    });

    it("should handle PUT requests with FormData", async () => {
      const data = { avatar: "avatar.jpg", bio: "new bio" };
      
      await request(
        {
          url: "/api/users/1/profile",
          method: "PUT",
          params: data,
          __isFormData: true,
        }
      );

      expect(mockAxiosInstance).toHaveBeenCalledWith({
        url: "/api/users/1/profile",
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: expect.any(FormData),
      });
    });

    it("should convert object to FormData correctly", async () => {
      const data = { name: "test", file: "test.txt" };
      
      await request(
        {
          url: "/api/upload",
          method: "POST",
          params: data,
          __isFormData: true,
        }
      );

      const callArgs = mockAxiosInstance.mock.calls[0][0];
      expect(callArgs.data).toBeInstanceOf(FormData);
      
      // Verify FormData content
      const formData = callArgs.data as FormData;
      expect(formData.get("name")).toBe("test");
      expect(formData.get("file")).toBe("test.txt");
    });

    it("should handle FormData with complex object values", async () => {
      const data = { 
        name: "test", 
        file: "test.txt",
        metadata: JSON.stringify({ type: "image", size: 1024 })
      };
      
      await request(
        {
          url: "/api/upload",
          method: "POST",
          params: data,
          __isFormData: true,
        }
      );

      const callArgs = mockAxiosInstance.mock.calls[0][0];
      expect(callArgs.data).toBeInstanceOf(FormData);
      
      // Verify FormData content
      const formData = callArgs.data as FormData;
      expect(formData.get("name")).toBe("test");
      expect(formData.get("file")).toBe("test.txt");
      expect(formData.get("metadata")).toBe(JSON.stringify({ type: "image", size: 1024 }));
    });

    it("should handle FormData with multiple properties", async () => {
      const data = { 
        file1: "file1.txt",
        file2: "file2.txt", 
        file3: "file3.txt",
        description: "multiple files"
      };
      
      await request(
        {
          url: "/api/upload",
          method: "POST",
          params: data,
          __isFormData: true,
        }
      );

      const callArgs = mockAxiosInstance.mock.calls[0][0];
      expect(callArgs.data).toBeInstanceOf(FormData);
      
      // Verify FormData content
      const formData = callArgs.data as FormData;
      expect(formData.get("file1")).toBe("file1.txt");
      expect(formData.get("file2")).toBe("file2.txt");
      expect(formData.get("file3")).toBe("file3.txt");
      expect(formData.get("description")).toBe("multiple files");
    });
  });

  describe("请求头处理测试", () => {
    let request: any;

    beforeEach(() => {
      request = creator({
        requestInterceptors: [] as unknown as Options["requestInterceptors"],
        responseInterceptors: [] as unknown as Options["responseInterceptors"],
      });

      mockAxiosInstance.mockResolvedValue({ data: { success: true } });
    });

    it("should merge custom headers with default headers", async () => {
      await request({
        url: "/api/users",
        method: "GET",
        params: {},
        headers: {
          "Authorization": "Bearer token123",
          "X-Request-Id": "req-123",
        },
      });

      expect(mockAxiosInstance).toHaveBeenCalledWith({
        url: "/api/users",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer token123",
          "X-Request-Id": "req-123",
        },
        params: {},
      });
    });

    it("should override default Content-Type when FormData is used", async () => {
      await request(
        {
          url: "/api/upload",
          method: "POST",
          params: { file: "test.txt" },
          headers: {
            "Content-Type": "application/json", // This should be overridden
          },
          __isFormData: true,
        }
      );

      expect(mockAxiosInstance).toHaveBeenCalledWith({
        url: "/api/upload",
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data", // Should be overridden
        },
        data: expect.any(MockFormData),
      });
    });

    it("should use default JSON Content-Type when headers do not contain Content-Type", async () => {
      await request({
        url: "/api/users",
        method: "POST",
        params: { name: "John" },
        headers: {
          "Authorization": "Bearer token",
          // No Content-Type header
        },
      });

      expect(mockAxiosInstance).toHaveBeenCalledWith({
        url: "/api/users",
        method: "POST",
        headers: {
          "Authorization": "Bearer token",
          "Content-Type": "application/json", // Should use default
        },
        data: { name: "John" },
      });
    });

    it("should use default JSON Content-Type when no headers are provided", async () => {
      await request({
        url: "/api/users",
        method: "POST",
        params: { name: "John" },
        // No headers at all
      });

      expect(mockAxiosInstance).toHaveBeenCalledWith({
        url: "/api/users",
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Should use default
        },
        data: { name: "John" },
      });
    });
  });

  describe("运行时配置测试", () => {
    let request: any;

    beforeEach(() => {
      request = creator({
        requestInterceptors: [] as unknown as Options["requestInterceptors"],
        responseInterceptors: [] as unknown as Options["responseInterceptors"],
      });

      mockAxiosInstance.mockResolvedValue({ data: { success: true } });
    });

    it("should pass runtime options to axios", async () => {
      await request({
        url: "/api/users",
        method: "GET",
        params: {},
        timeout: 5000,
        responseType: "json",
        withCredentials: true,
      });

      expect(mockAxiosInstance).toHaveBeenCalledWith({
        url: "/api/users",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        params: {},
        timeout: 5000,
        withCredentials: true,
      });
    });

    it("should handle empty restOptions", async () => {
      await request({
        url: "/api/users",
        method: "GET",
        params: {},
      });

      expect(mockAxiosInstance).toHaveBeenCalledWith({
        url: "/api/users",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        params: {},
      });
    });
  });

  describe("错误处理测试", () => {
    let request: any;

    beforeEach(() => {
      request = creator({
        requestInterceptors: [] as unknown as Options["requestInterceptors"],
        responseInterceptors: [] as unknown as Options["responseInterceptors"],
      });
    });

    it("should throw error when axios request fails", async () => {
      const error = new Error("Network error");
      mockAxiosInstance.mockRejectedValue(error);

      await expect(
        request({
          url: "/api/users",
          method: "GET",
          params: {},
        })
      ).rejects.toThrow("Network error");
    });

    it("should return response data when request succeeds", async () => {
      const responseData = { users: [{ id: 1, name: "John" }] };
      mockAxiosInstance.mockResolvedValue({ data: responseData });

      const result = await request({
        url: "/api/users",
        method: "GET",
        params: {},
      });

      expect(result).toEqual(responseData);
    });
  });

  describe("边界情况测试", () => {
    let request: any;

    beforeEach(() => {
      request = creator({
        requestInterceptors: [] as unknown as Options["requestInterceptors"],
        responseInterceptors: [] as unknown as Options["responseInterceptors"],
      });

      mockAxiosInstance.mockResolvedValue({ data: { success: true } });
    });

    it("should handle responseType blob", async () => {
      mockAxiosInstance.mockResolvedValue({ data: "blob data", responseType: "blob" });

      const result = await request({
        url: "/api/download",
        method: "GET",
        params: {},
        responseType: "blob",
      });

      expect(result).toEqual({ data: "blob data", responseType: "blob" });
    });

    it("should handle empty params object", async () => {
      await request({
        url: "/api/users",
        method: "GET",
        params: {},
      });

      expect(mockAxiosInstance).toHaveBeenCalledWith({
        url: "/api/users",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        params: {},
      });
    });

    it("should handle null/undefined restOptions", async () => {
      await request({
        url: "/api/users",
        method: "GET",
        params: {},
      });

      expect(mockAxiosInstance).toHaveBeenCalledWith({
        url: "/api/users",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        params: {},
      });
    });

    it("should handle null restOptions explicitly", async () => {
      // 模拟 restOptions 为 null 的情况
      const requestWithNullOptions = creator({
        requestInterceptors: [] as unknown as Options["requestInterceptors"],
        responseInterceptors: [] as unknown as Options["responseInterceptors"],
      });

      mockAxiosInstance.mockResolvedValue({ data: { success: true } });

      // 使用类型断言来模拟 null restOptions
      await (requestWithNullOptions as any)({
        url: "/api/users",
        method: "GET",
        params: {},
        headers: null,
        timeout: null,
      });

      expect(mockAxiosInstance).toHaveBeenCalledWith({
        url: "/api/users",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        params: {},
        timeout: null,
      });
    });

    it("should handle undefined restOptions", async () => {
      // 模拟 restOptions 为 undefined 的情况
      const requestWithUndefinedOptions = creator({
          requestInterceptors: [] as unknown as Options["requestInterceptors"],
        responseInterceptors: [] as unknown as Options["responseInterceptors"],
      });

      mockAxiosInstance.mockResolvedValue({ data: { success: true } });

      // 使用类型断言来模拟 undefined restOptions
      await (requestWithUndefinedOptions as any)({
        url: "/api/users",
        method: "GET",
        params: {},
        headers: undefined,
        timeout: undefined,
      });

      expect(mockAxiosInstance).toHaveBeenCalledWith({
        url: "/api/users",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        params: {},
        timeout: undefined,
      });
    });

    it("should handle complex nested objects in params", async () => {
      const complexParams = {
        filters: {
          status: "active",
          tags: ["tag1", "tag2"],
        },
        pagination: {
          page: 1,
          size: 10,
        },
      };

      await request({
        url: "/api/users",
        method: "POST",
        params: complexParams,
      });

      expect(mockAxiosInstance).toHaveBeenCalledWith({
        url: "/api/users",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: complexParams,
      });
    });
  });
});
