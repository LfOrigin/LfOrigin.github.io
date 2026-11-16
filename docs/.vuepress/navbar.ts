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
