<template>
  <v-menu :disabled="!edit">
    <template #activator="{ props }">
      <p
        v-bind="props"
        class="pa-1 text-body-3 text-gray-800 rounded-md"
        :class="edit ? 'output cursor-pointer' : ''"
      >
        {{ curr }}
      </p>
    </template>

    <v-list>
      <v-list-item v-for="(item, index) in items" :key="index" :value="item">
        <v-list-item-title @click="curr = item">{{ item }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
interface CompProps {
  items: string[];
  edit?: boolean;
}

const props = defineProps<CompProps>();

const curr = ref<string>(props?.items[0] || '');
</script>

<style scoped>
.output:hover {
  --v-theme-overlay-multiplier: var(--v-theme-gray-blue-overlay-multiplier);
  background-color: rgb(var(--v-theme-gray-blue)) !important;
  transition: 0.3s;
}
</style>
