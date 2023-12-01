<template>
  <div>
    <div v-if="label" class="d-flex mb-2">
      <p v-if="required" class="mr-1 text-body-1 text-error">*</p>
      <p
        class="text-body-1"
        :class="disabled ? 'text-gray-300' : 'text-gray-800'"
      >
        {{ label }}
      </p>
      <v-icon
        v-if="info"
        class="ml-1 align-self-center"
        size="20"
        :title="info"
        :color="disabled ? 'gray-300' : 'gray-800'"
        >mdi-information-outline</v-icon
      >
    </div>
    <v-text-field
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
defineProps({
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
});
</script>

<style>
.v-field__outline {
  color: #a0a8b1 !important;
}
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

.v-field--dirty > .v-field__field > .v-field__input {
  color: #454d54 !important;
}

.v-field > div > i {
  color: #6e7a87 !important;
}

.v-field--disabled > div > i,
.v-field--disabled > .v-field__field > .v-field__input,
.v-input--disabled > .v-input__details {
  color: #b9bfc6 !important;
}

.v-field:hover:not(.v-field--active):not(.v-field--error) > .v-field__outline {
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
</style>
