<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'default',
});

const { $trpc } = useNuxtApp();

const hello = await $trpc.hello.useQuery({ text: 'Djalma' });
</script>

<template>
  <v-row justify="center" align="center">
    <v-col cols="12">{{ hello.data.value?.greeting }}</v-col>
  </v-row>
</template>

<style scoped lang="scss">
.max-w-200 {
  max-width: 200px;
}
</style>
