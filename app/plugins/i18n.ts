import { defineNuxtPlugin } from "#imports";
import { createI18n } from "vue-i18n";
import ar from "~/i18n/ar.json";
import en from "~/i18n/en.json";

export default defineNuxtPlugin((nuxtApp) => {
  const langCookie = useCookie("lang", { default: () => "ar" });
  const i18n = createI18n({
    missingWarn: true,
    availableLocales: ["ar", "en"],
    legacy: false,
    globalInjection: true,
    locale: langCookie.value,
    fallbackLocale: false,
    messages: {
      ar,
      en,
    },
  });
  nuxtApp.vueApp.use(i18n);
  if (!nuxtApp.vueApp._context.components["i18n-t"]) {
    nuxtApp.vueApp.use(i18n);
  }
});
