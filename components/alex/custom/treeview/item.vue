<template>
  <div>
    <div
      v-if="hasChildren"
      :class="[nodeClasses, `pl-${level * 5}`, selectedNode === item.id ? 'bg-gray-100' : 'bg-white']"
      class="d-flex align-center item-content"
    >
      <v-icon class="cursor-pointer toggle-icon" color="gray-600" @click="toggle">{{
        !isOpen ? openIcon : closeIcon
      }}</v-icon>
      <slot v-if="customHeader" name="header" :header="item"></slot>
      <span v-else>{{ item.name }}</span>
    </div>
    <div
      v-else
      :class="[leafClasses, selectedNode === item.id ? 'bg-gray-100' : 'bg-white']"
      :style="{ paddingLeft: itemPadding }"
    >
      <slot v-if="customSlot" name="default" :item="item" :level="level === 1 ? 0 : level + 1"></slot>
      <div v-else>{{ item.name }}</div>
    </div>
    <component :is="transitionComponent">
      <div v-if="isOpen && hasChildren">
        <alex-custom-treeview-item
          v-for="child in children"
          :key="child.id"
          :item="child"
          :level="level + 1"
          v-bind="childProps"
        >
          <template #header="{ header = child }">
            <slot name="header" :header="header" />
          </template>
          <template #default="{ item, level = props.level }">
            <slot v-if="customSlot" name="default" :item="item" :level="level"></slot>
            <div v-else>
              {{ item.title }}
            </div>
          </template>
        </alex-custom-treeview-item>
      </div>
    </component>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface TreeItemProps {
  item: any;
  openIcon: string;
  closeIcon: string;
  leafClasses: string;
  nodeClasses: string;
  transitionComponent: string;
  customSlot: boolean;
  customHeader: boolean;
  defaultExpand: boolean;
  selectedNode: number;
  level: number;
  flat?: boolean;
}
const props = withDefaults(defineProps<TreeItemProps>(), {
  openIcon: 'mdi-chevron-down',
  closeIcon: 'mdi-chevron-right',
  leafClasses: '',
  nodeClasses: '',
  transitionComponent: 'v-slide-x-transition',
  customSlot: false,
  customHeader: false,
  defaultExpand: false,
  level: 1,
});

const childProps = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { item, level, ...rest } = props;
  return rest;
});

const isOpen = ref(props.defaultExpand);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const hasChildren = computed(() => {
  if (props.item.children && Array.isArray(props.item.children)) {
    return true;
  }
  const arrayProps = Object.keys(props.item).filter((key) => Array.isArray(props.item[key]));
  if (arrayProps.includes('tags')) {
    return false;
  }
  if (arrayProps.length > 1) {
    throw new Error(`Item ${props.item.name || props.item.id} has multiple array properties: ${arrayProps.join(', ')}`);
  }
  return arrayProps.length === 1;
});

const children = computed(() => {
  if (props.item.children && Array.isArray(props.item.children)) {
    return props.item.children;
  }
  const arrayProp = Object.keys(props.item).find((key) => Array.isArray(props.item[key]));
  return arrayProp ? props.item[arrayProp] : [];
});

const itemPadding = computed(() => {
  if (props.level === 1) {
    return '16px';
  } else if (!props.customSlot) {
    return `${(props.level + 1) * 20}px`;
  }
  return '0';
});
</script>

<style scoped>
.tree-item {
  padding-left: 20px;
}

.item-children {
  padding-left: 20px;
}
</style>
