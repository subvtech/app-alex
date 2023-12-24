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
      <alex-custom-dropdown v-if="isEditing" :items="dropdownProps">
        <template #activator="{ props: activeProps }">
          <v-icon v-bind="activeProps" class="cursor-pointer"
            >mdi-dots-vertical</v-icon
          >
        </template>
      </alex-custom-dropdown>
      <img
        v-else
        class="cursor-pointer"
        src="/svg/calendar.svg"
        width="24"
        height="24"
        @click="emit('click:calendar')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { pt } from 'date-fns/locale';
import { PropType } from 'nuxt/dist/app/compat/capi';
import { AlexDropdownItem } from './alex/inputs/Dropdown.vue';
import { useDatetime } from '~/composables/useDate';
const { t } = useI18n();
const emit = defineEmits(['click:activator', 'click:calendar']);

const props = defineProps({
  frequency: {
    type: String,
    required: true,
  },
  interval: {
    type: Number as PropType<0 | 1 | 7 | 14 | 30>,
    default: 7,
  },
  variant: {
    type: String as PropType<'editing' | 'list'>,
    default: 'list',
  },
  date: {
    type: Date,
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
    type: Array as PropType<AlexDropdownItem[]>,
    default: () => [
      {
        icon: 'mdi-pencil',
        text: 'Editar', // t('components.courses.meeting.edit'),
      },
      {
        icon: 'mdi-trash-can',
        text: 'Excluir', // t('components.courses.meeting.delete'),
        warning: true,
      },
    ],
  },
});

const { dateToHour } = useDatetime();
const date = computed(() => new Date(props.date));
const phrase = computed(() => format(date.value, 'EEEE').toLowerCase());
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
      format(date.value, formatText, { locale: pt })
    : format(date.value, formatText2, {
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
        day: t(`components.courses.meeting.single.${phrase.value}`),
      })
    : props.interval === 14
    ? t('components.courses.meeting.biweekly', {
        day: t(`components.courses.meeting.single.${phrase.value}`),
      })
    : props.interval === 0
    ? t(`components.courses.meeting.single.${phrase.value}`)
    : t('components.courses.meeting.interval', { days: props.interval }),
);

const startTime = computed(() => dateToHour(props.startHour, date.value));
const endTime = computed(() => dateToHour(props.endHour, date.value));

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
