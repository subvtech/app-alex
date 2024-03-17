<template>
  <div v-for="classValue in mappedClasses" :key="classValue.name">
    <h5 class="text-h5 text-gray-800">
      {{ classValue.name }}
    </h5>
    <alex-learningplan-meeting
      v-for="schedule in classValue.schedules"
      :key="schedule.id"
      :type="schedule.type"
      :local="schedule.type === 'onsite' ? schedule.local : undefined"
      :link="schedule.type === 'online' ? schedule.link : undefined"
      :interval="schedule.interval"
      :date="schedule.date"
      :start-hour="schedule.startHour"
      :end-hour="schedule.endHour"
    />
  </div>
</template>

<script setup lang="ts">
type ClassMeetingsProps = {
  classes: LearningClass[];
};
const { classes } = defineProps<ClassMeetingsProps>();
const mappedClasses = computed(() =>
  classes.map((classValue) => {
    return { name: classValue.name, schedules: classValue.meeting_schedules };
  }),
);
</script>

<style scoped></style>
