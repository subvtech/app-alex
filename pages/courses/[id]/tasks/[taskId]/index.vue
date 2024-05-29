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
      :columns="[
        {
          title: 'A fazer',
          color: 'gray',
          group: 'to_do',
          accept: ['to_do', 'in_progress', 'in_review', 'done'],
        },
        {
          title: 'A fazer',
          color: 'blue',
          group: 'in_progress',
          accept: ['to_do', 'in_progress', 'in_review', 'done'],
        },
        {
          title: 'A fazer',
          color: 'orange',
          group: 'in_review',
          accept: ['to_do', 'in_progress', 'in_review', 'done'],
        },
        {
          title: 'A fazer',
          color: 'green',
          group: 'done',
          accept: ['to_do', 'in_progress', 'in_review', 'done'],
        },
      ]"
      :tasks="[
        {
          id: 1,
          status: 'to_do',
          date: new Date(),
          studentClass: 'Classe c',
          user: {
            name: 'Jorge',
          },
          mark: 1,
          maxMark: 10,
        },
        {
          id: 2,
          status: 'to_do',
          date: new Date(),
          studentClass: 'Classe c',
          user: {
            name: 'Jorge',
          },
          mark: 1,
          maxMark: 10,
        },
        {
          id: 3,
          status: 'to_do',
          date: new Date(),
          studentClass: 'Classe c',
          user: {
            name: 'Jorge',
          },
          mark: 1,
          maxMark: 10,
        },
        {
          id: 4,
          status: 'to_do',
          date: new Date(),
          studentClass: 'Classe c',
          user: {
            name: 'Jorge',
          },
          mark: 1,
          maxMark: 10,
        },
        {
          id: 5,
          status: 'to_do',
          date: new Date(),
          studentClass: 'Classe c',
          user: {
            name: 'Jorge',
          },
          mark: 1,
          maxMark: 10,
        },
        {
          id: 6,
          status: 'to_do',
          date: new Date(),
          studentClass: 'Classe c',
          user: {
            name: 'Jorge',
          },
          mark: 1,
          maxMark: 10,
        },
        {
          id: 7,
          status: 'to_do',
          date: new Date(),
          studentClass: 'Classe c',
          user: {
            name: 'Jorge',
          },
          mark: 1,
          maxMark: 10,
        },
        {
          id: 8,
          status: 'to_do',
          date: new Date(),
          studentClass: 'Classe c',
          user: {
            name: 'Jorge',
          },
          mark: 1,
          maxMark: 10,
        },
        {
          id: 9,
          status: 'to_do',
          date: new Date(),
          studentClass: 'Classe c',
          user: {
            name: 'Jorge',
          },
          mark: 1,
          maxMark: 10,
        },
        {
          id: 10,
          status: 'to_do',
          date: new Date(),
          studentClass: 'Classe c',
          user: {
            name: 'Jorge',
          },
          mark: 1,
          maxMark: 10,
        },
        {
          id: 11,
          status: 'to_do',
          date: new Date(),
          studentClass: 'Classe c',
          user: {
            name: 'Jorge',
          },
          mark: 1,
          maxMark: 10,
        },
        {
          id: 12,
          status: 'to_do',
          date: new Date(),
          studentClass: 'Classe c',
          user: {
            name: 'Jorge',
          },
          mark: 1,
          maxMark: 10,
        },
        {
          id: 13,
          status: 'to_do',
          date: new Date(),
          studentClass: 'Classe c',
          user: {
            name: 'Jorge',
          },
          mark: 1,
          maxMark: 10,
        },
      ]"
    />
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  hideLearningPlanBanner: true,
});

// Caminho até a página (Acima do header)
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
