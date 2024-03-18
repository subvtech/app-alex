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
import { format, isValid } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { pt } from 'date-fns/locale';
import { AlexDropdownItem } from '../custom/Dropdown.vue';
import { capitalize } from '@/utils';
import date from '~/pages/components/inputs/date.vue';
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
const { t } = useI18n();

const props = withDefaults(defineProps<MeetingPropsType>(), {
  interval: 7,
  variant: 'default',
  type: 'onsite',
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
  local: undefined,
  link: undefined,
  id: undefined,
});
defineEmits(['click:activator', 'click:calendar']);
const isEditing = computed(() => props.variant === 'editing');
const dateValue = computed(() => {
  if (typeof props.date === 'string') {
    return new Date(props.date.replaceAll('-', '/'));
  }
  return new Date(props.date);
});
const formattedDate = computed(() => {
  if (!isValid(dateValue.value)) {
    return '';
  }

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
const frequencyText = computed(
  () =>
    frequencyTextValues[props.interval] ||
    t('components.courses.meeting.interval', { days: props.interval }),
);
const duration = computed(
  () =>
    `${props.startHour} ${t('components.courses.meeting.at')} ${props.endHour}`,
);
const title = computed(
  () => `${frequencyText.value}: ${formattedDate.value}, ${duration.value}`,
);
const subtitle = computed(() =>
  isValid(dateValue.value)
    ? `Próximo encontro: ${format(
        dateValue.value,
        `d '${t('components.courses.meeting.of')}' MMMM`,
        { locale: pt },
      )}`
    : '',
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
