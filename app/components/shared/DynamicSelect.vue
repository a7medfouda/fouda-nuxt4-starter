<script setup lang="ts">
import { computed } from "vue";

type SelectValue = string | number | boolean;
type SelectModel = SelectValue | SelectValue[] | null | undefined;

interface SelectOption {
  label: string;
  value: SelectValue;
  description?: string;
  icon?: string;
  disabled?: boolean;
}

interface Props {
  name: string;
  items: SelectOption[];
  label?: string;
  placeholder?: string;
  description?: string;
  help?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  leadingIcon?: string;
  fieldUi?: Record<string, string>;
  selectUi?: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  placeholder: undefined,
  description: undefined,
  help: undefined,
  hint: undefined,
  required: false,
  disabled: false,
  multiple: false,
  leadingIcon: undefined,
  fieldUi: undefined,
  selectUi: undefined,
});

const emit = defineEmits<{
  blur: [event: FocusEvent];
  change: [event: Event];
}>();

const model = defineModel<SelectModel>({ required: true });

const appendUiClass = (slot: string, className: string) =>
  [props.selectUi?.[slot], className].filter(Boolean).join(" ");

const mergedSelectUi = computed(() => ({
  ...props.selectUi,
  base: appendUiClass(
    "base",
    "rtl:flex-row-reverse rtl:text-right rtl:ps-11 rtl:pe-11"
  ),
  leading: appendUiClass("leading", "rtl:start-auto rtl:end-0 rtl:ps-0 rtl:pe-3"),
  trailing: appendUiClass(
    "trailing",
    "rtl:end-auto rtl:start-0 rtl:pe-0 rtl:ps-3"
  ),
  value: appendUiClass("value", "rtl:text-right"),
  placeholder: appendUiClass("placeholder", "rtl:text-right"),
  content: appendUiClass("content", "rtl:text-right"),
  item: appendUiClass("item", "rtl:flex-row-reverse rtl:text-right"),
  itemLeadingIcon: appendUiClass("itemLeadingIcon", "rtl:order-3"),
  itemWrapper: appendUiClass("itemWrapper", "rtl:text-right"),
  itemTrailing: appendUiClass("itemTrailing", "rtl:me-auto rtl:ms-0"),
  itemLabel: appendUiClass("itemLabel", "rtl:text-right"),
  itemDescription: appendUiClass("itemDescription", "rtl:text-right"),
}));

const updateModel = (value: SelectModel) => {
  model.value = value;
};
</script>

<template>
  <UFormField
    :name="name"
    :label="label"
    :description="description"
    :help="help"
    :hint="hint"
    :required="required"
    :ui="fieldUi"
  >
    <USelect
      :model-value="model"
      :name="name"
      :items="items"
      value-key="value"
      label-key="label"
      description-key="description"
      :placeholder="placeholder"
      :disabled="disabled"
      :multiple="multiple"
      :leading-icon="leadingIcon"
      size="xl"
      class="w-full"
      :ui="mergedSelectUi"
      @update:model-value="updateModel"
      @blur="emit('blur', $event)"
      @change="emit('change', $event)"
    />
  </UFormField>
</template>
