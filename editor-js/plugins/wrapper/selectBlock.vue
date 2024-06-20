<template>
  <div class="width-10">
    <v-checkbox
      v-model="check"
      class="input-checkbox"
      color="secondary-0"
      width="18"
      hide-details
      @change="() => onUpdate(check)"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  onUpdate: {
    type: Function,
    default: () => {},
  },
});

const check = ref(props.modelValue);
defineEmits(['update:modelValue']);
</script>

<style>
.v-selection-control__wrapper {
  color: #6e7a87 !important;
}
</style>
