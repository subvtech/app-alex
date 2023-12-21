<template>
  <div class="d-flex w-100 py-3 px-4 justify-space-between align-center">
    <div class="d-flex flex-column">
      <span class="date">
        {{ formattedDate }}
      </span>
      <span class="frequency">
        {{ frequencyText }}
      </span>
    </div>

    <div
      class="d-flex justify-space-between align-end gap-2"
      :class="isEditing ? 'flex-row' : 'flex-column-reverse'"
    >
      <span class="duration">
        {{ duration }}
      </span>
      <alex-inputs-dropdown v-if="isEditing" :items="dropdownProps">
        <template #activator="{ props }">
          <v-icon v-bind="props" class="cursor-pointer"
            >mdi-dots-vertical</v-icon
          >
        </template>
      </alex-inputs-dropdown>
      <img
        v-else
        class="cursor-pointer"
        src="/svg/calendar.svg"
        @click="emit('click:calendar')"
        width="24"
        height="24"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Item } from './alex/inputs/Dropdown.vue';
const { t } = useI18n();
const emit = defineEmits(['click:activator', 'click:calendar']);

const props = defineProps({
  frequency: {
    type: String as PropType<
      | 'sunday'
      | 'monday'
      | 'tuesday'
      | 'wednesday'
      | 'thursday'
      | 'friday'
      | 'saturday'
      | 'interval'
    >,
    required: true,
  },
  interval: {
    type: Number,
    default: 7,
  },
  variant: {
    type: String as PropType<'editing' | 'list'>,
    default: 'list',
  },
  date: {
    type: String,
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
  showOptions: {
    type: Boolean,
    default: false,
  },
  shortText: {
    type: Boolean,
    default: false,
  },
  dropdownProps: {
    type: Array as PropType<Item[]>,
    default: [
      {
        icon: 'mdi-pencil',
        text: 'Editar', // t('components.courses.meeting.edit'),
      },
      {
        icon: 'mdi-trash-can',
        text: 'Excluir', //t('components.courses.meeting.delete'),
        warning: true,
      },
    ],
  },
});

const date = new Date(props.date);
const formattedDate = computed(() => {
  let formatText = ` d '${t('components.courses.meeting.of')}' MMMM '${t(
    'components.courses.meeting.of',
  )}' yyyy`;
  let formatText2 = `EEEE, d '${t('components.courses.meeting.of')}' MMMM`;
  if (props.shortText) {
    formatText = ` d/MM/yyyy`;
    formatText2 = `EEEE, d/MM`;
  }

  const temp = isEditing.value
    ? t('components.courses.meeting.starting') +
      format(date, formatText, { locale: pt })
    : format(date, formatText2, {
        locale: pt,
      });
  return temp.charAt(0).toUpperCase() + temp.slice(1);
});

const isEditing = computed(() => props.variant === 'editing');

const frequencyText = computed(() =>
  props.frequency !== 'interval'
    ? t(`components.courses.meeting.every.${props.frequency}`)
    : props.interval === 30
    ? t('components.courses.meeting.monthly', {
        day: t(`components.courses.meeting.single.${format(date, 'EEEE')}`),
      })
    : props.interval === 14
    ? t('components.courses.meeting.biweekly', {
        day: t(`components.courses.meeting.single.${format(date, 'EEEE')}`),
      })
    : t('components.courses.meeting.interval', { days: props.interval }),
);
const startTime = computed(() => format(new Date(props.startHour), 'HH:mm'));
const endTime = computed(() => format(new Date(props.endHour), 'HH:mm'));

const duration = computed(
  () =>
    `${startTime.value} ${t('components.courses.meeting.at')} ${endTime.value}`,
);
</script>
<style scoped lang="scss">
.duration {
  color: var(--Cinza-Cinza-800, #454d54);
  width: max-content;

  /* Body/P1 */
  font-family: Sen;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.32px;
}

.cursor-pointer {
  cursor: pointer;
}
.date {
  color: var(--Cinza-Cinza-800, #454d54);

  /* Body/P1 */
  font-family: Sen;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.32px;
}

.gap {
  gap: 8px;
}

.frequency {
  color: var(--cinza-cinza-500, #8291a1);
}
</style>
