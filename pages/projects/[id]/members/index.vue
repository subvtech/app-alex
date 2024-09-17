<template>
  <alex-custom-card :title="$t('components.profile.projects.title')">
    <template #content>
      <alex-project-members-table
        :data="activeMembers"
        :search="search"
        :learning-plan-id="learningPlanStore.learningPlan?.id"
        :invitation-duration="
          learningPlanStore.learningPlan?.invitation_duration
        "
        :active-invite-id="learningPlanStore.learningPlan?.id"
        :invite-link-hash="learningPlanStore.invitationLink?.hash"
        :invite-link-expires-at="expiresAtDate"
        :disable-invite="!learningPlanStore.learningPlan?.invite_enabled"
        :title="$t('components.learningPlan.drawer.filter')"
        :can-edit="learningPlanStore.userIsFacilitator"
        :active-filters="selectedFilters"
        @toggle:drawer="handleToggleDrawer"
        @remove:filter="removeFilter"
        @update:search="updateSearch"
      />

      <alex-project-members-drawer
        ref="filterRef"
        v-model="filterDrawer"
        :title="$t('components.learningPlan.drawer.filter')"
        :filters="filters"
        @filter="filterMembers"
      />
    </template>
  </alex-custom-card>
</template>
<script setup lang="ts">
import { LearningPlanMemberSimple, MemberRoles } from '#imports';
import { FilterItemProps } from '~/components/alex/project/members/Drawer.vue';
import { isEnumValue } from '~/utils';
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

// Watch for changes in the store's activeMembers

const projectMembers = computed(
  () => learningPlanStore.learningPlan?.members || [],
);
const activeMembers = ref<LearningPlanMemberSimple[]>(projectMembers.value);
const selectedFilters = ref<string[]>([]);

const filterMembers = (values) => {
  selectedFilters.value = [];
  const isThereRole = !!values['0'];
  const isThereStatus = !!values['1'];
  if (isThereRole) selectedFilters.value.push(values['0']);
  if (isThereStatus) selectedFilters.value.push(values['1']);
  activeMembers.value = projectMembers.value.filter(
    (member) =>
      (!isThereRole || member.role === values['0']) &&
      (!isThereStatus || member.status === values['1']),
  );
  handleToggleDrawer();
};

const expiresAtDate = computed(() => {
  if (
    !learningPlanStore.invitationLink ||
    learningPlanStore.invitationLink.is_expired
  )
    return null;

  return new Date(learningPlanStore.invitationLink?.expires_at);
});

const removeFilter = (key: string) => {
  selectedFilters.value = selectedFilters.value.filter(
    (filter) => filter !== key,
  );

  if (selectedFilters.value.length === 0) {
    activeMembers.value = projectMembers.value;
    return;
  }
  selectedFilters.value.forEach((filter) => {
    if (isEnumValue(MemberStatus, filter))
      activeMembers.value = projectMembers.value.filter(
        (member) => member.status === filter,
      );
    else if (isEnumValue(MemberRoles, filter))
      activeMembers.value = projectMembers.value.filter(
        (member) => member.role === filter,
      );
  });
};

const handleToggleDrawer = () => {
  filterDrawer.value = !filterDrawer.value;
};

const updateSearch = (value: string) => {
  const isThereRole =
    selectedFilters.value.findIndex((filter) =>
      isEnumValue(MemberRoles, filter),
    ) !== -1;

  const isThereStatus =
    selectedFilters.value.findIndex((filter) =>
      isEnumValue(MemberStatus, filter),
    ) !== -1;
  const lowercaseValue = value.toLowerCase();
  activeMembers.value = projectMembers.value.filter((member) => {
    return (
      (!isThereRole || member.role === selectedFilters.value[0]) &&
      (!isThereStatus || member.status === selectedFilters.value[1]) &&
      (member.email.toLowerCase().includes(lowercaseValue) ||
        member.user.fullname.toLowerCase().includes(lowercaseValue))
    );
  });
};

watch(
  () => learningPlanStore.learningPlan,
  () => {
    console.log('changed');
    activeMembers.value = learningPlanStore.learningPlan?.members || [];
  },
);
</script>
