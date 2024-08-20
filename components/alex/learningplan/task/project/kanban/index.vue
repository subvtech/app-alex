<template>
  <div class="tw-mt-8 bg-white tw-rounded-lg tw-relative">
    <!-- Inputs -->
    <div
      class="d-flex tw-align-center pa-3 tw-px-6 ga-3 border-bottom-1 border-gray-100"
    >
      <alex-inputs-text-field
        v-model="search"
        name="student"
        :placeholder="$t('components.courses.tasks.srchStudent')"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        class="tw-w-full tw-mr-auto tw-min-w-40 tw-max-w-80"
        density="comfortable"
      />
      <!-- Deixar filtrar funcional -->
      <v-tooltip text="Filtrar" location="bottom" content-class="bg-gray-800">
        <template #activator="{ props: propsFilter }">
          <alex-custom-button
            v-bind="propsFilter"
            icon="mdi-filter-variant"
            size="large"
            variant="secondary"
          />
        </template>
      </v-tooltip>
    </div>
    <!-- Categorias e seus respectivos alunos -->
    <div
      ref="kanban"
      class="tw-w-full tw-flex tw-gap-4 pa-6 tw-overflow-x-auto tw-overflow-y-hidden"
    ></div>
  </div>
</template>

<script setup lang="ts" generic="T extends 'professor' | 'student'">
import { useMouse } from '@vueuse/core';
// import { Accept } from './column/index.vue';

// type Colors = 'orange' | 'green' | 'blue' | 'gray';
// interface Column {
//   title: string;
//   group: string;
//   color: Colors;
//   accept?: Accept<any> | null;
//   disable?: boolean;
// }
interface KanbanProps {
  type: T;
  classes?: string[];
}

useI18n();
// Models/props
const canDrag = ref(true);
defineProps<KanbanProps>();

const search = ref('');

// Scroll X and Y
const kanban = ref<HTMLDivElement | null>(null);
const { x: mouseX, y: mouseY } = useMouse({ window, type: 'client' });
const moveViewX = () => {
  const isDragging = document.querySelector(
    '.kanban-card-item.kanban-card-dragging',
  );
  if (!kanban.value || !isDragging) return;
  const rect = kanban.value.getBoundingClientRect();
  const x = mouseX.value - rect.left;
  const padding = 20;
  if (x < padding) {
    kanban.value.scrollLeft -= 10;
  }
  if (x > rect.width - padding) {
    kanban.value.scrollLeft += 10;
  }
};
const moveViewY = () => {
  const isDragging = document.querySelector(
    '.kanban-card-item.kanban-card-dragging',
  );
  const html = document.querySelector('html');
  if (!isDragging || !html) return;
  const y = Math.abs(mouseY.value);
  const paddingTop = 0.22;
  const paddingBottom = 0.68;
  if (y < window.innerHeight * paddingTop) {
    html.scrollTop -= 8;
  }
  if (y > window.innerHeight * paddingBottom) {
    html.scrollTop += 8;
  }
};
watch(mouseX, moveViewX);
watch(mouseY, moveViewY);

const setCanDrag = (value: boolean) => {
  canDrag.value = value;
};
defineExpose({
  canDrag,
  setCanDrag,
});
</script>

<style scoped>
.scroll-snap-mandatory {
  scroll-snap-type: x mandatory;
}
</style>
