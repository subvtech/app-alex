<template>
  <v-menu :dark="isDarkMode" role="dropdown" @update:model-value="onDropdownVisibilityChange">
    <template #activator="{ props: propsActivator, isActive }">
      <alex-custom-button
        v-if="!hasActivatorSlot"
        v-bind="propsActivator"
        :icon="icon"
        :variant="props.variant"
        :size="props.buttonSize"
      />
      <slot v-else name="activator" :props="propsActivator" :is-active="isActive" />
    </template>

    <v-list
      data-testid="dropdown-content"
      class="pa-0 pb-2 rounded-lg my-2 position-relative minimalist-scrollbar"
      :class="{ 'bg-primary-2': isDarkMode, 'bg-white': !isDarkMode, 'pt-2': !props.showSearch }"
    >
      <div
        v-if="props.showSearch"
        class="px-4 py-2 tw-w-[230px] tw-sticky tw-top-0 tw-left-0 tw-right-0 bg-white"
        style="z-index: 1000"
        @click.stop
      >
        <alex-inputs-text-field
          v-model="search"
          :placeholder="props.searchPlaceholder"
          density="compact"
          hide-details
        />
      </div>
      <alex-custom-list-item
        v-for="({ text, icon, link, warning, onClick, notBold }, index) in filteredItems"
        :key="index"
        :text="text"
        :icon="icon"
        :link="link"
        :warning="warning"
        :theme="theme"
        :not-bold="notBold"
        @click="!onClick ? onItemSelect(index) : onClick?.()"
      />
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import type { ButtonProps } from '@/components/alex/custom/Button.vue';
import type { AlexListItem } from '@/components/alex/custom/list-item/index.vue';

export interface AlexDropdownItem extends Omit<AlexListItem, 'theme'> {
  onClick?: () => unknown;
}

interface DropdownProps {
  items: AlexDropdownItem[];
  theme?: 'light' | 'dark';
  variant?: ButtonProps['variant'];
  buttonSize?: ButtonProps['size'];
  icon?: string;
  notBold?: boolean;
  onItemSelect?: (index: number) => unknown;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

const props = withDefaults(defineProps<DropdownProps>(), {
  theme: 'light',
  warning: false,
  variant: 'primary',
  buttonSize: 'default',
  icon: 'mdi-dots-vertical',
  notBold: false,
  onItemSelect: () => {},
  showSearch: false,
  searchPlaceholder: 'Search',
});

const search = ref('');
const filteredItems = computed(() => {
  return props.items.filter((item) => item.text.toLowerCase().includes(search.value.toLowerCase()));
});
const slots = useSlots();
const isDarkMode = computed(() => props.theme === 'dark');
const hasActivatorSlot = computed(() => !!slots.activator);

const onDropdownVisibilityChange = (isVisible: boolean) => {
  if (isVisible) {
    search.value = '';
  }
};
</script>

<style scoped lang="scss">
.hidden {
  visibility: hidden !important;
}
</style>
