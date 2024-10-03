<template>
  <alex-custom-dialog
    v-model="value"
    no-footer
  >
  <div
    v-if="meetings && meetings.length"
    class="tw-flex tw-flex-col tw-gap-2"
  >
    <div v-for="meeting in meetings" :key="meeting.schedule.id">
      <scheduleItem
        :meeting="meeting"

      />
    </div>
  </div>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import scheduleItem from './schedule.vue'
const value = defineModel<boolean>({required:true})

interface meetingProps {
  schedule:LearningPlanScheduleSimple,
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
})

console.log(props.meetings)

</script>

<style lang="scss" scoped>

</style>
