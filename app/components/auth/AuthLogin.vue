<script setup lang="ts">
import * as z from "zod";
import { reactive, ref } from "vue";
import { useAuthStore } from "~/stores/auth";
import { extractMessage } from "~/utils/errorHelpers";
import type { FormSubmitEvent } from "@nuxt/ui";

const { t } = useI18n();
const authStore = useAuthStore();
const toast = useToast();

const activeTab = ref<"mobile" | "email">("mobile");
const showPassword = ref(false);
const isLoading = ref(false);

const schema = z
  .object({
    phone: z.string().optional(),
    dialCode: z.string().optional(),
    email: z.string().optional(),
    password: z.string().min(6, t("Password must be at least 6 characters")),
  })
  .superRefine((data, ctx) => {
    if (activeTab.value === "mobile") {
      if (!data.phone || !/^\d{7,15}$/.test(data.phone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("Enter valid mobile"),
          path: ["phone"],
        });
      }
    } else {
      if (!data.email || !z.string().email().safeParse(data.email).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("Enter valid email"),
          path: ["email"],
        });
      }
    }
  });

type Schema = z.output<typeof schema>;

const state = reactive({
  phone: "",
  dialCode: "+966",
  email: "",
  password: "",
  rememberMe: false,
});

defineProps<{
  inputUi?: Record<string, string>;
}>();

const emit = defineEmits<{
  goToRegister: [];
  goToForgotPassword: [];
  closeOverlay: [];
}>();

const switchTab = (tab: "mobile" | "email") => {
  activeTab.value = tab;
  // Clear irrelevant field errors on tab switch
  state.phone = "";
  state.email = "";
};

const onSubmit = async (_event: FormSubmitEvent<Schema>) => {
  isLoading.value = true;
  try {
    const payload =
      activeTab.value === "mobile"
        ? {
            mobile: (state.dialCode || "+966").replace("+", "") + state.phone,
            password: state.password,
          }
        : { email: state.email, password: state.password };

    const res = await authStore.login(payload);

    // Login endpoint returns 200 with status:false for bad credentials
    if (!res?.status) {
      toast.add({
        title: t("Error"),
        description: extractMessage(res?.message) || t("Invalid credentials"),
        color: "error",
        icon: "i-heroicons-x-circle",
      });
      return;
    }

    toast.add({
      title: t("Success"),
      description: t("Logged in successfully"),
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    emit("closeOverlay");
  } catch (err: any) {
    const data = err?.data || err;
    const msg =
      extractMessage(data?.message) || t("An error occurred during login");
    toast.add({
      title: t("Error"),
      description: msg,
      color: "error",
      icon: "i-heroicons-x-circle",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div>
    <!-- Tabs -->
    <div class="flex border-b-2 border-[#0000001A] mb-6">
      <button
        class="flex-1 pb-3 text-center transition-colors text-sm font-light cursor-pointer"
        :class="
          activeTab === 'mobile'
            ? 'text-[#2E3FFF] border-b-2 border-[#2E3FFF]'
            : 'text-[#154066]'
        "
        :disabled="isLoading"
        @click="switchTab('mobile')"
      >
        {{ t("Mobile Number") }}
      </button>
      <button
        class="flex-1 pb-3 text-center transition-colors text-sm font-light cursor-pointer"
        :class="
          activeTab === 'email'
            ? 'text-[#2E3FFF] border-b-2 border-[#2E3FFF]'
            : 'text-[#154066]'
        "
        :disabled="isLoading"
        @click="switchTab('email')"
      >
        {{ t("Email Address") }}
      </button>
    </div>

    <!-- Form -->
    <UForm
      :schema="schema"
      :state="state"
      :validate-on="['blur', 'submit']"
      class="space-y-4"
      @submit="onSubmit"
    >
      <!-- Mobile Input -->
      <UFormField v-show="activeTab === 'mobile'" name="phone">
        <SharedPhoneInput
          v-model="state.phone"
          v-model:dialCode="state.dialCode"
          :placeholder="t('Mobile Number')"
          :disabled="isLoading"
          class="w-full"
        />
      </UFormField>

      <!-- Email Input -->
      <UFormField v-show="activeTab === 'email'" name="email">
        <UInput
          v-model="state.email"
          size="xl"
          type="email"
          :placeholder="t('Email Address')"
          leading-icon="i-heroicons-envelope"
          :disabled="isLoading"
          class="w-full"
          :ui="inputUi"
        />
      </UFormField>

      <!-- Password Input -->
      <UFormField name="password" class="mt-4">
        <UInput
          v-model="state.password"
          size="xl"
          :type="showPassword ? 'text' : 'password'"
          :placeholder="t('Enter password')"
          leading-icon="i-heroicons-lock-closed"
          :disabled="isLoading"
          class="w-full"
          :ui="inputUi"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="
                showPassword ? t('Hide password') : t('Show password')
              "
              :aria-pressed="showPassword"
              aria-controls="password"
              class="text-[#8E8E8E]"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <!-- Remember Me and Forgot Password -->
      <div class="flex items-center justify-between gap-2 flex-wrap pt-2">
        <UCheckbox
          v-model="state.rememberMe"
          :label="t('Keep me logged in')"
          :ui="{
            base: 'border-1 border-[#4B4B4B] rounded-[5px] cursor-pointer',
            indicator: 'bg-[#4B4B4B]',
            label:
              'text-[#4B4B4B] font-light hover:text-[#002240] transition-colors cursor-pointer',
          }"
        />
        <button
          type="button"
          class="text-sm text-[#4B4B4B] font-light hover:text-[#002240] transition-colors cursor-pointer"
          @click="emit('goToForgotPassword')"
        >
          {{ t("Forgot password?") }}
        </button>
      </div>

      <!-- Login Button -->
      <UButton
        type="submit"
        block
        size="xl"
        :loading="isLoading"
        :disabled="isLoading"
        class="cursor-pointer bg-[#002240] hover:bg-[#002240]/90 text-white rounded-[8px] py-3 mt-5 lg:mt-8 text-base font-normal transition-all"
      >
        {{ t("Login") }}
      </UButton>
    </UForm>

    <div
      class="mt-5 lg:mt-6 text-center text-sm flex gap-1 justify-center items-center"
    >
      <span class="text-[#8E8E8E] font-light">{{
        t("Don't have an account?")
      }}</span>
      <button
        class="text-[#2E3FFF] font-light hover:underline cursor-pointer"
        @click="emit('goToRegister')"
      >
        {{ t("Register now") }}
      </button>
    </div>
  </div>
</template>
