<script setup lang="ts">
import { BarChart } from '@/components/ui/chart-bar';
import CardTotalizer from './-components/CardTotalizer.vue';

const { t } = useI18n();
const learningPlanStore = useLearningPlanStore();
const route = useRoute();
const learningPlanId = computed(() => parseInt(route.params?.id.toString()));
const learningPlan = ref<LearningPlan>();
const institutions = ref<Institution[]>([]);
const data = ref([]);

const totalizers = ref({
  sprints: {
    title: t('pages.projects.overview.total_sprints'),
    icon: 'alex:Sprint',
    value: '0',
    percentage: 0,
  },
  epics: {
    title: t('pages.projects.overview.total_epics'),
    icon: 'alex:ManageHistory',
    value: '0',
    percentage: 50,
  },
  stories: {
    title: t('pages.projects.overview.total_story'),
    icon: 'alex:HistoryEdu',
    value: '0',
    percentage: 0,
  },
  remainingTime: {
    title: t('pages.projects.overview.remaining_time'),
    icon: 'mdi-calendar-clock',
    value: '0 dias',
    percentage: 0,
  },
});

const daysOfWeek = ['Seg', 'Ter', 'Quar', 'Quin', 'Sex', 'Sab', 'Dom'];
const today = new Date();
const firstDayOfWeek = today.getDate() - today.getDay() + 1;

const currentWeek = Array.from({ length: daysOfWeek.length }, (_v, i) => {
  const date = new Date(today.getFullYear(), today.getMonth(), firstDayOfWeek + i);
  return {
    name: daysOfWeek[i],
    date: date.getDate(),
    value: date.toISOString().split('T')[0],
  };
});

const remainingDays = computed(() => {
  if (!learningPlan.value?.end_date) return 0;
  const endDate = new Date(learningPlan.value.end_date);
  const today = new Date();
  const timeDiff = endDate.getTime() - today.getTime();
  return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
});

const percentageComplete = computed(() => {
  if (!learningPlan.value?.end_date || !learningPlan.value?.start_date) return 0;

  const endDate = new Date(learningPlan.value.end_date);
  const startDate = new Date(learningPlan.value.start_date);
  const today = new Date();

  const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
  const daysRemaining = (endDate.getTime() - today.getTime()) / (1000 * 3600 * 24);

  return Math.max(0, Math.round((daysRemaining / totalDays) * 100));
});

const fetchData = async () => {
  const response = await learningPlanStore.loadLearningPlan(learningPlanId.value);
  if (!response?.data) return navigateTo('/projects/me');
  learningPlan.value = response.data as unknown as LearningPlan;
  totalizers.value.remainingTime.value = `${remainingDays.value} dias`;
  totalizers.value.remainingTime.percentage = percentageComplete.value;
};

onBeforeMount(async () => {
  await fetchData();
});
</script>

<template>
  <div>
    <div class="tw-flex tw-flex-wrap gap-4 tw-mb-5 tw-flex-wrap">
      <CardTotalizer v-for="totalizer in Object.values(totalizers)" :key="totalizer.title" :totalizer="totalizer" />
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
                  return typeof tick === 'number' ? `$ ${new Intl.NumberFormat('us').format(tick).toString()}` : '';
                }
              "
              :type="'stacked'"
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
      <alex-custom-card title="Encontros" full-width class="flex-1">
        <template #content>
          <div class="tw-flex tw-flex-col tw-gap-2 tw-w-full">
            <div class="tw-flex tw-gap-1">
              <div v-for="day in currentWeek" :key="day.value">
                <alex-custom-button :variant="day.value === today.toISOString().split('T')[0] ? 'primary' : 'text'">
                  <div class="tw-flex tw-flex-col tw-h-10">
                    <span>{{ day.name }}</span>
                    <span>{{ day.date }}</span>
                  </div>
                </alex-custom-button>
              </div>
            </div>
          </div>
        </template>
      </alex-custom-card>
      <alex-custom-card title="Instituições parceiras" full-width class="flex-1">
        <template #content>
          <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-2 tw-w-full">
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
              :empty-text-message="$t('pages.projects.overview.empty_institutions')"
              empty-text-image="/svg/EmptyInstitutional.svg"
            />
          </div>
        </template>
      </alex-custom-card>
      <alex-custom-card title="Eventos" full-width class="flex-1">
        <template #content>
          <div class="tw-flex tw-flex-col tw-gap-2 tw-w-full"></div>
        </template>
      </alex-custom-card>
    </div>
  </div>
</template>
