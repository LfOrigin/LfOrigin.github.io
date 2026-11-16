import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";
import { author, authorUrl, description, hostname, owner, repo } from "./site.js";

export default hopeTheme({
  // 站点域名，用于生成 sitemap 等绝对链接
  hostname,

  // 作者信息
  author: {
    name: author,
    url: authorUrl,
  },

  // 左上角 Logo，文件位于 docs/.vuepress/public/logo.svg
  logo: "/logo.svg",
  favicon: "/logo.svg",

  // 仓库地址，会显示在导航栏右上角的 GitHub 图标
  repo: `${owner}/${repo}`,

  // 文档所在目录，用于“编辑此页”链接
  docsDir: "docs",

  // 导航栏与侧边栏
  navbar,
  sidebar,

  // 页脚
  displayFooter: true,
  footer: `MIT Licensed | Copyright © ${new Date().getFullYear()} ${author}`,
  // 关闭主题自带的版权信息，避免与上面的 footer 重复
  copyright: false,

  // 文章页展示的元信息
  pageInfo: ["Author", "Date", "Category", "Tag", "ReadingTime", "Word"],

  // 博客相关配置
  blog: {
    name: author,
    description,
    intro: "/about.html",
    timeline: "写下去，就对了",
    medias: {
      GitHub: authorUrl,
    },
    articlePerPage: 10,
  },

  // 中文文案
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  // 热更新（仅在调试主题时开启，会明显拖慢构建）
  // hotReload: true,

  // 主题内置的 Markdown 增强，按需保留
  markdown: {
    align: true,
    attrs: true,
    codeTabs: true,
    figure: true,
    gfm: true,
    imgLazyload: true,
    imgSize: true,
    mark: true,
    spoiler: true,
    sub: true,
    sup: true,
    tabs: true,
    tasklist: true,
    vPre: true,
  },

  plugins: {
    // 文章列表、分类、标签、时间线等页面的来源
    blog: true,

    // 在 Markdown 中直接使用 <Badge /> <VPCard /> 组件
    components: {
      components: ["Badge", "VPCard"],
    },

    // 图标库（Font Awesome 6）
    icon: {
      prefix: "fa6-solid:",
    },
  },
});

