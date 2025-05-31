<template>
  <div
    class="d-flex flex-column border-1 border-gray-100 rounded-lg pa-4 text-gray-800 card-kanban bg-white tw-h-[120px]"
  >
    <div class="d-flex gap-2 align-center">
      <p class="text-body-2 ellipsis lines-1 w-100">
        {{ title }}
      </p>
      <alex-custom-chip
        v-if="mark && maxMark && status === 'done'"
        status="green"
        :text="`${mark}/${maxMark}`"
        size="small"
      />
    </div>
    <div v-if="group" class="d-flex gap-2 align-center mt-2">
      <alex-custom-avatar-group :avatar-items="group.participants" class="tw-ml-2" />
    </div>
    <div class="d-flex gap-2 justify-end w-100 tw-mt-auto">
      <alex-custom-chip
        status="secondary"
        variant="outlined"
        :text="group ? $t('pages.task.table.type.group') : $t('pages.task.table.type.individual')"
        size="small"
      />
      <alex-custom-chip :status="dateColor" :text="formattedDate" size="small" prepend-icon="mdi-calendar-range" />
    </div>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { ptBR, enIN } from 'date-fns/locale';
const i18n = useI18n();
type TStatus = 'to_do' | 'in_progress' | 'in_review' | 'done' | (string & {});
type StudentCardProps = {
  date: Date;
  title: string;
  group?: {
    name: string;
    participants: { name: string; avatar?: string }[];
  };
  avatar?: string | null;
  status?: TStatus;
  mark?: number;
  maxMark?: number;
};
const props = withDefaults(defineProps<StudentCardProps>(), {
  status: 'to_do',
  avatar: undefined,
  mark: undefined,
  maxMark: undefined,
  group: undefined,
});
const dateColor = computed(() => {
  const mapedColors = {
    to_do: 'secondary',
    in_progress: 'blue',
    in_review: 'orange',
    done: 'green',
  };
  return mapedColors[props.status] as 'secondary' | 'blue' | 'orange' | 'green';
});
const formattedDate = computed(() => {
  try {
    return format(props.date, `d MMM y`, {
      locale: i18n.locale.value === 'pt' ? ptBR : enIN,
    });
  } catch (e) {
    return '';
  }
});
</script>

<style scoped>
.border-1 {
  border: 1px solid rgb(var(--v-border-color));
}
.min-w-300 {
  min-width: 300px;
}
</style>
