<script setup lang="ts">
import * as z from "zod";
import { computed, reactive } from "vue";
import type { FormSubmitEvent } from "@nuxt/ui";

interface ExampleFormState {
  fullName: string;
  age: number | undefined;
  password: string;
  email: string;
  phone: string;
  dialCode: string;
  message: string;
  acceptTerms: boolean;
  contactMethod: string;
  notifications: boolean;
  courseLevel: string;
}

const { t } = useI18n();
const toast = useToast();

const inputUi = {
  base: "px-3 py-2 border border-[#e1e1e1] hover:border-[#c5c5c5] rounded-[8px] text-[#4B4B4B] placeholder:font-light placeholder:text-[#8E8E8E] placeholder:text-[14px] font-light bg-white transition-colors duration-150 focus-visible:border-[#002240] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#002240] aria-invalid:border-[#ef4444] aria-invalid:ring-1 aria-invalid:ring-inset aria-invalid:ring-[#ef4444]",
  leadingIcon: "text-[#8E8E8E] size-5",
};

const controlUi = {
  base: "cursor-pointer",
  label: "text-[#4B4B4B] font-light cursor-pointer",
  description: "text-[#8E8E8E] font-light",
};

const state = reactive<ExampleFormState>({
  fullName: "",
  age: undefined,
  password: "",
  email: "",
  phone: "",
  dialCode: "+966",
  message: "",
  acceptTerms: false,
  contactMethod: "",
  notifications: false,
  courseLevel: "",
});

const schema = z.object({
  fullName: z.string().min(2, t("Name must be at least 2 characters")),
  age: z.coerce
    .number()
    .min(1, t("Age is required"))
    .max(120, t("Age must be 120 or less")),
  password: z.string().min(6, t("Password must be at least 6 characters")),
  email: z.string().email(t("Enter valid email")),
  phone: z
    .string()
    .min(1, t("Phone number is required"))
    .regex(/^\d{7,15}$/, t("Enter valid mobile")),
  dialCode: z.string().optional(),
  message: z.string().min(10, t("Message must be at least 10 characters")),
  acceptTerms: z.boolean().refine((value) => value === true, {
    message: t("Please accept the example terms"),
  }),
  contactMethod: z.string().min(1, t("Contact method is required")),
  notifications: z.boolean().refine((value) => value === true, {
    message: t("Enable notifications to continue"),
  }),
  courseLevel: z.string().min(1, t("Course level is required")),
});

type Schema = z.output<typeof schema>;

const contactOptions = computed(() => [
  { label: t("Email Address"), value: "email" },
  { label: t("Mobile Number"), value: "mobile" },
  { label: t("WhatsApp"), value: "whatsapp" },
]);

const courseLevelOptions = computed(() => [
  {
    label: t("Beginner"),
    value: "beginner",
    description: t("Beginner Level"),
    icon: "i-lucide-seedling",
  },
  {
    label: t("Intermediate"),
    value: "intermediate",
    description: t("Intermediate Level"),
    icon: "i-lucide-chart-no-axes-column-increasing",
  },
  {
    label: t("Advanced"),
    value: "advanced",
    description: t("Advanced Level"),
    icon: "i-lucide-award",
  },
]);

const onSubmit = (_event: FormSubmitEvent<Schema>) => {
  toast.add({
    title: t("Success"),
    description: t("Form saved successfully"),
    color: "success",
    icon: "i-heroicons-check-circle",
  });
};

const onError = (_event: any) => {
  toast.add({
    title: t("Error"),
    description: t("Please fill in all required fields correctly"),
    color: "error",
    icon: "i-heroicons-x-circle",
  });
};
</script>

<template>
  <main class="min-h-screen bg-[#F7F9FC] py-10 lg:py-14">
    <SharedContainer size="narrow">
      <section class="mb-8">
        <p class="text-sm font-light text-[#FE6452]">
          {{ t("Reusable inputs") }}
        </p>
        <h1 class="mt-2 text-3xl font-semibold text-[#002240]">
          {{ t("Form Components") }}
        </h1>
      </section>

      <UForm
        :schema="schema"
        :state="state"
        :validate-on="['blur', 'change']"
        novalidate
        class="rounded-[8px] border border-[#E1E1E1] bg-white p-5 shadow-sm sm:p-6"
        @submit="onSubmit"
        @error="onError"
      >
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SharedFormFieldRenderer
            v-model="state.fullName"
            name="fullName"
            type="text"
            :label="t('Text Input')"
            :placeholder="t('Enter your full name')"
            leading-icon="i-heroicons-user"
            required
            :input-ui="inputUi"
          />

          <SharedFormFieldRenderer
            v-model="state.age"
            name="age"
            type="number"
            :label="t('Number Input')"
            :placeholder="t('Enter your age')"
            leading-icon="i-lucide-hash"
            required
            :input-ui="inputUi"
          />

          <SharedFormFieldRenderer
            v-model="state.password"
            name="password"
            type="password"
            :label="t('Password Input')"
            :placeholder="t('Enter password')"
            leading-icon="i-heroicons-lock-closed"
            autocomplete="new-password"
            required
            :input-ui="inputUi"
          />

          <SharedFormFieldRenderer
            v-model="state.email"
            name="email"
            type="email"
            :label="t('Email Input')"
            :placeholder="t('Email Address')"
            leading-icon="i-heroicons-envelope"
            autocomplete="email"
            required
            :input-ui="inputUi"
          />

          <SharedPhoneInput
            v-model="state.phone"
            v-model:dial-code="state.dialCode"
            name="phone"
            :label="t('Phone Input')"
            :placeholder="t('Mobile Number')"
            required
            :input-ui="inputUi"
          />
        </div>

        <div class="mt-4 grid grid-cols-1 gap-4">
          <SharedFormFieldRenderer
            v-model="state.message"
            name="message"
            type="textarea"
            :label="t('Textarea Input')"
            :placeholder="t('Write your message here')"
            required
            :input-ui="inputUi"
          />

          <SharedFormFieldRenderer
            v-model="state.contactMethod"
            name="contactMethod"
            type="radio"
            :label="t('Radio Input')"
            :description="t('Preferred contact method')"
            :options="contactOptions"
            orientation="horizontal"
            required
            :control-ui="controlUi"
          />

          <SharedDynamicSelect
            v-model="state.courseLevel"
            name="courseLevel"
            :label="t('Dynamic Select')"
            :placeholder="t('Select course level')"
            :items="courseLevelOptions"
            leading-icon="i-lucide-list-filter"
            required
            :select-ui="inputUi"
          />

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SharedFormFieldRenderer
              v-model="state.acceptTerms"
              name="acceptTerms"
              type="checkbox"
              :label="t('Checkbox Input')"
              :description="t('Accept example terms')"
              required
              :control-ui="controlUi"
            />

            <SharedFormFieldRenderer
              v-model="state.notifications"
              name="notifications"
              type="switch"
              :label="t('Switch Input')"
              :description="t('Enable notifications')"
              required
              :control-ui="controlUi"
            />
          </div>
        </div>

        <UButton
          type="submit"
          size="xl"
          class="mt-6 cursor-pointer rounded-[8px] bg-[#002240] px-5 py-3 text-white hover:bg-[#002240]/90"
        >
          {{ t("Submit Examples") }}
        </UButton>
      </UForm>
    </SharedContainer>
  </main>
</template>
