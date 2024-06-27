<template>
  <div
    class="d-flex align-center ga-2 pa-2 list-card"
    @click="$emit('to-profile')"
  >
    <v-img
      class="avatar flex-0-0 rounded-circle"
      :src="
        member.avatarUrl ||
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
      "
      :alt="$t('components.learningPlan.members.member.label')"
      aspect-ratio="1"
      cover
    />

    <div class="flex-1-1">
      <span class="text-body-4 text-gray-800">{{
        member.name ||
        '(' + $t('components.learningPlan.members.missing.name') + ')'
      }}</span>

      <span class="text-body-3 text-gray-400 tw-ml-2">{{
        `(${
          member.class || $t('components.learningPlan.members.missing.class')
        })`
      }}</span>
    </div>

    <alex-custom-chip
      v-if="member.pending"
      :text="$t('components.learningPlan.members.member.pending')"
      size="small"
      status="secondary"
      variant="outlined"
    />
    <alex-custom-button
      icon="mdi-trash-can-outline"
      size="small"
      variant="text"
      @click.stop="$emit('remove-click')"
    />
  </div>

  <hr class="tw-w-full" />
</template>

<script setup lang="ts">
interface MemberProps {
  name?: string;
  avatarUrl?: string;
  class?: string;
  pending?: boolean;
  submitted?: boolean;
  accepted?: boolean;
}

interface CompProps {
  member: MemberProps;
}

defineProps<CompProps>();
defineEmits(['remove-click', 'to-profile']);
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
