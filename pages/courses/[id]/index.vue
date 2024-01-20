<template>
  <alex-learningplan-general
    :learning-plan="learningPlanStore.learningPlan!"
    :learning-plan-id="learningPlanStore.learningPlan?.id"
    :owner="learningPlanStore.facilitator!"
    :invitation-link="learningPlanStore.invitationLink"
    :can-edit="learningPlanStore.userIsFacilitator"
    :schedules="
      meetings?.data.map((item) => {
        return {
          id: String(item.id),
          startHour: format(new Date(item.startDate), 'HH:mm'),
          endHour: format(new Date(item.endDate), 'HH:mm'),
          interval: item.interval as 0 | 1 | 7 | 14 | 30,
          date:
            item.meetings.length !== 0
              ? new Date(getEarliestMeeting(item.meetings).date)
              : new Date(),
        };
      })
    "
    @update="(data) => updateCourse(true, data)"
  />
</template>

<script setup lang="ts">
import { format } from 'date-fns';
defineEmits(['update']);
definePageMeta({
  middleware: 'auth',
});
const { find } = useStrapiUtils();
const { setMessage } = useMessageStore();
const learningPlanStore = useLearningPlanStore();
const i18n = useI18n();
const route = useRoute();
const id = Number(route.params.id);

const getEarliestMeeting = (meetings) => {
  if (meetings.length === 0) return null;
  const sorted = meetings.sort((a, b) => {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
    return 0;
  });
  return sorted[0];
};

onBeforeMount(async () => {
  await updateCourse(false);
});
const { data: meetings, refresh: updateSchedules } = await useAsyncData(
  'schedules',
  () => {
    return find<LearningPlanScheduleSimple>('learning-plan-meeting-schedules', {
      filters: {
        learningplan: {
          id,
        },
      },
      populate: {
        meetings: true,
      },
      sort: 'date:asc',
    });
  },
);

const updateCourse = async (show = true, message?: string) => {
  const learninPlanResult = await learningPlanStore.loadLearningPlan(id, true);
  if (!learninPlanResult) {
    setMessage(i18n.t('pages.courses.notfound'), 'red', show);
  }
  updateSchedules();
  setMessage(message ?? 'done', 'green', show);
};
</script>
