<script lang="ts" setup>
import useI18nHandler from "~/composables/useI18nHandler";
const { t } = useI18n();
// Consume `refreshing` to gate button interaction during async switch.
const { setLang, langCookie, refreshing } = useI18nHandler();

const handleLanguageSwitch = async () => {
  const newLang = langCookie.value === "en" ? "ar" : "en";
  await setLang(newLang);
  window.location.reload();
};

// Logic: If current is EN, show "ع". If current is AR, show "EN".
const buttonLabel = computed(() => {
  return langCookie.value === "en" ? "ع" : "EN";
});

// Readable accessible label.
const ariaLabel = computed(() => {
  return langCookie.value === "en"
    ? t("Switch to Arabic")
    : t("Switch to English");
});
</script>

<template>
  <button
    :disabled="refreshing"
    :aria-busy="refreshing"
    :aria-label="ariaLabel"
    :title="ariaLabel"
    class="cursor-pointer w-9 h-9 flex items-center justify-center rounded-lg text-[#154066] border border-gray-200 hover:border-[#154066]/30 hover:bg-[#154066]/[0.05] transition-all duration-150"
    @click="handleLanguageSwitch"
  >
    <!--
      :disabled + :aria-busy prevent spam-clicks during the async
      refreshNuxtData() call.

      ClientOnly is kept to guard against hydration mismatches on cold loads
      with no cookie. The fallback renders something meaningful (not "...").
    -->
    <ClientOnly>
      <span class="inline-block text-center">{{ buttonLabel }}</span>

      <template #fallback>
        <!-- SSR fallback: cookie default is "ar", so show "EN" as the switch target. -->
        <span class="inline-block text-center">EN</span>
      </template>
    </ClientOnly>
  </button>
</template>
