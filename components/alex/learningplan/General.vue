<template>
  <div class="course-page w-100 gap-6">
    <alex-custom-card
      title=""
      class="left-block min-w-card flex-wrap w-100 pb-12"
      no-header
      full-width
      :align-content="'align-center'"
    >
      <template #content>
        <div
          v-if="loading"
          class="d-flex flex-column align-start w-100 gap-4 w-212 py-6"
        >
          <alex-custom-skeleton class="w-25 height-6" color="gray-200" />
          <alex-custom-skeleton class="w-100 height-68" color="gray-200" />
        </div>
        <div v-else class="d-flex flex-column align-center w-100 gap-12 w-212">
          <alex-learningplan-media
            :learningplan-id="learningPlan.id"
            sizing-class="pa-0"
            is-nested
            hide-dividers
            :title="$t('pages.courses.media.title')"
            :images="
              (learningPlan.media ? learningPlan.media : []).map((item) => {
                return { ...item };
              })
            "
            :no-icon="learningPlanStore.userIsFacilitator"
            :course-id="learningPlan.id"
            :can-edit="learningPlanStore.userIsFacilitator"
            :empty-text-message="$t('pages.courses.media.empty')"
          />
          <app-about
            sizing-class="pa-0"
            is-nested
            hide-dividers
            full-width
            :text="learningPlan.description"
            :user-id="user.id"
            :no-icon="learningPlanStore.userIsFacilitator"
            :can-edit="learningPlanStore.userIsFacilitator"
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
            :data="learningGoals"
            :no-icon="learningPlanStore.userIsFacilitator"
            :tooltip="$t('components.courses.goals.tooltip')"
            @update="(data) => emit('update', data)"
          />

          <alex-learningplan-details-editor
            v-if="showDetails"
            is-nested
            hide-dividers
            :data="learningPlan.details"
            :course-id="learningPlan.id"
            :title="$t('components.courses.editor.title')"
            :can-edit="learningPlanStore.userIsFacilitator"
            :no-icon="learningPlanStore.userIsFacilitator"
            @update="(data) => emit('update', data)"
          />
        </div>
      </template>
    </alex-custom-card>

    <div
      class="d-flex flex-column w-100 gap-6 min-w-card flex-wrap max-width-card-right"
    >
      <alex-custom-card v-if="loading" title="">
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
        class="w-100"
      >
        <template #content>
          <alex-profile-detail-boxes
            class="max-w-125"
            :boxes="detailBoxes"
            :loading="loading"
            hide-divider
          />
        </template>
        <template #footer>
          <div
            v-if="canEdit && learningPlanClasses?.length"
            class="w-100 fix-margin pb-6"
          >
            <p class="text-gray-800 text-h5 pb-6">
              {{ $t('components.courses.invites.title') }}
            </p>
            <div v-if="learningPlan.invite_enabled" class="mt-4">
              <alex-learningplan-invites
                v-for="classItem in learningPlanClasses"
                :key="classItem.id"
                full-width
                :class-name="classItem.name"
                :url="
                  classItem.activeLink?.hash
                    ? generateUrl(classItem.activeLink?.hash, learningPlan.id)
                    : null
                "
                :course-id="learningPlan.id"
                :invite-id="classItem.activeLink?.id"
                :class-id="classItem.id"
                :duration="invitationDuration"
                :invite-link-expires-at="classItem.activeLink?.expires_at"
                @update:link="updateLink"
                @link:expired="plainLink = null"
              />
            </div>
            <div v-else class="d-flex justify-center w-100">
              <span class="text-body-1 text-gray-500">{{
                $t('components.courses.invites.desactivated')
              }}</span>
            </div>
          </div>
        </template>
      </alex-custom-card>
      <alex-learningplan-meetings
        :learning-plan-classes="learningPlanClasses"
        :learning-plan-id="learningPlan?.id"
        :can-edit="learningPlanStore.userIsFacilitator"
        :class-info="classInfo"
      />
      <alex-learningplan-skeleton-competence v-if="loading" />
      <alex-learningplan-competences
        v-if="
          (learningPlanStore.generalTags?.length === 0 &&
            learningPlanStore.userIsFacilitator) ||
          (learningPlanStore.generalTags?.length !== 0 && !loading)
        "
        is-general
        :title="$t('components.competences.general.title')"
        :label="$t('components.competences.general.label')"
        :empty-message="$t('components.competences.general.empty')"
        :placeholder="$t('components.competences.general.placeholder')"
        :user-id="user.id"
        :learning-plan-id="learningPlan?.id"
        :tags="learningPlanStore.generalTags"
        :can-edit="learningPlanStore.userIsFacilitator"
        :loading="loading"
      />
      <alex-learningplan-skeleton-competence v-if="loading" />
      <alex-learningplan-competences
        v-if="
          (learningPlanStore.technicalTags?.length === 0 &&
            learningPlanStore.userIsFacilitator) ||
          (learningPlanStore.technicalTags?.length !== 0 && !loading)
        "
        :title="$t('components.competences.technical.title')"
        :label="$t('components.competences.technical.label')"
        :empty-message="$t('components.competences.technical.empty')"
        :placeholder="$t('components.competences.technical.placeholder')"
        :user-id="user.id"
        :learning-plan-id="learningPlan?.id"
        :tags="learningPlanStore.technicalTags"
        :can-edit="learningPlanStore.userIsFacilitator"
        :loading="loading"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { BoxItemType } from '@/components/alex/profile/BoxItem.vue';
