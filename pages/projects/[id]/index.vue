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
      <alex-custom-card title="Linha temporal" class="!tw-w-2/3">
        <template #content>
          <div class="tw-flex tw-flex-col tw-gap-2 tw-w-full">
            <alex-custom-empty-placeholder />
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
              :categories="['total', 'predicted']"
              :colors="['#B9BFC6', '#F1F1F1']"
              :y-formatter="
                (tick, i) => {
                  return typeof tick === 'number'
                    ? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
                    : '';
                }
              "
              :type="'stacked'"
            />
            <span>{{ $t('pages.projects.empty_task_progress') }}</span>
            <span class="tw-text-sm tw-text-gray-500">
              {{ $t('pages.projects.last_update') }}
              {{ learningPlan?.start_date ?? 'N/A' }}
            </span>
          </div>
        </template>
      </alex-custom-card>
    </div>

    <div class="tw-flex tw-space-x-4">
      <alex-custom-card title="Encontros" full-width class="flex-1">
        <template #content>
          <div class="tw-flex tw-flex-col tw-gap-2 tw-w-full">
            <alex-custom-empty-placeholder
              :empty-text-message="$t('pages.projects.empty_meetings')"
              empty-text-image="/svg/EmptyAbout.svg"
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
          <div class="tw-flex tw-flex-col tw-gap-2 tw-w-full">
            <alex-profile-institution-item
              v-for="institution in institutions"
              :id="institution.id"
              :key="institution.id"
              class="tw-cursor-pointer"
              :name="institution.name"
              :acronym="institution.acronym"
              :sector="institution.sector"
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
              :empty-text-message="$t('pages.projects.empty_events')"
            />
          </div>
        </template>
      </alex-custom-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
import { BarChart } from '@/components/ui/chart-bar';
const { t } = useI18n();
const learningPlanStore = useLearningPlanStore();
const route = useRoute();
const learningPlanId = computed(() => parseInt(route.params?.id.toString()));
const learningPlan = ref<LearningPlan>();
const institutions = ref<Institution[]>([]);
const data = ref([]);

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
    value: 0,
    percentage: 0,
  },
});

const remainingDays = computed(() => {
  if (!learningPlan.value?.end_date) return 0;
  const endDate = new Date(learningPlan.value.end_date);
  const today = new Date();
  const timeDiff = endDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

const percentageComplete = computed(() => {
  if (!learningPlan.value?.end_date || !learningPlan.value?.start_date)
    return 0;

  const endDate = new Date(learningPlan.value.end_date);
  const startDate = new Date(learningPlan.value.start_date);
  const today = new Date();

  const totalDays =
    (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
  const daysRemaining =
    (endDate.getTime() - today.getTime()) / (1000 * 3600 * 24);

  return Math.round((daysRemaining / totalDays) * 100);
});

const fetchData = async () => {
  const response = await learningPlanStore.loadLearningPlan(
    learningPlanId.value,
  );
  if (!response?.data) {
    return navigateTo('/projects/me');
  }
  learningPlan.value = response.data as unknown as LearningPlan;
  totalizers.value.remainingTime.value = remainingDays.value;
  totalizers.value.remainingTime.percentage = percentageComplete.value;
};

onBeforeMount(async () => {
  await fetchData();
});
</script>

<style lang="scss" scoped></style>
