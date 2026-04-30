<script setup lang="ts">
import * as z from "zod";
import { reactive, ref, computed, watch, onUnmounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { extractMessage } from "~/utils/errorHelpers";
import type { FormSubmitEvent } from "@nuxt/ui";

const { t } = useI18n();
const authStore = useAuthStore();
const toast = useToast();
const isLoading = ref(false);
const isResending = ref(false);

const OTP_LENGTH = 5;
const RESEND_COUNTDOWN = 60; // seconds

const props = defineProps<{
  inputUi?: Record<string, string>;
  forgotPhone: string;
  forgotDialCode: string;
}>();

const emit = defineEmits<{
  goToLogin: [];
  goToResetPassword: [];
}>();

// ── Schema ────────────────────────────────────────────────────────────────────
const schema = z.object({
  otp: z
    .string()
    .min(OTP_LENGTH, t("OTP must be at least 4 characters"))
    .max(6, t("OTP must be at most 6 characters")),
});

type Schema = z.output<typeof schema>;

// ── State ─────────────────────────────────────────────────────────────────────
const otpDigits = ref<string[]>([]);

const state = reactive({
  otp: "",
});

// Sync array → string whenever digits change
watch(
  otpDigits,
  (digits) => {
    state.otp = digits.join("");
  },
  { deep: true },
);

// ── Resend countdown ──────────────────────────────────────────────────────────
const countdown = ref(RESEND_COUNTDOWN);
const canResend = computed(() => countdown.value === 0);

let countdownTimer: ReturnType<typeof setInterval> | null = null;

const startCountdown = () => {
  countdown.value = RESEND_COUNTDOWN;
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(countdownTimer!);
    }
  }, 1000);
};

// Start on mount
startCountdown();

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer);
});

// ── Masked phone ───────────────────────────────────────────────────────────────
const maskedPhone = computed(() => {
  const d = props.forgotDialCode;
  const p = props.forgotPhone;
  if (!p || p.length < 3) return `${d} ***`;
  const masked = `${p.slice(0, 2)}*****${p.slice(-2)}`;
  return `\u202A${d} ${masked}\u202C`;
});



// ── Submit ────────────────────────────────────────────────────────────────────
const onSubmit = async (_event?: FormSubmitEvent<Schema>) => {
  // Guard: all digits filled
  if (state.otp.length < OTP_LENGTH) return;

  if (!authStore.resetUid) {
    toast.add({
      title: t("Error"),
      description: t("Failed to retrieve session ID. Please try sending OTP again."),
      color: "error",
      icon: "i-heroicons-x-circle",
    });
    return;
  }

  isLoading.value = true;
  try {
    const res = await authStore.verifyOtp({
      uId: authStore.resetUid,
      otp: state.otp,
    });

    // Handle 200 with status:false (wrong OTP code)
    if (!res?.status) {
      toast.add({
        title: t("Error"),
        description:
          extractMessage(res?.message) || t("Invalid OTP"),
        color: "error",
        icon: "i-heroicons-x-circle",
      });
      // Clear OTP on failure so user can re-enter cleanly
      otpDigits.value = [];
      return;
    }

    toast.add({
      title: t("Success"),
      description: t("OTP verified successfully"),
      color: "success",
      icon: "i-heroicons-check-circle",
    });

    authStore.resetOtp = state.otp;
    emit("goToResetPassword");
  } catch (err: any) {
    const data = err?.data || err;
    const msg =
      extractMessage(data?.message) ||
      t("An error occurred during verification");
    toast.add({
      title: t("Error"),
      description: msg,
      color: "error",
      icon: "i-heroicons-x-circle",
    });
    // Clear OTP on error so user can re-enter
    otpDigits.value = [];
  } finally {
    isLoading.value = false;
  }
};

