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
        @update="
          emit('load', {
            message: $t('components.profile.socials.update'),
            query: userSocials,
          })
        "
      />
    </div>
    <div class="d-flex flex-column w-100 gap-6">
      <app-about
        :title="$t('components.profile.about.title')"
        :text="user.info"
        :userId="user.id"
        :can-edit="canEdit"
        :about-text-message="$t('components.profile.about.placeholder')"
        :empty-text-message="$t('components.profile.about.placeholder')"
        @update="
          emit('update', {
            message: $t('components.profile.about.update'),
            query: userInfo,
          })
        "
      />
      <div
        class="d-flex flex-xs-column flex-sm-column flex-md-column flex-xl-row flex-xxl-row mb-6 competences gap-6"
      >
        <competences
          v-if="technicalTags.length !== 0 || canEdit"
          :title="$t('components.competences.technical.title')"
          :label="$t('components.competences.technical.label')"
          :placeholder="$t('components.competences.technical.placeholder')"
          :emptyMessage="$t('components.competences.technical.empty')"
          :userId="user.id"
          :can-edit="canEdit"
          :userTags="technicalTags"
          :forbidden-tags="generalTags"
          @update="
            emit('update', $t('components.competences.technical.updated'))
          "
        />
        <competences
          v-if="generalTags.length !== 0 || canEdit"
          :title="$t('components.competences.general.title')"
          :label="$t('components.competences.general.label')"
          :placeholder="$t('components.competences.general.placeholder')"
          :emptyMessage="$t('components.competences.general.empty')"
          :userId="user.id"
          :can-edit="canEdit"
          :userTags="generalTags"
          :forbidden-tags="technicalTags"
          is-general
          @update="
            emit('update', $t('components.competences.technical.updated'))
          "
        />
      </div>
      <alex-profile-institutional
        v-if="user.institutions.length !== 0 || canEdit"
        :institutions="user.institutions"
        :userId="user.id"
        :can-edit="canEdit"
        @update="emit('update')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { userInfo, userSocials } from '@/assets/queries';
const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true,
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
});
const { user } = toRefs(props);
const emit = defineEmits(['update', 'load']);
const { setMessage } = useMessageStore();

const generalTags = ref();
const technicalTags = ref();

const strapiUser = useStrapiUser<User>().value;

generalTags.value = props.user.tags.filter((item) => item.isGeneral) ?? [];
technicalTags.value = props.user.tags.filter((item) => !item.isGeneral) ?? [];
</script>
<style scoped lang="scss"></style>
