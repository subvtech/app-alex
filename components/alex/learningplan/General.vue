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
              (learningPlan.media ? learningPlan.media.data : []).map(
                (item) => {
                  return { id: item.id, ...item.attributes };
                },
              )
            "
            :course-id="learningPlan.id"
            :can-edit="canEdit"
            :empty-text-message="$t('pages.courses.media.empty')"
            sizing-class="pa-0"
            is-nested
            hide-dividers
          />
          <app-about
            :text="learningPlan.description"
            :user-id="learningPlan.id"
            :can-edit="canEdit"
            @update="updateAbout"
            :empty-text-message="$t('pages.courses.about.empty')"
            sizing-class="pa-0"
            is-nested
            is-optional
            hide-dividers
            full-width
          />

          <alex-learningplan-goals
            :can-edit="canEdit"
            :course-id="learningPlan.id"
            :user-id="owner.id"
            :data="
              learningPlan.learning_goals.data.map((item) => {
                return {
                  id: item.id,
                  title: item.attributes.description,
                  keyWord: item.attributes.verb.data.attributes.text,
                  keyWordId: item.attributes.verb.data.id,
                  contentData: {
                    id: item.id,
                    description: item.attributes.description,
                    verb: { text: item.attributes.verb.data.attributes.text },
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
            :info="learningPlan.details?.data"
            :courseId="learningPlan.id"
            :title="$t('components.courses.editor.title')"
            :can-edit="canEdit"
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
                number: learningPlan.members
                  ? learningPlan.members.data.length
                  : 0,
                label: 'students',
              },
              {
                icon: 'trails.svg',
                number: learningPlan.trails
                  ? learningPlan.trails.data.length
                  : 0,
                label: 'trails',
              },
              {
                icon: 'mdi-newspaper-variant-multiple-outline',
                number: 62,
                label: 'assignments',
              },
            ]"
            hide-dividers
          />
        </template>
        <template #footer>
          <alex-learningplan-meetings
            :can-edit="canEdit"
            :data="schedules"
            :end-date="new Date()"
            :is-facilitator="canEdit"
            :href="canEdit ? `${learningPlan.id}/settings` : ''"
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
        </template>
      </alex-custom-card>
      <competences
        v-if="(generalTags.length === 0 && canEdit) || generalTags.length !== 0"
        :title="$t('components.competences.general.title')"
        :label="$t('components.competences.general.label')"
        :emptyMessage="$t('components.competences.general.empty')"
        :placeholder="$t('components.competences.general.placeholder')"
        :userId="owner.id"
        :userTags="generalTags"
        :can-edit="canEdit"
        @update="(data) => emit('update', data)"
      />
      <competences
        v-if="
          (technicalTags.length === 0 && canEdit) || technicalTags.length !== 0
        "
        :title="$t('components.competences.technical.title')"
        :label="$t('components.competences.technical.label')"
        :emptyMessage="$t('components.competences.technical.empty')"
        :placeholder="$t('components.competences.technical.placeholder')"
        :userId="owner.id"
        :userTags="technicalTags"
        :can-edit="canEdit"
        @update="(data) => emit('update', true, data)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { CompetenceTag } from '@/components/Competences.vue';
import { useI18n } from 'vue-i18n';
import { InvitationLinkType } from '@/components/alex/learningplan/Invites.vue';
import { LearningPlanType } from '~/pages/courses/[id]/index.vue';
const { update } = useStrapi();

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
    type: Object as PropType<{ id: number }>,
    required: true,
  },
});

const generalTags = ref<CompetenceTag[]>([]);
const technicalTags = ref<CompetenceTag[]>([]);
const plainLink = ref<string | null>(null);

generalTags.value = props.learningPlan.tags.data.reduce(
  (acc: CompetenceTag[], item) => {
    if (item.attributes.isGeneral) {
      acc.push({ id: item.id, ...item.attributes });
    }

    return acc;
  },
  [],
);
technicalTags.value = props.learningPlan.tags.data.reduce(
  (acc: CompetenceTag[], item) => {
    if (!item.attributes.isGeneral) {
      acc.push({ id: item.id, ...item.attributes });
    }

    return acc;
  },
  [],
);

const updateAbout = async (text) => {
  await update('/learningplans', props.learningPlan.id, {
    description: text,
  });
  emit('update', i18n.t('components.courses.about.description.updated'));
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

.course-page {
  .left-block {
    min-width: 66% !important;
    padding-inline: 24px !important;
    padding-bottom: 24px;
    .flex-column.align-center.gap-12 {
      width: 50%;
    }
  }
}

@media (max-width: 1420px) {
  .course-page {
    .left-block {
      min-width: 50% !important;
      .flex-column.align-center.gap-12 {
        width: 100%;
      }
    }
  }
}

@media (max-width: 1075px) {
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
