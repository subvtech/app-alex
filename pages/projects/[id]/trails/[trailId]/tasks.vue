<template>
  <v-container fluid class="bg-white rounded">
    <div v-if="trailStore.loading" class="pa-12">
      <alex-custom-skeleton color="gray-300" class="w-100 height-96" />
    </div>
    <div v-else class="d-flex height-100 pa-6 align-center justify-center rounded text-gray-600">
      <span class="text-h4 text-gray-800">{{ $t('components.trails.tasks.empty') }}</span>
    </div></v-container
  >
</template>
<script setup lang="ts">
const trailStore = useTrailStore();
useHeaderTrails('tasks', 'components.trails.header.secondTab');
</script>
<style scoped lang="scss"></style>
