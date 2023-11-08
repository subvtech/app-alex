<template>
  <v-expansion-panels variant="accordion" role="list">
    <transition-group name="list">
      <v-expansion-panel
        v-for="(item, index) in list"
        :key="item.id"
        role="listItem"
        :class="over == index && dragging && dragFrom != item ? 'over' : ''"
        @dragover="(e) => onDragOver(index, e)"
        @dragend="() => finishDrag(item, index)"
        @dragenter="(e) => e.preventDefault()"
      >
        <v-expansion-panel-title class="expand-panel">
          <v-icon
            data-testid="dragItem"
            class="drag-icon"
            icon="mdi-drag"
            color="gray-300"
            draggable="true"
            @dragstart="(e) => startDrag(item, e)"
          />
          <v-icon
            v-if="item.icon"
            class="ml-3 mr-2 icon-border"
            color="gray-500"
            :icon="item.icon"
          />
          <p v-else class="text-gray-300 ml-2 mr-1 font-weight-bold">
            {{ index + 1 }}.
          </p>

          <span
            class="text-body-3 text-gray-600 text-overflow"
            data-testid="text"
          >
            <strong class="text-accent">
              {{ item.keyWord }}
            </strong>
            {{ item.title }}
          </span>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteItem(index)">
            <v-icon
              size="24px"
              icon="mdi-trash-can-outline"
              color="tag-red-light"
            />
          </v-btn>
        </v-expansion-panel-title>
        <v-expansion-panel-text class="bg-white rounded">
          <slot
            name="content"
            v-bind="{
              ...item.contentData,
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
const over = ref(-1);
const dragFrom = ref({});
const dragging = ref(false);
const id = ref(0);

const { data } = defineProps({
  data: {
    type: Array as PropType<
      {
        title?: string;
        keyWord?: string;
        icon?: string;
        contentData?: object;
        id?: number;
      }[]
    >,
    default: () => [],
  },
});

const list = ref();
list.value = data;
watch(data, () => {
  list.value.map((item) => {
    if (!item.id) item.id = id.value += 1;
    return item;
  });
});

onBeforeMount(() => {
  list.value.map((item) => {
    if (!item.id) item.id = id.value += 1;
    return item;
  });
});

const startDrag = (slide, e) => {
  const dragGhost = e.target.closest('.expand-panel');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', slide);
  dragging.value = true;
  dragFrom.value = slide;
  e.dataTransfer.setDragImage(dragGhost, 10, 10);
};

const finishDrag = (slide, pos) => {
  if (over.value < 0 || pos < 0) return;
  list.value.splice(pos, 1);
  list.value.splice(over.value, 0, slide);
  over.value = -1;
  dragging.value = false;
};

const onDragOver = (pos, e) => {
  over.value = pos;
  e.dataTransfer.dropEffect = 'move';
  e.preventDefault();
};

const deleteItem = (pos) => {
  list.value.splice(pos, 1);
};
</script>

<style>
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

.drag-icon {
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
  transition: all 0.2s ease;
}

.v-expansion-panel-title--active {
  background-color: #f1f5f9 !important;
}

.v-expansion-panel-title:hover {
  background-color: #ebedef !important;
}

.v-expansion-panel-title__overlay {
  display: none;
}
</style>
