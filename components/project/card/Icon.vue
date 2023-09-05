<template>
  <div class="d-flex gap-2">
    <div class="icon-card">
      <v-icon :icon="icon" size="x-large" color="gray-800" />
    </div>
    <v-item-group>
      <div class="pa-0 text-card text-gray-800 font-weight-bold">
        {{ title }}
      </div>
      <div class="pa-0 text-card text-gray-800">{{ subtitle }}</div>
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
  display: grid;
  width: 35px;
  aspect-ratio: 1;
  place-items: center;
  outline: 2px solid #abb2b9;
  border-radius: 8px;
}
</style>
