<template>
  <div
    class="d-flex flex-column border-1 border-gray-100 rounded-lg pa-4 text-gray-800 card-kanban bg-white"
  >
    <div class="d-flex gap-2 align-center">
      <v-avatar
        v-if="!group"
        :size="40"
        :image="avatar || undefined"
        class="alex-avatar-group-border alex-avatar-group-margin"
        color="gray-100"
      >
        <template v-if="!avatar" #default>
          <p class="text-gray-300 text-body-2">
            {{ initials }}
          </p>
        </template>
      </v-avatar>
      <p class="text-body-2 ellipsis lines-1 w-100">
        {{ group ? nameGroup : name }}
      </p>
      <alex-custom-chip
        v-if="mark && maxMark && status === 'done'"
        status="green"
        :text="`${mark}/${maxMark}`"
        size="small"
      />
    </div>
    <div v-if="group" class="d-flex gap-2 align-center mt-2">
      <v-avatar
        :size="24"
        :image="avatar || undefined"
        class="alex-avatar-group-border alex-avatar-group-margin"
        color="gray-100"
      >
        <template v-if="!avatar" #default>
          <p class="text-gray-300 text-body-6">
            {{ initials }}
          </p>
        </template>
      </v-avatar>
      <p class="text-body-5 text-gray-600 ellipsis lines-2">{{ name }}</p>
    </div>
    <div class="d-flex gap-2 justify-end w-100 mt-4">
      <alex-custom-chip
        status="secondary"
        :text="studentClass"
        size="small"
        class="chip"
      />
      <alex-custom-chip
        :status="dateColor"
        :text="formattedDate"
        size="small"
        prepend-icon="mdi-calendar-range"
      />
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
type TaskCardProps = {
  date: Date;
  name: string;
  studentClass: string;
  group?: boolean;
  nameGroup?: string;
  avatar?: string | null;
  status?: TStatus;
  mark?: number;
  maxMark?: number;
};
const props = withDefaults(defineProps<TaskCardProps>(), {
  group: false,
  status: 'to_do',
  avatar: undefined,
  nameGroup: undefined,
  mark: undefined,
  maxMark: undefined,
});
const initials = computed(() => {
  return getInitials(props.name);
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
const formattedDate = computed(() =>
  format(props.date, `d MMM y`, {
    locale: i18n.locale.value === 'pt' ? ptBR : enIN,
  }),
);
</script>

<style scoped>
:global(.card-kanban) {
  user-select: none;
  cursor: pointer;
}
:global(.card-kanban.ghost) {
  filter: brightness(90%);
}
.chip {
  max-width: 50%;
}
@media screen and (min-width: 1600px) {
  .chip {
    max-width: 60%;
  }
}
:deep(.chip .v-chip__content span) {
  overflow: hidden !important;
  text-overflow: ellipsis;
}
:deep(.chip .v-chip__content),
:deep(.chip .v-chip__content span) {
  display: block;
  width: 100%;
}
</style>
