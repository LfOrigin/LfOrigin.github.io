# 我的博客

基于 [VuePress 2](https://v2.vuepress.vuejs.org/zh/) + [vuepress-theme-hope](https://theme-hope.vuejs.press/zh/) 的个人博客，使用 GitHub Actions 自动构建并发布到 GitHub Pages。

- 支持文章列表、分类、标签、时间线、星标文章
- 支持暗色模式、全文搜索、文章目录、阅读时间
- 纯静态产物，零服务器成本

## 技术栈

| 依赖 | 版本 | 作用 |
| --- | --- | --- |
| vuepress | 2.0.0-rc.31 | 静态站点生成器 |
| vuepress-theme-hope | 2.0.0-rc.110 | 博客主题 |
| @vuepress/bundler-vite | 2.0.0-rc.31 | Vite 构建器 |
| vue / sass | 3.5 / 1.108 | 运行时与样式 |

> VuePress 2 与主题的版本需要匹配，升级时请同时升级，并保持 `@vuepress/bundler-vite` 与 `vuepress` 版本一致。

## 快速开始

要求 Node.js 20.19 及以上。

```bash
# 安装依赖
npm install

# 本地开发，默认 http://localhost:8080
npm run docs:dev

# 构建静态文件到 docs/.vuepress/dist
npm run docs:build

# 清理缓存后启动（改了主题样式但没生效时可以试试）
npm run docs:clean-dev
```

## 目录结构

```text
.
├─ .github/workflows/deploy.yml   # GitHub Actions 自动部署
├─ docs/                          # 站点根目录
│  ├─ .vuepress/
│  │  ├─ config.ts                # VuePress 配置入口
│  │  ├─ theme.ts                 # 主题配置（作者、导航、博客、Markdown）
│  │  ├─ navbar.ts                # 导航栏
│  │  ├─ sidebar.ts               # 侧边栏（仅 /notes/ 使用）
│  │  ├─ site.ts                  # 站点信息 + 部署 base 计算
│  │  ├─ styles/                  # 自定义样式与主题色
│  │  └─ public/                  # 静态资源，原样复制到产物根目录
│  ├─ README.md                   # 首页
│  ├─ about.md                    # 关于页
│  ├─ posts/                      # 博客文章
│  └─ notes/                      # 学习笔记（带侧边栏）
├─ package.json
└─ tsconfig.json
```

## 改成你自己的站点

只需要改以下几处（都在 `docs/` 下）：

1. **站点信息** — `docs/.vuepress/site.ts`

   ```ts
   export const title = "我的博客";
   export const description = "记录技术、读书与生活的地方。";
   export const author = "你的名字";
   ```

   `owner` 与 `repo` 在本地默认是占位符，GitHub Actions 中会自动读取 `GITHUB_REPOSITORY`，通常不用改。

2. **关于页** — `docs/about.md`，替换自我介绍、邮箱与社交链接。

3. **Logo 与封面** — 替换 `docs/.vuepress/public/logo.svg`、
   `docs/.vuepress/public/assets/images/cover*.jpg`（文章 frontmatter 的 `cover` 引用它们）。

4. **导航栏** — `docs/.vuepress/navbar.ts`，按需增删入口。

5. **主题色** — `docs/.vuepress/styles/config.scss` 里的 `$theme-color`。

6. **首页文案** — `docs/README.md` 的 `heroText` 和 `tagline`。

## 写文章

在 `docs/posts/` 下新建 Markdown 文件即可：

```md
---
date: 2026-12-01
category: 前端
tag:
  - Vue
  - 教程
cover: /assets/images/cover2.jpg
star: true
---

# 文章标题

这里是摘要，会显示在首页文章列表里。

<!-- more -->

这里是正文。
```

要点：

- `date` 必填，否则文章不会出现在文章列表与时间线里
- `category` 建议只写一个，`tag` 可以写多个
- `<!-- more -->` 之前的内容会作为首页摘要；不写会展示全文
- `star: true` 会出现在 `/star/` 星标页
- 文章链接形如 `/posts/文件名.html`

主题支持的提示容器、代码组、任务列表等写法，见 [Markdown 增强速查](docs/posts/markdown-showcase.md)。

## 部署到 GitHub Pages

### 1. 推送到 GitHub

```bash
git init -b main
git add .
git commit -m "chore: init blog"
git remote add origin https://github.com/<用户名>/<仓库名>.git
git push -u origin main
```

### 2. 打开 Pages

仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。

### 3. 等待自动部署

`.github/workflows/deploy.yml` 会在每次推送到 `main` 时：

1. 安装依赖（`npm ci`）
2. 构建站点（`npm run docs:build`）
3. 上传 `docs/.vuepress/dist` 并发布到 Pages

首次部署完成后，仓库的 **Actions → Deploy Blog** 里可以看到站点地址。

### 关于 base 路径（重要）

GitHub Pages 的地址有两种形式，`base` 必须与之匹配，否则会出现「页面能打开但没有样式」：

| 仓库名 | 站点地址 | base |
| --- | --- | --- |
| `<用户名>.github.io` | `https://<用户名>.github.io/` | `/` |
| 其他名字（如 `my-blog`） | `https://<用户名>.github.io/my-blog/` | `/my-blog/` |

本项目在 `docs/.vuepress/site.ts` 中读取 GitHub Actions 注入的 `GITHUB_REPOSITORY` 自动计算 `base`，
**CI 中无需手动配置**。本地开发默认使用 `/`。

如果想在本地预览「部署到子路径」后的效果：

```bash
# Windows PowerShell
$env:SITE_BASE="/my-blog/"; npm run docs:build

# macOS / Linux
SITE_BASE=/my-blog/ npm run docs:build
```

### 自定义域名

1. 把 `docs/.vuepress/public/CNAME.example` 重命名为 `CNAME`，内容写你的域名（不带 `https://`）
2. 域名服务商处添加 CNAME 记录，指向 `<用户名>.github.io`
3. 仓库 **Settings → Pages → Custom domain** 填入域名，DNS 生效后勾选 **Enforce HTTPS**
4. 修改 `.github/workflows/deploy.yml` 的构建步骤，显式指定根路径与域名：

   ```yaml
   - name: Build site
     env:
       NODE_OPTIONS: --max_old_space_size=4096
       SITE_BASE: /
       SITE_HOSTNAME: https://blog.example.com
     run: npm run docs:build
   ```

   > 项目主页（`/<仓库名>/`）绑定自定义域名后，站点根路径会变成域名根路径，
   > 因此必须把 `SITE_BASE` 设为 `/`，否则静态资源仍会去 `/仓库名/` 下找。

改完后推送，等待 Actions 重新部署即可。`base` 与 `hostname` 都支持环境变量覆盖，
也可以直接修改 `docs/.vuepress/site.ts` 里的默认值。

## 常见问题

**本地构建成功，Pages 上白屏 / 没有样式**

99% 是 `base` 与实际地址不一致。打开浏览器控制台看 CSS 请求路径，对照上面的表格检查。
CI 部署走的是自动计算，若手动改过 `SITE_BASE` 请确认值正确。

**GitHub Actions 报 `npm ci` 失败**

`npm ci` 依赖 `package-lock.json`，确保它已提交到仓库。如果改了依赖，先在本地执行
`npm install` 生成新的 lock 文件再提交。

**构建时内存不足**

工作流里已设置 `NODE_OPTIONS=--max_old_space_size=4096`。文章特别多时可以调大，或拆分构建。

**图标显示为空白**

导航栏和卡片图标来自 [Iconify](https://icon-sets.iconify.design/)，运行时从 CDN 加载。
网络受限时会显示为空白，但不影响文字与功能。企业内网部署时可改用本地图标方案。

**Node 版本**

VuePress 2 要求 Node.js 20.19+，工作流固定使用 Node 22。

## 本地构建产物

`npm run docs:build` 之后，静态文件在 `docs/.vuepress/dist/`，可以直接：

```bash
npx serve docs/.vuepress/dist
```

或部署到任意静态托管（Netlify、Vercel、对象存储等）。

## License

MIT
