<script setup lang="ts">
import { computed } from 'vue';
import type { RecentTask } from '~/models/simple/recentTask.model';

const props = withDefaults(
  defineProps<{
    tasks?: RecentTask[];
    isLoading?: boolean;
  }>(),
  {
    tasks: () => [],
    isLoading: false,
  },
);

const pendingTasks = computed(() => props.tasks.slice(0, 5));

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

const chipColors: Record<string, { color: string; text: string }> = {
  to_do: {
    color: 'secondary',
    text: 'Pendente',
  },
  in_progress: {
    color: 'blue',
    text: 'Em andamento',
  },
  in_review: {
    color: 'orange',
    text: 'Em revisão',
  },
  done: {
    color: 'green',
    text: 'Concluída',
  },
};

const defaultChip = { color: 'secondary', text: 'Pendente' };

const getChip = (status?: string | null) => chipColors[status ?? ''] ?? defaultChip;
</script>

<template>
  <div>
    <div class="tw-mb-4">
      <h2 class="text-h5 tw-font-semibold">Tarefas Pendentes</h2>
    </div>
    <div v-if="isLoading">
      <div v-for="n in 3" :key="n" class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-mb-4 tw-px-6 tw-pt-4 tw-pb-3">
        <v-skeleton-loader type="list-item-two-line" />
      </div>
    </div>
    <div v-else-if="pendingTasks.length">
      <div
        v-for="task in pendingTasks"
        :key="task.id"
        class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-mb-4 tw-px-6 tw-pt-4 tw-pb-3"
      >
        <div class="tw-flex tw-items-start tw-justify-between tw-mb-8">
          <div class="tw-flex tw-items-center tw-gap-4">
            <div :class="`tw-w-1 tw-h-16 tw-rounded-full ${task.status ?? 'to_do'}`"></div>
            <div>
              <div class="tw-font-semibold tw-text-base tw-mb-1">{{ task.title }}</div>
              <div v-if="task.description" class="tw-text-gray-600 tw-text-sm">{{ task.description }}</div>
            </div>
          </div>
          <alex-custom-chip :status="getChip(task.status).color" :text="getChip(task.status).text" />
        </div>
        <div class="tw-flex tw-items-center tw-flex-wrap tw-gap-4 tw-text-xs tw-text-gray-500 tw-mt-2">
          <div class="tw-flex tw-items-center tw-gap-1">
            <v-icon size="16" class="tw-mr-1" color="#BDBDBD">mdi-calendar</v-icon>
            {{ formatDate(task.finish_at) }}
          </div>
          <div v-if="task.parent_name" class="tw-flex tw-items-center tw-gap-1">
            <v-icon size="14" color="#BDBDBD">mdi-book-outline</v-icon>
            <span>{{ task.parent_name }}</span>
          </div>
          <template v-for="tag in task.tags || []" :key="tag.id">
            <div class="tw-flex tw-items-center tw-gap-1">
              <v-icon size="14" color="#BDBDBD">mdi-tag-outline</v-icon>
              <span>{{ tag.text }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div v-else class="tw-text-gray-500 tw-text-center tw-py-8">Nenhuma tarefa pendente no momento.</div>
  </div>
</template>

<style scoped>
.done {
  background-color: rgb(var(--v-theme-success--1));
}
.in_review {
  background-color: rgb(var(--v-theme-warning--1));
}
.in_progress {
  background-color: rgb(var(--v-theme-secondary-1));
}
.to_do {
  background-color: rgb(var(--v-theme-gray-300));
}
</style>
