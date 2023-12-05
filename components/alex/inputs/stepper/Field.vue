<template>
  <component
    :is="components[fieldType]"
    v-model="value"
    :error-messages="errorMessage"
  />
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import {
  VAutocomplete,
  VSelect,
  VTextarea,
} from 'vuetify/lib/components/index.mjs';
import TextField from '@/components/alex/inputs/TextField.vue';
const components = {
  TextField,
  VAutocomplete,
  VTextarea,
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
  fieldType: 'TextField',
});

const { value, errorMessage } = useField(() => props.name, undefined, {
  initialValue: props.value,
});
</script>
