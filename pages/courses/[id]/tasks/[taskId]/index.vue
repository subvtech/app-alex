<template>
  <section>
    <alex-learningplan-task-header
      :title="task.title"
      :tags="task.tags"
      :description="task.description"
      :deadline-at="task.deadline_at"
      :start-at="task.start_at"
      :status="task.status"
      @edit-click="teacherDrawer = true"
    />
    <alex-learningplan-task-kanban
      v-model="tasks"
      type="professor"
      :classes="['turma A']"
      :columns="[
        {
          title: 'A fazer',
          color: 'gray',
          group: 'to_do',
          accept: true,
        },
        {
          title: 'Em progresso',
          color: 'blue',
          group: 'in_progress',
          accept: true,
        },
        {
          title: 'Em avaliação',
          color: 'orange',
          group: 'in_review',
          accept: true,
        },
        {
          title: 'Concluído',
          color: 'green',
          group: 'done',
          accept: true,
        },
      ]"
      @card-click="console.log(true)"
    />
    <alex-learningplan-task-drawer-student
      v-model="studentDrawer"
      :messages="[]"
      :submission="{
        constraints: [],
        description: 'Teste',
        status: 'not_started',
      }"
      :deadline="new Date()"
      send-submission
      :submissions="submissions"
      :task="{ finalDate: new Date(), status: 'to_do' }"
      :student="{ name: 'Jorge santos lima', studentClass: 'Turma A' }"
    />
    <alex-learningplan-task-drawer-teacher
      v-model="teacherDrawer"
      title="Criar um mapa mental sobre o assunto abordado em sala de aula
        previamente e isso é um título muito grande grande grande"
      :messages="[]"
      :editable="true"
      has-submission
      send-after-deadline
    />
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  hideLearningPlanBanner: true,
});
// Caminho até a página (Acima do header)
const tasks = ref([
  {
    id: 1,
    status: 'to_do',
    date: new Date(),
    mark: 1,
    maxMark: 10,
    studentClass: 'turma b',
    user: { name: 'test1' },
  },
  {
    id: 2,
    status: 'done',
    date: new Date('2024/06/03'),
    mark: 1,
    maxMark: 10,
    studentClass: 'turma A',
    user: { name: 'test2' },
  },
]);
const learningPlanStore = useLearningPlanStore();
const i18n = useI18n();
const headerStore = usePageHeaderStore();
const teacherDrawer = ref(false);
const studentDrawer = ref(false);
const submissions: Array<AttachedSubmission> = [
  {
    id: 1,
    status: 'reviewed',
    time: new Date(),
    mark: 9.5,
    maxMark: 10,
    justification: {
      text: 'Amigos, a mobilidade dos capitais internacionais não pode mais se dissociar das formas de ação. A prática cotidiana prova que a crescente influência da mídia oferece uma interessante oportunidade para verificação dos relacionamentos verticais entre as hierarquias. ',
    },
  },
];
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
