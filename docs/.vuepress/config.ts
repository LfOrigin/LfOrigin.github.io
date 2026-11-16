import { defineUserConfig } from "vuepress";

import theme from "./theme.js";
import { base, description, title } from "./site.js";

export default defineUserConfig({
  base,

  lang: "zh-CN",
  title,
  description,

  theme,

  // 与 PWA 一起启用时建议关闭预取
  // shouldPrefetch: false,
});
