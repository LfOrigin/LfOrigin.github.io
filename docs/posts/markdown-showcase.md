---
date: 2026-11-10
category: 写作
tag:
  - Markdown
  - VuePress
---

# 主题内置的 Markdown 增强速查

vuepress-theme-hope 在标准 Markdown 之外加了不少实用的语法。这篇文章把它们集中演示一遍，以后写作时可以直接抄。

<!-- more -->

## 提示容器

```md
::: tip 提示
内容
:::
```

效果：

::: tip 提示
这是一个 `tip` 容器，适合放补充说明。
:::

::: note 笔记
这是一个 `note` 容器。
:::

::: important 重要
这是一个 `important` 容器。
:::

::: warning 警告
这是一个 `warning` 容器。
:::

::: caution 小心
这是一个 `caution` 容器。
:::

::: details 点击展开
还可以做成折叠面板，适合放长代码或补充资料。
:::

## 代码块

带文件名和行高亮：

```ts title="docs/.vuepress/site.ts"
export const base = "/my-blog/"; // [!code highlight]
```

语法是 ` ```ts title="文件名" `，行高亮在代码行末写 `// [!code highlight]`。

### 代码组（Tab 切换）

::: code-tabs#install

@tab npm

```bash
npm install
```

@tab pnpm

```bash
pnpm install
```

:::

写法是用 `::: code-tabs#名称` 包裹，每组用 `@tab 标题` 分隔。

## 表格与任务列表

| 能力 | 是否内置 | 说明 |
| --- | :---: | --- |
| 提示容器 | ✅ | tip / note / warning 等 |
| 代码组 | ✅ | 多语言示例切换 |
| 任务列表 | ✅ | 写作清单 |
| 数学公式 | ⬜️ | 需额外安装 KaTeX |

- [x] 搭建站点
- [x] 写第一篇文章
- [ ] 绑定自定义域名
- [ ] 坚持更新

## 文本标记

- 高亮：`==重点内容==` → ==重点内容==
- 上下标：`H~2~O`、`x^2^` → H~2~O、x^2^
- 剧透：`!!被隐藏的文字!!` → !!被隐藏的文字!!
- 徽章：`<Badge text="新" type="tip" />` → <Badge text="新" type="tip" />

## 图片

支持指定尺寸与图注：

```md
![图片描述](/assets/images/cover2.jpg =400x)
```

也可以直接用 HTML `<img>` 控制更细节的样式。

## 在 Markdown 里用组件

主题注册了 `Badge`、`VPCard` 等组件，直接在 Markdown 里写即可：

<VPCard
  title="VuePress"
  desc="Vue 驱动的静态网站生成器"
  logo="/logo.svg"
  link="https://v2.vuepress.vuejs.org/zh/"
  background="rgba(30, 128, 255, 0.06)"
/>

## 更多

完整的语法列表见 [主题文档](https://theme-hope.vuejs.press/zh/guide/markdown/)，包括：

- 图表（Chart.js、ECharts、Mermaid）
- 幻灯片（reveal.js）
- 代码演示与 Vue 交互演示
- 数学公式

这些需要额外安装依赖，按需开启即可，不必一开始就全打开。
