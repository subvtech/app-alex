<template>
    <alex-custom-card title="Tarefas" :show-icon="false" />
  </template>
  <script setup lang="ts">
  definePageMeta({
    middleware: 'auth',
  });
  </script>
  