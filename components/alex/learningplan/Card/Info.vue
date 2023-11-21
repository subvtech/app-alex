<template>
  <div class="d-flex gap-2 align-center justify-start width">
    <alex-custom-chip
      size="x-large"
      icon="mdi-account"
      variant="outlined"
      color="primary"
    />
    <div class="d-flex flex-column">
      <h4 class="text-body-4 text-gray-800">{{ title }}</h4>
      <p class="text-body-3 text-gray-600">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{ icon: string; title: string; subtitle: string | number }>(),
  {},
);
</script>

<style scoped>
.width {
  width: fit-content;
}
</style>
