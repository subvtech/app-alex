<template>
  <div>
    <alex-project-dialogs-sprint :model-value="value" />
    <button @click="value = true">Open</button>
  </div>
</template>

<script setup lang="ts">
const value = ref(false);
</script>
