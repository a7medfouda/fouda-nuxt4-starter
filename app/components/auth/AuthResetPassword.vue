<script setup lang="ts">
import * as z from "zod";
import { reactive, ref } from "vue";
import { useAuthStore } from "~/stores/auth";
import { extractMessage } from "~/utils/errorHelpers";
import type { FormSubmitEvent } from "@nuxt/ui";

const { t } = useI18n();
const authStore = useAuthStore();
const toast = useToast();
const isLoading = ref(false);

const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const schema = z
  .object({
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
  password: "",
  password_confirmation: "",
});

defineProps<{
  inputUi?: Record<string, string>;
}>();

const emit = defineEmits<{
  goToLogin: [];
  closeOverlay: [];
}>();



const onSubmit = async (_event: FormSubmitEvent<Schema>) => {
  if (!authStore.resetUid) {
    toast.add({
      title: t("Error"),
      description: t(
        "Failed to retrieve session ID. Please restart the forgot password process.",
      ),
      color: "error",
      icon: "i-heroicons-x-circle",
    });
    return;
  }

  isLoading.value = true;
  try {
    const payload = {
      uId: authStore.resetUid,
      otp: authStore.resetOtp || "",
      password: state.password,
      password_confirmation: state.password_confirmation,
    };

    const res = await authStore.resetPassword(payload);

    // Handle 200 with status:false (invalid uId, mismatched passwords, etc.)
    if (!res?.status) {
      toast.add({
        title: t("Error"),
        description:
          extractMessage(res?.errors) ||
          extractMessage(res?.message) ||
          t("Password reset failed"),
        color: "error",
        icon: "i-heroicons-x-circle",
      });
      return;
    }

    toast.add({
      title: t("Success"),
      description:
        (typeof res?.data === "string" ? res.data : undefined) ||
        t("Password reset successfully. You can now login."),
      color: "success",
      icon: "i-heroicons-check-circle",
    });

    // Clear reset session data
    authStore.resetUid = null;
    authStore.resetOtp = null;

    emit("goToLogin");
  } catch (err: any) {
    // $fetch throws on 4xx/5xx — extract response body
    const data = err?.data || err;
    const msg =
      extractMessage(data?.errors) ||
      extractMessage(data?.message) ||
      t("An error occurred during password reset");
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
    <p class="text-[#8E8E8E] text-sm font-light mb-6 leading-relaxed">
      {{
        t(
          "Please enter your new password below to reset your account password.",
        )
      }}
    </p>

    <UForm
      :schema="schema"
      :state="state"
      :validate-on="['blur', 'submit']"
      class="space-y-4"
      @submit="onSubmit"
    >
      <!-- New Password -->
      <UFormField name="password">
        <UInput
          v-model="state.password"
          size="xl"
          :type="showNewPassword ? 'text' : 'password'"
          :placeholder="t('Enter new password')"
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
              :icon="showNewPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="showNewPassword ? t('Hide password') : t('Show password')"
              class="text-[#8E8E8E]"
              @click="showNewPassword = !showNewPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <!-- Confirm New Password -->
      <UFormField name="password_confirmation">
        <UInput
          v-model="state.password_confirmation"
          size="xl"
          :type="showConfirmPassword ? 'text' : 'password'"
          :placeholder="t('Re-enter new password')"
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
              :icon="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="showConfirmPassword ? t('Hide password') : t('Show password')"
              class="text-[#8E8E8E]"
              @click="showConfirmPassword = !showConfirmPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <!-- Reset Button -->
      <UButton
        type="submit"
        block
        size="xl"
        :loading="isLoading"
        :disabled="isLoading"
        class="cursor-pointer bg-[#002240] hover:bg-[#002240]/90 text-white rounded-[8px] py-3 mt-5 lg:mt-8 text-base font-normal transition-all"
      >
        {{ t("Save Changes") }}
      </UButton>
    </UForm>
  </div>
</template>