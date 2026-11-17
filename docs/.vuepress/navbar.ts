import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "文章",
    icon: "book",
    prefix: "/",
    children: [
      { text: "全部文章", icon: "list", link: "article/" },
      { text: "分类", icon: "tags", link: "category/" },
      { text: "标签", icon: "tag", link: "tag/" },
      { text: "时间线", icon: "timeline", link: "timeline/" },
    ],
  },
  {
    text: "AI",
    icon: "book",
    prefix: "/notes/ai",
    children: [
      { text: "模型测评", icon: "list", link: "model-evaluation/" },
      { text: "Agent", icon: "tags", link: "agent/" },
      { text: "Harness", icon: "tag", link: "harness/" },
      { text: "AI协同", icon: "tags", link: "co-work/" },
    ],
  },
  {
    text: "笔记",
    icon: "pen-to-square",
    link: "/notes/",
  },
  {
    text: "关于",
    icon: "circle-info",
    link: "/about.html",
  },
]);
