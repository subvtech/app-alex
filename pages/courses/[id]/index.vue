<template>
  <alex-learningplan-general
    :loading="learningPlanStore.loading"
    :learning-plan="learningPlanStore.learningPlan!"
    :owner="learningPlanStore.facilitator!"
    :invite-link-hash="learningPlanStore.invitationLink?.hash"
    :invite-link-expires-at="expiresAtDate"
    :invitation-duration="learningPlanStore.learningPlan?.invitation_duration"
    :can-edit="effectiveUserIsFacilitator"
    :schedules="schedules"
    @update="(message) => updateCourse(true, message)"
  />
</template>

<script setup lang="ts">
defineEmits(['update']);
definePageMeta({
  middleware: 'auth',
});
const { setMessage } = useMessageStore();
const learningPlanStore = useLearningPlanStore();
const viewModeStudentStore = useViewModeStudentStore();
const i18n = useI18n();
const route = useRoute();
const id = Number(route.params.id);
const effectiveUserIsFacilitator = computed(() => {
  return !viewModeStudentStore.viewAsStudent && learningPlanStore.userIsFacilitator;
});
const schedules = computed(
  () =>
    learningPlanStore.schedules?.map((item) => {
      const earliestMeeting = item.meetings.find((meeting) => meeting.earliest);
      const startHour = item.startDate.split('T')[1].slice(0, 5);
      const endHour = item.endDate.split('T')[1].slice(0, 5);
      return {
        id: item.id,
        startHour,
        endHour,
        interval: item.interval,
        date: earliestMeeting?.date
          ? new Date(earliestMeeting.date)
          : new Date(),
      };
    }),
);
const headerStore = usePageHeaderStore();
onBeforeMount(() => (headerStore.showHeader = true));

const expiresAtDate = computed(() => {
  if (
    !learningPlanStore.invitationLink ||
    learningPlanStore.invitationLink.is_expired
  )
    return null;

  return new Date(learningPlanStore.invitationLink?.expires_at);
});

watch(
  () => learningPlanStore.loading,
  () => {
    if (!learningPlanStore.loading) {
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
    }
  },
);

const updateCourse = async (show = true, message?: string) => {
  const learninPlanResult = await learningPlanStore.loadLearningPlan(id, true);
  if (!learninPlanResult) {
    setMessage(i18n.t('pages.courses.notfound'), 'red', show);
  }
  setMessage(message ?? 'done', 'green', show);
};
</script>
