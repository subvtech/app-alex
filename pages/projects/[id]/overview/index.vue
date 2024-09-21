<script setup lang="ts">
import { GanttInstance, GanttItem, GanttSprint } from '@/components/Gantt.vue';
import CardTotalizer from './-components/CardTotalizer.vue';
import InstitutionDialog from './-components/InstitutionDialog.vue';
import TaskProgress from './-components/TaskProgress.vue';

interface DashboardSprint extends GanttSprint {
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

interface DashboardResponse {
  counters: {
    finishedEpicsPercent: number;
    finishedSprintsPercent: number;
    finishedStoriesPercent: number;
    totalEpics: number;
    totalStories: number;
    totalSprints: number;
    remainingDays: number;
  };
  sprints: DashboardSprint[];
  tasks: GanttItem[];
}

const { t } = useI18n();
const route = useRoute();
const strapi = useStrapiClient();
const learningPlanStore = useLearningPlanStore();

// const data = ref([]);
const loading = ref(true);
// const learningPlan = ref<LearningPlan>();
const institutions = ref<Institution[]>([]);
const taskProgress = ref<{ sprint: string; columns: any }[]>([]);

const ganttRef = ref<GanttInstance | null>(null);
const ganttItems = ref<GanttItem[]>([]);
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

onBeforeMount(async () => {
  try {
    const response = await learningPlanStore.loadLearningPlan(+route.params.id);

    if (!response?.data) {
      return navigateTo('/projects/me');
    }

    institutions.value = response.data.institutions as Institution[];

    const res = await strapi<DashboardResponse>(`learningplans/${route.params.id}/project-dashboard`);

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

    <div class="tw-grid tw-grid-cols-12 tw-gap-4">
      <alex-custom-card
        no-footer
        no-header
        title="Linha temporal"
        class="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-8"
        content-class-name="tw-flex-1"
      >
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
            <div class="tw-flex tw-gap-1 tw-overflow-auto">
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
              :max-height="375"
              :items="ganttItems"
              :sprints="ganttSprints"
              :view="ganttView"
            />
            <alex-custom-empty-placeholder v-else />
          </div>
        </template>
      </alex-custom-card>
      <TaskProgress
        class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4"
        :categories="'total'"
        last-update="2024-07-11 12:00"
        :data="taskProgress"
      />
      <alex-custom-card
        title="Encontros"
        full-width
        class="flex-1 tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4"
        content-class-name="justify-center align-center h-100"
        no-footer
      >
        <template #content>
          <div class="tw-flex tw-flex-col tw-gap-2 tw-w-full">
            <!-- TODO: Trocar isso aqui por tabs -->
            <div class="tw-flex tw-gap-1 ga-6 tw-items-center mb-4 tw-overflow-auto">
              <div v-for="day in currentWeek" :key="day.value">
                <div
                  class="tw-h-[57px] tw-w-[41px] pa-2 rounded-lg"
                  variant="text"
                  :class="
                    day.value === today.toISOString().split('T')[0] ? 'bg-secondary-0 tw-text-white' : 'tw-bg-white'
                  "
                >
                  <div class="tw-flex tw-flex-col text-center">
                    <span class="text-body-3">{{ day.name }}</span>
                    <span
                      class="text-body-2"
                      :class="day.value === today.toISOString().split('T')[0] ? 'tw-text-white' : ' text-secondary-0'"
                      >{{ day.date }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <alex-custom-empty-placeholder
              :empty-text-message="$t('pages.projects.overview.empty_meetings')"
              empty-text-image="/svg/OverviewEmptyMeetings.svg"
              grayscale
            />
          </div>
        </template>
      </alex-custom-card>
      <div
        class="tw-bg-white tw-w-full tw-flex tw-flex-col tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 rounded-lg"
      >
        <div class="tw-border-b tw-p-5 tw-flex tw-justify-between tw-items-center">
          <h3>{{ $t('pages.projects.overview.institutions') }}</h3>
          <InstitutionDialog :institutions="institutions" />
        </div>
        <div class="tw-flex tw-flex-1 tw-flex-col tw-gap-4 tw-p-4">
          <template v-if="institutions.length">
            <alex-profile-institution-item
              v-for="institution in institutions"
              :id="institution.id"
              :key="institution.id"
              :url="institution.cover?.url"
              :name="institution.name"
              :acronym="institution.acronym"
              :sector="institution.sector"
            />
          </template>
          <div v-else class="tw-m-auto">
            <alex-custom-empty-placeholder
              :empty-text-message="t('pages.projects.overview.empty_institutions')"
              empty-text-image="/svg/OverviewEmptyInstitution.svg"
              grayscale
            />
          </div>
        </div>
      </div>
      <alex-custom-card
        title="Eventos"
        full-width
        class="flex-1 tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4"
        content-class-name="d-flex justify-center align-center h-100"
        no-footer
      >
        <template #content>
          <div
            class="tw-flex tw-flex-col tw-gap-2 tw-w-full d-flex align-center margin-auto d-flex justify-center align-center"
          >
            <alex-custom-empty-placeholder
              empty-text-image="/svg/EmptyInstitutional.svg"
              :empty-text-message="t('pages.projects.overview.empty_meetings')"
              grayscale
            />
          </div>
        </template>
      </alex-custom-card>
    </div>
  </div>
</template>
