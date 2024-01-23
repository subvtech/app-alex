<template>
  <div v-if="user" class="content-block d-flex w-100 gap-6">
    <div class="details d-flex flex-column w-100 gap-6">
      <alex-profile-overview
        :user-id="user.id"
        :socials="user.socials"
        :telephone="user.phone"
        :email="user.email"
      />
      <alex-profile-socials
        v-if="user.socials.length !== 0 || canEdit"
        :can-edit="canEdit"
        :socials="user.socials"
        :user-id="user.id"
        @update="async () => await updateSocials()"
      />
    </div>
    <div class="d-flex flex-column w-100 gap-6">
      <app-about
        :title="$t('components.profile.about.title')"
        :text="user.info"
        :userId="user.id"
        :can-edit="canEdit"
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
        <alex-profile-competences
          v-if="technicalTags.length !== 0 || canEdit"
          :title="$t('components.competences.technical.title')"
          :label="$t('components.competences.technical.label')"
          :placeholder="$t('components.competences.technical.placeholder')"
          :emptyMessage="$t('components.competences.technical.empty')"
          :relation-id="user.id"
          :can-edit="canEdit"
          :selected-tags="technicalTags"
          @update="
            updateCompetences($t('components.competences.technical.updated'))
          "
        />
        <alex-profile-competences
          v-if="generalTags.length !== 0 || canEdit"
          :title="$t('components.competences.general.title')"
          :label="$t('components.competences.general.label')"
          :placeholder="$t('components.competences.general.placeholder')"
          :emptyMessage="$t('components.competences.general.empty')"
          :relation-id="user.id"
          :can-edit="canEdit"
          :selected-tags="generalTags"
          is-general
          @update="
            updateCompetences($t('components.competences.general.updated'))
          "
        />
      </div>
      <alex-profile-institutional
        v-if="institutions.length !== 0 || canEdit"
        :institutions="institutions"
        :userId="user.id"
        :can-edit="canEdit"
        @update="async () => await updateInstitutions()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true,
  },
  canEdit: {
    type: Boolean,
    default: false,
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