// ── Auto-submit when all digits entered (500ms delay for review) ─────────
let autoSubmitTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  otpDigits,
  (digits) => {
    if (autoSubmitTimer) clearTimeout(autoSubmitTimer);
    if (
      digits.length === OTP_LENGTH &&
      digits.every((v) => v !== undefined && v !== "")
    ) {
      autoSubmitTimer = setTimeout(() => onSubmit(), 500);
    }
  },
  { deep: true },
);

// ── Resend ────────────────────────────────────────────────────────────────────
const onResend = async () => {
  if (!canResend.value || isResending.value) return;

  isResending.value = true;
  try {
    const mobile =
      (props.forgotDialCode || "+966").replace("+", "") + props.forgotPhone;
    const res = await authStore.forgotPassword({ mobile });

    if (!res?.status) {
      toast.add({
        title: t("Error"),
        description:
          extractMessage(res?.message) || t("Failed to resend OTP"),
        color: "error",
        icon: "i-heroicons-x-circle",
      });
      return;
    }

    toast.add({
      title: t("Success"),
      description: t("OTP resent to your mobile"),
      color: "success",
      icon: "i-heroicons-check-circle",
    });

    otpDigits.value = [];
    startCountdown();
  } catch (err: any) {
    const data = err?.data || err;
    const msg =
      extractMessage(data?.message) || t("An error occurred");
    toast.add({
      title: t("Error"),
      description: msg,
      color: "error",
      icon: "i-heroicons-x-circle",
    });
  } finally {
    isResending.value = false;
  }
};
</script>

<template>
  <div>
    <!-- Subtitle -->
    <p class="text-[#8E8E8E] text-sm font-light mb-2 leading-relaxed">
      {{ t("Enter the code we sent to your phone number") }}
    </p>
    <p class="text-[#8E8E8E] text-sm font-light mb-6 leading-relaxed">
      {{ maskedPhone }}
    </p>

    <UForm
      :schema="schema"
      :state="state"
      :validate-on="['submit']"
      class="space-y-4"
      @submit="onSubmit"
    >
      <!-- OTP Pin Input -->
      <UFormField name="otp" class="flex justify-center" dir="ltr">
        <UPinInput
          v-model="otpDigits"
          :length="OTP_LENGTH"
          type="number"
          size="xl"
          placeholder="—"
          :disabled="isLoading"
          :ui="{
            base: 'border-1 border-[#e1e1e1] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#002240] rounded-[8px] text-[#002240] font-medium ring-0 focus:ring-0 w-14 h-14 text-center text-lg',
          }"
        />
      </UFormField>

      <!-- Resend row -->
      <div class="flex items-center justify-center gap-1 text-sm pt-1">
        <span class="text-[#8E8E8E] font-light">
          {{ t("Didn't receive the code?") }}
        </span>
        <template v-if="canResend">
          <button
            type="button"
            class="text-[#2E3FFF] font-light hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isResending"
            @click="onResend"
          >
            {{ t("Resend Code Now") }}
          </button>
        </template>
        <template v-else>
          <span class="text-[#4B4B4B] font-light" dir="ltr">
            {{ t("Resend code in") }} {{ countdown }}s
          </span>
        </template>
      </div>

      <!-- Verify Button -->
      <UButton
        type="submit"
        block
        size="xl"
        :loading="isLoading"
        :disabled="isLoading || state.otp.length < OTP_LENGTH"
        class="cursor-pointer bg-[#002240] hover:bg-[#002240]/90 text-white rounded-[8px] py-3 mt-5 lg:mt-8 text-base font-normal transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ t("Verify and Continue") }}
      </UButton>
    </UForm>

    <div class="mt-5 lg:mt-6 text-center text-sm flex gap-1 justify-center items-center">
      <span class="text-[#8E8E8E] font-light">{{ t("Want to go back to login?") }}</span>
      <button
        class="text-[#2E3FFF] font-light hover:underline cursor-pointer"
        @click="emit('goToLogin')"
      >
        {{ t("Login") }}
      </button>
    </div>
  </div>
</template>