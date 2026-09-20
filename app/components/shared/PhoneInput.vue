<script lang="ts" setup>
import { ref, computed, watch, useId, onMounted } from "vue";

const DEFAULT_COUNTRY = "SA";
const DEFAULT_DIAL_CODE = "+966";

const DIAL_CODE_TO_COUNTRY: Record<string, string> = {
  "966": "SA",
  "971": "AE",
  "974": "QA",
  "968": "OM",
  "973": "BH",
  "965": "KW",
  "962": "JO",
  "961": "LB",
  "970": "PS",
  "964": "IQ",
  "20": "EG",
  "963": "SY",
  "967": "YE",
  "212": "MA",
  "216": "TN",
  "213": "DZ",
  "249": "SD",
  "218": "LY",
  "1": "US",
  "44": "GB",
  "33": "FR",
  "49": "DE",
  "90": "TR",
  "91": "IN",
  "92": "PK",
  "880": "BD",
  "62": "ID",
  "60": "MY",
  "63": "PH",
};

const COUNTRY_MOBILE_PATTERNS: Record<string, RegExp> = {
  EG: /^(10|11|12|15)\d{8}$/,
  SA: /^5\d{8}$/,
  AE: /^5\d{8}$/,
  KW: /^[4569]\d{7}$/,
  QA: /^[3567]\d{7}$/,
  OM: /^[79]\d{7}$/,
  BH: /^[36]\d{7}$/,
  JO: /^7\d{8}$/,
  PS: /^5[69]\d{7}$/,
  IQ: /^7\d{9}$/,
  YE: /^7\d{8}$/,
  SY: /^9\d{8}$/,
  MA: /^[67]\d{8}$/,
  TN: /^[2459]\d{7}$/,
  DZ: /^[567]\d{8}$/,
  SD: /^[19]\d{8}$/,
  LY: /^9\d{8}$/,
};

const COUNTRY_MAX_LENGTHS: Record<string, number> = {
  EG: 10,
  SA: 9,
  AE: 9,
  KW: 8,
  QA: 8,
  OM: 8,
  BH: 8,
  JO: 9,
  PS: 9,
  IQ: 10,
  YE: 9,
  SY: 9,
  MA: 9,
  TN: 8,
  DZ: 9,
  SD: 9,
  LY: 9,
  US: 10,
  GB: 10,
  FR: 9,
  DE: 11,
  TR: 10,
  IN: 10,
  PK: 10,
};

const normalizePhoneNumber = (
  phone: string | number | null | undefined,
  dialcode: string | null | undefined,
) => {
  const rawPhone = String(phone ?? "").trim();
  let phoneDigits = rawPhone.replace(/\D/g, "");
  const dialcodeDigits = String(dialcode ?? "").replace(/\D/g, "");

  if (dialcodeDigits) {
    if (rawPhone.startsWith("+") && phoneDigits.startsWith(dialcodeDigits)) {
      phoneDigits = phoneDigits.slice(dialcodeDigits.length);
    } else {
      const internationalPrefix = `00${dialcodeDigits}`;
      if (rawPhone.startsWith("00") && phoneDigits.startsWith(internationalPrefix)) {
        phoneDigits = phoneDigits.slice(internationalPrefix.length);
      } else if (
        phoneDigits.startsWith(dialcodeDigits) &&
        phoneDigits.length >= dialcodeDigits.length + 7
      ) {
        phoneDigits = phoneDigits.slice(dialcodeDigits.length);
      }
    }
  }

  return phoneDigits.replace(/^0+/, "");
};

function validatePhoneNumber(
  phone: string,
  countryCode: string,
  dialCode: string,
  libValid?: boolean,
): boolean {
  if (!phone || !String(phone).trim()) return true;

  const codeIso = countryCode ? countryCode.toUpperCase() : "";
  let digits = String(phone).replace(/\D/g, "");
  const dialDigits = String(dialCode).replace(/\D/g, "");

  if (dialDigits && digits.startsWith(dialDigits)) {
    digits = digits.slice(dialDigits.length);
  }
  digits = digits.replace(/^0+/, "");

  if (COUNTRY_MOBILE_PATTERNS[codeIso]) {
    return COUNTRY_MOBILE_PATTERNS[codeIso].test(digits);
  }

  if (libValid !== undefined) {
    return libValid;
  }

  return digits.length >= 7 && digits.length <= 12;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | number;
    error?: boolean;
    with_label?: boolean;
    label?: string;
    disabled?: boolean;
    dialCode?: string;
    defaultDialCode?: string | null;
    defaultCountry?: string | null;
    smallRadius?: boolean;
    path?: string;
    placeholder?: string;
  }>(),
  {
    modelValue: "",
    with_label: false,
    disabled: false,
    dialCode: "966",
    placeholder: "",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "update:dialCode", value: string): void;
  (e: "update:country", value: string): void;
  (e: "update:isValid", value: boolean): void;
  (e: "update:is-valid", value: boolean): void;
  (e: "blur"): void;
}>();

