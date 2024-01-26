<template>
  <div class="course-page d-flex w-100 gap-6">
    <alex-custom-card
      title=""
      class="left-block"
      no-header
      full-width
      :align-content="'align-center'"
    >
      <template #content>
        <div class="d-flex flex-column align-center w-100 gap-12 px-6 w-212">
          <app-media
            :title="$t('pages.courses.media.title')"
            :images="
              (learningPlan.media ? learningPlan.media : []).map((item) => {
                return { ...item };
              })
            "
            :course-id="learningPlan.id"
            :can-edit="userIsFacilitator"
            :empty-text-message="$t('pages.courses.media.empty')"
            sizing-class="pa-0"
            is-nested
            hide-dividers
          />
          <app-about
            :text="learningPlan.description"
            :user-id="learningPlan.id"
            :can-edit="userIsFacilitator"
            @update="updateAbout"
            :empty-text-message="$t('pages.courses.about.empty')"
            sizing-class="pa-0"
            is-nested
            hide-dividers
            full-width
          />
          <alex-learningplan-goals
            :can-edit="canEdit"
            :course-id="learningPlan.id"
            :user-id="id"
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
            sizing-class="pa-0 w-100"
            class="w-100"
            @update="(data) => emit('update', data)"
            is-nested
          />

          <alex-learningplan-details-editor
            v-if="showDetails"
            :info="learningPlan.details?.lines"
            :courseId="learningPlan.id"
            :title="$t('components.courses.editor.title')"
            :can-edit="userIsFacilitator"
            is-nested
            hide-dividers
            @update="(data) => emit('update', data)"
          />
        </div>
      </template>
    </alex-custom-card>

    <div class="d-flex flex-column w-100 gap-6 max-width">
      <alex-custom-card :title="$t('pages.courses.details')" :show-icon="false">
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
              :can-edit="userIsFacilitator"
              :data="schedules"
              :end-date="new Date()"
              :is-facilitator="userIsFacilitator"
              :href="userIsFacilitator ? `${learningPlan.id}/settings` : ''"
              is-nested
              :learning-plan-id="0"
              hide-dividers
              sizing-class="ma-0"
            />
            <alex-learningplan-invites
              v-if="canEdit"
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
              full-width
            />
          </div>
        </template>
      </alex-custom-card>
      <alex-profile-cards-competences
        v-if="
          (generalTags.length === 0 && userIsFacilitator) ||
          generalTags.length !== 0
        "
        :title="$t('components.competences.general.title')"
        :label="$t('components.competences.general.label')"
        :emptyMessage="$t('components.competences.general.empty')"
        :placeholder="$t('components.competences.general.placeholder')"
        :relation-id="learningPlan.id"
        learningplan
        :userTags="generalTags"
        :can-edit="userIsFacilitator"
        @update="(data) => emit('update', data)"
      />
      <alex-profile-cards-competences
        v-if="
          (technicalTags.length === 0 && userIsFacilitator) ||
          technicalTags.length !== 0
        "
        :title="$t('components.competences.technical.title')"
        :label="$t('components.competences.technical.label')"
        :emptyMessage="$t('components.competences.technical.empty')"
        :placeholder="$t('components.competences.technical.placeholder')"
        :relationId="learningPlan.id"
        learningplan
        :userTags="technicalTags"
        :can-edit="userIsFacilitator"
        @update="(data) => emit('update', data)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { InvitationLinkType } from '@/components/alex/learningplan/Invites.vue';
import { LearningPlanType } from '~/pages/courses/[id]/index.vue';
const { update } = useStrapi();

const { standardTrails, userIsFacilitator, activeMembers } =
  useLearningPlanStore();

const i18n = useI18n();
const emit = defineEmits(['update']);
const props = defineProps({
  learningPlan: {
    type: Object as PropType<LearningPlanType>,
    required: true,
  },

  invitationLink: {
    type: Object as PropType<InvitationLinkType | null>,
    default: null,
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
  schedules: {
    type: Array as PropType<any[]>,
    default: [],
  },
  owner: {
    type: Object as PropType<LearningPlanMemberSimple>,
    required: true,
  },
});

const generalTags = ref<Tag[]>([]);
const technicalTags = ref<Tag[]>([]);
const plainLink = ref<string | null>(null);
const { id } = useStrapiUser<User>().value;

if (props.learningPlan.tags.data) {
  generalTags.value = props.learningPlan.tags.data.reduce(
    (acc: Tag[], item) => {
      if (item.attributes.isGeneral) {
        acc.push({ id: item.id, ...item.attributes });
      }

      return acc;
    },
    [],
  );

  technicalTags.value = props.learningPlan.tags.data.reduce(
    (acc: Tag[], item) => {
      if (!item.attributes.isGeneral) {
        acc.push({ id: item.id, ...item.attributes });
      }

      return acc;
    },
    [],
  );
}

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
.fix-margin {
  margin-top: -24px;
}

.course-page {
  .left-block {
    min-width: 60% !important;
    padding-inline: 24px !important;
    padding-bottom: 24px;
  }
}

@media (max-width: 1530px) {
  .course-page {
    .left-block {
      min-width: 45% !important;
      .flex-column.align-center.gap-12 {
        width: 100%;
      }
    }
  }
}

@media (max-width: 1250px) {
  .course-page {
    .left-block {
      min-width: 37% !important;
      .flex-column.align-center.gap-12 {
        width: 100%;
      }
    }
  }
}

@media (max-width: 1125px) {
  .course-page {
    flex-wrap: wrap;
    &.gap-6 {
      gap: 12px !important;
    }
    .left-block {
      min-width: 33% !important;
      padding-inline: 8px !important;

      .flex-column.align-center.gap-12 {
        width: 100%;
      }
    }
    .max-width {
      max-width: unset;
    }
  }
}

@media (max-width: 961px) {
  .course-page {
    .left-block {
      min-width: 50% !important;
      padding-inline: 24px !important;

      .flex-column.align-center.gap-12 {
        width: 100%;
      }
    }
    .max-width {
      max-width: unset;
    }
  }
}
@media (max-width: 850px) {
  .course-page {
    flex-direction: column;

    .left-block {
      padding-inline: 24px !important;

      .flex-column.align-center.gap-12 {
        width: 100%;
      }
    }
    .max-width {
      max-width: unset;
    }
  }
}

.max-width {
  max-width: 500px;
}

.gap-6 {
  gap: 24px;
}

.gap-12 {
  gap: 48px;
}
</style>
