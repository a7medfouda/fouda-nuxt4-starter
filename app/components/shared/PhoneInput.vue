<script lang="ts" setup>
import {
  ref,
  onMounted,
  computed,
  watch,
  useId,
} from "vue";

const props = defineProps<{
  modelValue: string | number;
  error?: boolean;
  with_label?: boolean;
  disabled?: boolean;
  dialCode?: string;
  smallRadius?: boolean;
  path?: string;
  placeholder?: string;
}>();
const emit = defineEmits(["update:modelValue", "update:dialCode", "blur"]);

const phone = ref(props.modelValue);
const { t } = useI18n();
const localPhone: any = ref("");
const localDialCode = ref(props.dialCode || "+966"); // Default  Saudi Arabia
const telInputRef = ref();
const uniqueId = useId();

// Computed property for border radius - match Input component
const borderRadius = computed(() => {
  return "8px";
});

const dropdownBorderRadius = computed(() => {
  return "8px 0px 0px 8px";
});

const dropdownBorderRadiusRTL = computed(() => {
  return "0px 8px 8px 0px";
});

// Map of dial codes to country codes
const dialToCountryCodeMap: Record<string, string> = {
  "+213": "dz", // Algeria
  "+973": "bh", // Bahrain
  "+253": "dj", // Djibouti
  "+20": "eg", // Egypt
  "+964": "iq", // Iraq
  "+962": "jo", // Jordan
  "+965": "kw", // Kuwait
  "+961": "lb", // Lebanon
  "+218": "ly", // Libya
  "+222": "mr", // Mauritania
  "+212": "ma", // Morocco
  "+968": "om", // Oman
  "+970": "ps", // Palestine
  "+974": "qa", // Qatar
  "+966": "sa", // Saudi Arabia
  "+252": "so", // Somalia
  "+249": "sd", // Sudan
  "+963": "sy", // Syria
  "+216": "tn", // Tunisia
  "+971": "ae", // United Arab Emirates
  "+967": "ye", // Yemen
  "+269": "km", // Comoros
};

// Computed property to get country code from dial code
const countryCode = computed(() => {
  return dialToCountryCodeMap[localDialCode.value] || "sa"; // Default to Syria if not found
});

onMounted(() => {
  // Set initial values properly
  phone.value = props.modelValue || "";
  localPhone.value = props.modelValue || "";
  // localDialCode.value = props.dial_code || "+966";
  const inputEl = telInputRef.value?.$el?.querySelector("input");
  if (inputEl) {
    inputEl.addEventListener("blur", () => {
      emit("blur");
    });
  }

  // Emit initial values
  emit("update:dialCode", localDialCode.value);
});

// Also add this watch to ensure the phone value updates when props change
watch(
  () => props.modelValue,
  (newValue: string | number) => {
    if (
      newValue !== undefined &&
      newValue !== null &&
      phone.value !== newValue
    ) {
      phone.value = newValue;
      localPhone.value = newValue;
    }
  },
  { immediate: true },
);

watch(
  () => props.dialCode,
  (newValue: string | undefined) => {
    if (newValue) {
      localDialCode.value = newValue;
    }
  },
  { immediate: true },
);

// This function handles the component's events
function handlePhoneInput(event: any, phoneObject: any) {
  // If we have a valid phone object with country info (from dropdown selection)
  if (phoneObject && phoneObject.number) {
    localPhone.value = phoneObject.number;
    const dialCode = phoneObject.countryCallingCode
      ? `+${phoneObject.countryCallingCode}`
      : localDialCode.value;
    localDialCode.value = dialCode;
    emit("update:modelValue", phoneObject.nationalNumber);
    emit("update:dialCode", dialCode);
    //     emit("update:dialCode", {
    //   ...phoneObject,
    //   iso2: phoneObject?.countryCode || phoneObject?.iso2,
    //   dialCode: phoneObject?.countryCallingCode || phoneObject?.dialCode,
    // });
    return;
  }

  // If event is an InputEvent (typing directly)
  if (event && event.target && event.target.value !== undefined) {
    localPhone.value = event.target.value;
    emit("update:modelValue", event.target.value);
    return;
  }

  // If event is just a string value
  if (typeof event === "string") {
    localPhone.value = event;
    emit("update:modelValue", event);
  }
}

