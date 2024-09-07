<script setup lang="ts">
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { ptBR, enIN } from 'date-fns/locale';
const i18n = useI18n();
type TaskCardProps = {
  name: string;
  participants: { name: string; image?: { url: string } }[];
  date?: Date | null;
  tags?: TagSimple[];
};
const props = withDefaults(defineProps<TaskCardProps>(), {
  group: undefined,
  date: undefined,
  tags: () => [],
});

const formattedDate = computed(() =>
  props.date
    ? format(props.date, `d MMM y`, {
        locale: i18n.locale.value === 'pt' ? ptBR : enIN,
      })
    : '',
);
</script>

<template>
  <div class="d-flex flex-column border-1 border-gray-100 rounded-lg pa-4 text-gray-800 card-kanban bg-white">
    <div v-if="tags.length > 0" class="tw-flex tw-flex-wrap tw-gap-2 tw-mb-2">
      <alex-custom-chip v-for="tag in tags" :key="tag.id" :text="tag.text" size="small" class="tw-w-fit" />
    </div>
    <p class="text-body-2 ellipsis lines-1 w-100">
      {{ name }}
    </p>
    <div class="d-flex tw-gap-2 align-center tw-mt-2">
      <alex-custom-avatar-group :avatar-items="participants" :size="34" class="ml-2 tw-mr-auto" />
      <alex-custom-chip v-if="date" :text="formattedDate" size="small" prepend-icon="mdi-calendar-range" />
    </div>
  </div>
</template>

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
