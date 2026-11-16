---
date: 2026-11-15
category: 前端
tag:
  - VuePress
  - 教程
  - 博客
cover: /assets/images/cover1.jpg
---

# 用 vuepress-theme-hope 搭建个人博客

本文记录这个博客从零搭建的完整过程。跟着做，大约 10 分钟就能在本地跑起来。

<!-- more -->

## 为什么是这个组合

静态博客的常见方案有 Hexo、Hugo、Astro、VuePress 等。选择 VuePress 2 + vuepress-theme-hope 的理由：

- **Markdown 优先**：写作体验好，同时支持在 Markdown 里直接写 Vue 组件
- **主题开箱即用**：文章列表、分类、标签、时间线、搜索、评论接口一应俱全
- **Vite 驱动**：本地热更新很快，构建也快
- **纯静态**：构建产物就是一堆 HTML/CSS/JS，扔到 GitHub Pages 即可

::: note 版本说明

本文写作时使用 VuePress `2.0.0-rc.31` 与 vuepress-theme-hope `2.0.0-rc.110`。
两者版本需要匹配，升级时请一起升级。

:::

## 环境准备

需要 Node.js 20.19 及以上版本：

```bash
node -v
# v22.x.x 或更高
```

包管理器用 npm、pnpm、yarn 都可以，本文以 npm 为例。

## 初始化项目

如果只是想快速体验，官方脚手架会生成一套完整的演示站点：

::: code-tabs#scaffold

@tab npm

```bash
npm init vuepress-theme-hope@latest my-blog
```

@tab pnpm

```bash
pnpm create vuepress-theme-hope my-blog
```

:::

不过脚手架会带很多演示文件。为了结构清晰，这个博客是手动搭建的，核心依赖只有五个：

```json
{
  "devDependencies": {
    "@vuepress/bundler-vite": "2.0.0-rc.31",
    "sass": "^1.108.2",
    "vue": "^3.5.45",
    "vuepress": "2.0.0-rc.31",
    "vuepress-theme-hope": "2.0.0-rc.110"
  }
}
```

安装依赖：

```bash
npm install
```

## 目录结构

```text
blog/
├─ .github/workflows/deploy.yml   # GitHub Actions 自动部署
├─ docs/                          # 站点根目录（sourceDir）
│  ├─ .vuepress/
│  │  ├─ config.ts                # VuePress 配置入口
│  │  ├─ theme.ts                 # 主题配置
│  │  ├─ navbar.ts                # 导航栏
│  │  ├─ sidebar.ts               # 侧边栏
│  │  ├─ site.ts                  # 站点信息 / base 计算
│  │  ├─ styles/                  # 自定义样式
│  │  └─ public/                  # 静态资源，原样复制到产物根目录
│  ├─ README.md                   # 首页（布局为 Blog）
│  ├─ about.md                    # 关于页
│  ├─ posts/                      # 文章
│  └─ notes/                      # 学习笔记（带侧边栏）
├─ package.json
└─ tsconfig.json
```

## 三处关键配置

### 1. 站点入口 `config.ts`

```ts
import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { base, description, title } from "./site.js";

export default defineUserConfig({
  base,
  lang: "zh-CN",
  title,
  description,
  theme,
});
```

`base` 是部署路径，也是新手最容易踩坑的地方：仓库名不是 `<用户名>.github.io` 时，它必须是 `/<仓库名>/`。本项目在 `site.ts` 里根据 GitHub Actions 注入的 `GITHUB_REPOSITORY` 自动计算，正常不需要手改。

### 2. 主题配置 `theme.ts`

```ts
import { hopeTheme } from "vuepress-theme-hope";

export default hopeTheme({
  hostname: "https://your-github-name.github.io",
  author: { name: "你的名字", url: "https://github.com/your-github-name" },
  logo: "/logo.svg",
  repo: "your-github-name/my-blog",
  docsDir: "docs",
  blog: {
    description: "记录技术、读书与生活",
    intro: "/about.html",
  },
  plugins: {
    blog: true,
  },
});
```

`plugins.blog: true` 会生成这些页面：

- `/article/` 文章列表（支持分页）
- `/category/` 分类页
- `/tag/` 标签页
- `/timeline/` 时间线
- `/star/` 星标文章

### 3. 导航栏与侧边栏

```ts
// navbar.ts
export default navbar([
  "/",
  { text: "文章", icon: "book", link: "/article/" },
  { text: "笔记", icon: "pen-to-square", link: "/notes/" },
  { text: "关于", icon: "circle-info", link: "/about.html" },
]);
```

```ts
// sidebar.ts
export default sidebar({
  "/notes/": "structure", // 按目录结构自动生成
});
```

`"structure"` 很好用：目录里有几篇文章，侧边栏就自动生成几项，不用手动维护。

## 写第一篇文章

在 `docs/posts/` 下新建 `my-first-post.md`：

```md
---
date: 2026-11-16
category: 随笔
tag:
  - 博客
cover: /assets/images/cover1.jpg
---

# 我的第一篇文章

正文从这里开始。
```

只要 frontmatter 里有 `date`，这篇文章就会出现在文章列表、时间线、分类和标签页里。

::: tip 小技巧

在 frontmatter 里加 `star: true`，文章会被标记为星标，出现在 `/star/` 页面。

:::

## 本地预览

```bash
npm run docs:dev
```

打开 <http://localhost:8080> 即可。修改 Markdown 或配置后页面会自动刷新。

构建静态文件：

```bash
npm run docs:build
```

产物在 `docs/.vuepress/dist/`，可以直接部署到任意静态托管平台。

## 下一步

站点能跑了，接下来把它发布到公网：

- [把博客发布到 GitHub Pages](/posts/deploy-to-github-pages.html)
- [Markdown 增强速查](/posts/markdown-showcase.html)