// Function for the on-country-change event
function handleCountryChange(country: any) {
  if (country && country.dialCode) {
    const dialCode = `+${country.dialCode}`;
    localDialCode.value = dialCode;
    emit("update:dialCode", dialCode);
    // emit("update:dialCode", country);
  }
}

function onlyAllowDigits(event: KeyboardEvent) {
  const key = event.key;
  if (!/^\d$/.test(key)) {
    event.preventDefault();
  }
}
[];
</script>

<template>
  <UFormField :name="path">
    <client-only>
      <div class="tw-w-full">
        <label
          v-if="with_label"
          :for="`phoneInput-${uniqueId}`"
          class="sm:tw-text-sm tw-text-xs tw-font-medium tw-mb-1 tw-text-black tw-block"
        >
          {{ t("Phone Number") }}
        </label>
        <vue-tel-input
          ref="telInputRef"
          v-model:value="phone"
          :key="countryCode"
          :id="`phoneInput-${uniqueId}`"
          dir="ltr"
          :disabled="disabled"
          :aria-invalid="error ? 'true' : undefined"
          :input-options="{
            placeholder: placeholder || t('Phone'),
            inputmode: 'numeric',
            pattern: '[0-9]*',
            type: 'tel',
            id: `phoneInput-${uniqueId}`,
          }"
          :dropdown-options="{
            showFlags: true,
            showDialCode: true,
            showDialCodeInList: true,
            showDialCodeInSelection: true,
            showSearchBox: true,
          }"
          :defaultCountry="countryCode"
          :mode="'international'"
          :preferred-countries="[
            'SA',
            'EG',
            'AE',
            'SY',
            'QA',
            'OM',
            'BH',
            'KW',
            'JO',
            'LB',
            'PS',
            'IQ',
          ]"
          @input="handlePhoneInput"
          @country-changed="handleCountryChange"
          @keypress="onlyAllowDigits"
          :class="error ? 'phone-error' : ''"
        ></vue-tel-input>
      </div>
      <template #fallback>
        <div class="tw-w-full">
          <label
            v-if="with_label"
            class="sm:tw-text-sm tw-text-xs tw-font-medium tw-mb-1 tw-text-transparent tw-block opacity-0"
          >
            {{ t("Phone Number") }}
          </label>
          <div
            class="tw-h-[41.6px] tw-w-full tw-rounded tw-bg-[#f3f4f6] tw-animate-pulse"
          ></div>
        </div>
      </template>
    </client-only>
  </UFormField>
</template>

<style lang="scss">
// Form item base styles to match Input component
:deep(.u-form-group) {
  --n-label-font-size: 14px !important;
  --n-label-padding: 0 !important;
  margin-bottom: 0 !important;
}

// Hide form item asterisk
:deep(.u-form-group-label__asterisk) {
  display: none !important;
}
.vue-tel-input:hover {
  // border: 1px solid transparent !important;
}
.vue-tel-input {
  width: 100%;
  border-radius: v-bind(borderRadius) !important;
  height: 41.6px; // Match Input component height
  border: 0px solid transparent;
  transition: border-color 0.2s ease;
  position: relative;
  &.disabled {
    opacity: 0.5;
  }
  :dir(rtl) & {
    direction: rtl;
  }
}
.vue-tel-input input::placeholder {
  color: #e1e1e1 !important; // Match Input component placeholder color
}
// dropdown
.vti__dropdown {
  padding: 0 8px !important;
  position: unset;
  @apply tw-flex-shrink-0;
  &::after {
    display: none;
  }
}

