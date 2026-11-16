---
title: 几个好用的 TypeScript 类型技巧
date: 2026-11-06
icon: wand-magic-sparkles
---

# 几个好用的 TypeScript 类型技巧

记录一些在项目里反复用到的类型技巧，每一个都配了最小示例。

## 从常量推导联合类型

```ts
const ROLES = ["admin", "editor", "guest"] as const;

type Role = (typeof ROLES)[number];
// "admin" | "editor" | "guest"
```

比手写联合类型更安全：数组里加一个值，类型自动更新。

## 用 `satisfies` 保留字面量类型

```ts
type Routes = Record<string, { title: string; icon?: string }>;

const routes = {
  home: { title: "首页" },
  about: { title: "关于", icon: "user" },
} satisfies Routes;
```

`routes.home.title` 的类型是 `"首页"` 而不是 `string`，同时仍然受 `Routes` 约束。

## 模板字面量类型

```ts
type EventName = `on${Capitalize<"click" | "focus" | "blur">}`;
// "onClick" | "onFocus" | "onBlur"
```

适合给事件系统、CSS 变量名、i18n key 做约束。

## 用 `infer` 提取类型

```ts
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type A = UnwrapPromise<Promise<string>>; // string
type B = UnwrapPromise<number>;          // number
```

## 类型守卫与 `asserts`

```ts
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") throw new TypeError("expected string");
}

const input: unknown = "hello";
assertIsString(input);
input.toUpperCase(); // 之后 TS 认为它一定是 string
```

## 避免 `any` 的几个替代

| 场景 | 推荐写法 |
| --- | --- |
| 真的未知 | `unknown` + 类型收窄 |
| 任意对象 | `Record<string, unknown>` |
| 函数任意参数 | `(...args: never[]) => void` |
| 第三方库缺类型 | 自己写 `.d.ts`，实在不行再 `as` |

## 最后

类型不是目的，**让错误在编译期暴露**才是。能用类型表达的业务规则，就不要只写在注释里。
