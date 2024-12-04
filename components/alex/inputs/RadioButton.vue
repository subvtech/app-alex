<template>
  <v-radio-group color="accent" class="alex-radio-button">
    <div v-for="button in buttons" :key="button.value" class="d-flex flex-column" role="button-radio">
      <v-radio
        class="text-body-1 radio"
        :class="button.disabled ? 'text-gray-400' : 'text-gray-800 '"
        :label="button.label"
        :value="button.value"
        :hint="button.hint"
        :disabled="button.disabled"
        v-bind="button.props"
        density="default"
      >
      </v-radio>
      <p :class="button.disabled ? 'text-gray-400' : 'text-gray-600 '" class="ml-11 text-body-3">
        {{ button.hint }}
      </p>
    </div>
  </v-radio-group>
</template>

<script setup lang="ts">
defineProps({
  buttons: {
    type: Array as PropType<
      {
        label: string;
        value: string;
        hint?: string;
        disabled?: boolean;
        props?: object;
      }[]
    >,
    default: () => [],
  },
});
</script>

<style>
.alex-radio-button {
  .v-selection-control__wrapper,
  .v-selection-control__input {
    height: 28px !important;
    width: 28px !important;
    margin: 0 8px !important;
  }

  .radio .v-label,
  .v-selection-control--disabled {
    opacity: 1 !important;
  }
}
</style>
