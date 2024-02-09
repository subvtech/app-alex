<template>
  <div class="course-page w-100 gap-6">
    <alex-custom-card
      title=""
      class="left-block min-w-card flex-wrap w-100"
      no-header
      full-width
      :align-content="'align-center'"
    >
      <template #content>
        <div
          v-if="learningPlanStore.loading"
          class="d-flex flex-column align-start w-100 gap-4 w-212 py-6"
        >
          <alex-custom-skeleton class="w-25 height-6" color="gray-200" />
          <alex-custom-skeleton class="w-100 height-68" color="gray-200" />
        </div>
        <div
          v-else-if="learningPlanStore.learningPlan"
          class="d-flex flex-column align-center w-100 gap-12 w-212"
        >
          <app-media
            sizing-class="pa-0"
            is-nested
            hide-dividers
            :title="$t('pages.courses.media.title')"
            :images="
              (learningPlanStore.learningPlan.media
                ? learningPlanStore.learningPlan.media
                : []
              ).map((item) => {
                return { ...item };
              })
            "
            :course-id="learningPlanStore.learningPlan.id"
            :can-edit="learningPlanStore.userIsFacilitator"
            :empty-text-message="$t('pages.courses.media.empty')"
          />
          <app-about
            sizing-class="pa-0"
            is-nested
            hide-dividers
            full-width
            :text="learningPlanStore.learningPlan.description"
            :user-id="user.id"
            :can-edit="learningPlanStore.userIsFacilitator"
            :empty-text-message="$t('pages.courses.about.empty')"
            @update="updateAbout"
          />
          <alex-learningplan-goals
            sizing-class="pa-0 w-100"
            class="w-100"
            is-nested
            :can-edit="learningPlanStore.userIsFacilitator"
            :course-id="learningPlanStore.learningPlan.id"
            :user-id="user.id"
            :data="
              learningPlanStore.learningPlan.learning_goals.map((item) => {
                return {
                  id: item.id,
                  title: item.description,
                  keyWord: item.verb.text,
                  keyWordId: item.verb.id,
                  contentData: {
                    id: item.id,
                    description: item.description,
                    verb: { text: item.verb.text },
                  },
                };
              })
            "
            :tooltip="$t('components.courses.goals.tooltip')"
            @update="(data) => emit('update', data)"
          />

          <alex-learningplan-details-editor
            v-if="showDetails"
            is-nested
            hide-dividers
            :info="learningPlanStore.learningPlan.details?.lines"
            :course-id="learningPlanStore.learningPlan.id"
            :title="$t('components.courses.editor.title')"
            :can-edit="learningPlanStore.userIsFacilitator"
            @update="(data) => emit('update', data)"
          />
        </div>
      </template>
    </alex-custom-card>

    <div
      class="right-block d-flex flex-column w-100 gap-6 min-w-card flex-wrap max-width-card-right"
    >
      <alex-custom-card
        v-if="learningPlanStore.loading"
        title=""
        :show-icon="false"
      >
        <template #content>
          <div class="d-flex bg-white rounded-lg align-center w-100 gap-4">
            <alex-custom-skeleton class="w-100 height-32" color="gray-200" />
            <alex-custom-skeleton class="w-100 height-32" color="gray-200" />
            <alex-custom-skeleton class="w-100 height-32" color="gray-200" />
          </div>
          <alex-custom-skeleton class="w-50 height-6 mt-4" color="gray-200" />
        </template>
      </alex-custom-card>
      <alex-custom-card
        v-else
        :title="$t('pages.courses.details')"
        :show-icon="false"
        class="w-100"
      >
        <template #content
          ><alex-profile-detail-boxes :boxes="boxes" hide-dividers />
        </template>
        <template #footer>
          <div
            v-if="learningPlanStore.learningPlan"
            class="w-100 fix-margin"
            :class="
              !plainLink || !learningPlanStore.learningPlan.invite_enabled
                ? 'pb-6'
                : 'pb-12'
            "
          >
            <alex-learningplan-meetings
              is-nested
              hide-dividers
              sizing-class="ma-0"
              :can-edit="learningPlanStore.userIsFacilitator"
              :data="schedules"
              :end-date="new Date()"
              :is-facilitator="learningPlanStore.userIsFacilitator"
              :to="
                learningPlanStore.userIsFacilitator
                  ? `${learningPlanStore.learningPlan.id}/settings`
                  : ''
              "
              :learning-plan-id="learningPlanStore.learningPlan.id"
            />
            <alex-learningplan-invites
              v-if="learningPlanStore.userIsFacilitator"
              full-width
              :enable-invites="learningPlanStore.learningPlan.invite_enabled"
              :duration="learningPlanStore.learningPlan.invitation_duration"
              :course-id="learningPlanStore.learningPlan.id"
              :data="learningPlanStore.invitationLink"
              @update:link="
                (data) => {
                  plainLink = data.url;
                }
              "
              @link:expired="plainLink = null"
            />
          </div>
        </template>
      </alex-custom-card>
      <alex-learningplan-skeleton-competence v-if="learningPlanStore.loading" />
      <alex-learningplan-competences
        v-else-if="
          ((learningPlanStore.generalTags?.length === 0 &&
            learningPlanStore.userIsFacilitator) ||
            (learningPlanStore.generalTags?.length !== 0 &&
              !learningPlanStore.loading)) &&
          learningPlanStore.learningPlan
        "
        is-general
        :title="$t('components.competences.general.title')"
        :label="$t('components.competences.general.label')"
        :empty-message="$t('components.competences.general.empty')"
        :placeholder="$t('components.competences.general.placeholder')"
        :user-id="user.id"
        :learning-plan-id="learningPlanStore.learningPlan.id"
        :tags="learningPlanStore.generalTags"
        :can-edit="learningPlanStore.userIsFacilitator"
        :loading="learningPlanStore.loading"
      />
      <alex-learningplan-skeleton-competence v-if="learningPlanStore.loading" />
      <alex-learningplan-competences
        v-else-if="
          ((learningPlanStore.technicalTags?.length === 0 &&
            learningPlanStore.userIsFacilitator) ||
            (learningPlanStore.technicalTags?.length !== 0 &&
              !learningPlanStore.loading)) &&
          learningPlanStore.learningPlan
        "
        :title="$t('components.competences.technical.title')"
        :label="$t('components.competences.technical.label')"
        :empty-message="$t('components.competences.technical.empty')"
        :placeholder="$t('components.competences.technical.placeholder')"
        :user-id="user.id"
        :learning-plan-id="learningPlanStore.learningPlan.id"
        :tags="learningPlanStore.technicalTags"
        :can-edit="learningPlanStore.userIsFacilitator"
        :loading="learningPlanStore.loading"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { format } from 'date-fns';

