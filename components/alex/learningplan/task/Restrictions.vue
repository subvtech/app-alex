<template>
  <div>
    <p class="text-gray-800 font-weight-bold mb-2">
      {{ $t('components.learningPlan.drawer.task.restrictions.label') }}
    </p>

    <div
      v-if="props.edit || model.length"
      class="d-flex align-center flex-wrap ga-2"
    >
      <alex-custom-dropdown v-if="props.edit" :items="options">
        <template #activator="{ props }">
          <alex-custom-button
            v-bind="props"
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
        :text="config[restriction].label"
        :clickable="props.edit"
        :closable="props.edit"
        size="small"
        status="secondary"
        variant="tonal"
      />
    </div>
    <div v-else>
      <p class="text-body-3 text-gray-800">
        {{ $t('components.learningPlan.drawer.task.missing.restrictions') }}
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

export type RestrictionValue = 'text' | 'image' | 'video' | 'document' | 'link';

interface RestrictionProps {
  label: string;
}

const { t } = useI18n();

const model = defineModel<RestrictionValue[]>({
  required: true,
});

const config: Record<RestrictionValue, RestrictionProps> = {
  text: {
    label: t('components.learningPlan.drawer.task.restrictions.text'),
  },
  image: {
    label: t('components.learningPlan.drawer.task.restrictions.image'),
  },
  video: {
    label: t('components.learningPlan.drawer.task.restrictions.video'),
  },
  document: {
    label: t('components.learningPlan.drawer.task.restrictions.document'),
  },
  link: {
    label: t('components.learningPlan.drawer.task.restrictions.link'),
  },
};

const add = (option: RestrictionValue) => {
  if (!model.value.includes(option)) {
    model.value.push(option);
  }
};

const options: AlexDropdownItem[] = [
  {
    text: config.text.label,
    onClick: () => add('text'),
  },
  {
    text: config.image.label,
    onClick: () => add('image'),
  },
  {
    text: config.video.label,
    onClick: () => add('video'),
  },
  {
    text: config.document.label,
    onClick: () => add('document'),
  },
  {
    text: config.link.label,
    onClick: () => add('link'),
  },
];
</script>
