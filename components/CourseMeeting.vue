<template>
  <div class="d-flex flex-column w-100 py-3 px-4">
    <div class="d-flex justify-space-between gap">
      <span class="date">
        {{ date }}
      </span>
      <img src="/svg/calendar.svg" width="20" height="18" alt="" />
    </div>
    <div class="d-flex justify-space-between align-end gap">
      <span class="frequency">
        {{ frequency }}
      </span>
      <span>
        {{ duration }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  frequency: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    validate: (value) => {
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      return dateRegex.test(value);
    },
    required: true,
  },
  startHour: {
    type: String,
    required: true,
  },
  endHour: {
    type: String,
    required: true,
  },
});

const duration = computed(() => `${props.startHour} às ${props.endHour}`);
</script>
<style scoped lang="scss">
span {
  overflow: hidden;
  text-overflow: ellipsis;
  /* Body/P1 */
  font-family: Sen;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%; /* 21.6px */
  letter-spacing: 0.32px;
}

.gap{
  gap: 8px;
}

.frequency {
  color: var(--cinza-cinza-500, #8291a1);
}
</style>
