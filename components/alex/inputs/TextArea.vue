<template>
  <div class="alex-textarea">
    <div v-if="label" class="d-flex mb-2 text-blue">
      <p v-if="required" class="mr-1 text-body-1 text-error">*</p>
      <p class="text-body-1" :class="`text-${textColor}`">
        {{ label }}
      </p>
      <v-icon
        v-if="info"
        class="ml-1 align-self-center"
        size="20"
        :title="info"
        :color="textColor"
        >mdi-information-outline</v-icon
      >
    </div>
    <v-textarea
      v-model="value"
      color="primary--2"
      rounded="lg"
      variant="outlined"
      no-resize
      role="textarea"
      clear-icon="mdi-close"
      :class="theme"
      :error-messages="errorMessage"
      :disabled="disabled"
      v-bind="$attrs"
      @click:append-inner="$emit('click:append-inner')"
    >
      <template #append-inner>
        <alex-custom-tooltip v-if="appendInnerIcon" :text="appendInnerIconHint">
          <template #content>
            <v-icon class="pointer" color="#6E7A87" @click="$emit('click:append-inner')">{{ appendInnerIcon }}</v-icon>
          </template>
        </alex-custom-tooltip>
      </template>
    </v-textarea>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';

interface TextAreaProps {
  modelValue?: string | number | boolean | unknown[] | any;
  name: string;
  label?: string;
  required?: boolean;
  info?: string;
  disabled?: boolean;
  appendInnerIcon?: string;
  appendInnerIconHint?: string;
  theme?: 'light' | 'dark';
}
const props = withDefaults(defineProps<TextAreaProps>(), {
  disabled: false,
  theme: 'light',
  info: undefined,
  label: undefined,
  value: undefined,
  appendInnerIcon: undefined,
  appendInnerIconHint: undefined,
  modelValue: undefined,
});

const { value, errorMessage } = useField(() => props.name, undefined, {
  syncVModel: true,
});

const textColor = computed(() => {
  if (props.theme === 'light') {
    return props.disabled ? 'gray-300' : 'gray-800';
  }
  if (props.theme === 'dark') {
    return props.disabled ? 'gray-300' : 'white';
  }
});
</script>

<style lang="scss">
.alex-textarea {
  .v-theme--mainTheme {
    --v-border-opacity: 1 !important;
    --v-high-emphasis-opacity: 1 !important;
    --v-medium-emphasis-opacity: 1 !important;
    --v-disabled-opacity: 1 !important;
    --v-border-color: rgb(var(--v-theme-gray-400));
  }

  .v-field__input {
    color: rgb(var(--v-theme-gray-300));
    border-color: rgb(var(--v-theme-gray-400));
    text-overflow: ellipsis !important;
    font-family: Sen !important;
    font-size: 16px !important;
    padding-top: 16px !important;
    padding-bottom: 16px !important;
    font-style: normal !important;
    height: 102px;
    line-height: 135% !important;
    letter-spacing: 0.32px !important;
    border-width: 5px !important;
  }

  .v-field--disabled > div > i,
  .v-field--disabled > .v-field__field > .v-field__input,
  .v-input--disabled > .v-input__details {
    color: rgb(var(--v-theme-gray-300)) !important;
  }

  .v-field:hover:not(.v-field--active):not(.v-field--error)
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

  .light .v-field__outline {
    color: rgb(var(--v-theme-gray-300));
  }

  .light .v-field--dirty > .v-field__field > .v-field__input {
    color: rgb(var(--v-theme-gray-800)) !important;
  }

  .light .v-field > div > i {
    color: rgb(var(--v-theme-gray-600)) !important;
  }

  .dark .v-field__outline {
    color: var(--gray-400);
  }

  .dark .v-field--dirty > .v-field__field > .v-field__input {
    color: #fff !important;
  }

  .dark .v-field > div > i {
    color: rgb(var(--v-theme-gray-400)) !important;
  }

  .v-field--error > .v-field__outline,
  .v-input--error .v-messages__message {
    color: rgb(var(--v-theme-error-0)) !important;
  }

  textarea::-webkit-scrollbar {
    width: 6px;
  }

  textarea::-webkit-scrollbar-thumb {
    background-color: #abb2b9;
    border-radius: 999px;
  }

  textarea::-webkit-scrollbar-track {
    background-color: rgb(var(--v-theme-white)) !important;
  }
}
</style>
