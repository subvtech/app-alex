<template>
  <div v-for="(classValue, index) in classes" :key="index" class="mb-6">
    <h5 v-if="showClass(classValue)" class="text-h5 text-gray-800 mb-4">
      {{ classValue.name }}
    </h5>
    <div
      v-for="(schedule, indexSchedule) in classValue.schedules"
      :key="indexSchedule"
    >
      <alex-learningplan-meeting
        v-if="schedule.date"
        :variant="variant"
        :class="indexSchedule !== classValue.schedules.length - 1 && 'mb-2'"
        :type="schedule.type"
        :location="schedule.type === 'onsite' ? schedule.location : undefined"
        :link="schedule.type === 'online' ? schedule.link : undefined"
        :interval="schedule.interval"
        :date="schedule.date"
        :start-hour="schedule.startHour"
        :end-hour="schedule.endHour"
        :dropdown-props="[
          {
            icon: 'mdi-pencil',
            text: $t('components.courses.meeting.edit'), //,
            onClick: () => emit('update', classValue.name, schedule),
          },
          {
            icon: 'mdi-trash-can',
            text: $t('components.courses.meeting.delete'),
            warning: true,
            onClick: () => emit('delete', classValue.name, schedule.id),
          },
        ]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MeetingVariantType } from '../Meeting.vue';
import { LearningClassType } from '../dialogs/create/index.vue';
type ClassMeetingsProps = {
  variant: MeetingVariantType;
};
const classes = defineModel<Pick<LearningClassType, 'schedules' | 'name'>[]>({
  default: [],
});

const emit = defineEmits(['update', 'delete']);
const { variant = 'editing' } = defineProps<ClassMeetingsProps>();

const showClass = (classValue) => {
  return classValue.schedules?.some((schedule) => schedule.date);
};
</script>
