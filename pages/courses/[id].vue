<template>
  <div>
    <alex-custom-banner
      v-if="learningPlan"
      :cover-picture="learningPlanStore.learningPlan?.cover_image"
      :profile-picture-size="24"
      :profile-picture="learningPlanStore.owner?.user.avatar"
      :user-id="user.value?.id"
      show-profile-picture
      darker-background
      show-shade
      show-menu
      settings-menu
      :title="$t('pages.courses.class')"
      :show-settings="canEdit"
      distribution="fullname-username-role"
      is-professor
      :fullname="learningPlanStore.owner?.user?.fullname"
      :description="learningPlanStore.learningPlan?.title"
      :subtitle="learningPlanStore.learningPlan?.class_name"
      :start-date="learningPlanStore.startDateFormated"
      :end-date="learningPlanStore.endDateFormated"
      :links="links"
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

const canEdit = computed(() => learningPlanStore.owner?.id === user.value.id);

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
    value: '6',
    icon: 'mdi-cog-outline',
    to: learningPlanStore.learningPlan
      ? `/courses/${learningPlanStore.learningPlan?.id}/settings`
      : '',
  },
]);
</script>
