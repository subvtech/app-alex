<template>
  <div class="custom-treeview">
    <tree-item
      v-for="item in items"
      :key="item.id"
      :item="item"
      :node-classes="nodeClasses"
      :leaf-classes="leafClasses"
      :open-icon="openIcon"
      :close-icon="closeIcon"
      :transition-component="transition"
      :custom-slot="customSlot"
      :default-expand="defaultExpand"
    >
      <template #default="{ item, level }">
        <slot :item="item" :level="level"></slot>
      </template>
    </tree-item>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import TreeItem from './item.vue';

interface TreeViewProps {
  items: Array<any>;
  nodeClasses?: string;
  leafClasses?: string;
  openIcon?: string;
  closeIcon?: string;
  /**
   * As transições podem ser customizadas usando o componente de transição do Vuetify
   * por exemplo: v-slide-y-transition
   * @see https://vuetifyjs.com/en/styles/transitions/#api
   */
  transition?: string;
  customSlot?: boolean;
  defaultExpand?: boolean;
}

withDefaults(defineProps<TreeViewProps>(), {
  nodeClasses: '',
  leafClasses: '',
  openIcon: 'mdi-chevron-right',
  closeIcon: 'mdi-chevron-down',
  transition: 'v-slide-x-transition',
  defaultExpand: false,
});
</script>
