<template>
  <alex-custom-dropdown :disabled="!edit" :items="items || []">
    <template #activator="{ props: dropdownProps }"
      ><p
        v-bind="dropdownProps"
        class="py-1 text-body-3 tw-rounded-md"
        :class="[
          !edit && 'tw-select-none',
          edit && 'px-1 output tw-cursor-pointer',
          !model && !emptyValue && 'text-gray-400',
          model && 'text-gray-800',
        ]"
      >
        {{ title }}
      </p>
    </template>
  </alex-custom-dropdown>
</template>

<script setup lang="ts" generic="T extends { title: string }">
import { AlexDropdownItem } from '~/components/alex/custom/Dropdown.vue';

interface CompProps {
  items?: AlexDropdownItem[];
  edit?: boolean;
  placeholder: string;
  emptyValue?: string;
  itemTitle?: string;
}

const props = defineProps<CompProps>();

const model = defineModel<T | null>({ default: null });
const title = computed(() => {
  if (props.itemTitle && model.value) {
    return model.value[props.itemTitle];
  }
  if (props.emptyValue) {
    return props.emptyValue;
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
