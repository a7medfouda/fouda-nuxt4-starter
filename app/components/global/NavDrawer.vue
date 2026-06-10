<script lang="ts" setup>
const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ "update:open": [value: boolean] }>();

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit("update:open", val),
});

const close = () => (isOpen.value = false);
const { t, locale } = useI18n();

const authOverlayOpen = useState("authOverlayOpen", () => false);
const authStep = useState("authStep", () => "login");

const openAuth = (step: "login" | "register") => {
  authStep.value = step;
  authOverlayOpen.value = true;
  close();
};

const navLinks = [
  { label: t("Home"), to: "/", icon: "i-heroicons-home" },
  { label: t("About Us"), to: "/about-us", icon: "i-heroicons-information-circle" },
  { label: t("Contact Us"), to: "/contact", icon: "i-heroicons-envelope" },
  { label: t("Swiper Examples"), to: "/swiper-examples", icon: "i-heroicons-squares-2x2" },
  { label: t("GSAP Examples"), to: "/gsap-examples", icon: "i-heroicons-sparkles" },
];

const route = useRoute();
watch(() => route.path, close);
</script>

<template>
  <UDrawer
    v-model:open="isOpen"
    :direction="locale === 'en' ? 'left' : 'right'"
    class="md:hidden"
    :ui="{
      content: 'bg-white h-full flex flex-col w-[300px]',
      overlay: 'bg-gray-900/40 backdrop-blur-sm',
    }"
  >
    <template #header>
      <div class="flex items-center justify-between w-full px-6 py-5 border-b border-gray-100">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2" @click="close">
          <div
            class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#002240] to-[#0a4a8a] flex items-center justify-center shadow-md shadow-[#002240]/20"
          >
            <span class="text-white font-bold text-sm">N4</span>
          </div>
          <span class="text-lg font-semibold text-gray-900 tracking-tight">Starter</span>
        </NuxtLink>

        <button
          class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200"
          @click="close"
        >
          <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
        </button>
      </div>
    </template>

    <template #body>
      <div class="flex flex-col h-full">
        <!-- Navigation Links -->
        <nav class="flex-1 px-4 py-4">
          <ul class="space-y-1">
            <li v-for="link in navLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-gray-600 hover:text-[#002240] hover:bg-[#002240]/[0.04] transition-all duration-200 group"
                active-class="!text-[#002240] !bg-[#002240]/[0.07] !font-semibold"
                @click="close"
              >
                <div
                  class="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-[#002240]/10 flex items-center justify-center transition-all duration-200"
                >
                  <UIcon :name="link.icon" class="w-4 h-4" />
                </div>
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- Bottom Actions -->
        <div class="px-4 pb-6 pt-4 border-t border-gray-100 space-y-3">
          <UButton
            variant="outline"
            color="neutral"
            block
            size="lg"
            class="!rounded-xl !font-medium"
            @click="openAuth('login')"
          >
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-4 h-4 me-2" />
            {{ t("Login") }}
          </UButton>
          <UButton
            color="primary"
            block
            size="lg"
            class="!rounded-xl !font-medium !bg-gradient-to-r !from-[#002240] !to-[#0a4a8a]"
            @click="openAuth('register')"
          >
            {{ t("Get Started") }}
          </UButton>
        </div>
      </div>
    </template>
  </UDrawer>
</template>
