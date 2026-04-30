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

const props = defineProps<{
  inputUi?: Record<string, string>;
  modelValue: string;
  dialCode: string;
}>();

const emit = defineEmits<{
  goToLogin: [];
  goToOtp: [];
  "update:modelValue": [value: string];
  "update:dialCode": [value: string];
}>();

const schema = z.object({
  phone: z.string().regex(/^\d{7,15}$/, t("Enter valid mobile")),
  dialCode: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  phone: props.modelValue,
  dialCode: props.dialCode,
});



const onSubmit = async (_event: FormSubmitEvent<Schema>) => {
  isLoading.value = true;
  try {
    const mobile = (state.dialCode || "+966").replace("+", "") + state.phone;
    const res = await authStore.forgotPassword({ mobile });

    if (!res?.status) {
      toast.add({
        title: t("Error"),
        description:
          extractMessage(res?.message) || t("Failed to send OTP"),
        color: "error",
        icon: "i-heroicons-x-circle",
      });
      return;
    }

    toast.add({
      title: t("Success"),
      description: t("OTP sent to your mobile"),
      color: "success",
      icon: "i-heroicons-check-circle",
    });

    // Propagate phone/dialCode up before navigating to OTP step
    emit("update:modelValue", state.phone);
    emit("update:dialCode", state.dialCode);
    emit("goToOtp");
  } catch (err: any) {
    // $fetch throws on 422 (invalid mobile format)
    const data = err?.data || err;
    const msg =
      extractMessage(data?.errors) ||
      extractMessage(data?.message) ||
      t("An error occurred");
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
          "Lost your password? Please enter your phone number. You will receive a new password code.",
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
      <UFormField name="phone">
        <SharedPhoneInput
          v-model="state.phone"
          v-model:dialCode="state.dialCode"
          :placeholder="t('Mobile Number')"
          :disabled="isLoading"
          class="w-full"
        />
      </UFormField>

      <UButton
        type="submit"
        block
        size="xl"
        :loading="isLoading"
        :disabled="isLoading"
        class="cursor-pointer bg-[#002240] hover:bg-[#002240]/90 text-white rounded-[8px] py-3 mt-5 lg:mt-8 text-base font-normal transition-all"
      >
        {{ t("Send Verification Code") }}
      </UButton>
    </UForm>

    <div
      class="mt-5 lg:mt-6 text-center text-sm flex gap-1 justify-center items-center"
    >
      <span class="text-[#8E8E8E] font-light">{{
        t("Want to go back to login?")
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
