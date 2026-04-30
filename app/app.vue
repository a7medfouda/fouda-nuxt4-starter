<script setup lang="ts">
//👉 Imports
import useI18nHandler from "~/composables/useI18nHandler";
import AuthOverlay from "./components/auth/AuthOverlay.vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
// لما التطبيق يفتح، لو في token بس user مش موجود (اتمسح من localStorage)
// نجيب بيانات اليوزر من الـ API تاني
// onMounted بيضمن إنه بيشتغل على الـ client بس (مش SSR)
onMounted(() => {
  authStore.syncAuthState();
});
const toaster = {
  position: "top-right" as const,
  duration: 2500,
  ui: {
    base: "z-index-[999999]",
    viewport: "z-index-[999999]",
    container: "z-index-[999999]",
    toast: "z-index-[999999]",
  },
};

//👉 Composables
const { setLang, langCookie } = useI18nHandler();
setLang(langCookie.value);
</script>
<template>
  <UApp :toaster="toaster">
    <Navbar />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <Footer />
    <AuthOverlay />
  </UApp>
</template>
<script setup lang="ts"></script>
