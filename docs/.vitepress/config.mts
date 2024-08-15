import { defineConfig } from "vitepress";
import path from "path";

const IS_PUBLISHED = process.env.IS_PUBLISH;

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: IS_PUBLISHED ? "/vue3-cal-heatmap/" : "/",
  title: "Vue 3 Calendar Heatmap",
  description:
    "A lightweight calendar heatmap Vue 3 component built on SVG, inspired by julienr114's vue-calendar-heatmap ans github's contribution calendar graph",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide" },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/rafalolszewski94/vue3-cal-heatmap",
      },
    ],
    search: {
      provider: "local",
    },
    editLink: {
      pattern:
        "https://github.com/rafalolszewski94/vue3-cal-heatmap/edit/master/docs/:path",
    },
  },
  markdown: {
    lineNumbers: true,
  },
  vite: {
    resolve: {
      alias: [
        {
          find: "@",
          replacement: path.resolve(__dirname, "../../src"),
        },
      ],
    },
  },
});
