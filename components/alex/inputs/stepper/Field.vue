<template>
  <v-text-field v-if="typeField === 'text'" v-model="value" :error-messages="errorMessage"> </v-text-field>
  <v-autocomplete v-else-if="typeField === 'autocomplete'" v-model="value" :error-messages="errorMessage"> </v-autocomplete>
  <v-select v-else-if="typeField === 'select'" v-model="value" :error-messages="errorMessage"> </v-select>

</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
const props = defineProps({
    name: { type: String, required: true },
    value: {
        type: String || Number || Boolean || undefined,
        default: undefined,
    },
    typeField: {
        type: String as PropType<'autocomplete' | 'text' | 'select'>,
        default: 'text'
    },
    
});

const { value, errorMessage } = useField(() => props.name, undefined, {initialValue: props.value});
</script>

<style lang="scss" scoped></style>
