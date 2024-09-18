<template>
  <alex-custom-dropdown :disabled="!edit" :items="items || []">
    <template #activator="{ props: dropdownProps }"
      ><p
        v-bind="dropdownProps"
        class="py-1 text-body-3 tw-rounded-md"
        :class="[edit && 'px-1 output tw-cursor-pointer', !model && 'text-gray-400', model && 'text-gray-800']"
      >
        {{ title }}
      </p>
    </template>
  </alex-custom-dropdown>
</template>

<script setup lang="ts">
import { AlexDropdownItem } from '../../custom/Dropdown.vue';

interface CompProps {
  items?: AlexDropdownItem[];
  edit?: boolean;
  placeholder: string;
  config?: Record<string, string>;
}

const props = defineProps<CompProps>();

const model = defineModel<string | null>();
const title = computed(() => {
  if (props.config && model.value) {
    return props.config[model.value];
  }
  if (!model.value) {
    return props.placeholder;
  }
  return model.value;
});
</script>

<style scoped>
.output:hover {
  --v-theme-overlay-multiplier: var(--v-theme-gray-blue-overlay-multiplier);
  background-color: rgb(var(--v-theme-gray-blue)) !important;
  transition: 0.3s;
}
</style>
