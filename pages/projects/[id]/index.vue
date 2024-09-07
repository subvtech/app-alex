<template>
  <div>
    <div class="tw-flex tw-flex-wrap gap-4 tw-mb-5">
      <Card
        v-for="totalizer in Object.values(totalizers)"
        :key="totalizer.title"
        class="tw-flex-1 tw-gap-2 bg-white tw-w-full sm:tw-w-1/2 lg:tw-w-1/3"
      >
        <CardContent class="!tw-p-0">
          <div class="tw-flex py-2 gap-4 overflow-hidden">
            <div class="tw-bg-[#00B7CC] h-full tw-w-2 tw-rounded-r-xl"></div>
            <div class="tw-py-4 tw-flex tw-flex-col tw-gap-1">
              <div class="tw-flex tw-items-center tw-mb-1 tw-gap-1">
                <div
                  class="tw-bg-slate-200 tw-p-3 tw-rounded tw-h-4 tw-w-4 tw-flex tw-items-center tw-justify-center"
                >
                  <v-icon icon="mdi-camera-timer" size="14px" />
                </div>
                <span class="tw-font-bold tw-text-gray-600">{{
                  totalizer.title
                }}</span>
              </div>
              <span class="tw-text-4xl tw-font-bold tw-mb-1">{{
                totalizer.value
              }}</span>
              <div class="tw-flex tw-items-center tw-gap-1">
                <alex-custom-chip
                  size="small"
                  variant="flat"
                  :text="`${totalizer.percentage}%`"
                  :status="'blue'"
                />
                <span class="tw-text-sm tw-text-gray-500">{{
                  $t('pages.projects.completed')
                }}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="tw-flex tw-space-x-4 tw-mb-5">
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
                <alex-custom-button
                  :variant="
                    day.value === today.toISOString().split('T')[0]
                      ? 'primary'
                      : 'text'
                  "
                >
                  <div class="tw-flex tw-flex-col tw-h-10">
                    <span>{{ day.name }}</span>
                    <span>{{ day.date }}</span>
                  </div>
                </alex-custom-button>
              </div>
            </div>
            <alex-custom-empty-placeholder
              :empty-text-message="$t('pages.projects.empty_meetings')"
              empty-text-image="/svg/EmptyInstitutional.svg"
            />
          </div>
        </template>
      </alex-custom-card>
      <alex-custom-card
        title="Instituições parceiras"
        full-width
        class="flex-1"
      >
        <template #content>
          <div
            class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-2 tw-w-full"
          >
            <alex-profile-institution-item
              v-for="institution in institutions"
              :id="institution.id"
              :key="institution.id"
              class="tw-cursor-pointer"
              :name="institution.attributes.name"
              :acronym="institution.attributes.acronym"
              :sector="institution.attributes.sector"
            />
            <alex-custom-empty-placeholder
              v-if="institutions.length === 0"
              :empty-text-message="$t('pages.projects.empty_institutions')"
              empty-text-image="/svg/EmptyInstitutional.svg"
            />
          </div>
        </template>
      </alex-custom-card>
      <alex-custom-card title="Eventos" full-width class="flex-1">
        <template #content>
          <div class="tw-flex tw-flex-col tw-gap-2 tw-w-full">
            <alex-custom-empty-placeholder
              :empty-text-message="$t('pages.projects.empty_meetings')"
              empty-text-image="/svg/EmptyInstitutional.svg"
            />
          </div>
        </template>
      </alex-custom-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
import { Strapi4ResponseData } from '@nuxtjs/strapi/dist/runtime/types';
import {
  Sprint,
  PrecisionGantt,
} from '~/components/alex/learningplan/charts/Gantt.vue';

interface Data {
  sprints: Sprint[];
  counters: {
    epicCount: number;
    storyCount: number;
    totalSprints: number;
    remainingDays: number;
  };
}

const { t } = useI18n();
const route = useRoute();
const { findOne, find } = useStrapi();
const learningPlanId = computed(() => parseInt(route.params?.id.toString()));
const learningPlan = ref<LearningPlan>();
const institutions = ref<Strapi4ResponseData<Institution>[]>([]);
const precision = ref<PrecisionGantt>('week');
const sprints = ref<Sprint[]>([]);
const taskProgress = ref<{ sprint: string; columns: any }[]>([]);

const totalizers = ref({
  sprints: {
    title: t('pages.projects.total_sprints'),
    icon: 'mdi-calendar-check',
    value: 0,
    percentage: 0,
  },
  epics: {
    title: t('pages.projects.total_epics'),
    icon: 'mdi-calendar-check',
    value: 0,
    percentage: 0,
  },
  stories: {
    title: t('pages.projects.total_story'),
    icon: 'mdi-calendar-check',
    value: 0,
    percentage: 0,
  },
  remainingTime: {
    title: t('pages.projects.remaining_time'),
    icon: 'mdi-calendar-check',
    value: '0 dias',
    percentage: 0,
  },
});

const daysOfWeek = ['Seg', 'Ter', 'Quar', 'Quin', 'Sex', 'Sab', 'Dom'];
const today = new Date();

const firstDayOfWeek = today.getDate() - today.getDay() + 1;

const currentWeek = Array.from({ length: daysOfWeek.length }, (_, i) => {
  const date = new Date(
    today.getFullYear(),
    today.getMonth(),
    firstDayOfWeek + i,
  );
  return {
    name: daysOfWeek[i],
    date: date.getDate(),
    value: date.toISOString().split('T')[0],
  };
});

const getLearningPlan = async () => {
  const response = await findOne<LearningPlan>(
    'learningplans',
    learningPlanId.value,
    {
      populate: '*',
    },
  );
  if (!response?.data) {
    return navigateTo('/projects/me');
  }
  learningPlan.value = response.data.attributes as never;
  institutions.value = response.data.attributes.institutions.data as never;
};

const fetchData = async () => {
  const response = (await find<Data>(
    `sprints/project/${learningPlanId.value}`,
  )) as unknown as Data;

  totalizers.value.epics.value = response.counters.epicCount;
  totalizers.value.sprints.value = response.counters.totalSprints;
  totalizers.value.stories.value = response.counters.storyCount;
  totalizers.value.remainingTime.value = `${response.counters.remainingDays} dias`;
  sprints.value = response.sprints;

  const process = response.sprints.map((sprint) => ({
    sprint: sprint.title,
    columns: sprint.kanban.kanban_columns.map((column) => ({
      status: column.status_type,
      name: column.title,
      total: column.kanban_column_tasks.reduce((count, taskGroup) => {
        return count + taskGroup.tasks.length;
      }, 0),
    })),
  }));

  taskProgress.value = process;
};

onMounted(() => {
  getLearningPlan();
  fetchData();
});
</script>

<style lang="scss" scoped></style>
