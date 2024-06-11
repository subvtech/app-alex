<template>
  <div class="members">
    <!-- Header -->
    <div class="header d-flex align-center py-4 px-2">
      <alex-inputs-text-field
        name="member"
        class="w-50"
        :placeholder="$t('components.learningPlan.members.search')"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        clearable
      />

      <alex-learningplan-task-members-invite :learningplan-id="learningplanId">
        <template #activator="{ menuProps }">
          <alex-custom-button
            v-bind="menuProps"
            class="ml-auto"
            variant="secondary"
            prepend-icon="mdi-plus"
            >{{
              $t('components.learningPlan.members.invite.label')
            }}</alex-custom-button
          >
        </template>
      </alex-learningplan-task-members-invite>
    </div>

    <!-- Cards -->
    <div v-if="members.length">
      <alex-learningplan-task-members-card
        v-for="(member, index) in members"
        :key="index"
        :member="member"
      />
    </div>
    <div
      v-else
      class="d-flex align-center justify-center flex-column ga-4 text-center"
    >
      <img
        class="no-members-svg"
        src="/svg/no-members.svg"
        :alt="$t('components.learningPlan.members.missing.member')"
        role="no-members"
      />
      <p class="text-body-3 text-gray-400">
        {{ $t('components.learningPlan.members.missing.member') }}
      </p>
    </div>

    <!-- Menu -->
    <div v-if="members.length" class="d-flex align-center ga-2 pa-6">
      <span class="flex-1-1"
        >Exibindo {{ page }} a {{ page + members.length }} de
        {{ pages }} resultados</span
      >
      <alex-custom-pagination v-model="page" :length="3" :total-visible="3" />
    </div>
  </div>
</template>

<script setup lang="ts">
const pages: number = 30;
const page = ref<number>(1);

interface MemberProps {
  name: string;
  avatarUrl?: string;
  class?: string;
  pending?: boolean;
  submitted?: boolean;
  accepted?: boolean;
}
interface MembersProps {
  members?: MemberProps[];
  learningplanId: number;
}
withDefaults(defineProps<MembersProps>(), { members: () => [] });
</script>

<style>
.no-members-svg {
  opacity: 0.6;
  mix-blend-mode: luminosity;
  width: 150px;
  height: 111.829px;
}
.members .v-input__details {
  display: none !important;
}
</style>
