<template>
  <v-menu
    :close-on-content-click="false"
    class="alex-picker"
    transition="scale-transition"
    offset-y
    min-width="auto"
    location="top start"
  >
    <template #activator="{ props: propsMenu }">
      <alex-inputs-text-field
        v-bind="propsMenu"
        v-model:model-value="inputValue"
        :required="required"
        :label="label"
        :class="{ 'no-value': !inputValue }"
        :name="name"
        class="alex-date-input w-100"
        density="compact"
        type="date"
        hide-details
        append-inner-icon="mdi-calendar"
      />
    </template>
    <v-date-picker
      v-model:model-value="value"
      color="secondary-0"
      rounded="lg"
      location="bottom start"
    />
  </v-menu>
</template>

<script setup lang="ts">
interface DatePickerProps {
  modelValue?: Date;
  label?: string;
  required?: boolean;
  name: string;
}
const props = withDefaults(defineProps<DatePickerProps>(), {
  label: undefined,
  modelValue: undefined,
  required: false,
});
const emit = defineEmits(['update:modelValue']);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
const inputValue = computed({
  get() {
    return formatDate(props.modelValue);
  },
  set(value) {
    emit('update:modelValue', formatDate(value));
  },
});

const formatDate = (date?: Date | string) => {
  if (!date) return undefined;
  return new Date(date).toISOString().substring(0, 10);
};
</script>

<style>
.alex-date-input input[type='date']::-webkit-calendar-picker-indicator {
  pointer-events: none !important;
  background: transparent !important;
  bottom: 0 !important;
  color: transparent !important;
  cursor: pointer !important;
  height: auto !important;
  left: 0 !important;
  position: absolute !important;
  right: 0 !important;
  top: 0 !important;
  width: auto !important;
}
.v-date-picker-month__day > .v-btn {
  border-radius: 8px !important;
  width: 36px !important;
  height: 36px !important;
}
.alex-date-input.no-value input[type='date'] {
  color: rgb(var(--v-theme-gray-300)) !important;
}
</style>
