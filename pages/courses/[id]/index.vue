<template>
  <alex-learningplan-general
    :learning-plan="learningPlanStore.learningPlan!"
    :learning-plan-id="learningPlanStore.learningPlan?.id"
    :owner="learningPlanStore.facilitator!"
    :invitation-link="learningPlanStore.invitationLink"
    :can-edit="learningPlanStore.userIsFacilitator"
    :schedules="
      learningPlanStore.schedules?.map((item) => {
        return {
          id: String(item.id),
          startHour: format(new Date(item.startDate), 'HH:mm'),
          endHour: format(new Date(item.endDate), 'HH:mm'),
          interval: item.interval as 0 | 1 | 7 | 14 | 30,
          date: new Date(item.meetings[0].date),
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
const { setMessage } = useMessageStore();
const learningPlanStore = useLearningPlanStore();
const i18n = useI18n();
const route = useRoute();
const id = Number(route.params.id);

onBeforeMount(async () => {
  await updateCourse(false);
});

const updateCourse = async (show = true, message?: string) => {
  const learninPlanResult = await learningPlanStore.loadLearningPlan(id, true);
  if (!learninPlanResult) {
    setMessage(i18n.t('pages.courses.notfound'), 'red', show);
  }
  setMessage(message ?? 'done', 'green', show);
};
</script>
