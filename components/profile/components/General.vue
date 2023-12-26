<template>
  <div class="details d-flex flex-column w-100">
    <profile-general
      :userId="userId"
      :socials="socials"
      :telephone="phone"
      :email="email"
      @update:user="emit('update:user')"
    />
    <profile-socials
      v-if="socials.length !== 0 || canEdit"
      :can-edit="canEdit"
      :socials="socials"
      :userId="userId"
      @update:user="emit('update:user')"
    />
  </div>
  <div class="d-flex flex-column w-100">
    <app-about
      :title="$t('components.profile.about.title')"
      :text="info"
      :userId="userId"
      :can-edit="canEdit"
      :about-text-message="$t('components.profile.about.placeholder')"
      @update="updateAbout"
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
        :userId="userId"
        :can-edit="canEdit"
        :userTags="technicalTags"
        :forbidden-tags="generalTags"
        @update:user="
          emit('update:user', {
            message: $t('components.competences.technical.updated'),
          })
        "
      />
      <competences
        v-if="generalTags.length !== 0 || canEdit"
        :title="$t('components.competences.general.title')"
        :label="$t('components.competences.general.label')"
        :placeholder="$t('components.competences.general.placeholder')"
        :emptyMessage="$t('components.competences.general.empty')"
        :userId="userId"
        :can-edit="canEdit"
        :userTags="generalTags"
        :forbidden-tags="technicalTags"
        is-general
        @update:user="
          emit('update:user', {
            message: $t('components.competences.technical.updated'),
          })
        "
      />
    </div>
    <profile-institutional
      v-if="institutions.length !== 0 || canEdit"
      :institutions="institutions"
      :userId="userId"
      :can-edit="canEdit"
      @update:user="emit('update:user')"
    />
  </div>
</template>

<script setup lang="ts">
const client = useStrapiClient()
const emit = defineEmits(['update:user']);
const props = defineProps({
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  socials: {
    type: Array as PropType<
      {
        id: number;
        url: string;
        name: string;
      }[]
    >,
    required: true,
  },
  institutions: {
    type: Array as PropType<any[]>,
    required: true,
  },
  technicalTags: {
    type: Array as PropType<Tag[]>,
    default: () => [],
  },

  generalTags: {
    type: Array as PropType<Tag[]>,
    default: () => [],
  },
  info: {
    type: String,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
  canEdit: { type: Boolean, required: true },
});

const { info, canEdit, generalTags, technicalTags, institutions } =
  toRefs(props);


const updateAbout = async (text) => {
  await client(`/users/${props.userId}`, {
    method: 'PUT',
    body: {
      info: text,
    },
  });
  emit('update:user')
}
</script>

<style scoped lang="scss">
.gap-6 {
  gap: 24px;
}
.details {
  gap: 24px;
}
@media (min-width: 801px) {
  .details {
    max-width: 450px;
  }
}
</style>
