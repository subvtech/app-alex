<template>
    <v-menu
      v-model="menuOpen"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      :dark="isDarkMode"
      role="dropdown"
    >
      <template #activator="{ props: propsActivator, on }">
        <alex-custom-button
          v-if="!hasActivatorSlot"
          v-bind="propsActivator"
          icon="mdi-dots-vertical"
          :variant="props.variant"
          :size="props.buttonSize"
          v-on="on"
        />
        <slot
          v-else
          name="activator"
          :props="propsActivator"
          :is-active="menuOpen"
        />
      </template>
  
      <v-list
        data-testid="dropdown-content"
        class="pa-0 py-2 rounded-lg my-2"
        :class="{ 'bg-primary-2': isDarkMode, 'bg-white': !isDarkMode }"
      >
        <slot name="items" />
      </v-list>
    </v-menu>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, useSlots } from 'vue';
  import { ButtonProps } from '@/components/alex/custom/Button.vue';
  
  interface DropdownProps {
    theme?: 'light' | 'dark';
    variant?: ButtonProps['variant'];
    buttonSize?: ButtonProps['size'];
  }
  
  const props = withDefaults(defineProps<DropdownProps>(), {
    theme: 'light',
    variant: 'primary',
    buttonSize: 'default',
  });
  
  const slots = useSlots();
  const isDarkMode = computed(() => props.theme === 'dark');
  const hasActivatorSlot = computed(() => !!slots.activator);
  const menuOpen = ref(false);
  </script>
  
  <style scoped lang="scss">
  .hidden {
    visibility: hidden !important;
  }
  </style>