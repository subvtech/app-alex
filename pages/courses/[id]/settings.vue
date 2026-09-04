<template>
  <alex-learningplan-settings
    v-if="!learningPlanStore.loading && learningPlanStore.learningPlan"
    :learning-plan="learningPlanStore.learningPlan"
    :learning-plan-id="learningPlanId"
    :owner="owner"
    :invitation-link="learningPlanStore.invitationLink"
    :can-edit="learningPlanStore.userIsFacilitator"
    :schedules="schedules"
  />
</template>

<script setup lang="ts">
import { format } from 'date-fns';
const { t } = useI18n();
definePageMeta({
  middleware: 'auth',
});
const learningPlanStore = useLearningPlanStore();
const owner = ref<any>();
const route = useRoute();
const schedules = computed(() =>
  learningPlanStore.schedules.map((item) => {
    return {
      id: item.id,
      startHour: format(new Date(item.startDate), 'HH:mm'),
      endHour: format(new Date(item.endDate), 'HH:mm'),
      interval: item.interval,
      date:
        item.meetings.length !== 0
          ? item.meetings.find((meeting) => meeting.earliest)?.date
          : new Date(),
    };
  }),
);
const learningPlanId = computed(() => parseInt(route.params?.id.toString()));

const headerStore = usePageHeaderStore();
const { id } = route.params;

onBeforeMount(() => {
  headerStore.showHeader = true;
});

watch(
  () => [learningPlanStore.loading],
  () => {
    if (!learningPlanStore.loading) {
      headerStore.title = t('components.courses.settings.breadcrumbTitle');
      headerStore.items = [
        {
          title: t('components.courses.settings.home'),
          disabled: false,
          to: '/',
        },
        {
          title: t('components.courses.settings.myCourses'),
          disabled: false,
          to: '/courses/me',
        },
        {
          title: learningPlanStore.learningPlan?.title || '',
          disabled: false,
          to: `/courses/${id}`,
        },
        {
          title: t('components.courses.settings.title'),
          disabled: true,
          to: `/courses/${id}/settings`,
        },
      ];
    }
  },
);
</script>
