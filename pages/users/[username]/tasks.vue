<template>
  <alex-custom-card title="Tarefas" />
</template>
<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});
</script>
