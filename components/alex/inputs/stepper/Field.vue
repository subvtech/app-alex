<template>
  <component
    :is="components[fieldType]"
    v-model="value"
    :error-messages="errorMessage"
  />
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { VAutocomplete, VSelect } from 'vuetify/lib/components/index.mjs';
const components = {
  VAutocomplete,
  VSelect,
};
type ComponentsKeys = keyof typeof components;

interface FieldProps {
  name: string;
  value?: string | number | boolean;
  fieldType?: ComponentsKeys;
}

const props = withDefaults(defineProps<FieldProps>(), {
  value: undefined,
  fieldType: 'VAutocomplete',
});

const { value, errorMessage } = useField(() => props.name, undefined, {
  initialValue: props.value,
});
</script>
