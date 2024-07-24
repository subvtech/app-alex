<template>
  <div class="alex-text-field" :class="class">
    <div v-if="label" class="d-flex mb-2 text-blue">
      <p v-if="required" class="mr-1 text-body-1 text-error">*</p>
      <p class="text-body-1" :class="`text-${textColor}`">
        {{ label }}
      </p>
      <alex-custom-tooltip v-if="info" :text="info">
        <template #content>
          <v-icon
            v-if="info"
            class="ml-1 align-self-center"
            size="20"
            :color="textColor"
            >mdi-information-outline</v-icon
          >
        </template>
      </alex-custom-tooltip>
    </div>
    <v-text-field
      v-model="value"
      color="primary--2"
      rounded="lg"
      clear-icon="mdi-close"
      variant="outlined"
      :error-messages="errorMessage"
      :class="theme"
      :disabled="disabled"
      v-bind="$attrs"
    >
      <!-- Bind all slots  -->
      <template v-for="(_, slot) in $slots" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </v-text-field>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { type YupSchema } from '../../../models/yupSchema.model';

defineOptions({
  inheritAttrs: false,
});

interface TextFieldProps {
  modelValue?: string | number | boolean | unknown[] | any;
  name: string;
  label?: string;
  required?: boolean;
  info?: string;
  disabled?: boolean;
  theme?: 'light' | 'dark';
  schema?: YupSchema;
  class?: string;
}

const props = withDefaults(defineProps<TextFieldProps>(), {
  disabled: false,
  theme: 'light',
  info: undefined,
  label: undefined,
  modelValue: undefined,
  schema: undefined,
  class: undefined,
});

const { value, errorMessage } = useField(() => props.name, props.schema, {
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
.alex-text-field {
  .v-theme--mainTheme {
    --v-border-opacity: 1 !important;
    --v-high-emphasis-opacity: 1 !important;
    --v-medium-emphasis-opacity: 1 !important;
    --v-disabled-opacity: 1 !important;
  }

  .v-field__input {
    overflow: hidden;
    color: rgb(var(--v-theme-gray-300)) !important;
    text-overflow: ellipsis !important;
    font-family: Sen !important;
    font-size: 16px !important;
    font-style: normal !important;
    font-weight: 400 !important;
    line-height: 135% !important;
    letter-spacing: 0.32px !important;
    border-width: 5px;
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
    color: rgb(var(--v-theme-gray-400));
  }

  .dark .v-field--dirty > .v-field__field > .v-field__input {
    color: rgb(var(--v-theme-white)) !important;
  }

  .dark .v-field > div > i {
    color: rgb(var(--v-theme-gray-400)) !important;
  }

  .v-field--error > .v-field__outline,
  .v-input--error .v-messages__message {
    color: rgb(var(--v-theme-error-0)) !important;
  }
}
</style>
