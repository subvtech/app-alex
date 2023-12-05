<template>
  <div id="custom-textfield">
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
    <v-text-field
      :class="theme"
      color="primary--2"
      rounded="lg"
      role="textfield"
      clear-icon="mdi-close"
      :disabled="disabled"
      v-bind="$attrs"
    ></v-text-field>
  </div>
</template>

<script setup>
const { theme, disabled } = defineProps({
  label: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  info: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String,
    default: 'light',
  },
});

const textColor = computed(() => {
  if (theme === 'light') {
    return disabled ? 'gray-300' : 'gray-800';
  }
  if (theme === 'dark') {
    return disabled ? 'gray-300' : 'white';
  }
});
</script>

<style>
:root {
  --gray-300: #b9bfc6;
  --gray-400: #a0a8b1;
  --gray-600: #6e7a87;
  --gray-800: #454d54;
}

#custom-textfield {
  .v-theme--mainTheme {
    --v-border-opacity: 1 !important;
    --v-high-emphasis-opacity: 1 !important;
    --v-medium-emphasis-opacity: 1 !important;
    --v-disabled-opacity: 1 !important;
  }

  .v-field__input {
    overflow: hidden;
    color: #b9bfc6 !important;
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
    color: #b9bfc6 !important;
  }

  .v-field:hover:not(.v-field--active):not(.v-field--error)
    > .v-field__outline {
    color: #454d54 !important;
  }

  .v-field--error > .v-field__outline {
    color: #e9494a !important;
  }

  .v-input__details {
    padding-inline-start: 0 !important;
  }

  .v-input__details > .v-messages > .v-messages__message {
    font-size: 14px !important;
    color: #6e7a87 !important;
  }

  .light .v-field__outline {
    color: var(--gray-300) !important;
  }

  .light .v-field--dirty > .v-field__field > .v-field__input {
    color: var(--gray-800) !important;
  }

  .light .v-field > div > i {
    color: var(--gray-600) !important;
  }

  .dark .v-field__outline {
    color: var(--gray-400) !important;
  }

  .dark .v-field--dirty > .v-field__field > .v-field__input {
    color: #fff !important;
  }

  .dark .v-field > div > i {
    color: var(--gray-400) !important;
  }
}
</style>
