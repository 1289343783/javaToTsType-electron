<template>
  <n-config-provider :date-locale="dateZhCN" :hljs="hljs" :locale="zhCN" :theme="theme"
                     :theme-overrides="themeOverrides">
    <naive-provider>
      <router-view />
    </naive-provider>
  </n-config-provider>
</template>

<script setup>
import { zhCN, dateZhCN, NConfigProvider, useOsTheme, darkTheme } from "naive-ui";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";
import NaiveProvider from "./components/NaiveProvider.vue";
import { computed } from "vue";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("java", java);
hljs.registerLanguage("cpp", cpp);
const osThemeRef = useOsTheme();
const theme = computed(() => {
  return osThemeRef.value === "dark" ? darkTheme : null;
});
const themeOverrides = {
  common: {
    primaryColor: "#1F94F1",
    primaryColorHover: "#1F94F1",
    primaryColorPressed: "#1F94F1",
    borderRadius: "12px"
  },
  Dialog: {
    borderRadius: "12px"
  },
  Scrollbar: {
    color: "transparent"
  }
};
</script>

<style scoped></style>