const { t, locale } = useI18n();
const isRtl = computed(() => locale.value === "ar");
const uniqueId = useId();
const telInputRef = ref();

const normalizeDial = (code?: string | number | null) => {
  if (!code) return DEFAULT_DIAL_CODE;
  const str = String(code).trim();
  return str.startsWith("+") ? str : `+${str}`;
};

const activeDialCode = computed(() => props.defaultDialCode || props.dialCode);

const localDialCode = ref(normalizeDial(activeDialCode.value));
const phone = ref(
  props.modelValue !== undefined && props.modelValue !== null
    ? normalizePhoneNumber(props.modelValue, localDialCode.value)
    : "",
);
const effectiveCountry = computed(() => {
  if (
    props.defaultCountry &&
    typeof props.defaultCountry === "string" &&
    props.defaultCountry.trim() !== "" &&
    props.defaultCountry !== "null"
  ) {
    return props.defaultCountry.toUpperCase();
  }

  const dialCodeStr = activeDialCode.value || localDialCode.value;
  if (dialCodeStr) {
    const digits = String(dialCodeStr).replace(/\D/g, "");
    if (DIAL_CODE_TO_COUNTRY[digits]) {
      return DIAL_CODE_TO_COUNTRY[digits];
    }
  }

  return DEFAULT_COUNTRY;
});

const currentMaxLength = computed(() => {
  const code = effectiveCountry.value ? effectiveCountry.value.toUpperCase() : "";
  return COUNTRY_MAX_LENGTHS[code] || 12;
});

const isValidPhone = ref<boolean>(true);

const checkValidity = (libValid?: boolean) => {
  const valid = validatePhoneNumber(
    String(phone.value),
    effectiveCountry.value,
    localDialCode.value,
    libValid,
  );
  isValidPhone.value = valid;
  emit("update:isValid", valid);
  emit("update:is-valid", valid);
};

defineExpose({
  isValid: isValidPhone,
  checkValidity,
});

watch(
  () => activeDialCode.value,
  (newDial) => {
    if (newDial) {
      localDialCode.value = normalizeDial(newDial);
      checkValidity();
    }
  },
  { immediate: true },
);

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== undefined && newValue !== null) {
      const normalized = normalizePhoneNumber(newValue, localDialCode.value);
      if (phone.value !== normalized) {
        phone.value = normalized;
      }
      checkValidity();
    }
  },
  { immediate: true },
);

onMounted(() => {
  phone.value = normalizePhoneNumber(phone.value, localDialCode.value);
  emit("update:modelValue", phone.value);
  emit("update:dialCode", localDialCode.value.replace(/^\+/, ""));
  emit("update:country", effectiveCountry.value);
  checkValidity();
});

function handlePhoneInput(event: any, phoneObject: any) {
  const currentCountry = phoneObject?.countryCode || effectiveCountry.value;
  const currentDialCode = phoneObject?.countryCallingCode
    ? `+${phoneObject.countryCallingCode}`
    : localDialCode.value;
  const maxLen =
    COUNTRY_MAX_LENGTHS[currentCountry ? currentCountry.toUpperCase() : ""] ||
    currentMaxLength.value;

  const rawNum =
    phoneObject?.nationalNumber ||
    phoneObject?.number ||
    (event && event.target && event.target.value !== undefined
      ? event.target.value
      : typeof event === "string"
        ? event
        : phone.value);

  let normalized = normalizePhoneNumber(String(rawNum), currentDialCode);
  if (normalized.length > maxLen) {
    normalized = normalized.slice(0, maxLen);
  }
  phone.value = normalized;

  if (phoneObject && phoneObject.countryCallingCode) {
    const dial = `+${phoneObject.countryCallingCode}`;
    localDialCode.value = dial;
    emit("update:dialCode", String(phoneObject.countryCallingCode));
    if (phoneObject.countryCode) {
      emit("update:country", phoneObject.countryCode);
    }
  }

  const valid = validatePhoneNumber(
    normalized,
    currentCountry,
    currentDialCode,
    phoneObject?.valid,
  );
  isValidPhone.value = valid;
  emit("update:isValid", valid);
  emit("update:is-valid", valid);
  emit("update:modelValue", normalized);
}

