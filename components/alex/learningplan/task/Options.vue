<template>
  <alex-custom-dropdown :disabled="!edit" :items="items">
    <template #activator="{ props }"
      ><p
        v-bind="props"
        class="pa-1 text-body-3 text-gray-800 rounded-md"
        :class="edit && 'output cursor-pointer'"
      >
        {{ model }}
      </p>
    </template>
  </alex-custom-dropdown>
</template>

<script setup lang="ts">
import { AlexDropdownItem } from '../../custom/Dropdown.vue';

interface CompProps {
  items: AlexDropdownItem[];
  edit?: boolean;
}

defineProps<CompProps>();

const model = defineModel<string>({ required: true });
</script>

<style scoped>
.output:hover {
  --v-theme-overlay-multiplier: var(--v-theme-gray-blue-overlay-multiplier);
  background-color: rgb(var(--v-theme-gray-blue)) !important;
  transition: 0.3s;
}
</style>
