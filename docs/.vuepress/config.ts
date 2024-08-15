import { navbar, sidebar } from "./configs";

import PluginShiki from "@vuepress/plugin-shiki";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
import path from "path";
import { viteBundler } from "@vuepress/bundler-vite";

const isPublish = process.env.IS_PUBLISH === "yes";

export default defineUserConfig({
  lang: "en-US",
  title: "Calendar Heatmap",
  description: "Simple Heatmap Component for Vue 3",
  base: isPublish ? "/vue3-calendar-heatmap/" : "/",
  bundler: viteBundler({
    viteOptions: {
      resolve: {
        alias: [
          {
            find: "@",
            replacement: path.resolve(__dirname, "../../src"),
          },
        ],
      },
    },
  }),
  theme: defaultTheme({
    logo: "https://vuejs.org/images/logo.png",
    repo: "rafalolszewski94/vue3-calendar-heatmap",
    docsDir: "docs",
    locales: {
      /**
       * English locale config
       *
       * As the default locale of @vuepress/theme-default is English,
       * we don't need to set all of the locale fields
       */
      "/": {
        // navbar
        navbar,

        // sidebar
        sidebar,

        // page meta
        editLinkText: "Edit this page on GitHub",
      },
    },
    themePlugins: {
      // only enable git plugin in production mode
      git: true,
      // use shiki plugin in production mode instead
      prismjs: false,
    },
  }),
  plugins: [
    PluginShiki({
      langs: ["ts", "json", "vue", "md", "bash", "diff"],
    }),
  ],
});