// dropdown list
.vue-tel-input .vti__dropdown-list {
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.12);
  border: none;
  color: black !important;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px;
  border-radius: 8px;
  max-height: 185px !important;

  // Fix scroll containment issue
  overflow-y: auto !important;
  overscroll-behavior: contain !important;
  -webkit-overflow-scrolling: touch !important;
  touch-action: pan-y !important;
  position: absolute !important;
  z-index: 50 !important;

  .vti__dropdown-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px;
    &.highlighted {
      background-color: #eff6ff;
      border-radius: 4px;
    }
  }
}
@media (max-width: 576px) {
  .vue-tel-input .vti__dropdown-list {
    padding: 10px;
    .vti__dropdown-item {
      padding: 8px;
    }
  }
}
// input - match Input component styling
.vue-tel-input .vti__input {
  font-size: 14px; // Match Input component
  border-top-right-radius: v-bind(borderRadius);
  border-bottom-right-radius: v-bind(borderRadius);
  background: transparent !important; // Match Input component
  border: 1px solid #e1e1e1; // Match Input component
  border-left: none;
  padding-right: 12px;
  color: #8e8e8e !important; // Match Input component
  height: 41.6px !important; // Match Input component
  transition: border-color 0.2s ease;

  // &:hover {
  //   border-color: #D61F2B !important; // Match Input component hover
  // }

  &:focus {
    // border: 1px solid #e1e1e1 !important;
    box-shadow: none !important;
  }

  &::placeholder {
    color: #e1e1e1 !important; // Match Input component
    font-weight: light !important;
    font-size: 16px !important;
    }
  // @media (min-width: 1024px) {
  //   font-size: 14px !important; // Match Input component
  //   &::placeholder {
  //     font-size: 14px !important;
  //   }
  // }

  :dir(rtl) & {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: none;
    border-left: 1px solid #e1e1e1;
    border-top-left-radius: v-bind(borderRadius);
    border-bottom-left-radius: v-bind(borderRadius);
    direction: rtl;
    @apply tw-pl-0 tw-pr-3 tw-text-end;
  }

  // Responsive font size for mobile
  @media (max-width: 768px) {
    font-size: 16px !important; // Prevent zoom on iOS

    &::placeholder {
      font-size: 16px !important;
    }
  }
}

// error input
.phone-error {
  .vti__dropdown,
  input {
    border-color: #e1e1e1 !important;
  }
}
.phone-error:focus-within {
  .vti__dropdown,
  input {
    border-color: #e1e1e1 !important;
    // box-shadow: 0 0 0 2px rgba(208, 48, 80, 0.2) !important;
  }
}

// hide dropdown arrow
.vue-tel-input .vti__dropdown-arrow {
  display: none !important;
}

.vue-tel-input .vti__dropdown.open::after {
  transform: translateY(-50%) rotate(180deg);
}

li.vti__dropdown-item.preferred,
li.vti__dropdown-item {
  font-size: 12px;
}

.vti__dropdown-list.below {
  top: 55px !important;
  z-index: 50 !important;

  // Additional scroll containment for the positioned dropdown
  overflow-y: auto !important;
  overscroll-behavior: contain !important;
  scroll-behavior: smooth !important;
}

[dir="rtl"] .vti__dropdown-list.below {
  direction: rtl;
  font-size: 12px;
  text-align: right;
}

/* .vti__selection .vti__flag {
  display: none !important;
} */

.vti__dropdown-list .vti__flag {
  display: inline-block !important;
  margin-right: 0;
}

.vti__selection {
  font-size: 2px !important;
}

.vti__dropdown,
.vti__dropdown:hover,
.vti__dropdown.open {
  background: transparent !important; // Match Input component
  border: 1px solid #e1e1e1 !important; // Match Input component
  border-radius: v-bind(dropdownBorderRadius);
  transition: border-color 0.2s ease;
  height: 41.6px !important; // Match Input component

  :dir(rtl) & {
    border-radius: v-bind(dropdownBorderRadiusRTL);
  }
}

input:-webkit-autofill {
  -webkit-text-fill-color: black !important;
}

.vue-tel-input:focus-within {
  box-shadow: none !important;
  border: none !important;

  .vti__dropdown {
    border-color: #e1e1e1 !important; // Match Input component focus
  }
}

.vti__selection .vti__country-code {
  color: #333 !important; // Match Input component text color
  font-size: 12px !important; // Match Input component font size
  @apply ltr:tw-ml-[5px];
}
</style>