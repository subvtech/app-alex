<template>
  <alex-custom-card
    class="w-100"
    :title="$t('components.meeting.title')"
    sizing-class="ma-0"
    align-content="align-center"
    :show-icon="false"
  >
    <template #content>
      <div v-if="data.length === 0" class="d-flex justify-center w-100">
        <span class="desactivated">{{
          $t(
            `components.courses.meeting.empty.${
              isFacilitator ? 'facilitator' : 'student'
            }`,
          )
        }}</span>
      </div>
      <course-meeting
        v-else
        v-for="item in data"
        :date="new Date(item.attributes.date)"
        :frequency="item.attributes.schedule.data.attributes.frequency"
        :start-hour="
          format(
            new Date(item.attributes.schedule.data.attributes.startDate),
            'HH:mm',
          )
        "
        :end-hour="
          format(
            new Date(item.attributes.schedule.data.attributes.endDate),
            'HH:mm',
          )
        "
        :interval="item.attributes.schedule.data.attributes.interval"
        :variant="variant"
      />
    </template>
    <template v-if="variant === 'editing'" #footer>
      <alex-custom-button
        variant="primary"
        prepend-icon="mdi-check"
        @click=""
        >{{
          $t('components.courses.settings.general.save')
        }}</alex-custom-button
      >
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import {
  MeetingVariantType,
  MeetingProps,
} from '@/components/CourseMeeting.vue';

const props = defineProps({
  data: {
    type: Array as PropType<
      { id: number; attributes: { schedule: any; date: string } }[]
    >,
    default: [],
  },
  canEdit: { type: Boolean, default: false },
  variant: {
    type: String as PropType<MeetingVariantType>,
    default: 'list',
  },
  isFacilitator: {
    type: Boolean,
    default: false,
  },
});

const { data } = toRefs(props);

const addMeeting = () => {
  data.value.push();
};
</script>

<style scoped lang="scss">
.desactivated {
  color: var(--cinza-cinza-500, #8291a1);
  text-align: center;

  /* Body/P1 */
  font-family: Sen;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%; /* 21.6px */
  letter-spacing: 0.32px;
}
</style>
