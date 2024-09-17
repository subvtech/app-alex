<script setup lang="ts">
import { GanttInstance, Item as Task, Sprint as GanttSprint } from '@/components/Gantt.vue';
import { BarChart } from '@/components/ui/chart-bar';
import CardTotalizer from './-components/CardTotalizer.vue';

interface Sprint extends GanttSprint {
  kanban: {
    kanban_columns: {
      title: string;
      id: string;
      position: string;
      status_type: string;
      kanban_column_tasks: {
        task: History;
      }[];
    }[];
  };
}

export interface Data {
  counters: {
    finishedEpicsPercent: number;
    finishedSprintsPercent: number;
    finishedStoriesPercent: number;
    totalEpics: number;
    totalStories: number;
    totalSprints: number;
    remainingDays: number;
  };
  sprints: Sprint[];
  tasks: Task[];
}

type CoverFormat = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
};

export type Cover = {
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    small: CoverFormat;
    medium: CoverFormat;
    thumbnail: CoverFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CompletedInstitution = Institution & {
  cover: Cover;
};

const { t } = useI18n();
const route = useRoute();
const strapi = useStrapiClient();
const learningPlanStore = useLearningPlanStore();

const data = ref([]);
const loading = ref(true);
const learningPlan = ref<LearningPlan>();
const institutions = ref<Institution[]>([]);
const taskProgress = ref<{ sprint: string; columns: any }[]>([]);

const ganttRef = ref<GanttInstance | null>(null);
const ganttItems = ref<Task[]>([]);
const ganttSprints = ref<GanttSprint[]>([]);
const ganttView = ref('month');

const totalizers = ref({
  sprints: {
    title: t('pages.projects.overview.total_sprints'),
    icon: 'alex:Sprint',
    value: 0,
    percentage: 0,
  },
  epics: {
    title: t('pages.projects.overview.total_epics'),
    icon: 'alex:ManageHistory',
    value: 0,
    percentage: 50,
  },
  stories: {
    title: t('pages.projects.overview.total_story'),
    icon: 'alex:HistoryEdu',
    value: 0,
    percentage: 0,
  },
  remainingTime: {
    title: t('pages.projects.overview.remaining_time'),
    icon: 'mdi-calendar-clock',
    value: '0 dias',
    percentage: 0,
  },
});

const today = new Date();
const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
const firstDayOfWeek = today.getDate() - today.getDay() + 1;

const currentWeek = Array.from({ length: daysOfWeek.length }, (_v, i) => {
  const date = new Date(today.getFullYear(), today.getMonth(), firstDayOfWeek + i);
  return {
    name: daysOfWeek[i],
    date: date.getDate(),
    value: date.toISOString().split('T')[0],
  };
});

const formatCurrency = (tick: number | Date): string => {
  return typeof tick === 'number' ? `$ ${new Intl.NumberFormat('us').format(tick)}` : '';
};

onBeforeMount(async () => {
  try {
    const response = await learningPlanStore.loadLearningPlan(+route.params.id);

    if (!response?.data) {
      return navigateTo('/projects/me');
    }

    institutions.value = response.data.institutions as never;

    const res = await strapi<Data>(`learningplans/${route.params.id}/project-dashboard`);

    totalizers.value.epics.value = res.counters.totalEpics;
    totalizers.value.epics.percentage = res.counters.finishedEpicsPercent || 0;
    totalizers.value.sprints.value = res.counters.totalSprints;
    totalizers.value.sprints.percentage = res.counters.finishedSprintsPercent || 0;
    totalizers.value.stories.value = res.counters.totalStories;
    totalizers.value.stories.percentage = res.counters.finishedStoriesPercent || 0;
    totalizers.value.remainingTime.value = `${res.counters.remainingDays} dias`;

    ganttItems.value = res.tasks;
    ganttSprints.value = res.sprints;

    const process = res.sprints.map((sprint) => ({
      sprint: sprint.title,
      columns: sprint.kanban?.kanban_columns?.map((column) => ({
        status: column.status_type,
        name: column.title,
        total: column.kanban_column_tasks?.reduce((count, taskGroup) => {
          return count + (taskGroup.task ? 1 : 0);
        }, 0),
      })),
    }));

    taskProgress.value = process;
  } catch (_) {
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <div class="tw-flex tw-flex-wrap gap-4 tw-mb-5">
      <CardTotalizer v-for="totalizer in Object.values(totalizers)" :key="totalizer.title" :totalizer="totalizer" />
    </div>
    <div class="tw-flex tw-space-x-4 tw-mb-5">
      <alex-custom-card no-footer no-header title="Linha temporal" class="!tw-w-2/3" content-class-name="tw-flex-1">
        <template #header>
          <div class="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-px-6 tw-py-4 tw-border-b">
            <div class="tw-flex tw-items-center tw-gap-4">
              <span class="tw-text-gray-600 tw-font-bold tw-text-xl tw-leading-8">
                {{ $t('pages.projects.overview.timeline') }}
              </span>
              <alex-custom-button size="small" @click="ganttRef?.changeToCurrentDate()">
                {{ $t('pages.projects.overview.timeline_today') }}
              </alex-custom-button>
            </div>
            <div class="tw-flex tw-gap-1">
              <alex-custom-button
                v-for="view in ['day', 'week', 'month']"
                :key="view"
                :variant="ganttView === view ? 'secondary' : 'text'"
                @click="ganttView = view"
              >
                {{ $t(`pages.projects.overview.timeline_${view}`) }}
              </alex-custom-button>
            </div>
          </div>
        </template>
        <template #content>
          <div class="tw-flex tw-flex-col tw-flex-1 tw-gap-2 tw-w-full tw-pt-6">
            <div v-if="loading" class="tw-flex tw-justify-center tw-items-center tw-w-full">
              <v-progress-circular indeterminate />
            </div>
            <Gantt
              v-else-if="ganttItems.length"
              ref="ganttRef"
              class="tw-flex-1"
              :max-height="475"
              :items="ganttItems"
              :sprints="ganttSprints"
              :view="ganttView"
            />
            <alex-custom-empty-placeholder v-else />
          </div>
        </template>
      </alex-custom-card>
      <alex-custom-card title="Progresso de tarefas" class="!tw-w-1/3">
        <template #content>
          <div class="tw-flex tw-flex-col tw-items-center">
            <BarChart
              class="!tw-w-full"
              index="name"
              :data="data"
              :type="'stacked'"
              :colors="['#B9BFC6', '#F1F1F1']"
              :categories="['total', 'predicted']"
              :y-formatter="formatCurrency"
            />
            <span>{{ $t('pages.projects.overview.empty_task_progress') }}</span>
            <span class="tw-text-sm tw-text-gray-500">
              {{ $t('pages.projects.overview.last_update') }}
              {{ learningPlan?.start_date ?? 'N/A' }}
            </span>
          </div>
        </template>
      </alex-custom-card>
    </div>
    <div class="tw-flex tw-space-x-4">
      <alex-custom-card title="Encontros" full-width class="flex-1 tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4">
        <template #content>
          <div class="tw-flex tw-flex-col tw-gap-2 tw-w-full">
            <div class="tw-flex tw-gap-1">
              <div v-for="day in currentWeek" :key="day.value" class="">
                <alex-custom-button :variant="day.value === today.toISOString().split('T')[0] ? 'primary' : 'text'">
                  <div class="tw-flex tw-flex-col tw-h-10">
                    <span>{{ day.name }}</span>
                    <span>{{ day.date }}</span>
                  </div>
                </alex-custom-button>
              </div>
            </div>
            <alex-custom-empty-placeholder
              :empty-text-message="$t('pages.projects.overview.empty_meetings')"
              empty-text-image="/svg/EmptyInstitutional.svg"
            />
          </div>
        </template>
      </alex-custom-card>
      <div class="tw-bg-white tw-w-full tw-flex tw-flex-col tw-gap-4 tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4">
        <div class="tw-border-b tw-p-5 tw-flex tw-justify-between tw-items-center">
          <h3>{{ $t('pages.projects.overview.institutions') }}</h3>
          <alex-project-dialogs-institution :institutions="institutions" />
        </div>
        <div class="tw-flex tw-flex-col tw-px-4 tw-items-center tw-justify-center tw-gap-2 tw-w-full">
          <alex-profile-institution-item
            v-for="institution in institutions"
            :id="institution.id"
            :key="institution.id"
            class="tw-cursor-pointer"
            :url="institution.cover.url"
            :name="institution.name"
            :acronym="institution.acronym"
            :sector="institution.sector"
          />
          <alex-custom-empty-placeholder
            v-if="institutions.length === 0"
            :empty-text-message="$t('pages.projects.overview.empty_institutions')"
            empty-text-image="/svg/EmptyInstitutional.svg"
          />
        </div>
      </div>
      <alex-custom-card title="Eventos" full-width class="flex-1 tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4">
        <template #content>
          <div class="tw-flex tw-flex-col tw-gap-2 tw-w-full">
            <alex-custom-empty-placeholder
              :empty-text-message="$t('pages.projects.overview.empty_meetings')"
              empty-text-image="/svg/EmptyInstitutional.svg"
            />
          </div>
        </template>
      </alex-custom-card>
    </div>
  </div>
</template>
