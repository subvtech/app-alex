<template>
  <alex-custom-card :title="$t('components.profile.projects.title')">
    <template #content>
      <alex-project-members-table
        :data="learningPlanStore.activeMembers"
        :search="search"
        :title="$t('components.learningPlan.drawer.filter')"
        :can-edit="learningPlanStore.userIsFacilitator"
        @toggle:drawer="handleToggleDrawer"
      />

      <alex-project-members-drawer
        ref="filterRef"
        v-model="filterDrawer"
        :title="$t('components.learningPlan.drawer.filter')"
        :filters="filters"
        @filter="(e) => console.log(e)"
      />
    </template>
    <template #footer>
      <pre>{{
        { userIsFacilitator: learningPlanStore.userIsFacilitator }
      }}</pre>
    </template>
  </alex-custom-card>
</template>
<script setup lang="ts">
import { FilterItemProps } from '~/components/alex/project/members/Drawer.vue';
const { t } = useI18n();
definePageMeta({
  middleware: 'auth',
});

const search = ref('');
const filterDrawer = ref(false);
const learningPlanStore = useLearningPlanStore();

const filters: FilterItemProps[] = [
  {
    label: t('components.learningPlan.projects.role'),
    placeholder: t('components.learningPlan.projects.collaborator'),
    items: [
      MemberRoles.COLLABORATOR,
      MemberRoles.FACILITATOR,
      MemberRoles.PARTNER,
      MemberRoles.STUDENT,
    ],
  },
  {
    label: t('components.learningPlan.projects.status'),
    placeholder: t('components.learningPlan.projects.pending'),
    items: [MemberStatus.PENDING_INVITATION, MemberStatus.JOINED],
  },
];

const handleToggleDrawer = () => {
  filterDrawer.value = !filterDrawer.value;
};
</script>
