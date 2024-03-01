<template>
  <div v-if="user" class="content-block d-flex w-100 gap-6">
    <div class="details d-flex flex-grow-1 flex-column gap-6">
      <alex-profile-cards-overview
        :user-id="user.id"
        :socials="user.socials"
        :telephone="user.phone"
        :email="user.email"
        :learning-plans="activeLearningPlans"
        :loading="loading"
      />
      <alex-profile-cards-socials
        v-if="user.socials.length !== 0 || canEdit"
        :can-edit="canEdit"
        :socials="user.socials"
        :user-id="user.id"
        @update="
          setMessage($t('components.profile.socials.update'), 'green', true)
        "
      />
    </div>
    <div class="d-flex flex-column flex-grow-2 gap-6">
      <app-about
        :title="$t('components.profile.about.title')"
        :text="user.info"
        :user-id="user.id"
        :can-edit="canEdit"
        :loading="loading"
        is-optional
        :about-text-message="$t('components.profile.about.placeholder')"
        :empty-text-message="$t('components.profile.about.placeholder')"
        @update="
          (data) =>
            emit(
              'update',
              { info: data },
              [],
              $t('components.profile.about.updated'),
            )
        "
      />
      <div
        class="d-flex flex-xs-column flex-sm-column flex-md-column flex-xl-row flex-xxl-row competences gap-6"
      >
        <alex-learningplan-skeleton-competence v-if="loading" />
        <alex-profile-cards-competences
          v-else-if="technicalTags.length !== 0 || canEdit"
          :title="$t('components.competences.technical.title')"
          :label="$t('components.competences.technical.label')"
          :placeholder="$t('components.competences.technical.placeholder')"
          :empty-message="$t('components.competences.technical.empty')"
          :relation-id="user.id"
          :can-edit="canEdit"
          :selected-tags="technicalTags"
          @update="
            setMessage(
              $t('components.competences.technical.updated'),
              'green',
              true,
            )
          "
        />
        <alex-learningplan-skeleton-competence v-if="loading" />
        <alex-profile-cards-competences
          v-else-if="generalTags.length !== 0 || canEdit"
          :title="$t('components.competences.general.title')"
          :label="$t('components.competences.general.label')"
          :placeholder="$t('components.competences.general.placeholder')"
          :empty-message="$t('components.competences.general.empty')"
          :relation-id="user.id"
          :can-edit="canEdit"
          :selected-tags="generalTags"
          is-general
          @update="
            setMessage(
              $t('components.competences.general.updated'),
              'green',
              true,
            )
          "
        />
      </div>
      <alex-profile-cards-institutions
        v-if="institutions.length !== 0 || canEdit"
        :institutions="
          institutions.map((item) => ({ ...item, canEdit, isDeleted: false }))
        "
        :user-id="user.id"
        :can-edit="canEdit"
        :loading="loading"
        @update="
          setMessage(
            $t('components.profile.institutional.update'),
            'green',
            true,
          )
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { setMessage } = useMessageStore();
const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true,
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
  activeLearningPlans: {
    type: Number,
    required: true,
  },

  activeTasks: {
    type: Number,
    required: true,
  },

  updateSocials: {
    type: Function,
    default: () => {},
  },
  updateCompetences: {
    type: Function,
    default: () => {},
  },
  updateInstitutions: {
    type: Function,
    default: () => {},
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
const { user } = toRefs(props);
const emit = defineEmits(['update']);

const generalTags = computed(
  () => user.value.tags.filter((item) => item.isGeneral) ?? [],
);
const technicalTags = computed(
  () => user.value.tags.filter((item) => !item.isGeneral) ?? [],
);

const institutions = computed(() => user.value.institutions ?? []);
</script>
<style scoped lang="scss">
.flex-grow-2 {
  flex-grow: 2;
}
#profile {
  flex-direction: column;
  font-family: 'Sen';
  height: 100%;

  .header {
    justify-content: flex-start;
    align-items: center;
    align-self: stretch;
    height: 44px;

    .title {
      color: #5d6872;
      font-size: 24px;
      font-weight: bold;
      line-height: 28px;
      padding-right: 16px;
    }

    .pages {
      padding-left: 16px;
      gap: 12px;
      align-items: center;
      border-left: 1px solid #e1e4e7;
      .go-back {
        color: #abb2b9;
        font-size: 14px;
        font-weight: 400;
        line-height: normal;
      }

      .current-page {
        color: #5d6872;
        font-size: 14px;
        font-weight: 400;
        line-height: normal;
      }
    }
  }

  .content-block {
    gap: 24px;
    flex-direction: row;
  }

  @media (max-width: 1410px) {
    .competences {
      flex-direction: column;
    }
  }

  @media (max-width: 1000px) {
    .content-block {
      flex-wrap: wrap;
    }
    .details {
      max-width: none;
    }
  }
}
</style>
