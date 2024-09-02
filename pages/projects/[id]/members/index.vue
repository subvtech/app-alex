<template>
  <alex-custom-card :title="$t('components.profile.projects.title')">
    <template #content>
      <alex-project-members-table
        :data="activeMembers"
        :search="search"
        :title="$t('components.learningPlan.drawer.filter')"
        :can-edit="learningPlanStore.userIsFacilitator"
        :active-filters="selectedFilters"
        @toggle:drawer="handleToggleDrawer"
        @remove:filter="removeFilter"
      />

      <alex-project-members-drawer
        ref="filterRef"
        v-model="filterDrawer"
        :title="$t('components.learningPlan.drawer.filter')"
        :filters="filters"
        @filter="filterMembers"
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
const activeMembers = ref(learningPlanStore.activeMembers);

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

const selectedFilters = ref<string[]>([]);

const filterMembers = (values) => {
  const roleValue = values['0'];
  const statusValue = values['1'];
  selectedFilters.value = [];
  if (roleValue) {
    selectedFilters.value.push(roleValue);
    activeMembers.value = learningPlanStore.activeMembers.filter(
      (member) => member.role === roleValue,
    );
  }
  if (statusValue) {
    selectedFilters.value.push(statusValue);
    activeMembers.value = learningPlanStore.activeMembers.filter(
      (member) => member.status === statusValue,
    );
  }
  handleToggleDrawer();
};

const removeFilter = (key: string) => {
  selectedFilters.value = selectedFilters.value.filter(
    (filter) => filter !== key,
  );
  selectedFilters.value.forEach((filter) => {
    if (filter in MemberStatus)
      activeMembers.value = learningPlanStore.activeMembers.filter(
        (member) => member.status === filter,
      );
  });
};

const handleToggleDrawer = () => {
  filterDrawer.value = !filterDrawer.value;
};
</script>
