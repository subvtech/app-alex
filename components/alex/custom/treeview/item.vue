<template>
  <div class="tree-item">
    <div
      v-if="hasChildren"
      class="item-content"
      :class="nodeClasses"
      @click="toggle"
    >
      <v-icon color="gray-600">{{ !isOpen ? openIcon : closeIcon }}</v-icon>
      {{ item.name }}
    </div>
    <div v-else class="item-content" :class="leafClasses">
      <slot v-if="customSlot" name="default" :item="item"></slot>
      <div v-else>{{ item.name }}</div>
    </div>
    <component :is="transitionComponent">
      <div v-if="isOpen && hasChildren" class="item-children">
        <alex-custom-treeview-item
          v-for="child in children"
          :key="child.id"
          :item="child"
          v-bind="childProps"
        >
          <template #default="slotProps">
            <slot
              v-if="customSlot"
              name="default"
              :item="slotProps.item"
            ></slot>
            <div v-else>{{ slotProps.item.name }}</div>
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
  defaultExpand: boolean;
}
const props = withDefaults(defineProps<TreeItemProps>(), {
  openIcon: 'mdi-chevron-down',
  closeIcon: 'mdi-chevron-right',
  leafClasses: '',
  nodeClasses: '',
  transitionComponent: 'v-slide-x-transition',
  customSlot: false,
  defaultExpand: false,
});

const childProps = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { item, ...rest } = props;
  return rest;
});

const isOpen = ref(props.defaultExpand);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const hasChildren = computed(() => {
  if (props.item.children && Array.isArray(props.item.children)) {
    return props.item.children.length > 0;
  }
  const arrayProps = Object.keys(props.item).filter((key) =>
    Array.isArray(props.item[key]),
  );
  if (arrayProps.length > 1) {
    throw new Error(
      `Item ${
        props.item.name || props.item.id
      } has multiple array properties: ${arrayProps.join(', ')}`,
    );
  }
  return arrayProps.length === 1;
});

const children = computed(() => {
  if (props.item.children && Array.isArray(props.item.children)) {
    return props.item.children;
  }
  const arrayProp = Object.keys(props.item).find((key) =>
    Array.isArray(props.item[key]),
  );
  return arrayProp ? props.item[arrayProp] : [];
});
</script>

<style scoped>
.tree-item {
  margin-left: 20px;
}

.item-content {
  cursor: pointer;
  padding: 5px 0;
}

.toggle-icon {
  display: inline-block;
  width: 20px;
}

.item-children {
  margin-left: 20px;
}
</style>
