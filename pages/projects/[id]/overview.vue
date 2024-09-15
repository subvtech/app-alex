<template>
  <div>
    <div class="tw-flex tw-flex-wrap gap-4 tw-mb-5">
      <CardTotalizer v-for="totalizer in Object.values(totalizers)" :key="totalizer.title" :totalizer="totalizer" />
    </div>

    <div class="tw-flex tw-space-x-4 tw-mb-5 tw-flex-wrap">
      <alex-learningplan-charts-gantt
        class="!tw-w-2/3"
        :precision="precision"
        start-date="2024-07-11 12:00"
        end-date="2024-11-30 12:00"
        :sprints="sprints"
      />
      <alex-learningplan-charts-task-progress
        class="!tw-w-1/3"
        :categories="'total'"
        last-update="2024-07-11 12:00"
        :data="taskProgress"
      />
    </div>

    <div class="tw-flex tw-space-x-4">
      <alex-custom-card title="Encontros" full-width class="flex-1">
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
      <div class="tw-bg-white tw-w-full tw-flex tw-flex-col tw-gap-4">
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
      <alex-custom-card title="Eventos" full-width class="flex-1">
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

<script setup lang="ts">
import { PrecisionGantt, Sprint } from '~/components/alex/learningplan/charts/Gantt.vue';
import CardTotalizer from './-components/CardTotalizer.vue';

export interface Data {
  sprints: Sprint[];
  counters: {
    finishedEpicsPercent: number;
    finishedSprintsPercent: number;
    finishedStoriesPercent: number;
    totalEpics: number;
    totalStories: number;
    totalSprints: number;
    remainingDays: number;
  };
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
const { find } = useStrapi();
const learningPlanId = computed(() => parseInt(route.params?.id.toString()));
const learningPlanStore = useLearningPlanStore();

const { id: projectId } = route.params;
const institutions = ref<CompletedInstitution[]>([]);
const precision = ref<PrecisionGantt>('week');
const sprints = ref<Sprint[]>([]);
const taskProgress = ref<{ sprint: string; columns: any }[]>([]);

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

const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
const today = new Date();

const firstDayOfWeek = today.getDate() - today.getDay() + 1;

const currentWeek = Array.from({ length: daysOfWeek.length }, (_, i) => {
  const date = new Date(today.getFullYear(), today.getMonth(), firstDayOfWeek + i);
  return {
    name: daysOfWeek[i],
    date: date.getDate(),
    value: date.toISOString().split('T')[0],
  };
});

const getLearningPlan = async () => {
  const response = await learningPlanStore.loadLearningPlan(+projectId);

  if (!response?.data) {
    return navigateTo('/projects/me');
  }
  console.log(response);
  institutions.value = response.data.institutions as never;
};

const fetchData = async () => {
  const response = (await find<Data>(`learningplans/${learningPlanId.value}/project-dashboard`)) as unknown as Data;

  totalizers.value.epics.value = response.counters.totalEpics;
  totalizers.value.epics.percentage = response.counters.finishedEpicsPercent || 0;
  totalizers.value.sprints.value = response.counters.totalSprints;
  totalizers.value.sprints.percentage = response.counters.finishedSprintsPercent || 0;
  totalizers.value.stories.value = response.counters.totalStories;
  totalizers.value.stories.percentage = response.counters.finishedStoriesPercent || 0;
  totalizers.value.remainingTime.value = `${response.counters.remainingDays} dias`;
  sprints.value = response.sprints;

  const process = response.sprints.map((sprint) => ({
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
};

onMounted(() => {
  fetchData();
  getLearningPlan();
});
</script>

<style lang="scss" scoped></style>
