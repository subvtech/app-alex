<template>
  <section>
    <alex-learningplan-task-header
      :title="task.title"
      :tags="task.tags"
      :description="task.description"
      :deadline-at="task.deadline_at"
      :start-at="task.start_at"
      :status="task.status"
    />
    <alex-learningplan-task-kanban
      v-model="tasks"
      type="professor"
      :columns="[
        {
          title: 'A fazer',
          color: 'gray',
          group: 'to_do',
          accept: null,
        },
        {
          title: 'Em progresso',
          color: 'blue',
          group: 'in_progress',
          accept: ['to_do', 'in_progress', 'in_review', 'done'],
        },
        {
          title: 'Em avaliação',
          color: 'orange',
          group: 'in_review',
          accept: ['to_do', 'in_progress', 'in_review', 'done'],
        },
        {
          title: 'Concluído',
          color: 'green',
          group: 'done',
          accept: ['to_do', 'in_progress', 'in_review', 'done'],
        },
      ]"
      @insert-card="changeStatusTask"
    />
  </section>
</template>

<script setup lang="ts">
import { Task } from '~/components/alex/learningplan/task/kanban/index.vue';
definePageMeta({
  hideLearningPlanBanner: true,
});
const changeStatusTask = async (
  _newIndex: number,
  value: Task,
  _group: string,
) => {
  const success = await new Promise((resolve) =>
    setTimeout(() => resolve(false), 2000),
  );
  if (!success) {
    tasks.value = tasks.value.map((task) => {
      if (task.id === value.id) {
        return { ...task, status: value.status };
      }
      return task;
    });
  }
};
// Caminho até a página (Acima do header)
const tasks = ref([
  {
    id: 1,
    status: 'to_do',
    date: new Date(),
    mark: 1,
    maxMark: 10,
    studentClass: 'turma A',
    user: { name: 'test1' },
  },
  {
    id: 2,
    status: 'to_do',
    date: new Date(),
    mark: 1,
    maxMark: 10,
    studentClass: 'turma A',
    user: { name: 'test2' },
  },
]);
const learningPlanStore = useLearningPlanStore();
const i18n = useI18n();
const headerStore = usePageHeaderStore();
onBeforeMount(() => (headerStore.showHeader = true));
watch(
  () => learningPlanStore.loading,
  () => {
    if (!learningPlanStore.loading) {
      headerStore.title = i18n.t('pages.classes.breadcrumbs.myCourses');
      headerStore.items = [
        {
          title: i18n.t('pages.classes.breadcrumbs.home'),
          to: '/',
          disabled: true,
        },
        {
          title: i18n.t('pages.classes.breadcrumbs.myCourses'),
          to: '/courses/me',
          disabled: false,
        },
        {
          title: learningPlanStore.learningPlan?.title || '',
          to: `/courses/${learningPlanStore.learningPlan?.id}`,
          disabled: false,
        },
        {
          title: `${task.title}`,
          to: `/courses/${learningPlanStore.learningPlan?.id}/tasks/${task.id}`,
          disabled: false,
        },
      ];
    }
  },
);

// Task de exemplo
const task = {
  id: 1,
  title: 'Título do rascunho',
  status: 'published',
  description: `A sinergia cósmica transcende a compreensão humana, erguendo-se como o
          néctar da existência primordial. Navegar pelas correntes do infinito é
          como dançar com os ventos etéreos da consciência, num êxtase
          transcendental. A sinergia cósmica transcende a compreensão humana,
          erguendo-se como o néctar da existência primordial. Navegar pelas
          correntes do infinito é como dançar com os ventos etéreos da
          consciência, num êxtase transcendental. A sinergia cósmica transcende
          a compreensão humana, erguendo-se como o néctar da existência
          primordial. Navegar pelas correntes do infinito é como dançar com os
          ventos etéreos da consciência, num êxtase transcendental. A sinergia
          cósmica transcende a compreensão humana, erguendo-se como o néctar da
          existência primordial. Navegar pelas correntes do infinito é como
          dançar com os ventos etéreos da consciência, num êxtase
          transcendental.`,
  tags: ['Desenvolvimento', 'UI/UX'],
  start_at: new Date(),
  deadline_at: new Date(),
};
</script>

<style scoped></style>
