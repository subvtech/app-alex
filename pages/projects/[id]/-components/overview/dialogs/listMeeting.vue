<template>
  <alex-custom-dialog v-model="value" no-footer :title="$t('pages.projects.overview.manage_meetings')">
    <div class="tw-flex tw-flex-col tw-gap-2">
      <div v-for="meeting in meetings" :key="meeting.schedule.id">
        <scheduleItem :meeting="meeting" :onEdit="() => onEdit(meeting.schedule)" />
      </div>
      <div
        @click="onCreate"
        class="tw-flex tw-w-full tw-items-center justify-center tw-cursor-pointer tw-p-4 tw-rounded tw-border tw-border-dashed :tw-hover:bg-gray-blue"
      >
        <p class="text-body-1 text-gray-400">{{ $t('pages.projects.overview.add_meeting') }} +</p>
      </div>
      <createMeeting ref="createMeetingRef" />
    </div>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import scheduleItem from '../schedule.vue';
import createMeeting from './createMeeting.vue';
const createMeetingRef = ref(createMeeting);
const value = defineModel<boolean>({ required: true });

const onCreate = () => {
  createMeetingRef?.value.openDialog();
};

const onEdit = (meeting) => {
  createMeetingRef?.value.openDialog(meeting);
};

interface meetingProps {
  schedule: LearningPlanScheduleSimple;
  scheduleName: string;
  interval: string | undefined;
  formattedDate: string;
  date: string;
  is_expired: boolean;
  earliest?: boolean;
}

const props = defineProps({
  meetings: {
    type: Array as PropType<meetingProps[]>,
    required: false,
  },
});

console.log(props.meetings);
</script>

<style lang="scss" scoped></style>
