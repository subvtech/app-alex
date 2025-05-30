<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import RecentTasks from '~/components/dashboard/recentTasks.vue';
import DashboardStatsCard from '~/components/dashboard/statusCard.vue';

definePageMeta({
  middleware: 'auth',
  layout: 'default',
});

const user = useStrapiUser<User>();

const { data: dashboardStats, isLoading: isStatsLoading } = useQuery({
  queryKey: ['dashboard-stats', user.value?.id],
  queryFn: async () => {
    const { find } = useStrapi();
    const res = await find('learning-plan-members', {
      filters: { user: user.value?.id },
      populate: ['learningplan'],
    });

    const now = new Date();

    const allProjectMembers =
      res.data?.filter(
        (member: any) =>
          member.attributes.learningplan.data.attributes.type === 'project' &&
          !member.attributes.learningplan.data.attributes.archived_at,
      ) || [];

    const allCourseMembers =
      res.data?.filter(
        (member: any) =>
          member.attributes.learningplan.data.attributes.type === 'course' &&
          !member.attributes.learningplan.data.attributes.archived_at,
      ) || [];

    const activeProjectMembers = allProjectMembers.filter((member: any) => {
      const endDate = member.attributes.learningplan.data.attributes.end_date
        ? new Date(member.attributes.learningplan.data.attributes.end_date)
        : null;
      return !endDate || endDate >= now;
    });

    const activeCourseMembers = allCourseMembers.filter((member: any) => {
      const endDate = member.attributes.learningplan.data.attributes.end_date
        ? new Date(member.attributes.learningplan.data.attributes.end_date)
        : null;
      return !endDate || endDate >= now;
    });

    return {
      projectStats: {
        created: activeProjectMembers.filter((m: any) => m.attributes.role === 'facilitator').length,
        participating: activeProjectMembers.filter((m: any) => m.attributes.role === 'student').length,
        finalized: allProjectMembers.length - activeProjectMembers.length,
        total: allProjectMembers.length,
      },
      courseStats: {
        created: activeCourseMembers.filter((m: any) => m.attributes.role === 'facilitator').length,
        participating: activeCourseMembers.filter((m: any) => m.attributes.role === 'student').length,
        finalized: allCourseMembers.length - activeCourseMembers.length,
        total: allCourseMembers.length,
      },
    };
  },
  enabled: computed(() => !!user.value?.id),
});

const userTasks = ref<TaskSimple[]>([
  {
    id: 1,
    position: 1,
    submission_required: true,
    status: 'to_do',
    title: 'Entregar relatório do projeto',
    organization: 'standard',
    description: 'Faça o upload do relatório final do projeto.',
    type: 'individual',
    tags: [
      { id: 1, name: 'Relatório' },
      { id: 2, name: 'Urgente' },
    ],
    blocks: [],
    start_at: '2024-07-01',
    finish_at: '2024-07-10',
    archived_at: null,
    can_submit_after_deadline: false,
    can_change_from_review: false,
    allowed_editor_plugins: '',
    submission_description: '',
    kanban_column_task: { id: 1, name: 'to_do' },
  },
  {
    id: 2,
    position: 2,
    submission_required: false,
    status: 'in_progress',
    title: 'Participar do fórum de discussão',
    organization: 'standard',
    description: 'Contribua com pelo menos uma mensagem no fórum.',
    type: 'group',
    tags: [{ id: 3, name: 'Discussão' }],
    blocks: [],
    start_at: '2024-07-05',
    finish_at: '2024-07-15',
    archived_at: null,
    can_submit_after_deadline: true,
    can_change_from_review: true,
    allowed_editor_plugins: '',
    submission_description: '',
    kanban_column_task: { id: 2, name: 'in_progress' },
  },
  {
    id: 3,
    position: 3,
    submission_required: true,
    status: 'to_do',
    title: 'Revisar material complementar',
    organization: 'standard',
    description: 'Leia os artigos recomendados para a próxima aula.',
    type: 'individual',
    tags: [{ id: 4, name: 'Leitura' }],
    blocks: [],
    start_at: '2024-07-08',
    finish_at: '2024-07-20',
    archived_at: null,
    can_submit_after_deadline: false,
    can_change_from_review: false,
    allowed_editor_plugins: '',
    submission_description: '',
    kanban_column_task: { id: 3, name: 'to_do' },
  },
  {
    id: 4,
    position: 4,
    submission_required: true,
    status: 'under_review',
    title: 'Revisar material complementar',
    organization: 'standard',
    description: 'Leia os artigos recomendados para a próxima aula.',
    type: 'individual',
    tags: [{ id: 4, name: 'Leitura' }],
    blocks: [],
    start_at: '2024-07-08',
    finish_at: '2024-07-20',
    archived_at: null,
    can_submit_after_deadline: false,
    can_change_from_review: false,
    allowed_editor_plugins: '',
    submission_description: '',
    kanban_column_task: { id: 4, name: 'under_review' },
  },
  {
    id: 5,
    position: 5,
    submission_required: true,
    status: 'done',
    title: 'Revisar material complementar',
    organization: 'standard',
    description: 'Leia os artigos recomendados para a próxima aula.',
    type: 'individual',
    tags: [{ id: 4, name: 'Leitura' }],
    blocks: [],
    start_at: '2024-07-08',
    finish_at: '2024-07-20',
    archived_at: null,
    can_submit_after_deadline: false,
    can_change_from_review: false,
    allowed_editor_plugins: '',
    submission_description: '',
    kanban_column_task: { id: 5, name: 'done' },
  },
]);

const getWelcomeMessage = () => {
  const messages = [
    'Continue sua jornada de aprendizado no Alex.',
    'Pronto para descobrir algo novo hoje?',
    'Vamos continuar de onde você parou?',
    'Seu progresso está esperando por você!',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};
</script>

<template>
  <div class="tw-space-y-6">
    <v-card class="tw-bg-white tw-shadow-lg" rounded="lg" elevation="0">
      <v-card-text class="pa-6">
        <div class="tw-flex tw-items-start tw-justify-between">
          <div class="tw-flex-1">
            <h1 class="text-h3 tw-font-bold tw-mb-3 tw-text-gray-900">
              Bem vindo de volta, <span class="text-secondary-0">{{ user?.fullname || 'Usuário' }}</span>
            </h1>
            <p class="text-subtitle-1 tw-text-gray-600">
              {{ getWelcomeMessage() }}
            </p>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <v-row>
      <v-col cols="12" md="4">
        <div class="tw-flex tw-flex-col tw-gap-4">
          <DashboardStatsCard
            title="Projetos"
            :total="dashboardStats?.projectStats.total || 0"
            :stats="{
              created: dashboardStats?.projectStats.created || 0,
              participating: dashboardStats?.projectStats.participating || 0,
              finalized: dashboardStats?.projectStats.finalized || 0,
            }"
            :is-loading="isStatsLoading"
          />

          <DashboardStatsCard
            title="Cursos"
            :total="dashboardStats?.courseStats.total || 0"
            :stats="{
              created: dashboardStats?.courseStats.created || 0,
              participating: dashboardStats?.courseStats.participating || 0,
              finalized: dashboardStats?.courseStats.finalized || 0,
            }"
            :is-loading="isStatsLoading"
          />
        </div>
      </v-col>

      <v-col cols="12" md="8">
        <v-card class="tw-bg-white tw-shadow-sm tw-h-full" rounded="lg" elevation="0">
          <v-card-text class="pa-6">
            <RecentTasks :tasks="userTasks" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
