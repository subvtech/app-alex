<template>
  <alex-inputs-checkbox :model-value="true" label="Checkbox" hint="Hint" />
  <alex-inputs-checkbox :model-value="false" label="Checkbox 2" hint="Hint 2" />
  <alex-inputs-checkbox
    :indeterminate="true"
    label="Checkbox 3"
    hint="Hint 3"
  />
  <alex-inputs-checkbox
    :model-value="true"
    :disabled="true"
    label="Checkbox 4"
    hint="Hint 4"
  />
  <alex-inputs-checkbox :disabled="true" label="Checkbox 5" hint="Hint 5" />
  <alex-inputs-checkbox
    :model-value="true"
    :readonly="true"
    label="Checkbox 6"
    hint="Hint 6"
  />
  <alex-inputs-checkbox :readonly="true" label="Checkbox 7" hint="Hint 7" />
  <alex-inputs-checkbox
    :indeterminate="true"
    :readonly="true"
    label="Checkbox 8"
    hint="Hint 8"
  />
  <alex-inputs-checkbox
    :model-value="true"
    label="Checkbox 9"
    readonly="true"
  />
</template>
<script setup>
import { ref } from 'vue';

// const checkbox1 = ref({
//   modelValue: true,
//   label: 'Checkbox',
//   hint: 'True',
//   disabled: false,
//   readonly: false,
//   indeterminate: false,
// });
</script>
