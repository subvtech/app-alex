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
        <div class="d-flex flex-column align-center w-100 gap-12 w-212">
          <app-media
            sizing-class="pa-0"
            is-nested
            hide-dividers
            :title="$t('pages.courses.media.title')"
            :images="
              (learningPlan.media ? learningPlan.media : []).map((item) => {
                return { ...item };
              })
            "
            :course-id="learningPlan.id"
            :can-edit="userIsFacilitator"
            :empty-text-message="$t('pages.courses.media.empty')"
          />
          <app-about
            sizing-class="pa-0"
            is-nested
            hide-dividers
            full-width
            :text="learningPlan.description"
            :user-id="user.id"
            :can-edit="userIsFacilitator"
            :empty-text-message="$t('pages.courses.about.empty')"
            @update="updateAbout"
          />
          <alex-learningplan-goals
            sizing-class="pa-0 w-100"
            class="w-100"
            is-nested
            :can-edit="canEdit"
            :course-id="learningPlan.id"
            :user-id="user.id"
            :data="
              learningPlan.learning_goals.map((item) => {
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
            :info="learningPlan.details?.lines"
            :course-id="learningPlan.id"
            :title="$t('components.courses.editor.title')"
            :can-edit="userIsFacilitator"
            @update="(data) => emit('update', data)"
          />
        </div>
      </template>
    </alex-custom-card>

    <div
      class="d-flex flex-column w-100 gap-6 min-w-card flex-wrap max-width-card-right"
    >
      <alex-custom-card
        :title="$t('pages.courses.details')"
        :show-icon="false"
        class="w-100"
      >
        <template #content>
          <app-general-boxes
            :boxes="[
              {
                icon: 'mdi-account-outline',
                number: activeMembers.length,
                label: 'students',
              },
              {
                icon: 'trails.svg',
                number: standardTrails,
                label: 'trails',
              },
              {
                icon: 'mdi-newspaper-variant-multiple-outline',
                number: 0,
                label: 'assignments',
              },
            ]"
            hide-dividers
          />
        </template>
        <template #footer>
          <div
            class="w-100 fix-margin"
            :class="
              !plainLink || !learningPlan.invite_enabled ? 'pb-6' : 'pb-12'
            "
          >
            <alex-learningplan-meetings
              is-nested
              hide-dividers
              sizing-class="ma-0"
              :can-edit="userIsFacilitator"
              :data="schedules"
              :end-date="new Date()"
              :is-facilitator="userIsFacilitator"
              :href="userIsFacilitator ? `${learningPlan.id}/settings` : ''"
              :learning-plan-id="learningPlan.id"
            />
            <alex-learningplan-invites
              v-if="canEdit"
              full-width
              :enable-invites="learningPlan.invite_enabled"
              :duration="learningPlan.invitation_duration"
              :course-id="learningPlan.id"
              :data="invitationLink"
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
      <alex-learningplan-competences
        v-if="
          (generalTags?.length === 0 && userIsFacilitator) ||
          generalTags?.length !== 0
        "
        is-general
        :title="$t('components.competences.general.title')"
        :label="$t('components.competences.general.label')"
        :empty-message="$t('components.competences.general.empty')"
        :placeholder="$t('components.competences.general.placeholder')"
        :user-id="user.id"
        :learning-plan-id="learningPlan?.id"
        :tags="generalTags"
        :can-edit="userIsFacilitator"
      />
      <alex-learningplan-competences
        v-if="
          (technicalTags?.length === 0 && userIsFacilitator) ||
          technicalTags?.length !== 0
        "
        :title="$t('components.competences.technical.title')"
        :label="$t('components.competences.technical.label')"
        :empty-message="$t('components.competences.technical.empty')"
        :placeholder="$t('components.competences.technical.placeholder')"
        :user-id="user.id"
        :learning-plan-id="learningPlan?.id"
        :tags="technicalTags"
        :can-edit="userIsFacilitator"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { MeetingPropsType } from '~/components/CourseMeeting.vue';
type GeneralProps = {
  learningPlan: LearningPlanSimple;
  owner: LearningPlanMemberSimple;
  invitationLink?: InvitationLinkSimple | null;
  canEdit?: boolean;
  schedules?: MeetingPropsType[];
};
const props = withDefaults(defineProps<GeneralProps>(), {
  invitationLink: null,
  schedules: () => [],
});
const { update } = useStrapi();
const learningPlanStore = useLearningPlanStore();
const standardTrails = learningPlanStore.standardTrailsCount;
const userIsFacilitator = learningPlanStore.userIsFacilitator;
const activeMembers = learningPlanStore.activeMembers;
const i18n = useI18n();
const emit = defineEmits(['update']);
const plainLink = ref<string | null>(null);
const user = useStrapiUser<User>();
const generalTags = computed(
  () => learningPlanStore.learningPlan?.tags?.filter((tag) => tag.isGeneral),
);
const technicalTags = computed(
  () => learningPlanStore.learningPlan?.tags?.filter((tag) => !tag.isGeneral),
);
const updateAbout = async (text) => {
  await update('/learningplans', props.learningPlan.id, {
    description: text,
  });
  emit('update', i18n.t('pages.courses.about.updated'));
};

const showDetails = computed(() => {
  if (props.canEdit) return props.canEdit;

  return props.learningPlan.details?.data?.length !== 0;
});
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
    flex-wrap: wrap;
  }
  .min-w-card {
    min-width: 300px;
  }
  .max-width-card-right {
    max-width: unset;
  }
}
</style>
