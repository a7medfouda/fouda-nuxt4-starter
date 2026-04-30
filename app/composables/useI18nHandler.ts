import { ref } from "vue";
import { useCookie, useHead, refreshNuxtData } from "nuxt/app";

type Lang = "en" | "ar";

export default function useI18nHandler() {
  const refreshing = ref(false);

  // Fix 6.2: Use built-in cookie default instead of a side-effectful assignment
  // on every composable call.
  const langCookie = useCookie<Lang>("lang", { default: () => "ar" });

  const { locale, t } = useI18n({ useScope: "global" });

  // Fix 2.1 + 1.2: Register useHead once with a reactive getter so it runs
  // correctly on both SSR and the client, and never leaks stale head entries.
  useHead(() => ({
    htmlAttrs: {
      lang: langCookie.value,
      dir: langCookie.value === "ar" ? "rtl" : ("ltr" as "rtl" | "ltr"),
    },
    bodyAttrs: {
      dir: langCookie.value === "ar" ? "rtl" : ("ltr" as "rtl" | "ltr"),
    },
  }));

  const setLang = async (lang: Lang) => {
    langCookie.value = lang;
    locale.value = lang;

    refreshing.value = true;
    try {
      // TODO (Performance – Critical): Replace the wildcard call below with a
      // selective key list, e.g. refreshNuxtData(['products', 'categories']),
      // to avoid re-fetching every cached useFetch/useAsyncData key on each
      // language switch. Doing a full refresh can trigger a network waterfall
      // and freeze the UI on slow connections.
      await refreshNuxtData();
    } finally {
      refreshing.value = false;
    }
  };

  // Fix 6.1: Return `refreshing` so consumers can bind disabled/aria-busy states.
  return { setLang, t, langCookie, refreshing };
}
