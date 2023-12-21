<template>
  <alex-custom-card
    class="w-100"
    :title="$t('components.meeting.title')"
    href="dsads"
    hide-dividers
    sizing-class="ma-0"
    is-nested
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
        :date="item.attributes.date"
        :frequency="item.attributes.schedule.data.attributes.frequency"
        :start-hour="item.attributes.schedule.data.attributes.startDate"
        :end-hour="item.attributes.schedule.data.attributes.endDate"
        :interval="item.attributes.schedule.data.attributes.interval"
      />
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
defineProps({
  data: {
    type: Array as PropType<
      { id: number; attributes: { schedule: any; date: string } }[]
    >,
    default: [],
  },
  isFacilitator: {
    type: Boolean,
    default: false,
  },
});
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
