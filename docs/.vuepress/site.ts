/**
 * 站点全局信息
 *
 * 把下面几项换成你自己的信息即可，其余配置都不用改。
 */

/** GitHub 用户名（用于页脚链接、编辑此页链接） */
export const owner = process.env.GITHUB_REPOSITORY?.split("/")[0] || "lforigin";

/** 仓库名 */
export const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] || "lforigin.github.io";

/**
 * 部署到 GitHub Pages 时的站点根路径（base）。
 *
 * - 仓库名是 `<用户名>.github.io`（用户主页）→ base 为 `/`
 * - 仓库名是其他名字（项目主页）      → base 为 `/<仓库名>/`
 * - 本地开发时默认 `/`，方便直接访问 http://localhost:8080
 *
 * CI 中 `GITHUB_REPOSITORY` 由 GitHub 自动注入，所以 base 会被自动算对，
 * 正常情况下你不需要手动改。若想本地预览部署后的效果，可以这样构建：
 *
 *   Windows PowerShell: $env:SITE_BASE="/my-blog/"; npm run docs:build
 *   macOS / Linux:      SITE_BASE=/my-blog/ npm run docs:build
 */
const ciRepo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserSite = ciRepo.endsWith(".github.io");

/** VuePress 要求 base 以 `/` 开头并以 `/` 结尾 */
type BasePath = "/" | `/${string}/`;

export const base = (process.env.SITE_BASE ??
  (ciRepo ? (isUserSite ? "/" : `/${ciRepo}/`) : "/")) as BasePath;

/**
 * 站点地址（用于 sitemap、SEO 等绝对链接）
 *
 * 默认是 GitHub Pages 的地址，项目主页会自动带上仓库名。
 * 绑定自定义域名后，把环境变量 SITE_HOSTNAME 设为 `https://blog.example.com`，
 * 或直接修改这里。
 */
export const hostname =
  process.env.SITE_HOSTNAME ??
  `https://${owner}.github.io${base === "/" ? "" : base.replace(/\/$/, "")}`;

/** 站点标题 / 描述 / 作者 */
export const title = "我的博客";

export const description = "记录技术、读书与生活的地方。";

export const author = "Lforigin";

/** 作者主页，显示在文章页与博客信息卡上 */
export const authorUrl = `https://github.com/${owner}`;
