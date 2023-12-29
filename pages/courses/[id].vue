<template>
  <div>
    <alex-custom-banner
      v-if="
        learningPlan && !route.meta?.hideLearningPlanBanner
      "
      :cover-picture="learningPlanStore.learningPlan?.cover_image"
      :profile-picture-size="24"
      :profile-picture="learningPlanStore.facilitator?.user.avatar"
      :user-id="user.id"
      show-profile-picture
      darker-background
      show-shade
      show-menu
      settings-menu
      :title="$t('pages.courses.class')"
      :show-settings="learningPlanStore.userIsFacilitator"
      distribution="fullname-username-role"
      is-professor
      :fullname="learningPlanStore.facilitator?.user?.fullname"
      :description="learningPlanStore.learningPlan?.title"
      :subtitle="learningPlanStore.learningPlan?.class_name"
      :start-date="learningPlanStore.startDateFormated"
      :end-date="learningPlanStore.endDateFormated"
      :links="learningPlanStore.userIsFacilitator ? links : links.slice(0, -1)"
      :selected-option="selectedOption"
      :copy-object="
        learningPlanStore.activeInvitationLinkUrl
          ? {
              label: $t('pages.courses.invite'),
              copyText: learningPlanStore.activeInvitationLinkUrl,
            }
          : undefined
      "
      @select:option="selectOption"
      @display:settings="selectOption(8)"
    />
    <NuxtPage @update="fetchData()" />
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

definePageMeta({
  middleware: 'auth',
});

const i18n = useI18n();

const user = useStrapiUser<User>();

// const { find, findOne, update } = useStrapi();
const route = useRoute();
const learningPlanStore = useLearningPlanStore();
const { learningPlan } = toRefs(learningPlanStore);
const learningPlanId = computed(() => parseInt(route.params?.id.toString()));

const selectedOption = ref(0);

const fetchData = async () => {
  await useAsyncData('user', () =>
    learningPlanStore.loadLearningPlan(learningPlanId.value),
  );
};

const selectOption = (index) => {
  selectedOption.value = index;
};

const links = computed(() => [
  {
    label: i18n.t('pages.courses.general'),
    value: '0',
    to: learningPlanStore.learningPlan
      ? `/courses/${learningPlanStore.learningPlan?.id}`
      : route.path,
  },
  {
    label: i18n.t('pages.courses.trails'),
    value: '1',
    to: `/courses/${learningPlanStore.learningPlan?.id}/trails`,
  },
  {
    label: i18n.t('pages.courses.assignments'),
    value: '2',
    to: `/courses/${learningPlanStore.learningPlan?.id}/tasks`,
  },
  {
    label: i18n.t('pages.courses.class'),
    value: '3',
    to: `/courses/${learningPlanStore.learningPlan?.id}/class`,
  },
  {
    label: i18n.t('pages.courses.projects'),
    value: '4',
    to: `/courses/${learningPlanStore.learningPlan?.id}/projects`,
  },
  {
    label: '',
    icon: 'mdi-cog-outline',
    value: '5',
    to: `/courses/${learningPlanStore.learningPlan?.id}/settings`,
  },

]);
</script>