function handleCountryChange(country: any) {
  if (country && country.dialCode) {
    const dial = `+${country.dialCode}`;
    const countryIso = country.iso2 || country.countryCode || effectiveCountry.value;
    const maxLen = COUNTRY_MAX_LENGTHS[countryIso.toUpperCase()] || 12;

    localDialCode.value = dial;
    emit("update:dialCode", String(country.dialCode));
    emit("update:country", countryIso);

    let normalized = normalizePhoneNumber(phone.value, dial);
    if (normalized.length > maxLen) {
      normalized = normalized.slice(0, maxLen);
    }
    phone.value = normalized;
    emit("update:modelValue", phone.value);

    const valid = validatePhoneNumber(
      String(phone.value),
      countryIso,
      dial,
      true,
    );
    isValidPhone.value = valid;
    emit("update:isValid", valid);
    emit("update:is-valid", valid);
  }
}

function onlyAllowDigits(event: KeyboardEvent) {
  const key = event.key;
  if (
    event.ctrlKey ||
    event.metaKey ||
    ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(key)
  ) {
    return;
  }
  if (!/^\d$/.test(key)) {
    event.preventDefault();
    return;
  }
  const currentDigits = String(phone.value).replace(/\D/g, "");
  if (currentDigits.length >= currentMaxLength.value) {
    event.preventDefault();
  }
}
</script>

<template>
  <div
    class="phone-input-wrapper w-full"
    :dir="isRtl ? 'rtl' : 'ltr'"
    :class="{
      'phone-error': error || (!isValidPhone && String(phone).trim() !== ''),
      'is-rtl': isRtl,
      'is-ltr': !isRtl,
    }"
  >
    <label
      v-if="with_label"
      :for="`phoneInput-${uniqueId}`"
      class="text-third text-sm font-semibold mb-2 block"
    >
      {{ label || t("Phone Number") }}
    </label>
    <client-only>
      <vue-tel-input
        ref="telInputRef"
        v-model:value="phone"
        :id="`phoneInput-${uniqueId}`"
        :dir="isRtl ? 'rtl' : 'ltr'"
        :disabled="disabled"
        :aria-invalid="
          error || (!isValidPhone && String(phone).trim() !== '')
            ? 'true'
            : undefined
        "
        :maxlength="currentMaxLength"
        :input-options="{
          placeholder: placeholder || t('Phone Number'),
          inputmode: 'numeric',
          pattern: '[0-9]*',
          type: 'tel',
          id: `phoneInput-${uniqueId}`,
          maxlength: currentMaxLength,
        }"
        :dropdown-options="{
          showFlags: true,
          showDialCode: true,
          showDialCodeInList: true,
          showDialCodeInSelection: true,
          showSearchBox: true,
        }"
        :default-country="effectiveCountry"
        :mode="'international'"
        :preferred-countries="[
          'SA',
          'EG',
          'AE',
          'KW',
          'QA',
          'OM',
          'BH',
          'JO',
          'LB',
          'SY',
          'IQ',
          'PS',
        ]"
        @input="handlePhoneInput"
        @country-changed="handleCountryChange"
        @keypress="onlyAllowDigits"
      />
      <template #fallback>
        <div
          class="h-[46px] w-full rounded-[16px] bg-[#F8FAFC] border border-[#E2E8F0] animate-pulse"
        />
      </template>
    </client-only>
    <p
      v-if="!isValidPhone && String(phone).trim() !== ''"
      class="text-red-500 text-xs mt-1"
    >
      {{ t("Please enter a valid phone number") }}
    </p>
  </div>
</template>

<style lang="scss">
.phone-input-wrapper {
  width: 100%;
}

