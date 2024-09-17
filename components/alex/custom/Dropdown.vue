<template>
  <v-menu :dark="isDarkMode" role="dropdown">
    <template #activator="{ props: propsActivator, isActive }">
      <alex-custom-button
        v-if="!hasActivatorSlot"
        v-bind="propsActivator"
        :icon="icon"
        :variant="props.variant"
        :size="props.buttonSize"
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
import { AlexListItem } from '@/components/alex/custom/list-item/index.vue';
import { ButtonProps } from '@/components/alex/custom/Button.vue';

export interface AlexDropdownItem extends Omit<AlexListItem, 'theme'> {
  onClick?: () => unknown;
}

interface DropdownProps {
  items: AlexDropdownItem[];
  theme?: 'light' | 'dark';
  variant?: ButtonProps['variant'];
  buttonSize?: ButtonProps['size'];
  icon?: string;
}

const props = withDefaults(defineProps<DropdownProps>(), {
  theme: 'light',
  warning: false,
  variant: 'primary',
  buttonSize: 'default',
  icon: 'mdi-dots-vertical',
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