import { BoxItemType } from '~/components/alex/profile/BoxItem.vue';

const { update } = useStrapi();
const learningPlanStore = useLearningPlanStore();

const i18n = useI18n();
const emit = defineEmits(['update']);
const plainLink = ref<string | null>(null);
const user = useStrapiUser<User>();

const updateAbout = async (text) => {
  if (!learningPlanStore.learningPlan) return;
  await update('/learningplans', learningPlanStore.learningPlan.id, {
    description: text,
  });
  emit('update', i18n.t('pages.courses.about.updated'));
};

const showDetails = computed(() => {
  if (learningPlanStore.userIsFacilitator)
    return learningPlanStore.userIsFacilitator;

  return learningPlanStore.learningPlan?.details?.data?.length !== 0;
});

const boxes: BoxItemType[] = [
  {
    icon: 'mdi-account-outline',
    number: learningPlanStore.activeMembers.length,
    label: 'students',
  },
  {
    icon: 'trails.svg',
    number: learningPlanStore.standardTrails.length,
    label: 'trails',
  },
  {
    icon: 'mdi-newspaper-variant-multiple-outline',
    number: 0,
    label: 'assignments',
  },
];

const schedules = computed(
  () =>
    learningPlanStore.schedules?.map((item) => {
      const earliestMeeting = item.meetings.find((meeting) => meeting.earliest);
      return {
        id: item.id,
        startHour: format(new Date(item.startDate), 'HH:mm'),
        endHour: format(new Date(item.endDate), 'HH:mm'),
        interval: item.interval,
        date: earliestMeeting?.date
          ? new Date(earliestMeeting.date)
          : new Date(),
      };
    }),
);

const headerStore = usePageHeaderStore();
onBeforeMount(() => (headerStore.showHeader = true));
watch(
  () => learningPlanStore.loading,
  () => {
    if (!learningPlanStore.loading) {
      headerStore.title = i18n.t('pages.classes.breadcrumbs.myCourses');
      headerStore.items = [
        {
          title: i18n.t('pages.classes.breadcrumbs.home'),
          to: '/',
          disabled: true,
        },
        {
          title: i18n.t('pages.classes.breadcrumbs.myCourses'),
          to: '/courses/me',
          disabled: false,
        },
        {
          title: learningPlanStore.learningPlan?.title || '',
          to: `/courses/${learningPlanStore.learningPlan?.id}`,
          disabled: false,
        },
      ];
    }
  },
);
</script>

<style scope lang="scss">
.w-212 {
  max-width: 850px;
}
.min-w-card {
  min-width: 400px;
}
.fix-margin {
  margin-top: -24px;
}
.max-width-card-right {
  max-width: 500px;
}
.course-page {
  display: flex;
  flex-direction: row;
  .left-block {
    padding-bottom: 24px;
  }
}

@media screen and (max-width: 1130px) {
  .course-page {
    flex-wrap: wrap-reverse;
  }

  .right-block {
    flex-direction: column !important;
  }

  .min-w-card {
    min-width: 300px;
  }
  .max-width-card-right {
    max-width: unset;
  }
}
</style>
