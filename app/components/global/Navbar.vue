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
  { label: t("Home"), to: "/" },
  { label: t("Courses"), to: "/courses" },
  { label: t("About Us"), to: "/about-us" },
  { label: t("Contact Us"), to: "/contact" },
];
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm h-16 flex items-center">
    <SharedContainer class="w-full">
      <div class="flex items-center justify-between gap-4">
        <!-- Logo -->
        <NuxtLink to="/" class="shrink-0">
<span>logo</span>        </NuxtLink>

        <!-- Desktop Links -->
        <ul class="hidden md:flex items-center gap-8">
          <li v-for="link in navLinks" :key="link.to">
            <NuxtLink 
              :to="link.to" 
              class="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              active-class="text-blue-600"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>

        <!-- Right Actions -->
        <div class="flex items-center gap-4">
          <UiLangSwitcher />
          
          <div class="hidden md:flex items-center gap-2">
            <UButton variant="ghost" color="neutral" @click="openAuth('login')">
              {{ t("Login") }}
            </UButton>
            <UButton color="primary" @click="openAuth('register')">
              {{ t("Get Started") }}
            </UButton>
          </div>

          <!-- Mobile Toggle -->
          <button 
            class="md:hidden p-2 text-gray-600"
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
