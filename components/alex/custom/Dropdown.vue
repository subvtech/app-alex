<template>
  <v-menu :dark="isDarkMode" role="dropdown">
    <template #activator="{ props: propsActivator, isActive }">
      <alex-custom-button
        v-if="!hasActivatorSlot"
        v-bind="propsActivator"
        icon="mdi-dots-vertical"
      />
      <slot
        v-else
        name="activator"
        :props="propsActivator"
        :is-active="isActive"
      />
    </template>

    <v-list
      data-testid="dropdown-content"
      class="pa-0 py-2 rounded-lg my-2"
      :class="{ 'bg-primary-2': isDarkMode, 'bg-white': !isDarkMode }"
    >
      <alex-custom-list-item
        v-for="({ text, icon, link, warning, onClick }, index) in items"
        :key="index"
        :text="text"
        :icon="icon"
        :link="link"
        :warning="warning"
        :theme="theme"
        @click="onClick"
      />
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { AlexListItem } from '@/components/alex/custom/listItem/index.vue';

export interface AlexDropdownItem extends Omit<AlexListItem, 'theme'> {
  onClick?: () => unknown;
}
interface DropdownProps {
  items: AlexDropdownItem[];
  theme?: 'light' | 'dark';
}

const props = withDefaults(defineProps<DropdownProps>(), {
  theme: 'light',
  warning: false,
});

const slots = useSlots();
const isDarkMode = computed(() => props.theme === 'dark');
const hasActivatorSlot = computed(() => !!slots.activator);
</script>

<style scoped lang="scss">
.hidden {
  visibility: hidden !important;
}
</style>
