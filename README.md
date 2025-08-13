# @siyuan0215/easier-axios-dsl

[![npm version](https://badge.fury.io/js/@siyuan0215%2Feasier-axios-dsl.svg)](https://badge.fury.io/js/@siyuan0215%2Feasier-axios-dsl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Test Coverage](https://img.shields.io/badge/coverage-88.76%25-brightgreen)](https://github.com/siyuan0215/easier-axios-dsl)

> 🚀 基于 Axios 的 DSL（领域特定语言）API 声明库，大幅减少重复代码，提升开发效率

## ✨ 特性

- 🎯 **DSL 声明式 API** - 使用简洁的字符串声明 API 接口，告别重复模板代码
- 🔧 **类型安全** - 完整的 TypeScript 支持，提供智能类型提示
- 🚀 **零配置** - 开箱即用，无需复杂配置
- 📦 **轻量级** - 基于 Axios，无额外依赖
- 🧪 **高测试覆盖率** - 88.76% 测试覆盖率，确保代码质量
- 🔄 **拦截器支持** - 完整的请求/响应拦截器配置
- 📁 **FormData 自动处理** - 智能识别并转换文件上传请求
- 🎨 **智能请求头** - 自动设置 Content-Type，支持自定义覆盖
- 🌐 **跨技术栈** - 支持 Vue、React、Angular 等所有 JavaScript/TypeScript 项目

## 📦 安装

```bash
# 使用 npm
npm install @siyuan0215/easier-axios-dsl

# 使用 yarn
yarn add @siyuan0215/easier-axios-dsl

# 使用 pnpm
pnpm add @siyuan0215/easier-axios-dsl
```

## 🚀 快速开始

### 1. 配置请求实例

```typescript
// utils/request.ts
import { init } from "@siyuan0215/easier-axios-dsl";

const { generatorAPIS, requestInstance } = init({
  requestInterceptors: [
    (config) => {
      // 添加认证头
      config.headers.Authorization = `Bearer ${getToken()}`;
      return config;
    },
    (error) => Promise.reject(error),
  ],
  responseInterceptors: [
    (response) => response,
    (error) => {
      // 统一错误处理
      if (error.response?.status === 401) {
        // 处理未授权
      }
      return Promise.reject(error);
    },
  ],
  timeout: 10000,
  baseURL: "https://api.example.com",
});

export { generatorAPIS, requestInstance };
```

### 2. 声明 API 接口

```typescript
// api/index.ts
import { generatorAPIS } from "@/utils/request";

const APIS = {
  // 获取用户信息 - GET 请求，查询参数
  getUserInfo: "GET /api/users q:userId",

  // 创建用户 - POST 请求，请求体数据
  createUser: "POST /api/users d:name,email,age",

  // 更新用户 - PUT 请求，路径参数 + 请求体
  updateUser: "PUT /api/users/{id} path:id d:name,email",

  // 删除用户 - DELETE 请求，路径参数
  deleteUser: "DELETE /api/users/{id} path:id",

  // 文件上传 - POST 请求，FormData
  uploadFile: "POST /api/upload d.f:file,description",

  // 批量操作 - POST 请求，数组数据
  batchUpdate: "POST /api/users/batch [d] q:dryRun",

  // 通配符模式 - 传递所有参数
  wildcardPost: "POST /api/users d:*",
} as const;

export default generatorAPIS(APIS);
```

### 3. 在组件中使用

```ts
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import APIS from '@/api'

// 响应式数据
const user = ref(null)
const formData = ref({ name: '', email: '', age: 0 })
const uploadProgress = ref(0)

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const { data } = await APIS.getUserInfo<{data: UserInfo}>({ userId: '123' })
    user.value = data
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 保存用户
const saveUser = async () => {
  try {
    const result = await APIS.createUser({
      name: formData.value.name,
      email: formData.value.email,
      age: formData.value.age
    })
    console.log('用户创建成功:', result)
  } catch (error) {
    console.error('创建用户失败:', error)
  }
}

// 上传文件
const uploadFile = async (file: File) => {
  try {
    const result = await APIS.uploadFile(
      { file, description: '用户头像' },
      undefined, // otherPayload
      {
        onUploadProgress: (progressEvent) => {
          uploadProgress.value = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
        }
      }
    )
    console.log('文件上传成功:', result)
  } catch (error) {
    console.error('文件上传失败:', error)
  }
}
</script>
```

## 📚 DSL 语法详解

### 基本格式

```
[HTTP方法] [URL] [参数载体类型]:[参数列表]
```

### 参数载体类型

| 类型   | 说明       | 示例                   | 适用场景                  |
| ------ | ---------- | ---------------------- | ------------------------- |
| `q`    | 查询参数   | `q:page,size`          | GET 请求的 URL 参数       |
| `path` | 路径参数   | `path:userId`          | 动态路由参数              |
| `d`    | 请求体数据 | `d:name,email`         | POST/PUT 请求的 JSON 数据 |
| `d.f`  | FormData   | `d.f:file,description` | 文件上传                  |
| `[d]`  | 数组数据   | `[d]`                  | 批量操作                  |
| `*`    | 通配符     | `d:*`                  | 传递所有参数              |

### 完整示例

```typescript
const APIS = {
  // 简单 GET 请求
  getUsers: "GET /api/users q:page,size,sort",

  // 带路径参数的 GET 请求
  getUserById: "GET /api/users/{id} path:id q:include",

  // POST 请求，JSON 数据
  createUser: "POST /api/users d:name,email,age",

  // PUT 请求，路径参数 + 请求体
  updateUser: "PUT /api/users/{id} path:id d:name,email",

  // DELETE 请求，路径参数
  deleteUser: "DELETE /api/users/{id} path:id",

  // 文件上传
  uploadFile: "POST /api/upload d.f:file,description",

  // 批量操作
  batchDelete: "POST /api/users/batch-delete [d] q:confirm",

  // 通配符模式
  flexiblePost: "POST /api/users d:*",
};
```

## 🔧 高级配置

### 自定义请求配置

```typescript
// 运行时配置
const result = await APIS.downloadFile(
  { id: "123" }, // majorPayload - 主要参数
  undefined, // otherPayload - 额外参数（可选）
  {
    responseType: "blob",
    timeout: 30000,
    headers: {
      "Custom-Header": "value",
    },
    returnResponse: true, // 返回完整的响应对象
  } // RequestConfig - Axios 配置选项
);
```

#### 参数详解

| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| **majorPayload** | `Record<string, any>` \| `any[]` | ✅ | 主要请求参数，根据 DSL 声明自动分配到对应位置 | `{ userId: '123' }` |
| **otherPayload** | `Record<string, any>` | ❌ | 额外参数，仅在数组数据模式下使用 | `{ extra: 'data' }` |
| **RequestConfig** | `AxiosRequestConfig` | ❌ | Axios 运行时配置选项 | `{ timeout: 5000 }` |

#### `majorPayload` 参数分配规则

根据 DSL 声明自动将参数分配到不同位置：

```typescript
// DSL: "GET /api/users/{id} path:id q:page,size d:name,email"
const result = await APIS.getUser(
  {
    id: "123",        // → 路径参数: /api/users/123
    page: 1,          // → 查询参数: ?page=1
    size: 10,         // → 查询参数: ?size=10
    name: "John",     // → 请求体: { name: "John" }
    email: "john@example.com" // → 请求体: { email: "john@example.com" }
  }
);
```

#### `otherPayload` 使用场景

仅在数组数据模式 `[d]` 下使用，用于传递额外的非数组参数：

```typescript
// DSL: "POST /api/users/batch [d] q:dryRun"
const result = await APIS.batchCreate(
  [user1, user2, user3], // majorPayload - 数组数据
  { dryRun: true },      // otherPayload - 额外查询参数
  { timeout: 10000 }     // RequestConfig
);
```

#### `RequestConfig` 特殊选项

| 选项 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `returnResponse` | `boolean` | 返回完整 Axios 响应对象，而非仅 data | `{ returnResponse: true }` |
| `responseType` | `string` | 响应数据类型（blob, json, text 等） | `{ responseType: "blob" }` |
| `timeout` | `number` | 请求超时时间（毫秒） | `{ timeout: 5000 }` |
| `headers` | `object` | 自定义请求头 | `{ headers: { "Authorization": "Bearer token" } }` |

#### 完整示例

```typescript
// 1. 基本使用
const user = await APIS.getUser({ id: "123" });

// 2. 带额外配置
const user = await APIS.getUser(
  { id: "123" },
  undefined,
  { timeout: 5000 }
);

// 3. 文件下载
const file = await APIS.downloadFile(
  { id: "123" },
  undefined,
  { 
    responseType: "blob",
    returnResponse: true 
  }
);

// 4. 数组数据 + 额外参数
const result = await APIS.batchUpdate(
  [{ id: 1, name: "John" }, { id: 2, name: "Jane" }],
  { dryRun: true },
  { timeout: 30000 }
);

// 5. 获取完整响应
const response = await APIS.getUser(
  { id: "123" },
  undefined,
  { returnResponse: true }
);
// response 包含: { data, status, statusText, headers, config }
```

## 🧪 测试

项目包含完整的单元测试套件，测试覆盖率达到 88.76%：

```bash
# 运行测试
npm test

# 运行测试并生成覆盖率报告
npm run coverage

# 监听模式
npm run test:watch
```

### 测试覆盖范围

- ✅ 核心功能测试
- ✅ DSL 解析测试
- ✅ 参数处理测试
- ✅ 拦截器测试
- ✅ FormData 处理测试
- ✅ 错误处理测试
- ✅ 边界情况测试

## 📊 性能对比

### 传统方式 vs DSL 方式

**传统方式（冗余代码）：**

```typescript
// 需要为每个接口写重复的模板代码
export const getUserInfo = (userId: string) =>
  request("/api/users", {
    method: "GET",
    params: { userId },
  });

export const createUser = (userData: UserData) =>
  request("/api/users", {
    method: "POST",
    data: userData,
  });

export const updateUser = (id: string, userData: UserData) =>
  request(`/api/users/${id}`, {
    method: "PUT",
    data: userData,
  });
```

**DSL 方式（简洁声明）：**

```typescript
// 一行声明一个接口，自动生成对应函数
const APIS = {
  getUserInfo: "GET /api/users q:userId",
  createUser: "POST /api/users d:*",
  updateUser: "PUT /api/users/{id} path:id d:*",
};
```

**优势：**

- 🎯 **代码量减少 70%+** - 大幅减少重复模板代码
- 🚀 **开发效率提升** - 快速声明 API 接口
- 🔧 **维护成本降低** - 统一的接口管理方式
- 🎨 **类型安全** - 完整的 TypeScript 支持

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 开发环境设置

```bash
# 克隆仓库
git clone https://github.com/siyuan0215/easier-axios-dsl.git

# 安装依赖
npm install

# 运行测试
npm test

# 运行开发服务器
npm run dev
```

### 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🙏 致谢

- [Axios](https://axios-http.com/) - 优秀的 HTTP 客户端库
- [Vitest](https://vitest.dev/) - 快速的单元测试框架
- 所有贡献者和用户的支持

## 📞 联系我们

- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](https://github.com/siyuan0215/easier-axios-dsl/issues)
- 📖 文档: [项目 Wiki](https://github.com/siyuan0215/easier-axios-dsl/wiki)

---

⭐ 如果这个项目对你有帮助，请给我们一个 Star！
