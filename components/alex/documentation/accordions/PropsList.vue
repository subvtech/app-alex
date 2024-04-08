<template>
  <v-data-table
    v-model:expanded="expanded"
    class="row-pointer"
    variant="outline"
    :headers="headers"
    :items="dataWithIndex"
    item-value="name"
    show-expand
    no-data-text="No data"
    fixed-header
    :height="300"
  >
    <template #top>
      <v-toolbar flat color="gray-blue">
        <v-toolbar-title>
          <p class="text-h5 text-center">
            {{ componentTitle }}
          </p></v-toolbar-title
        >
      </v-toolbar>
    </template>
    <template #item="{ item, props: itemProps, isExpanded }">
      <tr
        class="w-100 tr-hover"
        :class="[isExpanded(itemProps.item) ? 'bg-gray-blue' : '']"
        @click="
          () => {
            expanded = isExpanded(itemProps.item) ? [] : [item.name];
          }
        "
      >
        <td v-if="showPositions" class="text-warning-1">{{ item.index }}</td>
        <td>{{ item.name }}</td>
        <td class="text-success-1">{{ item.type }}</td>

        <td v-if="item.required !== undefined && !listEmits" class="w-110">
          <v-icon v-if="item.required" class="pointer" color="success-1"
            >mdi-checkbox-marked</v-icon
          >
          <v-icon v-else color="error-1">mdi-close-box</v-icon>
        </td>
        <td v-if="!listEmits">{{ item.default ?? '' }}</td>
        <td>
          <alex-documentation-buttons-tooltip
            :icon="
              isExpanded(itemProps.item) ? 'mdi-chevron-up' : 'mdi-chevron-down'
            "
            variant="text"
            rounded
          />
        </td>
      </tr>
    </template>
    <template #expanded-row="{ columns, item }">
      <tr class="bg-gray-100 rounded">
        <td :colspan="columns.length">{{ item.description }}</td>
      </tr>
    </template>
    <template #bottom />
  </v-data-table>
</template>

<script setup lang="ts">
export interface PropItemType {
  name: string;
  required?: boolean;
  description: string;
  default?: string;
  index?: number;
  type: 'number' | 'string' | 'boolean' | 'array' | 'object' | string;
}

export interface PropsListComponentType {
  title: string;
  data: PropItemType[];
  showPositions?: boolean;
  listEmits?: boolean;
}
const props = withDefaults(defineProps<PropsListComponentType>(), {
  title: 'Component Props',
  showPositions: false,
  listEmits: false,
});

const { title, listEmits } = toRefs(props);

const componentTitle = computed(() =>
  listEmits.value && title.value.toLowerCase() === 'component props'
    ? 'Component Events'
    : title.value,
);

const expanded = ref<string[]>([]);
const headers = computed(() => {
  const indexCol = props.showPositions
    ? [{ title: 'Index', key: 'index' }]
    : [];
  const propCols = props.listEmits
    ? []
    : [
        { title: 'Required', key: 'required' },
        { title: 'Default', key: 'default' },
      ];

  return [
    ...indexCol,
    { title: 'Name', key: 'name' },
    { title: 'Type', key: 'type' },
    ...propCols,
  ];
});
const dataWithIndex = computed(() =>
  props.showPositions
    ? props.data.map((item, index) => ({ index: index + 1, ...item }))
    : props.data,
);
</script>
<style scoped lang="scss">
.pointer {
  cursor: pointer;
}
.tr-hover {
  cursor: pointer;
  &:hover {
    background-color: rgb(var(--v-theme-gray-blue)) !important;
  }
}
</style>
