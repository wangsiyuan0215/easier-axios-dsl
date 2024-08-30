# @siyuan0215/easier-axios-dsl

基于 [Axios](https://www.npmjs.com/package/axios) 以及借鉴了简单的 DSL（领域特定语言）制定了一套基本规则用于接口对接，减少冗余、重复的接口声明模板代码，提高开发效率。

## 🤖 如何安装？

使用 NPM 安装：

```bash
npm i @siyuan0215/easier-axios-dsl
```

使用 Yarn 安装：

```bash
yarn add @siyuan0215/easier-axios-dsl
```

## 🤙 优势

未使用 easier-axios-dsl 之前，我们再对接接口的时候往往需要添加如下代码：

```ts
// api/index.ts
import { request } from "@/utils/request";

export const getUserInfo = (userId: string) =>
  request("api/getUserInfo", {
    method: "GET",
    params: { userId },
  });

export const getPosts = ({ pageNumber, pageSize }) =>
  request("api/getPosts", {
    method: "GET",
    params: {
      pageNumber,
      pageSize,
    },
  });

export const saveUserInfo = (userInfo: UserInfo) =>
  request("api/saveUserInfo", {
    method: "POST",
    data: userInfo,
  });
```

可以看出，在声明接口时有很多重复的模板代码，这种方式主要有两个痛点：

- 接口较多时，大量的模板代码导致的冗余的代码增加，前端资源体积会增大；
- 影响了开发小伙伴的开发效率；

easier-axios-dsl 利用简单的“特定领域语言”优化了上述的两个痛点，一定程度上提高了开发的效率和减少了冗余的代码。

对于上述的代码例子，使用 easier-axios-dsl 进行改造：

```ts
// api/index.ts
import { generatorAPIS } from "@/utils/generateAPIs";

enum APIS {
  getUserInfo = "GET api/getUserInfo q:userId",
  getPosts = "GET api/getPosts d:pageNumber,pageSize",
  saveUserInfo = "POST api/saveUserInfo d:*",
}

export default generatorAPIS<typeof APIS>(APIS);
```

可以明显看出，使用 easier-axios-dsl 对接接口时 coding 更顺畅也更简洁。

_默认导出的 `generatorAPIS<typeof APIS>(APIS);` 函数执行结果是对象。_

需要注意的是，接口对象是以我们**声明的接口的名字**作为 key（比如 `getUserInfo`），以 `Promise` 作为值。因此我们既可以使用 `async / await` 也可以使用 `Promise` 处理请求的回调。

## ⚙️ 如何静态（全局）配置？

easier-axios-dsl 基于 Axios 进行二次封装。

考虑到可扩展性，我们提供了 `requestCreator(options: AxiosRequestConfig & Options<T>)` 方法需要您自行创建一个 Axios 的实例，并允许我们对其进行静态地配置。

```ts
// utils/generateAPIs.ts

import { requestCreator, G } from "@siyuan0215/easier-axios-dsl";

const otherAxiosConfig = {
  timeout: TIMEOUT.DEFAULT,
  withCredentials: true,
};

// 创建一个 Axios 的实例，参数为静态配置
export const request = requestCreator({
  requestInterceptors: [
    /* ... */
  ],
  responseInterceptors: [
    /* ... */
  ],
  ...otherAxiosConfig,
});

// 当前版本下，此具名导出必不可少
export const generatorAPIS = <T extends {}>(apiConfig: T) =>
  G<T>(request, apiConfig);
```

_❗️ 请注意，看上去上述代码有些繁琐，本可以将静态配置传入 `G` 函数中，直接返回 `generatorAPIS` 函数即可。但是考虑到在项目中可能有些接口对接需要用到 Axios 实例，因此我们决定将其暴露出来。_

`requestCreator` 函数返回的请求实例 `request` 函数参数类型声明如下：

```ts
request(
  { method, url, params, ...restOptions }: {
      url: AxiosRequestConfig["url"];
      method: AxiosRequestConfig["method"];
      params: AxiosRequestConfig["params"] | AxiosRequestConfig["data"];
    } & Omit<AxiosRequestConfig<any>, "url" | "method" | "params" | "data">,
  // 是否将 body 体封装为 formData
  isFormData?: boolean | undefined): Promise<T>
```

`request` 函数中接收传递请求体数据的 key 是 `params`，不论是 `POST` 还是 `GET` 请求方式，均通过这个字段传递。

我们保（tou）留（lan）了 Axios 的配置，同时提供了如下配置项：

```ts
export type Options<T> = {
  // 请求拦截器
  requestInterceptors: [OnFulfilled<AxiosRequestConfig>, OnRejected];
  // 响应拦截器
  responseInterceptors: [OnFulfilled<AxiosResponse<T>>, OnRejected];
};
```

| 参数                   | 类型                                            | 是否必填 | 说明       |
| ---------------------- | ----------------------------------------------- | -------- | ---------- |
| `requestInterceptors`  | `[OnFulfilled<AxiosRequestConfig>, OnRejected]` | 否       | 请求拦截器 |
| `responseInterceptors` | `[OnFulfilled<AxiosResponse>,OnRejected]`       | 否       | 响应拦截器 |

拦截器的具体配置方法参照[官方文档](https://axios-http.com/docs/interceptors)。

_❗️ 需要注意的是，使用 `requestCreator` 创建后的 Axios 实例会丢失官方的请求拦截和响应拦截的**静态**配置方式，需要使用 `requestInterceptors` 和 `responseInterceptors` 配置项，同时也无法使用多拦截器的特性。_

## 🧑🏽‍💻 如何使用？

继续以上述改造后的接口声明文件为例，我们创建了如下三个接口的函数（服务）：

- `getUserInfo`；
- `getPosts`；
- `saveUserInfo`；

只需要我们在对应的业务组件中，引入我们的接口函数，调用即可。

```HTML
<script lang="ts">
import APIS from '@/api/index.ts';

const fetchUserInfo = async (userId: string) => {
  try {
    const { data } = await APIS.getUserInfo({ userId });
    // ...
  } catch(error) {
    console.log("getUserInfo =>", error)
  }
}
</script>
```

接口函数中的类型如下：

```ts
type ApiRequestUrlMethod = (
  majorPayload: Record<string, any> | any[],
  otherPayload?: Record<string, any>,
  AxiosConfig?: AxiosRequestConfig
) => Promise;
```

其中：

- `majorPayload`：既可以是对象，也可以是数组（取决于后端声明 `POST` 请求的 body 体类型）;
- `otherPayload`：对象，可选，仅当 body 体需要传递数组，且接口仍需要传递额外的参数时，将额外的参数传入此对象中；
- `AxiosConfig`：对象，可选，Axios 运行时配置；

_❗️ 如果需要给请求添加运行时配置 `AxiosConfig`，又不需要用到 `otherPayload`（body 体非数组），请将第二个参数显示地传入 `undefined` 或 `void 0`，例如：_

```ts
APIS.exportFile(params, undefined, { responseType: "blob" });
// or
APIS.exportFile(params, void 0, { responseType: "blob" });
```

## 🔌 如何新增接口声明？

新声明一个接口时，需要遵照如下格式，每个部分（以 `[]` 内为一部分）均以空格隔开：

```bash
[POST|GET|PUT|DELETE|...] [url] [(d|data)|(d.f|d.formData|data.f|data.formData)|([d]|[data]))|(q|query)|path]:[(id,name,gender,...)|'*']
```

其中：

- `POST|GET|PUT|DELETE|...` HTTP 的请求方式；
- `url` 请求地址；
- 请求参数，格式为 `[参数载体类型]:[传递的参数 key]`，请注意**参数载体类型**和**需要传递的参数**需要以 `:` 冒号相连（不能出现空格）
  - `(d|data)|(d.f|d.formData|data.f|data.formData)|([d]|[data]))` 对应 `POST` 或 `PUT` 请求的 Body 体，其中：
    - 仅 `d` 或 `data` 指将参数放到正常 Body 体中（对象类型）；
    - `d.f` 或 `d.formData` 或 `data.f` 或 `data.formData` 指需要传递的是 FormData 类型，但是调用接口函数时传递对象类型（内部会帮助你处理好）；
    - `[d|data]` 指 Body 体传递的是数组，等价于：`data: [1,2,3,4]`；
  - `q|query` 传递给 `GET` 或 `DELETE` 请求的 query 参数；
  - `path` 表示将参数放到请求地址中进行传递（动态路由），比如：`api/getUserInfo/{uesrId}`；
- `[(id,name,gender,...)|'*']` 参数的 key
  - 枚举，如果有明确的 key，那么请以 `,` 逗号相连（**不能出现空格**），且最终请求后端接口时所传递的参数以此处声明的 key 为准；
  - 通配符 `*` 如果需要传递的参数比较多，可以使用 `*` 来表示将所有的参数全部传给后端（跳过参数校验的阶段）；

我们以 `GET` 和 `POST` 请求举几个例子，帮助大家理解：

```js
/**
 * POST:
 *    - `POST posts/save d:*`;
 *        equal: (params) => api.post({ url: baseUrl + 'posts/save', params }, true)
 *
 *    - `POST upload-file d:sourceType,systemType,fileName,file,remark`;
 *        equal: (types) => api.post({ url: baseUrl + 'upload-file', data: { file, remark } })
 *
 *    - `POST posts/list q:pageNumber,pageSize`;
 *        equal: (pageNumber, pageSize) => api.post({ url: baseUrl + 'posts/list', params: { pageNumber, pageSize} })
 *
 *    - `POST users/search [d] q:a`
 *        equal: (types) => api.post({ url: baseUrl + 'users/search' + '?a=1', data: types })
 *
 *    - `POST users/update d.f:a,b,c`
 *        equal: (data) => api.post({ url: baseUrl + 'users/update', data: FormData<{ a, b ,c }> }) and Content-Type is 'multipart/form-data'
 *
 * GET:
 *    - `GET users/getUserInfo q:userId`
 *        equal: (userId: string) => api.get({ url: baseUrl + 'users/getUserInfo', params: { userId } })
 *
 *    - `GET users/get/{id} path:id`
 *        equal: (id: string) => api.get({ url: baseUrl + 'users/get/' + id })
 * */
```

## 👻 单元测试

尽可能的覆盖所有的代码，保证代码的质量。

![alt text](image.png)


## 📦 未来计划？

- [X] 单元测试的编写；
- [ ] 支持多拦截器；
- [ ] 支持更多的载体类型，比如 Map 等；
- [ ] 支持原生小程序；
