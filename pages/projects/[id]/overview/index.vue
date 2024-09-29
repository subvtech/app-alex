<script setup lang="ts">
import EventsWidget from './-components/EventsWidget.vue';
import GanttWidget, { type GanttWidgetProps } from './-components/GanttWidget.vue';
import InstitutionsWidget from './-components/InstitutionsWidget.vue';
import MeetupWidget from './-components/MeetupWidget.vue';
import StatisticsWidget, { type StatisticsWidgetProps } from './-components/StatisticsWidget.vue';
import TaskProgressWidget, { type TaskProgressProps } from './-components/TaskProgressWidget.vue';

interface DataStore {
  counters: StatisticsWidgetProps['counters'];
  institutions: Institution[];
  sprints: TaskProgressProps['sprints'];
  tasks: GanttWidgetProps['items'];
}

const route = useRoute();
const strapi = useStrapiClient();
const learningPlanStore = useLearningPlanStore();

const dataStore = ref<DataStore>();
const loading = ref(true);

const handleRemoveInstitution = (value: Institution) => {
  dataStore.value!.institutions = dataStore.value!.institutions.filter((v) => v.id !== value.id);
};

const handleUpdateInstitution = (value: Institution) => {
  const index = dataStore.value!.institutions.findIndex((v) => v.id === value.id);

  if (index !== -1) {
    dataStore.value!.institutions[index] = { ...dataStore.value!.institutions[index], ...value };
  } else {
    dataStore.value!.institutions.push(value);
  }
};

onBeforeMount(async () => {
  try {
    const learnPlan = await learningPlanStore.loadLearningPlan(+route.params.id);
    if (!learnPlan?.data) return navigateTo('/projects/me');

    dataStore.value = await strapi<DataStore>(`learningplans/${route.params.id}/project-dashboard`);
    dataStore.value.institutions = learnPlan.data.institutions as Institution[];
  } catch (_) {
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <StatisticsWidget :counters="dataStore?.counters" />
    <div class="tw-grid tw-grid-cols-12 tw-gap-4">
      <GanttWidget :items="dataStore?.tasks" :sprints="dataStore?.sprints" :loading="loading" />
      <TaskProgressWidget
        class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4"
        categories="total"
        :last-update="new Date()"
        :sprints="dataStore?.sprints"
      />
      <MeetupWidget />
      <InstitutionsWidget
        :institutions="dataStore?.institutions"
        @remove="handleRemoveInstitution"
        @update="handleUpdateInstitution"
      />
      <EventsWidget />
    </div>
  </div>
</template>
