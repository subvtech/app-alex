<template>
  <TailoredCheckbox :checkbox="checkbox1" />
  <TailoredCheckbox :checkbox="checkbox2" />
  <TailoredCheckbox :checkbox="checkbox3" />
  <TailoredCheckbox :checkbox="checkbox4" />
  <TailoredCheckbox :checkbox="checkbox5" />
  <TailoredCheckbox :checkbox="checkbox6" />
  <TailoredCheckbox :checkbox="checkbox7" />
  <TailoredCheckbox :checkbox="checkbox8" />
  <TailoredCheckbox :checkbox="checkbox9" />
</template>
<script setup>
import { ref } from 'vue';

const checkbox1 = ref({
  modelValue: true,
  label: 'Checkbox',
  hint: 'True',
  disabled: false,
  readonly: false,
  indeterminate: false,
});

const checkbox2 = ref({
  modelValue: false,
  label: 'Teste sem hint',
  hint: '',
  disabled: false,
  readonly: false,
  indeterminate: false,
});

const checkbox3 = ref({
  modelValue: false,
  label: 'Checkbox',
  hint: 'Indeterminate and true',
  disabled: false,
  readonly: false,
  indeterminate: true,
});

const checkbox4 = ref({
  modelValue: false,
  label: 'Checkbox',
  hint: 'Disabled and false',
  disabled: true,
  readonly: false,
  indeterminate: false,
});

const checkbox5 = ref({
  modelValue: true,
  label: 'Checkbox',
  hint: 'Disabled and true',
  disabled: true,
  readonly: false,
  indeterminate: false,
});

const checkbox6 = ref({
  modelValue: true,
  label: 'Checkbox',
  hint: 'Disabled and indeterminate',
  disabled: true,
  readonly: false,
  indeterminate: true,
});

const checkbox7 = ref({
  label: 'Checkbox',
  hint: 'Indeterminate and readonly',
  disabled: false,
  readonly: true,
  indeterminate: true,
});

const checkbox8 = ref({
  modelValue: true,
  label: 'Checkbox',
  hint: 'Readonly and true',
  disabled: false,
  readonly: true,
  indeterminate: false,
});

const checkbox9 = ref({
  modelValue: false,
  label: 'Checkbox',
  hint: 'Readonly and false',
  disabled: false,
  readonly: true,
  indeterminate: false,
});
</script>
