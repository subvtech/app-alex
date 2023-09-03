<template>
  <div class="d-flex gap-2">
    <v-icon :icon="icon" class="icon-card" size="x-large" color="gray-700" />
    <v-item-group>
      <div class="text-card font-weight-bold text-gray-700">{{ title }}</div>
      <div class="pa-0 text-card text-gray-700">{{ subtitle }}</div>
    </v-item-group>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle: string | number; icon: string }>();
</script>

<style scoped>
.text-card {
  font-size: 14px;
  line-height: 18px;
}
.icon-card {
  outline: 2px solid #abb2b9;
  border-radius: 8px;
}
</style>