import { MeetingPropsType } from '@/components/alex/learningplan/Meeting.vue';
import { ClassSimple } from '@/models/simple/classSimple.model';
type GeneralProps = {
  learningPlan: LearningPlanSimple;
  owner: LearningPlanMemberSimple;
  invitationDuration?: number;
  canEdit?: boolean;
  schedules?: MeetingPropsType[];
  loading?: boolean;
};
const props = withDefaults(defineProps<GeneralProps>(), {
  schedules: () => [],
  loading: false,
  invitationDuration: 0,
});

const { update } = useStrapi();
const learningPlanStore = useLearningPlanStore();
const i18n = useI18n();

const { generateUrl, generateNewInvite, calcRemainingTime } =
  useInvitationLink();

const emit = defineEmits(['update']);

const user = useStrapiUser<User>();

const plainLink = ref<string | null>(null);

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

const learningGoals = computed(
  () =>
    props.learningPlan.learning_goals?.map((goal, index) => ({
      id: goal.id,
      title: goal.description,
      keyWord: goal.verb?.text,
      errorKeyWord: false,
      errorTitle: false,
      contentData: {
        id: goal.id,
        index,
        description: goal.description,
        verb: {
          id: goal.verb.id,
          text: goal.verb.text,
          general: goal.verb.general,
        },
      },
    })),
);

const updateLink = (data) => {
  const { url, expiresAt } = data;

  console.log('updateLink', data);

  plainLink.value = url;
  // inviteLinkExpiresAtRef.value = expiresAt;
};

const getActiveLink = (classItem: ClassSimple) => {
  const activeLinks = classItem?.invitation_links?.filter(
    (invite) =>
      !invite.is_expired &&
      (invite.emails_to_send ||
        new Date(invite.expires_at).getTime() > new Date().getTime()),
  );

  return activeLinks && activeLinks.length > 0
    ? activeLinks[activeLinks.length - 1]
    : null;
};

const learningPlanClasses = computed(() => {
  return props.learningPlan?.classes?.map((classItem) => ({
    name: classItem.name,
    id: classItem.id,
    activeLink: getActiveLink(classItem),
    meeting_schedules: classItem.meeting_schedules,
  }));
});

const classInfo = computed(() => {
  return {
    start: props.learningPlan?.start_date,
    end: props.learningPlan?.end_date,
  };
});

const detailBoxes = computed<BoxItemType[]>(() => [
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
]);
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
