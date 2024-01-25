<template>
  <div
    class="d-flex w-100 py-3 px-4 justify-space-between align-center"
    :class="variant === 'editing' ? 'bordered' : ''"
  >
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
import { pt, enUS } from 'date-fns/locale';
import { AlexDropdownItem } from './alex/inputs/Dropdown.vue';

const { t } = useI18n();
const emit = defineEmits(['click:activator', 'click:calendar']);
export type MeetingVariantType = 'editing' | 'list';

export interface MeetingPropsType {
  interval: 0 | 1 | 7 | 14 | 30;
  variant?: MeetingVariantType;
  date: Date;
  startHour: string;
  endHour: string;
  shortText?: boolean;
  showOptions?: boolean;
  id?: string;
  dropdownProps?: AlexDropdownItem[];
}

const props = withDefaults(defineProps<MeetingPropsType>(), {
  interval: 7,
  variant: 'list',
  id: undefined,
  dropdownProps: () => [
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
  shortText: false,
  showOptions: false,
});

const date = computed(() => new Date(props.date));

const formattedDate = computed(() => {
  let formatText = ` d '${t('components.courses.meeting.of')}' MMMM '${t(
    'components.courses.meeting.of',
  )}' yyyy`;
  let formatText2 = `EEEE, d '${t('components.courses.meeting.of')}' MMMM`;
  if (props.shortText) {
    formatText = ` d/MM/yyyy`;
    formatText2 = `EEEE, d/MM`;
  }

  const temp =
    date.value >= new Date() && isEditing.value
      ? t('components.courses.meeting.starting') +
        format(date.value, formatText, { locale: pt })
      : format(date.value, formatText2, {
          locale: pt,
        });
  return temp.charAt(0).toUpperCase() + temp.slice(1);
});

const isEditing = computed(() => props.variant === 'editing');

const frequencyText = computed(() => {
  const dayOfTheWeek = format(date.value, 'iiii', {
    locale: enUS,
  }).toLowerCase();
  switch (props.interval) {
    case 0: // once
      return t(`components.courses.meeting.single.${dayOfTheWeek}`);

    case 1:
      return t(`components.courses.meeting.everyday`);

      case 7:
      return t('components.courses.meeting.weekly', {
        day: t(`components.courses.meeting.single.${dayOfTheWeek}`),
      });

    case 14:
      return t('components.courses.meeting.biweekly', {
        day: t(`components.courses.meeting.single.${dayOfTheWeek}`),
      });
    case 30:
      return t('components.courses.meeting.monthly', {
        day: t(`components.courses.meeting.single.${dayOfTheWeek}`),
      });
   
    default:
      return t('components.courses.meeting.interval', { days: props.interval });
  }
});

const duration = computed(
  () =>
    `${props.startHour} ${t('components.courses.meeting.at')} ${props.endHour}`,
);
</script>
<style scoped lang="scss">
.bordered {
  border-radius: 8px;
  border: 1px solid var(--Cinza-Cinza-100, #ebedef);
}

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
