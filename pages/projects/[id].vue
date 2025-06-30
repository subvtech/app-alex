<script setup lang="ts">
import { TabType } from '~/components/alex/custom/Tabs.vue';

definePageMeta({
  middleware: ['auth'],
  pageTransition: true,
  validate({ params: { id } }) {
    return id && Number.isNaN(+id)
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
const learningPlanStore = useLearningPlanStore();

const { id: projectId } = route.params;

const activeTab = computed(() => route.path.split('/').pop());
const isJoinRoute = computed(() => route.name === 'projects-id-join-hash');
const isSettingsRoute = computed(() => route.name === 'projects-id-settings');

const generalLinks = computed<TabType[]>(() => [
  {
    label: t('pages.projects.common.overview'),
    value: 'overview',
    to: `/projects/${projectId}/overview`,
  },
  {
    label: t('pages.projects.common.documents'),
    value: 'documents',
    to: `/projects/${projectId}/documents`,
  },
  {
    label: t('pages.projects.common.tasks'),
    value: 'tasks',
    to: `/projects/${projectId}/tasks`,
  },
  {
    label: t('pages.projects.common.members'),
    value: 'members',
    to: `/projects/${projectId}/members`,
  },
  {
    label: t('pages.projects.common.individual_learning'),
    value: 'individual_learning',
    to: `/projects/${projectId}/individual_learning`,
  },
  ...(learningPlanStore.userIsFacilitator
    ? [
        {
          label: '',
          icon: 'mdi-cog-outline',
          value: 'settings',
          to: `/projects/${projectId}/settings`,
          classes: 'ml-auto',
        },
      ]
    : []),
]);

const fetchData = async () => {
  headerStore.showHeader = true;
  await learningPlanStore.loadLearningPlan(+projectId);
  headerStore.isLoading = false;

  if (!learningPlanStore.learningPlan) {
    return navigateTo('/projects/me');
  }

  if (isSettingsRoute.value && !learningPlanStore.userIsFacilitator) {
    return navigateTo(`/projects/${projectId}`);
  }

  const isGuest =
    !learningPlanStore.userIsFacilitator &&
    !learningPlanStore.userIsActiveMember &&
    !learningPlanStore.userIsPendingMember;

  if (isGuest && !isJoinRoute.value) {
    return await navigateTo('/projects/me');
  }

  if (!isGuest && learningPlanStore.userIsPendingMember && !isJoinRoute.value) {
    const invite = learningPlanStore.learningPlan?.invitation_links.find(
      (v) => v.emails_to_send?.includes(user?.value?.email),
    );

    if (invite) {
      return navigateTo(`/projects/${projectId}/join/${invite.hash}`);
    }
  }
};

const changeRoute = (slug: string) => {
  navigateTo(`${route.path.split('/').slice(0, -1).join('/')}/${slug}`);
};

watch(
  () => route.name,
  () => {
    const page = route.name?.toString() || '';
    if (page.includes('projects-id')) fetchData();
  },
);

watch(
  () => `${learningPlanStore.loading}-${route.path}`,
  () => {
    if (learningPlanStore.loading) return;
    const slug = route.name?.toString()?.split('-').at(-1);
    const { memberId } = route.params; // Need to be here to get the updated memberId

    headerStore.title = t('pages.projects.common.my_projects');
    headerStore.items = [
      {
        title: t('pages.projects.common.my_projects'),
        to: '/projects/me',
      },
      {
        title: learningPlanStore.learningPlan?.title || '',
        to: `/projects/${projectId}/overview`,
        disabled: /projects\/[0-9]+\/overview/.test(route.path),
      },
    ];

    ['documents', 'members', 'individual_learning', 'tasks'].forEach((path) => {
      if (new RegExp(`projects/[0-9]+/${path}`).test(route.path)) {
        headerStore.items.push({
          title: t(`pages.projects.common.${path}`),
          to: `/projects/${projectId}/${path}`,
          disabled: !memberId,
        });
      }
    });

    if (new RegExp(`projects/[0-9]+/individual_learning/[0-9]+/${slug}`).test(route.path)) {
      headerStore.title = t('pages.projects.common.individual_learning');
      headerStore.items.push({
        title: t(`pages.projects.individual_learning.${slug}`),
        disabled: true,
        to: `/projects/${projectId}/individual_learning/${memberId}/${slug}`,
      });
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
  <section class="tw-flex tw-flex-col tw-flex-grow">
    <alex-custom-banner
      v-if="!route.meta?.hideLearningPlanBanner"
      darker-background
      is-professor
      show-menu
      show-profile-picture
      show-shade
      distribution="fullname-username-role"
      :copy-object="
        learningPlanStore.activeInvitationLinkUrl && learningPlanStore.userIsFacilitator
          ? { copyText: learningPlanStore.activeInvitationLinkUrl, label: $t('pages.courses.invite') }
          : undefined
      "
      :cover-picture="learningPlanStore.learningPlan?.cover_image"
      :description="learningPlanStore.learningPlan?.title"
      :end-date="learningPlanStore.endDateFormated"
      :fullname="learningPlanStore.facilitator?.user?.fullname"
      :links="isJoinRoute ? [] : generalLinks"
      :loading="learningPlanStore.loading && !learningPlanStore.learningPlan"
      :profile-picture-size="24"
      :profile-picture="learningPlanStore.facilitator?.user?.avatar"
      :selected-option="activeTab"
      :settings="{ label: '', icon: 'mdi-cog-outline', value: 5, to: `/projects/${projectId}/settings` }"
      :show-settings="learningPlanStore.userIsFacilitator"
      :start-date="learningPlanStore.startDateFormated"
      :user-id="user?.id"
      @select:option="changeRoute"
    />
    <NuxtPage @update="fetchData" />
  </section>
</template>
