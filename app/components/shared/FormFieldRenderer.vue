<script setup lang="ts">
import { computed, ref } from "vue";

type FieldType =
  | "text"
  | "number"
  | "password"
  | "email"
  | "textarea"
  | "checkbox"
  | "radio"
  | "switch";

type FieldValue = string | number | boolean | null | undefined;
type ChoiceValue = string | number | boolean;

interface FieldOption {
  label: string;
  value: ChoiceValue;
  description?: string;
  disabled?: boolean;
}

interface Props {
  name: string;
  type?: FieldType;
  label?: string;
  placeholder?: string;
  description?: string;
  help?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  autocomplete?: string;
  leadingIcon?: string;
  rows?: number;
  maxrows?: number;
  options?: FieldOption[];
  orientation?: "vertical" | "horizontal";
  fieldUi?: Record<string, string>;
  inputUi?: Record<string, string>;
  controlUi?: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  label: undefined,
  placeholder: undefined,
  description: undefined,
  help: undefined,
  hint: undefined,
  required: false,
  disabled: false,
  autocomplete: undefined,
  leadingIcon: undefined,
  rows: 4,
  maxrows: 8,
  options: () => [],
  orientation: "vertical",
  fieldUi: undefined,
  inputUi: undefined,
  controlUi: undefined,
});

const emit = defineEmits<{
  blur: [event: FocusEvent];
  change: [event: Event];
}>();

const model = defineModel<FieldValue>({ required: true });
const { t } = useI18n();
const showPassword = ref(false);

const isBinaryField = computed(
  () => props.type === "checkbox" || props.type === "switch"
);

const inputType = computed(() => {
  if (props.type === "password") {
    return showPassword.value ? "text" : "password";
  }

  if (props.type === "email" || props.type === "number") {
    return props.type;
  }

  return "text";
});

const scalarModel = computed<string | number | null | undefined>({
  get: () => (typeof model.value === "boolean" ? undefined : model.value),
  set: (value) => {
    model.value = value;
  },
});

const textAreaModel = computed<string | number | null>({
  get: () => {
    if (typeof model.value === "boolean" || model.value === undefined) {
      return "";
    }

    return model.value;
  },
  set: (value) => {
    model.value = value;
  },
});

const booleanModel = computed(() => model.value === true);

const choiceModel = computed<ChoiceValue | undefined>({
  get: () => {
    if (
      typeof model.value === "string" ||
      typeof model.value === "number" ||
      typeof model.value === "boolean"
    ) {
      return model.value;
    }

    return undefined;
  },
  set: (value) => {
    model.value = value;
  },
});

const updateBoolean = (value: boolean | "indeterminate") => {
  model.value = value === true;
};

const updateChoice = (value: ChoiceValue) => {
  choiceModel.value = value;
};
</script>

<template>
  <UFormField
    :name="name"
    :label="isBinaryField ? undefined : label"
    :description="isBinaryField ? undefined : description"
    :help="help"
    :hint="hint"
    :required="required"
    :ui="fieldUi"
  >
    <UTextarea
      v-if="type === 'textarea'"
      v-model="textAreaModel"
      :name="name"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :maxrows="maxrows"
      :leading-icon="leadingIcon"
      size="xl"
      autoresize
      class="w-full"
      :ui="inputUi"
      @blur="emit('blur', $event)"
      @change="emit('change', $event)"
    />

    <UCheckbox
      v-else-if="type === 'checkbox'"
      :model-value="booleanModel"
      :name="name"
      :label="label"
      :description="description"
      :disabled="disabled"
      :ui="controlUi"
      @update:model-value="updateBoolean"
      @change="emit('change', $event)"
    />

    <URadioGroup
      v-else-if="type === 'radio'"
      :model-value="choiceModel"
      :name="name"
      :items="options"
      :disabled="disabled"
      :orientation="orientation"
      :ui="controlUi"
      @update:model-value="updateChoice"
      @change="emit('change', $event)"
    />

    <USwitch
      v-else-if="type === 'switch'"
      :model-value="booleanModel"
      :name="name"
      :label="label"
      :description="description"
      :disabled="disabled"
      :ui="controlUi"
      @update:model-value="model = $event"
      @change="emit('change', $event)"
    />

    <UInput
      v-else-if="type === 'number'"
      v-model.number="scalarModel"
      :name="name"
      type="number"
      inputmode="numeric"
      :placeholder="placeholder"
      :disabled="disabled"
      :leading-icon="leadingIcon"
      :autocomplete="autocomplete"
      size="xl"
      class="w-full"
      :ui="inputUi"
      @blur="emit('blur', $event)"
      @change="emit('change', $event)"
    />

    <UInput
      v-else
      v-model="scalarModel"
      :name="name"
      :type="inputType"
      :placeholder="placeholder"
      :disabled="disabled"
      :leading-icon="leadingIcon"
      :autocomplete="autocomplete"
      size="xl"
      class="w-full"
      :ui="inputUi"
      @blur="emit('blur', $event)"
      @change="emit('change', $event)"
    >
      <template v-if="type === 'password'" #trailing>
        <UButton
          type="button"
          color="neutral"
          variant="link"
          size="sm"
          :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
          :aria-label="showPassword ? t('Hide password') : t('Show password')"
          :aria-pressed="showPassword"
          class="text-[#8E8E8E]"
          @click="showPassword = !showPassword"
        />
      </template>
    </UInput>
  </UFormField>
</template>
