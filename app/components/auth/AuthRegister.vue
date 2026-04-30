<script setup lang="ts">
import * as z from "zod";
import { reactive, ref } from "vue";
import { useAuthStore } from "~/stores/auth";
import { extractMessage, extractFieldError } from "~/utils/errorHelpers";
import type { FormSubmitEvent } from "@nuxt/ui";

const { t } = useI18n();
const authStore = useAuthStore();
const toast = useToast();
const isLoading = ref(false);

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const schema = z
  .object({
    full_name: z.string().min(2, t("Name must be at least 2 characters")),
    username: z.string().min(2, t("Username must be at least 2 characters")),
    phone: z.string().regex(/^\d{7,15}$/, t("Enter valid mobile")),
    dialCode: z.string().optional(),
    email: z.string().email(t("Enter valid email")),
    password: z
      .string()
      .min(8, t("At least 8 characters"))
      .regex(/[!@#$%]/, t("Must contain special character"))
      .regex(/[0-9]/, t("Must contain a number"))
      .regex(/[a-z]/, t("Must contain lowercase letter"))
      .regex(/[A-Z]/, t("Must contain uppercase letter")),
    password_confirmation: z
      .string()
      .min(1, t("Confirm password is required")),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: t("You must agree to the terms and conditions"),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password_confirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("Passwords must match"),
        path: ["password_confirmation"],
      });
    }
  });

type Schema = z.output<typeof schema>;

const state = reactive({
  full_name: "",
  username: "",
  phone: "",
  dialCode: "+966",
  email: "",
  password: "",
  password_confirmation: "",
  agreeTerms: false,
});

defineProps<{
  inputUi?: Record<string, string>;
}>();

const emit = defineEmits<{
  goToLogin: [];
  closeOverlay: [];
}>();



const onSubmit = async (_event: FormSubmitEvent<Schema>) => {
  isLoading.value = true;
  try {
    const payload = {
      full_name: state.full_name,
      username: state.username,
      mobile: (state.dialCode || "+966").replace("+", "") + state.phone,
      email: state.email,
      password: state.password,
      password_confirmation: state.password_confirmation,
    };

    const res = await authStore.register(payload);

    if (!res?.status) {
      toast.add({
        title: t("Error"),
        description:
          extractMessage(res?.message) || t("Registration failed"),
        color: "error",
        icon: "i-heroicons-x-circle",
      });
      return;
    }

    toast.add({
      title: t("Success"),
      description:
        extractMessage(res?.message) || t("Account successfully registered"),
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    emit("closeOverlay");
  } catch (err: any) {
    // $fetch throws on 422 — err.data contains the response body
    const data = err?.data || err;
    const fieldError = extractFieldError(data?.errors);
    const msg =
      fieldError ||
      extractMessage(data?.message) ||
      t("An error occurred during registration");
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
    <UForm
      :schema="schema"
      :state="state"
      :validate-on="['blur', 'submit']"
      class="space-y-4"
      @submit="onSubmit"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <!-- Full Name -->
        <UFormField name="full_name">
          <UInput
            v-model="state.full_name"
            size="xl"
            :placeholder="t('Enter full name')"
            leading-icon="i-heroicons-user"
            :disabled="isLoading"
            class="w-full"
            :ui="inputUi"
          />
        </UFormField>

        <!-- Username -->
        <UFormField name="username">
          <UInput
            v-model="state.username"
            size="xl"
            :placeholder="t('Enter username')"
            leading-icon="i-heroicons-user-circle"
            :disabled="isLoading"
            class="w-full"
            :ui="inputUi"
          />
        </UFormField>
      </div>

      <!-- Phone + Email -->
      <div class="flex flex-col gap-4">
        <UFormField name="phone">
          <SharedPhoneInput
            v-model="state.phone"
            v-model:dialCode="state.dialCode"
            :placeholder="t('Mobile Number')"
            :disabled="isLoading"
            class="w-full"
          />
        </UFormField>

        <UFormField name="email">
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
      </div>

      <!-- Password + Confirm Password -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <UFormField name="password">
          <UInput
            v-model="state.password"
            size="xl"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="t('Enter password')"
            leading-icon="i-heroicons-lock-closed"
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
                class="text-[#8E8E8E]"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormField>

        <UFormField name="password_confirmation">
          <UInput
            v-model="state.password_confirmation"
            size="xl"
            :type="showConfirmPassword ? 'text' : 'password'"
            :placeholder="t('Re-enter password')"
            leading-icon="i-heroicons-lock-closed"
            class="w-full"
            :ui="inputUi"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="
                  showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'
                "
                :aria-label="
                  showConfirmPassword ? t('Hide password') : t('Show password')
                "
                class="text-[#8E8E8E]"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </UInput>
        </UFormField>
      </div>

      <!-- Terms Checkbox -->
      <UFormField name="agreeTerms" class="pt-2">
        <div class="flex items-center gap-1">
          <UCheckbox
            v-model="state.agreeTerms"
            :ui="{
              base: 'border-1 border-[#4B4B4B] rounded-[5px] cursor-pointer',
              indicator: 'bg-[#4B4B4B]',
              label: 'text-[#4B4B4B] font-light cursor-pointer',
            }"
          />
          <span class="text-sm text-[#4B4B4B] font-light">
            {{ t("I agree to the") }}
            <NuxtLink
              to="/terms"
              class="text-[#2E3FFF] hover:underline"
              @click="emit('closeOverlay')"
            >
              {{ t("Terms and Conditions") }}
            </NuxtLink>
          </span>
        </div>
      </UFormField>

      <!-- Register Button -->
      <UButton
        type="submit"
        block
        size="xl"
        :loading="isLoading"
        :disabled="isLoading"
        class="cursor-pointer bg-[#002240] hover:bg-[#002240]/90 text-white rounded-[8px] py-3 mt-5 lg:mt-5 text-base font-normal transition-all"
      >
        {{ t("Register") }}
      </UButton>
    </UForm>

    <div
      class="mt-3 lg:mt-4 text-center text-sm flex gap-1 justify-center items-center"
    >
      <span class="text-[#8E8E8E] font-light">{{
        t("Already have an account?")
      }}</span>
      <button
        class="text-[#2E3FFF] font-light hover:underline cursor-pointer"
        @click="emit('goToLogin')"
      >
        {{ t("Login") }}
      </button>
    </div>
  </div>
</template>
