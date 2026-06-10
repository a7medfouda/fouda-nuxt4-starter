<script lang="ts" setup>
const drawerOpen = ref(false);
const { t } = useI18n();

const authOverlayOpen = useState("authOverlayOpen", () => false);
const authStep = useState("authStep", () => "login");

const openAuth = (step: "login" | "register") => {
  authStep.value = step;
  authOverlayOpen.value = true;
};

const navLinks = [
  { label: t("Home"), to: "/", icon: "i-heroicons-home" },
  {
    label: t("About Us"),
    to: "/about-us",
    icon: "i-heroicons-information-circle",
  },
  { label: t("Contact Us"), to: "/contact", icon: "i-heroicons-envelope" },
  {
    label: t("Swiper Examples"),
    to: "/swiper-examples",
    icon: "i-heroicons-squares-2x2",
  },
  {
    label: t("GSAP Examples"),
    to: "/gsap-examples",
    icon: "i-heroicons-sparkles",
  },
];

const scrolled = ref(false);

onMounted(() => {
  const handleScroll = () => {
    scrolled.value = window.scrollY > 10;
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  onUnmounted(() => window.removeEventListener("scroll", handleScroll));
});
</script>

<template>
  <nav
    class="sticky top-0 z-50 h-16 flex items-center transition-all duration-300"
    :class="[
      scrolled
        ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-gray-900/5 border-b border-gray-200/50'
        : 'bg-white border-b border-gray-100',
    ]"
  >
    <SharedContainer class="w-full">
      <div class="flex items-center justify-between gap-4">
        <!-- Logo -->
        <NuxtLink to="/" class="shrink-0 flex items-center gap-2 group">
          <div
            class="w-9 h-9 rounded-lg bg-gradient-to-br from-[#002240] to-[#0a4a8a] flex items-center justify-center shadow-md shadow-[#002240]/20"
          >
            <span class="text-white font-bold text-sm">N4</span>
          </div>
          <span
            class="hidden sm:block text-lg font-semibold text-gray-900 tracking-tight"
            >Starter</span
          >
        </NuxtLink>

        <!-- Desktop Links -->
        <ul class="hidden md:flex items-center gap-1">
          <li v-for="link in navLinks" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-[#002240] hover:bg-gray-50 transition-all duration-200"
              active-class="!text-[#002240] !bg-[#002240]/[0.06] !font-semibold"
            >
              <UIcon :name="link.icon" class="w-4 h-4 opacity-60" />
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>

        <!-- Right Actions -->
        <div class="flex items-center gap-3">
          <UiLangSwitcher />

          <div class="hidden md:flex items-center gap-2">
            <UButton
              variant="ghost"
              color="neutral"
              class="!font-medium"
              @click="openAuth('login')"
            >
              {{ t("Login") }}
            </UButton>
          </div>

          <!-- Mobile Toggle -->
          <button
            class="md:hidden p-2 rounded-lg text-gray-600 hover:text-[#002240] hover:bg-gray-50 transition-all duration-200"
            @click="drawerOpen = true"
          >
            <UIcon name="i-heroicons-bars-3" class="w-6 h-6" />
          </button>
        </div>
      </div>
    </SharedContainer>
  </nav>

  <NavDrawer v-model:open="drawerOpen" />
</template>
