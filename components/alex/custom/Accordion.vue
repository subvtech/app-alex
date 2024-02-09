<template>
  <v-expansion-panels variant="accordion" role="list" class="alex-accordion">
    <transition-group name="list">
      <v-expansion-panel
        v-for="(item, index) in list"
        :key="item.id"
        role="listItem"
        :class="over == index && dragging && dragFrom != item ? 'over' : ''"
        @dragover="(e) => onDragOver(index, e)"
        @dragend="
          () => {
            finishDrag(item, index, list);
            emit('dragged:item', index);
          }
        "
        @dragenter="(e) => e.preventDefault()"
      >
        <v-expansion-panel-title class="expand-panel">
          <div
            class="drag-icon"
            data-testid="dragItem"
            draggable="true"
            @dragstart="
              (e) => {
                startDrag(item, e, '.expand-panel');
              }
            "
          >
            <v-icon
              class="drag-icon-size"
              src="@assets/svg/DragIndicator.svg"
              icon="alex:DragIndicator"
              color="gray-300"
            />
          </div>
          <p
            v-if="item.position || (showPositions && item.position !== false)"
            class="text-gray-300 ml-2 mr-1 font-weight-bold"
          >
            {{ index + 1 }}.
          </p>
          <div v-if="item.icon" class="mr-2 icon-border">
            <img v-if="item.icon.includes('.')" :src="item.icon" />
            <v-icon v-else color="gray-500" :icon="item.icon" />
          </div>

          <span
            class="text-body-3 text-gray-600 text-overflow"
            data-testid="text"
          >
            <strong :class="item.errorKeyWord ? 'error' : 'text-accent'">
              {{ item.keyWord }}
            </strong>
            <span :class="item.errorTitle ? 'error' : ''">{{
              ' ' + item.title
            }}</span>
          </span>
          <v-spacer />
          <v-btn
            class="mx-4 delete-btn"
            variant="text"
            size="36px"
            color="transparent"
            @click="deleteItem(index)"
          >
            <v-icon size="24px" :icon="icon" :color="iconColor" />
          </v-btn>
        </v-expansion-panel-title>
        <v-expansion-panel-text class="bg-white rounded">
          <slot
            name="content"
            v-bind="{
              ...(item.contentData as any),
              index,
            }"
          ></slot>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </transition-group>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDragDrop } from '@/composables/useDragDrop';

export interface AccordionItemType {
  title?: string;
  keyWord?: string;
  icon?: string;
  contentData?: { [key: string]: any };
  id?: number;
  position?: boolean;
  errorKeyWord?: boolean;
  errorTitle?: boolean;
}

export interface AccordionComponentType {
  data?: AccordionItemType[];
  showPositions?: boolean;
  icon?: string;
  iconColor?: string;
}

const props = withDefaults(defineProps<AccordionComponentType>(), {
  data: () => [],
  showPositions: false,
  icon: 'mdi-trash-can-outline',
  iconColor: 'tag-red-light',
});

const emit = defineEmits(['deleted:item', 'dragged:item', 'update:data']);
const { data } = toRefs(props);
const id = ref(0);

const list = ref(props.data);

watch(data, () => {
  list.value.map((item) => {
    if (!item.id) item.id = id.value += 1;
    return item;
  });
});

watch(
  list,
  () => {
    emit('update:data', list.value);
  },
  { deep: true },
);

onBeforeMount(() => {
  list.value.map((item) => {
    if (!item.id) item.id = id.value += 1;
    return item;
  });
});

const deleteItem = (pos) => {
  emit('deleted:item', list.value[pos]);
  list.value.splice(pos, 1);
};

const { over, dragFrom, dragging, startDrag, finishDrag, onDragOver } =
  useDragDrop();
</script>

<style>
.alex-accordion .error {
  color: red !important;
}
.v-theme--mainTheme {
  --v-border-opacity: unset !important;
}
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.over {
  background-color: #ebedef !important;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(40px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.drag-icon-size {
  min-width: 16px !important;
  height: 16px;
  width: 16px;
}

.drag-icon {
  width: 16px !important;
  height: 16px !important;
  position: absolute;
  left: 4px;
  cursor: grab;
  transition: 0.3s ease;
  &:hover {
    cursor: grab !important;
  }
  &:active {
    cursor: grabbing !important;
  }
}
.icon-border {
  display: flex;
  min-width: 36px;
  min-height: 36px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: 1px solid #d2d6da;
}

.v-expansion-panel-title {
  transition: all 0.3s ease;
  height: 52px !important;
}

.v-expansion-panel-title--active {
  background-color: #f1f5f9 !important;
  height: 60px !important;
  min-height: 60px !important;
}

.v-expansion-panel-title:hover:not(:has(.delete-btn:hover)) {
  background-color: #ebedef !important;
}

.v-expansion-panel-title__overlay {
  display: none;
}

.delete-btn {
  transition: all 0.3s ease;
  &:hover {
    background-color: #ebedef !important;
  }
  &:active {
    background-color: #d2d6da !important;
  }
}
</style>
