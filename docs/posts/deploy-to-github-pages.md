---
date: 2026-11-14
category: 前端
tag:
  - GitHub Pages
  - CI
  - 部署
cover: /assets/images/cover2.jpg
---

# 把博客发布到 GitHub Pages

站点在本地跑起来之后，最激动人心的一步就是把它放到公网上。GitHub Pages 免费、稳定、支持自定义域名，配合 GitHub Actions 可以做到「推代码即发布」。

<!-- more -->

## 先搞清楚页面地址

GitHub Pages 有两种仓库：

| 仓库名 | 地址 | `base` |
| --- | --- | --- |
| `<用户名>.github.io` | `https://<用户名>.github.io/` | `/` |
| 其他名字，如 `my-blog` | `https://<用户名>.github.io/my-blog/` | `/my-blog/` |

第二种叫**项目主页**，站点被放在子路径下。VuePress 生成的资源链接都是绝对路径，如果 `base` 和实际路径不一致，页面就会变成没有样式的白板——这是最常见的「部署成功但页面全乱」的原因。

::: important 本项目已经处理好了

`docs/.vuepress/site.ts` 会读取 GitHub Actions 自动注入的 `GITHUB_REPOSITORY`，
判断是用户主页还是项目主页，并算出正确的 `base`。你不需要手动改。

:::

## 创建工作流

在项目根目录新建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy Blog

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v6
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build site
        env:
          NODE_OPTIONS: --max_old_space_size=4096
        run: npm run docs:build

      - name: Add .nojekyll
        run: touch docs/.vuepress/dist/.nojekyll

      - uses: actions/configure-pages@v5

      - uses: actions/upload-pages-artifact@v5
        with:
          path: docs/.vuepress/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

逐段解释：

- `on.push.branches`：推到 `main` 分支时触发。如果你的默认分支叫 `master`，改成 `master`
- `permissions`：上传 Pages 产物、申请 OIDC 令牌所必需，少了会 403
- `fetch-depth: 0`：拉取完整 git 历史，主题的「最后更新时间」依赖它
- `.nojekyll`：告诉 GitHub Pages 不要用 Jekyll 处理产物，避免以下划线开头的目录被忽略
- `upload-pages-artifact` + `deploy-pages`：GitHub 官方推荐的 Pages 部署方式

## 打开 Pages 开关

首次部署前必须手动设置一次：

1. 打开仓库的 **Settings → Pages**
2. **Build and deployment → Source** 选择 **GitHub Actions**
3. 回到 **Actions** 标签页，等待 `Deploy Blog` 运行完成
4. 在运行记录里可以看到站点地址

之后每次 `git push`，工作流都会重新构建并发布，通常一两分钟完成。

::: warning 第一次可能失败

如果第一次运行报 `Get Pages site failed` 之类的错误，通常是因为第 2 步还没做。
设置好 Source 之后，在 Actions 页面点 **Re-run all jobs** 即可。

:::

## 推送到 GitHub

```bash
git init -b main
git add .
git commit -m "chore: init blog"
git remote add origin https://github.com/<用户名>/<仓库名>.git
git push -u origin main
```

推送成功后，工作流会自动开始。可以在仓库的 **Actions** 页面看实时日志。

## 绑定自定义域名

如果想让博客跑在自己的域名上（例如 `blog.example.com`），按以下步骤操作：

1. 在仓库 **Settings → Pages → Custom domain** 填入域名并保存
2. GitHub 会在仓库根目录生成 `CNAME` 文件；也可以自己提交一个

   项目里准备了 `docs/.vuepress/public/CNAME.example`，改名为 `CNAME` 并填入域名即可：

   ```text
   blog.example.com
   ```

3. 到域名服务商添加解析：

   | 类型 | 主机记录 | 记录值 |
   | --- | --- | --- |
   | CNAME | `blog` | `<用户名>.github.io` |

   如果是根域名（`example.com`），需要配置四条 A 记录指向 GitHub Pages 的 IP，
   具体地址见 [GitHub 官方文档](https://docs.github.com/zh/pages/configuring-a-custom-domain-for-your-github-pages-site)。

4. 等待 DNS 生效，然后在 Pages 设置里勾选 **Enforce HTTPS**

::: tip 自定义域名会改变 base 吗

不会。使用了自定义域名后，站点根路径就是域名根路径，`base` 仍然是 `/`。
如果仓库是项目主页且绑定了自定义域名，需要把 `base` 改成 `/`。

:::

## 常见问题排查

::: details 页面能打开，但没有样式、图片全是裂图

几乎一定是 `base` 配错了。打开浏览器控制台，看 CSS 请求的路径：

- 请求 `/assets/xxx.css` 但站点在 `/my-blog/` 下 → `base` 少了仓库名
- 请求 `/my-blog/assets/xxx.css` 但站点在根路径 → `base` 多了仓库名

:::

::: details 首页正常，点进文章 404

检查是否在 Settings → Pages 里选择了 `GitHub Actions`，以及工作流是否真的把 `docs/.vuepress/dist` 上传成功。
也可以在 Actions 产物里确认 `index.html` 是否存在。

:::

::: details 构建在本地成功，在 CI 失败

先看日志里的 Node 版本。本项目要求 Node 20.19+，工作流里固定为 22。
另外 `npm ci` 需要仓库里有 `package-lock.json`，记得把它一起提交。

:::

## 发布流程小结

之后写文章的流程就非常轻松了：

```bash
# 1. 新建或修改 docs/posts/ 下的 Markdown
# 2. 本地预览
npm run docs:dev

# 3. 提交并推送
git add .
git commit -m "post: 新文章标题"
git push
```

推送之后什么都不用做，GitHub Actions 会替你完成构建和发布。
