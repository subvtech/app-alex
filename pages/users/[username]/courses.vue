<template>
  <alex-custom-card title="Cursos" :show-icon="false" />
</template>
<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});
</script>
