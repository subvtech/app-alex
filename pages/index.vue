<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import RecentTasks from '~/components/dashboard/recentTasks.vue';
import DashboardStatsCard from '~/components/dashboard/statusCard.vue';
import type { RecentTask } from '~/models/simple/recentTask.model';

definePageMeta({
  middleware: 'auth',
  layout: 'default',
});

const user = useStrapiUser<User>();

// O Strapi trunca em `maxLimit: 100` (config/api.js), entao um unico request nunca
// devolve tudo. Percorre as paginas ate juntar a colecao inteira.
const findAll = async (resource: string, params: Record<string, any>) => {
  const { find } = useStrapi();
  const pageSize = 100;
  const results: any[] = [];
  let page = 1;
  let pageCount = 1;

  do {
    const res: any = await find(resource, { ...params, pagination: { page, pageSize } });
    results.push(...(res.data || []));
    pageCount = res.meta?.pagination?.pageCount ?? 1;
    page += 1;
  } while (page <= pageCount);

  return results;
};

const { data: dashboardStats, isLoading: isStatsLoading } = useQuery({
  queryKey: ['dashboard-stats', user.value?.id],
  queryFn: async () => {
    const members = await findAll('learning-plan-members', {
      filters: { user: user.value?.id },
      populate: ['learningplan'],
    });

    const now = new Date();

    // Um learningplan em draft ou removido chega como `data: null`. Sem essa
    // normalizacao o acesso a `.attributes` derruba os dois donuts de uma vez.
    const plans = members
      .map((member: any) => ({
        role: member.attributes.role,
        plan: member.attributes.learningplan?.data?.attributes ?? null,
      }))
      .filter((member) => member.plan && !member.plan.archived_at);

    const isActive = (member: (typeof plans)[number]) => !member.plan.end_date || new Date(member.plan.end_date) >= now;

    // "Criados" = onde o usuario e facilitator, o papel de quem cria o plano.
    // Todo o resto do enum (student, student_leader, partner, collaborator) conta
    // como "Participando" — se listar apenas 'student', os demais papeis entram no
    // total e nao aparecem em nenhuma linha da legenda.
    const buildStats = (type: string) => {
      const all = plans.filter((member) => member.plan.type === type);
      const active = all.filter(isActive);

      return {
        created: active.filter((member) => member.role === 'facilitator').length,
        participating: active.filter((member) => member.role !== 'facilitator').length,
        finalized: all.length - active.length,
        total: all.length,
      };
    };

    return {
      projectStats: buildStats('project'),
      courseStats: buildStats('course'),
    };
  },
  enabled: computed(() => !!user.value?.id),
});

const { data: userTasks, isLoading: isTasksLoading } = useQuery({
  queryKey: ['dashboard-tasks', user.value?.id],
  queryFn: async (): Promise<RecentTask[]> => {
    const members = await findAll('task-members', {
      filters: {
        // O campo `user` do task-member nao e preenchido na criacao (nem pelo
        // addStudents do backend, nem pelo front), entao o vinculo com o usuario
        // so existe atraves do learning_plan_member / learning_plan_group.
        $or: [
          { learning_plan_member: { user: user.value?.id } },
          { learning_plan_group: { group_members: { student_member: { user: user.value?.id } } } },
        ],
        status: { $ne: 'done' },
      },
      populate: { task: { populate: ['tags', 'learningplan'] } },
    });

    // Sem prazo definido a tarefa vai para o fim da lista, nao para o comeco.
    const deadline = (date?: string | null) => (date ? new Date(date).getTime() : Number.POSITIVE_INFINITY);

    return members
      .map((member: any): RecentTask | null => {
        const task = member.attributes.task?.data;
        if (!task) return null;

        return {
          id: task.id,
          title: task.attributes.title,
          description: tiptapToPlainText(task.attributes.description),
          status: member.attributes.status || 'to_do',
          finish_at: task.attributes.finish_at,
          parent_name: task.attributes.learningplan?.data?.attributes?.title ?? null,
          tags: (task.attributes.tags?.data || []).map((tag: any) => ({
            id: tag.id,
            text: tag.attributes.text,
          })),
        };
      })
      .filter((task: RecentTask | null): task is RecentTask => !!task)
      .sort((a: RecentTask, b: RecentTask) => deadline(a.finish_at) - deadline(b.finish_at))
      .slice(0, 5);
  },
  enabled: computed(() => !!user.value?.id),
});

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
            <RecentTasks :tasks="userTasks" :is-loading="isTasksLoading" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
