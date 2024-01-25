<template>
  <alex-custom-card title="Projetos" :show-icon="false" />
</template>
<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});
</script>
