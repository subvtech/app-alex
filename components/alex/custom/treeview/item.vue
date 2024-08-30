<template>
  <div>
    <div
      v-if="hasChildren"
      :class="[nodeClasses, `pl-${level * 5}`]"
      @click="toggle"
    >
      <v-icon color="gray-600">{{ !isOpen ? openIcon : closeIcon }}</v-icon>
      {{ item.name }}
    </div>
    <div
      v-else
      :class="leafClasses"
      :style="{ paddingLeft: `${(level + 1) * 20}px` }"
    >
      <slot
        v-if="customSlot"
        name="default"
        :item="item"
        :level="props.level + 1"
      ></slot>
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
          <template #default="{ item, level = props.level }">
            <slot
              v-if="customSlot"
              name="default"
              :item="item"
              :level="level"
            ></slot>
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
  defaultExpand: boolean;
  level: number;
}
const props = withDefaults(defineProps<TreeItemProps>(), {
  openIcon: 'mdi-chevron-down',
  closeIcon: 'mdi-chevron-right',
  leafClasses: '',
  nodeClasses: '',
  transitionComponent: 'v-slide-x-transition',
  customSlot: false,
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
  padding-left: 20px;
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
  padding-left: 20px;
}
</style>
