<script setup lang="ts">
import { useState } from "nuxt/app";
import { ref, watch, onUnmounted, computed } from "vue";
import type { AuthPageResponse } from "~/types/auth";

const { locale, t } = useI18n();

// ── Fetch dynamic overlay content ──────────────────────────────────────────────
const { data: authApiData } = await useCachedApi<AuthPageResponse>(
  "auth-overlay-content",
  "/v2/web/auth",
  24 * 60 * 60 * 1000, // 24 hours
);

const authContent = computed(() => {
  const response = authApiData.value as AuthPageResponse | null;
  return response?.data?.auth_section?.[0] || null;
});

const isOpen = useState("authOverlayOpen", () => false);

type AuthStep =
  | "login"
  | "register"
  | "forgotPassword"
  | "otp"
  | "resetPassword";

const authStep = useState<AuthStep>("authStep", () => "login");

// Shared state passed from ForgotPassword → OTP
const forgotPhone = ref("");
const forgotDialCode = ref("+966");

// ── Navigation helpers ────────────────────────────────────────────────────────
const goToLogin = () => {
  authStep.value = "login";
};
const goToRegister = () => {
  authStep.value = "register";
};
const goToForgotPassword = () => {
  authStep.value = "forgotPassword";
};
const goToOtp = () => {
  authStep.value = "otp";
};
const goToResetPassword = () => {
  authStep.value = "resetPassword";
};
const closeOverlay = () => {
  isOpen.value = false;
};

// ── Body scroll lock ──────────────────────────────────────────────────────────
watch(isOpen, (val) => {
  if (!import.meta.client) return;
  if (val) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
    authStep.value = "login";
    forgotPhone.value = "";
    forgotDialCode.value = "+966";
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = "";
  }
});

// ── Dynamic heading ───────────────────────────────────────────────────────────
const stepTitle = computed(() => {
  switch (authStep.value) {
    case "login":
      return t("Login to Fikrah");
    case "register":
      return t("Register a New Account");
    case "forgotPassword":
      return t("Forgot Password?");
    case "otp":
      return t("Code Verification");
    case "resetPassword":
      return t("Reset Password");
    default:
      return "";
  }
});

const showWelcome = computed(() =>
  ["login", "register", "forgotPassword"].includes(authStep.value),
);

// ── Shared UInput ui prop ─────────────────────────────────────────────────────
const inputUi = {
  base: "px-2 py-2 border-1 border-[#e1e1e1] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#002240] rounded-[8px] text-[#8E8E8E] placeholder:font-light placeholder:text-[#E1E1E1] placeholder:text-[14px] font-light ring-0 focus:ring-0",
  leadingIcon: "text-[#8E8E8E] size-5",
};

