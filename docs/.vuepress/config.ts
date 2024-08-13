import { defaultTheme, defineUserConfig, viteBundler } from "vuepress";
import { navbar, sidebar } from "./configs";

import type { DefaultThemeOptions } from "vuepress";
import PluginRegisterComponents from "@vuepress/plugin-register-components";
import PluginShiki from "@vuepress/plugin-shiki";
import path from "path";

const isPublish = process.env.IS_PUBLISH === "yes";

export default defineUserConfig<DefaultThemeOptions>({
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
    colorMode: "light",
    colorModeSwitch: false,
    logo: "https://vuejs.org/images/logo.png",
    repo: "razorness/vue3-calendar-heatmap",
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
    PluginRegisterComponents({
      componentsDir: path.resolve(__dirname, "./components"),
      components: {
        CalendarHeatmap: path.resolve(
          __dirname,
          "../../src/components/CalendarHeatmap.vue"
        ),
      },
    }),
    PluginShiki({
      theme: "dark-plus",
    }),
  ],
});
