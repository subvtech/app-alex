<script setup lang="ts">
import { TabType } from '~/components/alex/custom/Tabs.vue';

definePageMeta({
  middleware: ['auth'],
  pageTransition: true,
  validate: (route) => {
    // Check if the id is made up of digits
    return typeof route.params.id === 'string' && /^\D+$/.test(route.params.id)
      ? {
          statusCode: 404,
          cause: 'invalid_params',
          message: 'Invalid params',
        }
      : true;
  },
});

const { t } = useI18n();
const user = useStrapiUser<User>();
const route = useRoute();
const headerStore = usePageHeaderStore();
const currentRouteTab = ref<number | null>(null);
const learningPlanStore = useLearningPlanStore();

const isJoinRoutePath = computed(() => {
  if (!route?.name) return false;
  return route.name === 'projects-id-join-hash';
});

const isSettingsRoutePath = computed(() => {
  return route.name === 'projects-id-settings';
});

const generalLinks = computed<TabType[]>(() => [
  {
    label: t('pages.projects.overview'),
    value: 0,
    to: `/projects/${route.params.id}`,
  },
  {
    label: t('pages.projects.documents'),
    value: 1,
    to: `/projects/${route.params.id}/documents`,
  },
  {
    label: t('pages.projects.tasks'),
    value: 2,
    to: `/projects/${route.params.id}/tasks`,
  },
  {
    label: t('pages.projects.members'),
    value: 3,
    to: `/projects/${route.params.id}/members`,
  },
  {
    label: t('pages.projects.individual_learning'),
    value: 4,
    to: `/projects/${route.params.id}/individual_learning`,
  },
  ...(learningPlanStore.userIsFacilitator
    ? [
        {
          label: '',
          icon: 'mdi-cog-outline',
          value: 5,
          to: `/projects/${route.params.id}/settings`,
          classes: 'ml-auto',
        },
      ]
    : []),
]);

const fetchData = async () => {
  headerStore.showHeader = true;
  await learningPlanStore.loadLearningPlan(+route.params.id);
  headerStore.isLoading = false;

  if (!learningPlanStore.learningPlan) {
    return navigateTo('/projects/me');
  }

  if (isSettingsRoutePath.value && !learningPlanStore.userIsFacilitator) {
    return navigateTo(`/projects/${route.params.id}`);
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
      (v) => v.emails_to_send?.includes(user?.value?.email),
    );

    if (invite) {
      return navigateTo(`/projects/${route.params.id}/join/${invite.hash}`);
    }
  }
};

const selectRouteTab = (index: number | null) => {
  currentRouteTab.value = index;
};

watch(
  () => route.name,
  () => {
    const page = route.name?.toString() || '';
    if (page.includes('projects-id')) fetchData();
  },
);

watch(
  () => learningPlanStore.loading,
  () => {
    if (learningPlanStore.loading) return;
    const { id, memberId } = route.params;
    const slug = route.name?.toString()?.split('-').at(-1);

    headerStore.title = t('pages.projects.my_projects');
    headerStore.items = [
      {
        title: t('pages.projects.my_projects'),
        to: '/projects/me',
      },
      {
        title: learningPlanStore.learningPlan?.title || '',
        to: `/projects/${id}`,
        disabled: !memberId,
      },
    ];

    if (route.path.includes('/individual_learning')) {
      headerStore.items.push({
        title: t('pages.projects.individual_learning'),
        to: `/projects/${id}/individual_learning`,
        disabled: !memberId,
      });

      if (memberId) {
        headerStore.title = t('pages.projects.individual_learning');
        headerStore.items.push({
          title: t(`pages.projects.${slug}`),
          disabled: true,
          to: `/projects/${id}/individual_learning/${memberId}/${slug}`,
        });
      }
    }
  },
);

onBeforeMount(async () => {
  headerStore.isLoading = true;
  await fetchData();
});

onBeforeUnmount(() => {
  learningPlanStore.learningPlan = undefined;
  learningPlanStore.loading = true;
  headerStore.isLoading = true;
});
</script>

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
              copyText: learningPlanStore.activeInvitationLinkUrl,
              label: $t('pages.courses.invite'),
            }
          : undefined
      "
      :settings="{
        label: '',
        icon: 'mdi-cog-outline',
        value: 5,
        to: `/projects/${route.params.id}/settings`,
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