// ── Back arrow icon (RTL-aware) ───────────────────────────────────────────────
const arrowIcon = computed(() =>
  locale.value === "ar" ? "i-heroicons-arrow-left" : "i-heroicons-arrow-right",
);
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <!--
        UToaster is placed OUTSIDE the overlay div so it Teleports to <body>
        independently. We give it a z-index of 99999 via class so it always
        renders above the overlay (z-9999) regardless of stacking context.
        Per Nuxt UI v3 docs: UToaster wraps Reka UI's ToastProvider and
        accepts standard HTML attributes including class on its root element.
      -->
      <UToaster class="z-99999!" position="top-right" />

      <Transition name="slide-up">
        <div
          v-if="isOpen"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-overlay-title"
          class="fixed inset-0 z-9999 bg-[#002240cc] text-white overflow-y-auto flex"
          :style="{
            backgroundImage: `url('/imgs/auth-bg.svg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
          }"
        >
          <!-- Back Button — desktop -->
          <button
            class="cursor-pointer absolute top-6 right-6 rtl:right-[unset] rtl:left-6 md:top-10 md:right-10 md:rtl:right-[unset] flex items-center gap-2 border border-[#E1E1E1] rounded-lg px-4 py-2 hover:bg-white/10 transition-colors z-10000 hidden lg:flex"
            @click="closeOverlay"
          >
            <span class="font-light text-sm">{{ t("Back to Home") }}</span>
            <UIcon :name="arrowIcon" class="w-5 h-5" />
          </button>

          <SharedContainer
            class="w-full min-h-screen flex flex-col lg:flex-row items-end"
          >
            <!-- ── Form Card ─────────────────────────────────────────────── -->
            <div
              class="w-full lg:w-[500px] xl:w-[550px] flex flex-col items-center lg:items-stretch justify-center lg:justify-start my-auto lg:my-0 sm:px-6 lg:px-0 lg:pr-12 xl:pr-24 py-8 lg:py-0 relative z-10 transition-all duration-700 delay-200 gap-4"
              :class="{ 'translate-y-10 opacity-0': !isOpen }"
            >
              <!-- Back Button — mobile -->
              <div class="flex lg:hidden w-full max-w-md">
                <button
                  class="cursor-pointer flex items-center gap-2 border border-[#E1E1E1] rounded-lg px-4 py-2 hover:bg-white/10 transition-colors"
                  @click="closeOverlay"
                >
                  <span class="font-light text-sm">{{
                    t("Back to Home")
                  }}</span>
                  <UIcon :name="arrowIcon" class="w-5 h-5" />
                </button>
              </div>

              <div
                class="bg-white rounded-[32px] lg:rounded-t-[32px] lg:rounded-b-none w-full max-w-md lg:max-w-full p-6 sm:p-8 lg:p-10 text-gray-900 shadow-2xl min-h-[440px] flex flex-col"
              >
                <!-- Logo -->
                <div class="flex mb-6 lg:mb-7">
                 logo
                </div>

                <!-- Transition between steps -->
                <Transition name="fade" mode="out-in">
                  <div :key="authStep">
                    <!-- Dynamic Header -->
                    <div class="mb-5 lg:mb-6">
                      <p
                        v-if="showWelcome"
                        class="text-[#FE6452] text-sm mb-1 font-light"
                      >
                        {{ t("Welcome") }}
                      </p>
                      <h2 class="text-2xl text-[#002240]">
                        {{ stepTitle }}
                      </h2>
                    </div>

                    <!-- LOGIN -->
                    <template v-if="authStep === 'login'">
                      <AuthLogin
                        :input-ui="inputUi"
                        @go-to-register="goToRegister"
                        @go-to-forgot-password="goToForgotPassword"
                        @close-overlay="closeOverlay"
                      />
                    </template>

                    <!-- REGISTER -->
                    <template v-else-if="authStep === 'register'">
                      <AuthRegister
                        :input-ui="inputUi"
                        @go-to-login="goToLogin"
                        @close-overlay="closeOverlay"
                      />
                    </template>

                    <!-- FORGOT PASSWORD -->
                    <template v-else-if="authStep === 'forgotPassword'">
                      <AuthForgotPassword
                        v-model="forgotPhone"
                        v-model:dial-code="forgotDialCode"
                        :input-ui="inputUi"
                        @go-to-login="goToLogin"
                        @go-to-otp="goToOtp"
                      />
                    </template>

                    <!-- OTP -->
                    <template v-else-if="authStep === 'otp'">
                      <AuthOtp
                        :input-ui="inputUi"
                        :forgot-phone="forgotPhone"
                        :forgot-dial-code="forgotDialCode"
                        @go-to-login="goToLogin"
                        @go-to-reset-password="goToResetPassword"
                      />
                    </template>

                    <!-- RESET PASSWORD -->
                    <template v-else-if="authStep === 'resetPassword'">
                      <AuthResetPassword
                        :input-ui="inputUi"
                        @go-to-login="goToLogin"
                        @close-overlay="closeOverlay"
                      />
                    </template>

                    <!-- Footer -->
                    <div class="mt-4 lg:mt-7 text-center">
                      <p class="text-[11px] text-[#8E8E8E] font-light">
                        {{ t("All rights reserved to Fikrah © 2026") }}
                      </p>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>

            <!-- ── Hero / Left panel ─────────────────────────────────────── -->
            <div
              class="hidden lg:flex flex-col justify-center flex-1 pe-12 xl:pe-24 rtl:pe-0 rtl:ps-12 xl:rtl:ps-24 pb-12"
            >
              <div
                class="max-w-xl flex flex-col gap-4 relative z-10 transition-all duration-700 delay-100 translate-y-0 opacity-100"
                :class="{ 'translate-y-10 opacity-0': !isOpen }"
              >
                <!-- Badge -->
                <div class="flex justify-start">
                  <span
                    class="inline-flex items-center gap-1.5 bg-[#FE6452] text-white text-xs px-3.5 py-1.5 rounded-full"
                  >
                    <IconsHeroStarIcon />
                    <span class="font-light">{{
                      authContent
                        ? authContent.header
                        : t("Learning Platform in Saudi Arabia")
                    }}</span>
                  </span>
                </div>
                <!-- Headline -->
                <h2
                  class="text-white font-bold leading-snug text-2xl sm:text-3xl xl:text-[45px]"
                >
                  {{
                    authContent
                      ? authContent.title
                      : t("Start Your Learning Journey")
                  }}
                  <span v-if="!authContent" class="block text-[#FE6452]">{{
                    t("with the Best Instructors")
                  }}</span>
                </h2>
                <!-- Paragraph -->
                <p class="text-[#AED4F5] leading-relaxed font-light text-sm">
                  {{
                    authContent
                      ? authContent.description
                      : t(
                          "Explore thousands of courses in programming, design, business, marketing, and more. Learn at your own pace with high-quality Arabic content.",
                        )
                  }}
                </p>
                <!-- CTA buttons -->
                <div class="flex items-center gap-3 flex-wrap">
                  <UButton
                    size="xl"
                    class="cursor-pointer font-light bg-[#2E3FFF] hover:bg-[#2E3FFF]/90 text-white rounded-[8px] px-4 py-[9px]"
                    :to="authContent?.button_action_2"
                    @click="closeOverlay"
                  >
                    {{
                      authContent ? authContent.button_2 : t("Explore Courses")
                    }}
                    <IconsHeroExploreIcon />
                  </UButton>
                  <UButton
                    size="xl"
                    class="cursor-pointer font-light bg-white text-[#1F1F1F] rounded-[8px] px-4 py-[9px] hover:bg-white/90"
                    :to="authContent?.button_action_1"
                    @click="closeOverlay"
                  >
                    {{
                      authContent ? authContent.button_1 : t("Know About Us")
                    }}
                  </UButton>
                </div>
                <!-- Stats Row -->
                <div class="flex items-center gap-6 flex-wrap pt-4">
                  <template v-if="authContent">
                    <template
                      v-for="(stat, index) in authContent.number_sections"
                      :key="index"
                    >
                      <div class="flex flex-col gap-1">
                        <div
                          class="flex items-center gap-1 text-white text-2xl xl:text-3xl"
                        >
                          <img
                            v-if="stat.icon && stat.title"
                            :src="stat.icon"
                            class="size-[32px]"
                            :alt="stat.title"
                          />
                          {{ stat.number }}
                        </div>
                        <span class="text-[#AED4F5] text-xs font-light">{{
                          stat.title
                        }}</span>
                      </div>
                      <div
                        v-if="index !== authContent.number_sections.length - 1"
                        class="w-px h-8 bg-white/20"
                      />
                    </template>
                  </template>
                  <template v-else>
                    <div class="flex flex-col gap-1">
                      <div
                        class="flex items-center gap-1 text-white text-2xl xl:text-3xl"
                      >
                        <IconsHeroRateIcon />
                        4.8/5
                      </div>
                      <span class="text-[#AED4F5] text-xs font-light">{{
                        t("Platform Rating")
                      }}</span>
                    </div>
                    <div class="w-px h-8 bg-white/20" />
                    <div class="flex flex-col gap-1">
                      <div
                        class="flex items-center gap-1 text-white text-2xl xl:text-3xl"
                      >
                        <IconsHeroExploreIcon />
                        500+
                      </div>
                      <span class="text-[#AED4F5] text-xs font-light">{{
                        t("Available Courses")
                      }}</span>
                    </div>
                    <div class="w-px h-8 bg-white/20" />
                    <div class="flex flex-col gap-1">
                      <div
                        class="flex items-center gap-1 text-white text-2xl xl:text-3xl"
                      >
                        <IconsHeroStudentsIcon />
                        50,000+
                      </div>
                      <span class="text-[#AED4F5] text-xs font-light">{{
                        t("Active Students")
                      }}</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </SharedContainer>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

::-ms-reveal {
  display: none;
}
</style>
