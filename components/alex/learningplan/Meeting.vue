<template>
  <v-card
    class="d-flex w-100 py-3 px-4 align-start justify-space-between"
    variant="outlined"
    color="gray-blue"
    rounded="lg"
    elevation="0"
  >
    <div class="w-100 d-flex flex-column gap-2">
      <div class="d-flex gap-2 align-center">
        <v-icon color="gray-600">mdi-calendar-range</v-icon>
        <div class="d-flex flex-column w-100">
          <p class="text-body-1 text-gray-800">
            {{ title }}
          </p>
          <p class="text-body-1 text-gray-500">
            {{ subtitle }}
          </p>
        </div>
      </div>
      <div class="d-flex gap-2 align-center">
        <v-icon color="gray-600" :icon="typeValues[type].icon" />
        <div class="d-flex flex-column align-start">
          <p class="text-body-1 text-gray-800">
            {{ typeValues[type].title }}
          </p>
          <p v-if="type === 'onsite'" class="text-body-1 text-gray-500">
            {{ local }}
          </p>
          <a
            v-else
            :href="link"
            target="_blank"
            class="text-body-1 text-secondary-1 text-decoration-none"
          >
            {{ link }}
          </a>
        </div>
      </div>
    </div>
    <alex-custom-dropdown v-if="isEditing" :items="dropdownProps">
      <template #activator="{ props: activeProps }">
        <alex-custom-button
          v-bind="activeProps"
          variant="text"
          size="small"
          icon="mdi-dots-vertical"
        />
      </template>
    </alex-custom-dropdown>
  </v-card>
</template>

<script setup lang="ts">
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { pt } from 'date-fns/locale';
import { AlexDropdownItem } from '../custom/Dropdown.vue';
import { capitalize } from '@/utils';
const { t } = useI18n();
defineEmits(['click:activator', 'click:calendar']);
export type MeetingVariantType = 'editing' | 'default';
export type MeetingType = 'onsite' | 'online';
export interface MeetingPropsType {
  interval: 0 | 1 | 7 | 14 | 30;
  date: Date | string;
  startHour: string;
  endHour: string;
  type: MeetingType;
  variant?: MeetingVariantType;
  local?: string;
  link?: string;
  id?: number;
  dropdownProps?: AlexDropdownItem[];
}
const defaultDropdown = [
  {
    icon: 'mdi-pencil',
    text: 'Editar', // t('components.courses.meeting.edit'),
  },
  {
    icon: 'mdi-trash-can',
    text: 'Excluir', // t('components.courses.meeting.delete'),
    warning: true,
  },
];
const {
  interval = 7,
  variant = 'default',
  dropdownProps = defaultDropdown,
  endHour,
  local,
  type = 'onsite',
  startHour,
  link,
  date,
} = defineProps<MeetingPropsType>();

const isEditing = computed(() => variant === 'editing');
const dateValue = computed(() => {
  if (typeof date === 'string') {
    return new Date(date.replaceAll('-', '/'));
  }
  return new Date(date);
});
const formattedDate = computed(() => {
  const temp = format(dateValue.value, 'EEEE', { locale: pt });
  return capitalize(temp);
});
const frequencyTextValues = {
  0: t(`components.courses.meeting.unique`),
  1: t(`components.courses.meeting.everyday`),
  7: t('components.courses.meeting.weekly'),
  14: t('components.courses.meeting.biweekly'),
  30: t('components.courses.meeting.monthly'),
};
const frequencyText = computed(() => {
  return (
    frequencyTextValues[interval] ||
    t('components.courses.meeting.interval', { days: interval })
  );
});
const duration = computed(
  () => `${startHour} ${t('components.courses.meeting.at')} ${endHour}`,
);
const title = computed(
  () => `${frequencyText.value}: ${formattedDate.value}, ${duration.value}`,
);
const subtitle = computed(
  () =>
    `Próximo encontro: ${format(
      dateValue.value,
      `d '${t('components.courses.meeting.of')}' MMMM`,
      { locale: pt },
    )}`,
);
const typeValues = {
  onsite: {
    icon: 'mdi-map-marker-outline',
    title: 'Presencial',
  },
  online: {
    icon: 'mdi-link',
    title: 'Online',
  },
};
</script>
