<script setup lang="ts">
import { FilterItemProps } from '~/components/alex/project/members/Drawer.vue';
import { isEnumValue } from '~/utils';
import { contains } from '~/utils/contains';
import { LearningPlanMemberSimple, MemberRoles } from '#imports';

definePageMeta({
  middleware: 'auth',
});

const { t } = useI18n();
const route = useRoute();
const search = ref('');
const filterDrawer = ref(false);
const disableInvite = ref<boolean>(true);
const learningPlanStore = useLearningPlanStore();
const user = useStrapiUser();

const filters: FilterItemProps[] = [
  {
    label: t('components.learningPlan.projects.role'),
    placeholder: t('components.learningPlan.projects.collaborator'),
    items: [MemberRoles.COLLABORATOR, MemberRoles.FACILITATOR, MemberRoles.PARTNER, MemberRoles.STUDENT],
  },
  {
    label: t('components.learningPlan.projects.status'),
    placeholder: t('components.learningPlan.projects.pending'),
    items: [MemberStatus.PENDING_INVITATION, MemberStatus.JOINED],
  },
];

const projectMembers = computed(() => learningPlanStore.learningPlan?.members || []);
const activeMembers = ref<LearningPlanMemberSimple[]>(projectMembers.value);
const selectedFilters = ref<string[]>([]);

const filterMembers = (values) => {
  const isThereRole = !!values['0'];
  const isThereStatus = !!values['1'];

  selectedFilters.value = [];
  if (isThereRole) selectedFilters.value.push(values['0']);
  if (isThereStatus) selectedFilters.value.push(values['1']);

  activeMembers.value = projectMembers.value.filter(
    (member) => (!isThereRole || member.role === values['0']) && (!isThereStatus || member.status === values['1']),
  );

  handleToggleDrawer();
};

const expiresAtDate = computed(() => {
  if (!learningPlanStore.invitationLink || learningPlanStore.invitationLink.is_expired) return null;

  return new Date(learningPlanStore.invitationLink?.expires_at);
});

const removeFilter = (key: string) => {
  selectedFilters.value = selectedFilters.value.filter((filter) => filter !== key);

  if (selectedFilters.value.length === 0) {
    activeMembers.value = projectMembers.value;
    return;
  }

  selectedFilters.value.forEach((filter) => {
    if (isEnumValue(MemberStatus, filter)) {
      activeMembers.value = projectMembers.value.filter((member) => member.status === filter);
    } else if (isEnumValue(MemberRoles, filter)) {
      activeMembers.value = projectMembers.value.filter((member) => member.role === filter);
    }
  });
};

const handleToggleDrawer = () => {
  filterDrawer.value = !filterDrawer.value;
};

const updateSearch = (value: string) => {
  const isThereRole = selectedFilters.value.findIndex((filter) => isEnumValue(MemberRoles, filter)) !== -1;
  const isThereStatus = selectedFilters.value.findIndex((filter) => isEnumValue(MemberStatus, filter)) !== -1;

  activeMembers.value = projectMembers.value.filter((member) => {
    return (
      (!isThereRole || member.role === selectedFilters.value[0]) &&
      (!isThereStatus || member.status === selectedFilters.value[1]) &&
      (contains(member.email, value) || contains(member.user.fullname, value))
    );
  });
};

onMounted(() => {
  learningPlanStore.loadLearningPlan(+route.params.id);
});

watch(
  () => learningPlanStore.loading,
  () => {
    activeMembers.value = learningPlanStore.learningPlan?.members || [];

    if (learningPlanStore.loading) {
      return;
    }

    const member = learningPlanStore.learningPlan?.members?.find((member) => member?.user?.id === user.value?.id);

    if (['student_leader', 'facilitator'].includes(member?.role ?? '')) {
      disableInvite.value = false;
    }
  },
);
// :disable-invite="!learningPlanStore.learningPlan?.invite_enabled"
</script>

<template>
  <alex-custom-card :title="$t('pages.projects.common.members')">
    <template #content>
      <alex-project-members-table
        :data="activeMembers"
        :search="search"
        :learning-plan-id="learningPlanStore.learningPlan?.id"
        :invitation-duration="learningPlanStore.learningPlan?.invitation_duration"
        :active-invite-id="learningPlanStore.learningPlan?.id"
        :invite-link-hash="learningPlanStore.invitationLink?.hash"
        :invite-link-expires-at="expiresAtDate"
        :disable-invite="disableInvite"
        :title="$t('components.learningPlan.drawer.filter')"
        :can-edit="disableInvite"
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
