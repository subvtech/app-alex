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
  <div v-else />
</template>

<script setup lang="ts">
import { format } from 'date-fns';
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
</script>
