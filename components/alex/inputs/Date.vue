<template>
  <div class="alex-date" :class="theme">
    <div v-if="label" class="d-flex mb-2 text-blue">
      <p v-if="required" class="mr-1 text-body-1 text-error">*</p>
      <p class="text-body-1" :class="`text-${textColor}`">
        {{ label }}
      </p>
      <v-icon
        v-if="info"
        class="ml-1 align-self-center"
        :size="20"
        :title="info"
        :color="textColor"
        >mdi-information-outline</v-icon
      >
    </div>
    <v-text-field
      v-model="inputValue"
      color="primary--2"
      rounded="lg"
      clear-icon="mdi-close"
      class="w-100"
      type="date"
      append-inner-icon="mdi-calendar"
      :error-messages="errorMessage"
      :disabled="disabled"
      :required="required"
      :class="{ 'no-value': !inputValue, theme }"
      v-bind="$attrs"
    >
      <v-menu
        v-if="!mobile"
        v-model="menu"
        class="alex-picker"
        transition="scale-transition"
        offset-y
        min-width="auto"
        location="top start"
        activator="parent"
        :close-on-content-click="false"
      >
        <v-date-picker
          v-model="dateValue"
          color="secondary-0"
          rounded="lg"
          location="bottom start"
          :title="$t('components.date.selectDate')"
          :header="$t('components.date.enterDate')"
          :landscape="true"
          :allowed-dates="allowedDates"
          :max-width="360"
        />
      </v-menu>
    </v-text-field>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
interface DatePickerProps {
  name: string;
  modelValue?: Date | string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  info?: string;
  theme?: 'light' | 'dark';
  allowedDates?: (value?: any) => boolean;
}
const mobile = navigator.userAgent.toLowerCase().includes('mobile');
const props = withDefaults(defineProps<DatePickerProps>(), {
  label: undefined,
  modelValue: undefined,
  required: false,
  disabled: false,
  info: undefined,
  theme: 'light',
  allowedDates: () => true,
});

const emit = defineEmits(['update:modelValue']);

const { value, errorMessage } = useField<string>(() => props.name, undefined, {
  syncVModel: true,
});

const convertToDate = (dateValue: Date | string | undefined) => {
  let date: Date | string | undefined = dateValue;
  if (!date) return undefined;
  else if (typeof date === 'string') {
    date = new Date(date.replace(/-/g, '/'));
  } else if (date) {
    date = new Date(date);
  }
  date.setHours(0, 0, 0, 0);
  return date;
};

const dateValue = computed({
  get() {
    return convertToDate(value.value);
  },
  set(value) {
    emit('update:modelValue', formatDate(value));
  },
});

const menu = ref(false);
const inputValue = computed({
  get() {
    return value.value;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const formatDate = (date?: Date | string) => {
  const newDate = convertToDate(date);
  if (!newDate) return undefined;
  return newDate.toISOString().substring(0, 10);
};

const textColor = computed(() => {
  if (props.theme === 'light') {
    return props.disabled ? 'gray-300' : 'gray-800';
  }
  if (props.theme === 'dark') {
    return props.disabled ? 'gray-300' : 'white';
  }
});

watch(inputValue, () => (menu.value = false));
</script>

<style lang="scss">
.alex-date input[type='date']::-webkit-calendar-picker-indicator {
  pointer-events: none !important;
  background: transparent !important;
  bottom: 0 !important;
  color: transparent !important;
  cursor: pointer !important;
  height: auto !important;
  left: 0 !important;
  position: absolute !important;
  right: 0 !important;
  top: 0 !important;
  width: auto !important;
}
.v-date-picker-month__day > .v-btn {
  border-radius: 8px !important;
  width: 36px !important;
  height: 36px !important;
}

.alex-date {
  .v-theme--mainTheme {
    --v-border-opacity: 1 !important;
    --v-high-emphasis-opacity: 1 !important;
    --v-medium-emphasis-opacity: 1 !important;
    --v-disabled-opacity: 1 !important;
  }

  .no-value input[type='date'] {
    color: rgb(var(--v-theme-gray-300)) !important;
  }

  &.v-field__input {
    overflow: hidden;
    color: rgb(var(--v-theme-gray-300));
    border-color: rgb(var(--v-theme-gray-400));
    text-overflow: ellipsis !important;
    font-family: Sen !important;
    font-size: 16px !important;
    padding-top: 16px !important;
    padding-bottom: 16px !important;
    font-style: normal !important;
    line-height: 135% !important;
    letter-spacing: 0.32px !important;
    border-width: 5px !important;
  }

  &.v-field--disabled > div > i,
  &.v-field--disabled > .v-field__field > .v-field__input,
  &.v-input--disabled > .v-input__details {
    color: rgb(var(--v-theme-gray-300)) !important;
  }

  &.v-field:hover:not(.v-field--active):not(.v-field--error)
    > .v-field__outline {
    color: rgb(var(--v-theme-gray-800)) !important;
  }

  .v-input__details {
    padding-inline-start: 0 !important;
  }

  .v-input__details > .v-messages > .v-messages__message {
    font-size: 14px !important;
    color: rgb(var(--v-theme-gray-600));
  }

  &.light .v-field__outline {
    color: rgb(var(--v-theme-gray-300));
  }

  &.light .v-field--dirty > .v-field__field > .v-field__input {
    color: rgb(var(--v-theme-gray-800)) !important;
  }

  &.light .v-field > div > i {
    color: rgb(var(--v-theme-gray-600)) !important;
  }

  &.dark .v-field__outline {
    color: var(--gray-400);
  }

  &.dark .v-field--dirty > .v-field__field > .v-field__input {
    color: #fff !important;
  }

  &.dark .v-field__append-inner .v-icon {
    color: rgb(var(--v-theme-gray-400)) !important;
  }

  .v-field--error > .v-field__outline,
  .v-input--error .v-messages__message {
    color: rgb(var(--v-theme-error-0)) !important;
  }
}
</style>
