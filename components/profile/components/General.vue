<template>
  <div class="details d-flex flex-column w-100">
    <profile-general
      :id="id"
      :socials="socials"
      :telephone="phone"
      :email="email"
      @update:user="emit('update:user')"
    />
    <profile-socials
      v-if="socials.length !== 0 || canEdit"
      :can-edit="canEdit"
      :socials="socials"
      :id="id"
      @update:user="emit('update:user')"
    />
  </div>
  <div class="d-flex flex-column w-100">
    <profile-about
      :info="info"
      :id="id"
      :can-edit="canEdit"
      @update:user="emit('update:user')"
    />
    <div
      class="d-flex flex-xs-column flex-sm-column flex-md-column flex-xl-row flex-xxl-row mb-6 competences"
      style="gap: 24px"
    >
      <profile-competences
        v-if="technicalTags.length !== 0 || canEdit"
        :title="$t('components.profile.competences.technical.title')"
        :label="$t('components.profile.competences.technical.label')"
        :placeholder="
          $t('components.profile.competences.technical.placeholder')
        "
        :emptyMessage="$t('components.profile.competences.technical.empty')"
        :id="id"
        :can-edit="canEdit"
        :userTags="technicalTags"
        @update:user="emit('update:user')"
      ></profile-competences>
      <profile-competences
        v-if="generalTags.length !== 0 || canEdit"
        :title="$t('components.profile.competences.general.title')"
        :label="$t('components.profile.competences.general.label')"
        :placeholder="$t('components.profile.competences.general.placeholder')"
        :emptyMessage="$t('components.profile.competences.general.empty')"
        :id="id"
        :can-edit="canEdit"
        :userTags="generalTags"
        :is-general="true"
        @update:user="emit('update:user')"
      ></profile-competences>
    </div>
    <profile-institutional
      v-if="institutions.length !== 0 || canEdit"
      :institutions="institutions"
      :id="id"
      :can-edit="canEdit"
      @update:user="emit('update:user')"
    />
  </div>
</template>

<script setup lang="ts">
import { OutputBlockData } from '@editorjs/editorjs';

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
    type: Array as PropType<OutputBlockData<string, any>[]>,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  canEdit: { type: Boolean, required: true },
});

const { info, canEdit, institutions } = toRefs(props);
</script>
