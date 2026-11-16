import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  /**
   * 博客本身不需要侧边栏，这里显式关闭，
   * 避免主题对每个没有配置的页面输出警告。
   */
  "/": false,

  // 侧边栏只在 /notes/ 下的页面显示，按文件结构自动生成
  "/notes/": "structure",
});
