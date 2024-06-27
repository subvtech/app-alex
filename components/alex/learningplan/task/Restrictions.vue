<template>
  <div>
    <p class="text-body-4 text-gray-800 tw-font-weight-bold mb-2">
      {{ $t('components.learningPlan.drawer.task.restrictions.label') }}
    </p>

    <div
      v-if="props.edit || model.length"
      class="d-flex align-center flex-wrap ga-2"
    >
      <alex-custom-dropdown v-if="props.edit" :items="options">
        <template #activator="{ props: dropdownProps }">
          <alex-custom-button
            v-bind="dropdownProps"
            icon="mdi-plus"
            size="small"
            variant="tertiary"
          />
        </template>
      </alex-custom-dropdown>

      <!-- Objetivos selecionados -->
      <alex-custom-chip
        v-for="(restriction, index) in model"
        :key="index"
        :text="config[restriction]"
        :clickable="props.edit"
        :closable="props.edit"
        size="small"
        status="secondary"
        variant="tonal"
        @click:close="remove(restriction)"
      />
    </div>
    <div v-else>
      <p class="text-body-3 text-gray-400">
        {{ $t('components.learningPlan.drawer.missing.restrictions') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlexDropdownItem } from '../../custom/Dropdown.vue';

interface CompProps {
  edit?: boolean;
}

const props = defineProps<CompProps>();

export type RestrictionValue =
  | 'text'
  | 'image'
  | 'video'
  | 'document'
  | 'link'
  | 'gallery';

const { t } = useI18n();

const model = defineModel<RestrictionValue[]>({
  required: true,
});

const config: Record<RestrictionValue, string> = {
  text: t('components.learningPlan.drawer.task.restrictions.text'),
  image: t('components.learningPlan.drawer.task.restrictions.image'),
  video: t('components.learningPlan.drawer.task.restrictions.video'),
  document: t('components.learningPlan.drawer.task.restrictions.document'),
  link: t('components.learningPlan.drawer.task.restrictions.link'),
  gallery: t('components.learningPlan.drawer.task.restrictions.gallery'),
};

const add = (option: RestrictionValue) => {
  if (model.value.includes(option)) return;
  model.value = [...model.value, option];
};

const remove = (value: RestrictionValue) => {
  model.value = model.value.filter((tag) => tag !== value);
};
const options: AlexDropdownItem[] = [
  {
    text: config.text,
    onClick: () => add('text'),
  },
  {
    text: config.image,
    onClick: () => add('image'),
  },
  {
    text: config.video,
    onClick: () => add('video'),
  },
  {
    text: config.gallery,
    onClick: () => add('gallery'),
  },
  {
    text: config.document,
    onClick: () => add('document'),
  },
  {
    text: config.link,
    onClick: () => add('link'),
  },
];
</script>
