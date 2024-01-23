<template>
  <alex-learningplan-general
    :learning-plan="learningPlanStore.learningPlan!"
    :learning-plan-id="learningPlanStore.learningPlan?.id"
    :owner="learningPlanStore.facilitator!"
    :invitation-link="learningPlanStore.invitationLink"
    :can-edit="learningPlanStore.userIsFacilitator"
    :schedules="schedules"
    @update="(message) => updateCourse(true, message)"
  />
</template>

<script setup lang="ts">
import { format } from 'date-fns';
defineEmits(['update']);
definePageMeta({
  middleware: 'auth',
});
const { setMessage } = useMessageStore();
const learningPlanStore = useLearningPlanStore();
const i18n = useI18n();
const route = useRoute();
const id = Number(route.params.id);

const schedules = computed(
  () =>
    learningPlanStore.schedules?.map((item) => {
      const earliestMeeting = item.meetings.find((meeting) => meeting.earliest);
      return {
        id: item.id,
        startHour: format(new Date(item.startDate), 'HH:mm'),
        endHour: format(new Date(item.endDate), 'HH:mm'),
        interval: item.interval,
        date: earliestMeeting?.date
          ? new Date(earliestMeeting.date)
          : new Date(),
      };
    }),
);
const headerStore = usePageHeaderStore();
onBeforeMount(async () => {
  await updateCourse(false);
  headerStore.showHeader = true;
  headerStore.title = i18n.t('pages.classes.breadcrumbs.myCourses');
  headerStore.items = [
    {
      title: i18n.t('pages.classes.breadcrumbs.home'),
      to: '/',
      disabled: true,
    },
    {
      title: i18n.t('pages.classes.breadcrumbs.myCourses'),
      to: '/courses/me',
      disabled: false,
    },
    {
      title: learningPlanStore.learningPlan?.title || '',
      to: `/courses/${learningPlanStore.learningPlan?.id}`,
      disabled: false,
    },
  ];
});

const updateCourse = async (show = true, message?: string) => {
  const learninPlanResult = await learningPlanStore.loadLearningPlan(id, true);
  if (!learninPlanResult) {
    setMessage(i18n.t('pages.courses.notfound'), 'red', show);
  }
  setMessage(message ?? 'done', 'green', show);
};
</script>
