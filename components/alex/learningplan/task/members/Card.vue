<template>
  <div
    class="d-flex align-center ga-2 pa-2"
    :class="{ 'list-card': clickable }"
    @click="clickable && $emit('to-profile')"
  >
    <v-img
      v-if="!member.group"
      class="avatar flex-0-0 rounded-circle"
      :src="
        member.avatarUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
      "
      :alt="$t('components.learningPlan.members.member.label')"
      aspect-ratio="1"
      cover
    />
    <div v-else class="avatar bg-gray-blue tw-grid tw-place-items-center tw-rounded-full">
      <v-icon class="text-gray-600" size="small">mdi-account-group-outline</v-icon>
    </div>

    <div class="flex-1-1">
      <span class="text-body-4 text-gray-800 tw-line-clamp-1">{{
        member.name || '(' + $t('components.learningPlan.members.missing.name') + ')'
      }}</span>

      <span v-if="!noClass" class="text-body-3 text-gray-400 tw-ml-2">{{
        `(${member.class || $t('components.learningPlan.members.missing.class')})`
      }}</span>
    </div>

    <alex-custom-avatar-group v-if="member.participants" :avatar-items="member.participants" class="tw-ml-2" />

    <alex-custom-chip
      v-if="member.responsable"
      :class="toggleResponsible && 'tw-cursor-pointer hover:tw-opacity-80'"
      status="primary"
      :text="$t('pages.classes.responsible')"
      size="x-small"
      @click="
        () => {
          if (toggleResponsible) {
            $emit('responsible', false);
          }
        }
      "
    />
    <alex-custom-chip
      v-if="!member.responsable && toggleResponsible"
      class="tw-opacity-10 hover:tw-opacity-30 tw-cursor-pointer"
      status="primary"
      :text="$t('pages.classes.responsible')"
      size="x-small"
      @click="$emit('responsible', true)"
    />

    <alex-custom-button
      v-if="edit && member.group"
      icon="mdi-pencil-outline"
      size="small"
      variant="text"
      @click.stop="$emit('edit-click')"
    />
    <alex-custom-button
      v-if="edit && !member.responsable"
      icon="mdi-trash-can-outline"
      size="small"
      variant="text"
      @click.stop="$emit('remove-click')"
    />
    <alex-custom-button
      v-else-if="edit && member.responsable && toggleResponsible"
      class="tw-opacity-60"
      icon="mdi-trash-can-outline"
      size="small"
      variant="text"
    />
  </div>

  <hr class="tw-w-full" />
</template>

<script setup lang="ts">
import { emit } from 'process';

interface MemberProps {
  name?: string;
  avatarUrl?: string;
  responsable?: boolean;
  class?: string;
  group?: boolean;
  participants?: { name: string; image: { url: string } }[];
}

interface CompProps {
  member: MemberProps;
  noClass?: boolean;
  edit?: boolean;
  clickable?: boolean;
  toggleResponsible?: boolean;
}

withDefaults(defineProps<CompProps>(), {
  noClass: false,
  edit: true,
  clickable: true,
});
defineEmits(['remove-click', 'to-profile', 'edit-click', 'responsible']);
</script>

<style scoped>
.avatar {
  width: 32px;
  height: 32px;
}
.list-card {
  cursor: pointer;
  border-radius: 8px;
}
.list-card:hover {
  background: rgb(var(--v-theme-gray-blue)) !important;
}
.list-card:active {
  background: rgb(var(--v-theme-gray-100)) !important;
}
</style>
