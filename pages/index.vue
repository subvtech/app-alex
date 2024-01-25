<template>
  <v-row justify="center" align="center">
    <v-col cols="12"> Bem vindo ao Alex </v-col>
  </v-row>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'default',
});
</script>

<style scoped lang="scss">
.max-w-200 {
  max-width: 200px;
}
</style>