.vue-tel-input {
  width: 100% !important;
  height: 46px !important;
  border-radius: 16px !important;
  background-color: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  transition: all 0.2s ease-in-out !important;
  box-shadow: none !important;
  display: flex !important;
  align-items: center !important;
  position: relative !important;

  &:hover {
    border-color: #cbd5e1 !important;
  }

  &:focus-within {
    border-color: var(--primary-color, #26467b) !important;
    outline: 1px solid var(--primary-color, #26467b) !important;
    background-color: #ffffff !important;
  }

  &.disabled {
    opacity: 0.6 !important;
    cursor: not-allowed !important;
    background-color: #f1f5f9 !important;
  }
}

// LTR Layout
.is-ltr,
:dir(ltr),
html[dir="ltr"] {
  .vue-tel-input {
    direction: ltr !important;
  }

  .vti__dropdown {
    border-right: 1px solid #e2e8f0 !important;
    border-left: none !important;
    border-top-left-radius: 16px !important;
    border-bottom-left-radius: 16px !important;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }

  .vti__input {
    direction: ltr !important;
    text-align: left !important;
    border-top-right-radius: 16px !important;
    border-bottom-right-radius: 16px !important;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }

  .vti__dropdown-list {
    direction: ltr !important;
    text-align: left !important;
    left: 0 !important;
    right: auto !important;

    input,
    .vti__search_box {
      direction: ltr !important;
      text-align: left !important;
    }
  }

  .vti__dropdown-arrow {
    margin-left: 4px !important;
    margin-right: 0 !important;
  }

  .vti__country-code {
    margin-left: 4px !important;
    margin-right: 0 !important;
  }
}

// RTL Layout
.is-rtl,
:dir(rtl),
html[dir="rtl"] {
  .vue-tel-input {
    direction: rtl !important;
  }

  .vti__dropdown {
    border-left: 1px solid #e2e8f0 !important;
    border-right: none !important;
    border-top-right-radius: 16px !important;
    border-bottom-right-radius: 16px !important;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }

  .vti__input {
    direction: rtl !important;
    text-align: right !important;
    border-top-left-radius: 16px !important;
    border-bottom-left-radius: 16px !important;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }

  .vti__dropdown-list {
    direction: rtl !important;
    text-align: right !important;
    right: 0 !important;
    left: auto !important;

    input,
    .vti__search_box {
      direction: rtl !important;
      text-align: right !important;
    }
  }

  .vti__dropdown-arrow {
    margin-right: 4px !important;
    margin-left: 0 !important;
  }

  .vti__country-code {
    margin-right: 4px !important;
    margin-left: 0 !important;
  }
}

// Dropdown (flag and dial code)
.vue-tel-input .vti__dropdown {
  background: transparent !important;
  border-top: none !important;
  border-bottom: none !important;
  height: 100% !important;
  padding: 0 14px !important;
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  cursor: pointer !important;
  transition: background-color 0.2s ease !important;

  &:hover,
  &.open {
    background-color: rgba(38, 70, 123, 0.05) !important;
  }

  &::after {
    display: none !important;
  }
}

.vue-tel-input .vti__selection {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  font-size: 14px !important;

  .vti__country-code {
    color: #0f172a !important;
    font-size: 14px !important;
    font-weight: 600 !important;
  }
}

.vue-tel-input .vti__dropdown-arrow {
  color: #64748b !important;
  font-size: 10px !important;
}

// Input field
.vue-tel-input .vti__input {
  background: transparent !important;
  border: none !important;
  height: 100% !important;
  padding: 0 16px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  color: #0f172a !important;
  width: 100% !important;

  &:focus {
    outline: none !important;
    box-shadow: none !important;
    border: none !important;
  }

  &::placeholder {
    color: #94a3b8 !important;
    font-size: 15px !important;
    font-weight: 500 !important;
  }
}

// Dropdown popup menu
.vue-tel-input .vti__dropdown-list {
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 16px !important;
  box-shadow: 0 12px 32px 0 rgba(15, 23, 42, 0.12) !important;
  padding: 8px !important;
  max-height: 220px !important;
  width: 280px !important;
  z-index: 99999 !important;
  top: 50px !important;
  overflow-y: auto !important;

  .vti__dropdown-item {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    padding: 8px 12px !important;
    border-radius: 10px !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    color: #0f172a !important;
    cursor: pointer !important;
    transition: background 0.15s ease !important;

    strong {
      font-weight: 600 !important;
    }

    &.highlighted,
    &:hover {
      background-color: #eff6ff !important;
      color: #26467b !important;
    }
  }

  input,
  .vti__search_box {
    width: 100% !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 10px !important;
    padding: 6px 10px !important;
    margin-bottom: 6px !important;
    outline: none !important;
    font-size: 13px !important;
    background: #f8fafc !important;

    &:focus {
      border-color: #26467b !important;
    }
  }
}

// Error state
.phone-error .vue-tel-input {
  border-color: #ef4444 !important;
  outline: 1px solid #ef4444 !important;
}
</style>
