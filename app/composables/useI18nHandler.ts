import { ref } from "vue";
import { useCookie, useHead, reloadNuxtApp } from "nuxt/app";

type Lang = "en" | "ar";

export default function useI18nHandler() {
  const refreshing = ref(false);

  const langCookie = useCookie<Lang>("lang", { default: () => "ar" });

  const { locale, t } = useI18n({ useScope: "global" });

  // Register useHead once with a reactive getter so it runs correctly on both
  // SSR and the client, and never leaks stale head entries.
  useHead(() => ({
    htmlAttrs: {
      lang: langCookie.value,
      dir: langCookie.value === "ar" ? "rtl" : ("ltr" as "rtl" | "ltr"),
    },
    bodyAttrs: {
      dir: langCookie.value === "ar" ? "rtl" : ("ltr" as "rtl" | "ltr"),
    },
  }));

  /**
   * Sync-only: update cookie + vue-i18n locale + head attrs.
   * No data fetching — safe to call on app boot.
   */
  const setLang = (lang: Lang) => {
    langCookie.value = lang;
    locale.value = lang;
  };

  /**
   * Full language switch (user-initiated): update state then perform a single
   * controlled page reload. reloadNuxtApp() triggers one SSR render that reads
   * the updated cookie and fetches all data in the correct language — once.
   * The ttl deduplicates accidental double-triggers within 1 second.
   */
  const switchLang = (lang: Lang) => {
    refreshing.value = true;
    setLang(lang);
    reloadNuxtApp({ ttl: 1000 });
  };

  return { setLang, switchLang, t, langCookie, refreshing };
}
