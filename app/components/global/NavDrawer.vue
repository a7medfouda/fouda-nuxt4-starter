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
  { label: t("Home"), to: "/" },
  { label: t("Courses"), to: "/courses" },
  { label: t("About Us"), to: "/about-us" },
  { label: t("Contact Us"), to: "/contact" },
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
      content: 'bg-white h-full flex flex-col w-[280px]',
      body: 'p-6 flex-1',
      header: 'p-6 border-b border-gray-100 flex items-center justify-between',
    }"
  >
    <template #header>
<div>logo</div>      <UButton
        icon="i-heroicons-x-mark"
        color="neutral"
        variant="ghost"
        @click="close"
      />
    </template>

    <template #body>
      <nav class="flex flex-col gap-4">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
          active-class="text-blue-600"
          @click="close"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="mt-12 pt-8 border-t border-gray-100 flex flex-col gap-4">
        <UiLangSwitcher />
        <UButton variant="subtle" color="neutral" block @click="openAuth('login')">
          {{ t("Login") }}
        </UButton>
        <UButton color="primary" block @click="openAuth('register')">
          {{ t("Get Started") }}
        </UButton>
      </div>
    </template>
  </UDrawer>
</template>
