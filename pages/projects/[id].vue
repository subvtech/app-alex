<template>
  <section>
    <alex-custom-banner
      v-if="!route.meta?.hideLearningPlanBanner"
      :loading="learningPlanStore.loading && !learningPlanStore.learningPlan"
      :cover-picture="learningPlanStore.learningPlan?.cover_image"
      :profile-picture-size="24"
      :profile-picture="learningPlanStore.facilitator?.user?.avatar"
      :user-id="user.id"
      :show-settings="learningPlanStore.userIsFacilitator"
      distribution="fullname-username-role"
      :fullname="learningPlanStore.facilitator?.user?.fullname"
      :description="learningPlanStore.learningPlan?.title"
      :start-date="learningPlanStore.startDateFormated"
      :end-date="learningPlanStore.endDateFormated"
      :links="isJoinRoutePath ? [] : generalLinks"
      :selected-option="currentRouteTab"
      :copy-object="
        learningPlanStore.activeInvitationLinkUrl &&
        learningPlanStore.userIsFacilitator
          ? {
              label: $t('pages.courses.invite'),
              copyText: learningPlanStore.activeInvitationLinkUrl,
            }
          : undefined
      "
      :settings="{
        label: '',
        icon: 'mdi-cog-outline',
        value: 5,
        to: `/projects/${learningPlanId}/settings`,
      }"
      show-profile-picture
      darker-background
      show-shade
      show-menu
      is-professor
      @select:option="selectRouteTab"
    />
    <NuxtPage @update="fetchData" />
  </section>
</template>
<script setup lang="ts">
import { TabType } from '~/components/alex/custom/Tabs.vue';

definePageMeta({
  middleware: ['auth'],
  pageTransition: true,
  validate: (route) => {
    // Check if the id is made up of digits
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id);
  },
});

const { t } = useI18n();
const user = useStrapiUser<User>();
const route = useRoute();
const { id } = route.params;
const headerStore = usePageHeaderStore();
const currentRouteTab = ref<number | null>(null);
const learningPlanStore = useLearningPlanStore();
const isJoinRoutePath = computed(() => {
  if (!route?.name) {
    return false;
  }
  const isRoute = route.name === 'projects-id-join-hash';

  return isRoute;
});

// Computed
const isSettingsRoutePath = computed(() => {
  return route.name === 'projects-id-settings';
});
const learningPlanId = computed(() => parseInt(route.params?.id.toString()));
const pageRoute = computed(() => route.name);
const generalLinks = computed<TabType[]>(() => [
  {
    label: 'Painel',
    value: 0,
    to: `/projects/${learningPlanId.value}`,
  },
  {
    label: 'Documentos',
    value: 1,
    to: `/projects/${learningPlanId.value}/documents`,
  },
  {
    label: 'Tarefas',
    value: 2,
    to: `/projects/${learningPlanId.value}/tasks`,
  },
  {
    label: 'Integrantes',
    value: 3,
    to: `/projects/${learningPlanId.value}/members`,
  },
  {
    label: 'Jornada Individual',
    value: 4,
    to: `/projects/${learningPlanId.value}/individual_learning`,
  },
  ...(learningPlanStore.userIsFacilitator
    ? [
        {
          label: '',
          icon: 'mdi-cog-outline',
          value: 5,
          to: `/projects/${learningPlanId.value}/settings`,
          classes: 'ml-auto',
        },
      ]
    : []),
]);

// Functions
const fetchData = async () => {
  headerStore.showHeader = true;
  await learningPlanStore.loadLearningPlan(learningPlanId.value);
  headerStore.isLoading = false;
  if (!learningPlanStore.learningPlan) {
    return navigateTo('/projects');
  }

  if (isSettingsRoutePath.value && !learningPlanStore.userIsFacilitator) {
    return navigateTo(`/projects/${learningPlanId.value}`);
  }

  if (
    !learningPlanStore.userIsFacilitator &&
    !learningPlanStore.userIsActiveMember &&
    !learningPlanStore.userIsPendingMember &&
    !isJoinRoutePath.value
  ) {
    return navigateTo('/projects/me');
  }

  if (learningPlanStore.userIsPendingMember && !isJoinRoutePath.value) {
    const invite = learningPlanStore.learningPlan?.invitation_links.find(
      (i) => i.emails_to_send?.includes(user?.value?.email),
    );

    if (invite) {
      return navigateTo(
        `/projects/${learningPlanId.value}/join/${invite.hash}`,
      );
    }
  }
};
const selectRouteTab = (index: number | null) => {
  currentRouteTab.value = index;
};

// LifeCycle
onBeforeMount(async () => {
  headerStore.isLoading = true;
  await fetchData();
});

onBeforeUnmount(() => {
  learningPlanStore.learningPlan = undefined;
  learningPlanStore.loading = true;
  headerStore.isLoading = true;
});

watch(pageRoute, async () => {
  const page = pageRoute.value?.toString() || '';
  if (page.includes('projects-id')) {
    await fetchData();
  }
});

watch(
  () => learningPlanStore.loading,
  () => {
    if (!learningPlanStore.loading) {
      headerStore.title = t('pages.projects.myProjects');
      headerStore.items = [
        {
          title: t('pages.projects.myProjects'),
          to: '/',
          disabled: true,
        },
        {
          title: t('pages.projects.myProjects'),
          to: '/projects/me',
          disabled: false,
        },
        {
          title: learningPlanStore.learningPlan?.title || '',
          to: `/projects/${id}`,
          disabled: true,
        },
      ];
    }
  },
);
</script>
