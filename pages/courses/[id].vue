<template>
  <section>
    <alex-custom-banner
      v-if="!route.meta?.hideLearningPlanBanner"
      :loading="learningPlanStore.loading && !learningPlanStore.learningPlan"
      :cover-picture="learningPlanStore.learningPlan?.cover_image"
      :profile-picture-size="24"
      :profile-picture="learningPlanStore.facilitator?.user?.avatar"
      :user-id="user.id"
      :title="bannerTitle.title"
      :show-settings="learningPlanStore.userIsFacilitator"
      distribution="fullname-username-role"
      :fullname="learningPlanStore.facilitator?.user?.fullname"
      :description="learningPlanStore.learningPlan?.title"
      :subtitle="bannerTitle.subtitle"
      :start-date="learningPlanStore.startDateFormated"
      :end-date="learningPlanStore.endDateFormated"
      :links="isJoinRoutePath ? [] : generalLinks"
      :selected-option="selectedOption"
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
        to: `/courses/${learningPlanId}/settings`,
      }"
      show-profile-picture
      darker-background
      show-shade
      show-menu
      is-professor
      @select:option="selectOption"
    />
    <NuxtPage @update="fetchData" />
  </section>
</template>
<script setup lang="ts">
import { TabType } from '~/components/alex/custom/Tabs.vue';

definePageMeta({
  middleware: 'auth',
});

const i18n = useI18n();
const user = useStrapiUser<User>();
const route = useRoute();
const learningPlanStore = useLearningPlanStore();
const isJoinRoutePath = computed(() => {
  if (!route?.name) {
    return false;
  }
  const isRoute = route.name === 'courses-id-join-hash';

  return isRoute;
});

const isSettingsRoutePath = computed(() => {
  return (
    route.name === 'courses-id-settings' ||
    route.name === 'courses-id-trails-trailid-settings'
  );
});

const learningPlanId = computed(() => parseInt(route.params?.id.toString()));
const headerStore = usePageHeaderStore();
const selectedOption = ref<number | null>(null);
const fetchData = async () => {
  await useAsyncData('learningPlanDetails', () =>
    learningPlanStore.loadLearningPlan(learningPlanId.value),
  );

  headerStore.isLoading = false;
  if (!learningPlanStore.learningPlan) {
    return navigateTo('/');
  }

  if (isSettingsRoutePath.value && !learningPlanStore.userIsFacilitator) {
    return navigateTo(`/courses/${learningPlanId.value}`);
  }

  if (
    !learningPlanStore.userIsFacilitator &&
    !learningPlanStore.userIsActiveMember &&
    !learningPlanStore.userIsPendingMember &&
    !isJoinRoutePath.value
  ) {
    return navigateTo('/courses/me');
  }

  if (learningPlanStore.userIsPendingMember && !isJoinRoutePath.value) {
    const invite = learningPlanStore.learningPlan?.invitation_links.find(
      (i) => {
        return i.emails_to_send?.includes(user?.value?.email);
      },
    );

    if (invite) {
      return navigateTo(`/courses/${learningPlanId.value}/join/${invite.hash}`);
    }
  }
};
const pageRoute = computed(() => route.name);

const bannerTitle = computed(() => {
  if (learningPlanStore.userIsFacilitator) {
    return {
      title: i18n.t('pages.courses.identifier'),
      subtitle: learningPlanStore.learningPlan?.slug,
    };
  }
  return {
    title: i18n.t('pages.courses.class'),
    subtitle: learningPlanStore.userClass?.name,
  };
});

onBeforeMount(async () => {
  headerStore.isLoading = true;
  await fetchData();
});

onUnmounted(() => {
  learningPlanStore.learningPlan = undefined;
  learningPlanStore.loading = true;
  headerStore.isLoading = false;
});

watch(pageRoute, async () => {
  if ((pageRoute.value?.toString() || '').includes('courses-id')) {
    await fetchData();
  }
});

const selectOption = (index: number | null) => {
  selectedOption.value = index;
};

const generalLinks = computed<TabType[]>(() => [
  {
    label: i18n.t('pages.courses.general'),
    value: 0,
    to: `/courses/${learningPlanId.value}`,
  },
  {
    label: i18n.t('pages.courses.trails'),
    value: 1,
    to: `/courses/${learningPlanId.value}/trails`,
  },
  // {
  //   label: i18n.t('pages.courses.assignments'),
  //   value: 2,
  //   to: `/courses/${learningPlanId.value}/tasks`,
  // },
  {
    label: i18n.t('pages.courses.classes'),
    value: 3,
    to: `/courses/${learningPlanId.value}/class`,
  },
  // {
  //   label: i18n.t('pages.courses.projects'),
  //   value: 4,
  //   to: `/courses/${learningPlanId.value}/projects`,
  // },
  ...(learningPlanStore.userIsFacilitator
    ? [
        {
          label: '',
          icon: 'mdi-cog-outline',
          value: 5,
          to: `/courses/${learningPlanId.value}/settings`,
          classes: 'ml-auto',
        },
      ]
    : []),
]);
</script>
