<template>
  <v-menu>
    <!-- Chip de exibição -->
    <template #activator="{ props }">
      <alex-custom-chip
        v-bind="props"
        :text="config[curr].title"
        :status="config[curr].variant"
        prepend-icon="mdi-chevron-down"
        variant="tonal"
        size="x-small"
        clickable
      />
    </template>

    <!-- Opções -->
    <v-list>
      <v-list-item
        v-for="(data, status) in config"
        :key="status"
        :value="status"
      >
        <v-list-item-title @click="curr = status">{{
          data.title
        }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
const { t } = useI18n();

type TaskStatus = 'draft' | 'published' | 'closed';

interface StateProps {
  title: string;
  variant: 'secondary' | 'blue' | 'red';
}

const config: Record<TaskStatus, StateProps> = {
  draft: {
    title: t('components.learningPlan.drawer.task.status.draft'),
    variant: 'secondary',
  },
  published: {
    title: t('components.learningPlan.drawer.task.status.published'),
    variant: 'blue',
  },
  closed: {
    title: t('components.learningPlan.drawer.task.status.closed'),
    variant: 'red',
  },
};

const curr = ref<TaskStatus>('draft');
</script>
