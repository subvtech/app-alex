<template>
  <v-radio-group color="accent">
    <div
      v-for="button in buttons"
      :key="button.value"
      class="d-flex flex-column"
      role="button-radio"
    >
      <v-radio
        class="text-body-1 text-gray-800 radio"
        :label="button.label"
        :value="button.value"
        :hint="button.hint"
        :disabled="button.disabled"
        v-bind="button.props"
      >
      </v-radio>
      <p
        :class="
          button.disabled && button.disabled === true
            ? 'text-gray-400 '
            : 'text-gray-600 '
        "
        class="ml-10 mt-1 text-body-3"
      >
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
.v-selection-control__wrapper,
.v-selection-control__input {
  height: 24px !important;
}

.radio .v-label {
  opacity: 1 !important;
}
</style>
