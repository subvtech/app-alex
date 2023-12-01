<template>
  <v-text-field
    color="primary--2"
    rounded="lg"
    role="textfield"
    persistent-hint
  ></v-text-field>
</template>

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

.v-field--disabled > div > i {
  color: #b9bfc6 !important;
}

.v-field:hover:not(.v-field--active):not(.v-field--error) > .v-field__outline {
  color: #454d54 !important;
}

.v-field--error > .v-field__outline {
  color: #e9494a !important;
}
</style>
