<template>
  <alex-custom-card title="Trilhas" :show-icon="false" />
</template>
<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});
</script>
