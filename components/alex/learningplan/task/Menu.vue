<template>
  <v-menu v-model="open" class="task-menu" :close-on-content-click="false">
    <!-- Exibição -->
    <template #activator="{ props }">
      <slot v-bind="props" name="activate"></slot>
    </template>

    <!-- Opções -->
    <v-list class="list pt-1 rounded-lg">
      <slot name="content"></slot>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
const open = ref<boolean>(false);
</script>

<style scoped>
.task-menu .list {
  width: 320px;
  max-height: 95%;
}
</style>

<style>
.task-menu .v-input__details {
  display: none !important;
}
</style>
