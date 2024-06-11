<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'default',
});
</script>

<template>
  <v-row justify="center" align="center">
    <v-col cols="12">Welcome</v-col>
  </v-row>
</template>

<style scoped>
.max-w-200 {
  max-width: 200px;
}
</style>
