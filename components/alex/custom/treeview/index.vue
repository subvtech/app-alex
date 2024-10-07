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
      :custom-header="customHeader"
      :default-expand="defaultExpand"
      :selected-node="selectedNode"
      :child-array-name="childArrayName"
    >
      <template #header="{ header }">
        <slot name="header" :header="header" />
      </template>
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
  customHeader?: boolean;
  defaultExpand?: boolean;
  selectedNode?: number;
  childArrayName?: string;
}

withDefaults(defineProps<TreeViewProps>(), {
  nodeClasses: '',
  leafClasses: '',
  openIcon: 'mdi-chevron-right',
  closeIcon: 'mdi-chevron-down',
  transition: 'v-slide-x-transition',
  defaultExpand: false,
  selectedNode: -1,
  childArrayName: '',
});
</script>
