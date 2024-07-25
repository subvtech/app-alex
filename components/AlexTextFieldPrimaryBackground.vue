<template>
  <v-text-field
    v-model="inputValue"
    :rules="rules"
    :label="label"
    :color="color"
    :outlined="outlined"
    :required="required"
    @input="emit('input', inputValue)"
  >
  </v-text-field>
</template>

<script setup lang="ts">
const props = defineProps({
  value: {
    type: String,
  },
  rules: {
    type: Array as PropType<any>,
    default: () => [],
  },
  label: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  outlined: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
});

const { label, outlined, required, rules, color, value } = toRefs(props);
const emit = defineEmits(['input']);

const inputValue = ref();

watch(
  () => value,
  (v) => (inputValue.value = v),
);
</script>

<style scoped lang="scss">
:deep(.theme--light.v-label),
:deep(.theme--light.v-input) input,
:deep(.theme--light.v-input) textarea,
:deep(.theme--light.v-icon) {
  color: rgba(255, 255, 255, 1);
}

:deep(.v-input .v-label) {
  left: 0 !important;
  top: -25px !important;
}

:deep(.v-text-field .v-label)--active {
  transform: none !important;
}

:deep(.v-text-field--outlined) fieldset {
  border-collapse: collapse;
  border-color: white;
  border-style: solid;
  border-width: 2px;
}
</style>
