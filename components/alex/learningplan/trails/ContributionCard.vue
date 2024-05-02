<template>
  <div class="bg-white rounded">
    <div
      v-for="(contribution, index) in contributions"
      :key="contribution.title + index"
      class="bg-white pa-3 px-4 rounded cursor-pointer left-border"
      :class="displayBorder(contribution)"
      @click="emits('show', studentIndex, index)"
    >
      <div
        v-if="hideBlocked(contribution)"
        class="w-100 py-3 h-10 d-flex justify-space-between"
      >
        <div class="d-flex flex-column">
          <span class="text-gray-600 text-body-5"
            >{{ timeStampToDate(contribution.contribution.time) }}
          </span>
          <span class="text-gray-700 text-body-2">{{
            contribution.title
          }}</span>
        </div>
        <div v-if="isProfessor" class="ml-auto mr-4 d-flex align-center">
          <span v-if="contribution.blocked" class="text-body-4 text-error--1">
            {{ t('components.trails.contributions.blocked') }}
          </span>
          <v-btn
            v-else
            :icon="
              contribution.highlighted
                ? 'mdi-star-check'
                : 'mdi-star-check-outline'
            "
            variant="text"
            :color="contribution.highlighted ? 'warning-0' : 'gray-800'"
            @click.stop="emits('highlight', contribution.id)"
          ></v-btn>
        </div>
        <alex-custom-dropdown
          v-if="showDropdown()"
          :items="dropDownItems(contribution, index)"
          variant="text"
          icon="mdi-dots-vertical"
        ></alex-custom-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { contributionType } from '~/pages/courses/[id]/trails/[trailId]/contributions.vue';
const emits = defineEmits(['edit', 'delete', 'highlight', 'block', 'show']);
const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    contributions: contributionType[];
    isProfessor?: boolean;
    studentIndex?: number;
  }>(),
  {
    studentIndex: -1,
    isProfessor: false,
  },
);

const timeStampToDate = (timeStamp: number) => {
  const dateTime = new Date(timeStamp);
  return `${dateTime.toLocaleDateString()} - ${dateTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })}`;
};

const displayBorder = (contribution: contributionType) => {
  if (!props.isProfessor) return;
  if (contribution.blocked) return 'border-blocked';
  if (contribution.highlighted) return 'border-highlighted';
  return 'bg-green';
};

const professorOptions = (contribution: contributionType) => {
  return [
    {
      text: contribution.highlighted
        ? t('components.trails.contributions.card.removeHighlight')
        : t('components.trails.contributions.card.highlight'),
      icon: contribution.highlighted
        ? 'mdi-star-remove-outline'
        : 'mdi-star-check-outline',
      onClick: () => {
        emits('highlight', contribution.id);
      },
    },
    {
      text: contribution.blocked
        ? t('components.trails.contributions.card.unblock')
        : t('components.trails.contributions.card.block'),
      icon: contribution.blocked
        ? 'mdi-shield-lock-open-outline'
        : 'mdi-shield-alert-outline',
      warning: true,
      onClick: () => {
        emits('block', contribution.id);
      },
    },
  ];
};

const studentOption = (contributionId: number, index: number) => {
  return [
    {
      text: t('components.trails.contributions.card.edit'),
      icon: 'mdi-pencil',
      onClick: () => {
        emits('edit', index);
      },
    },
    {
      text: t('components.trails.contributions.card.delete'),
      icon: 'mdi-delete-outline',
      warning: true,
      onClick: () => {
        emits('delete', contributionId);
      },
    },
  ];
};

const dropDownItems = (contribution: contributionType, index: number) => {
  return props.isProfessor && props.studentIndex !== undefined
    ? professorOptions(contribution)
    : studentOption(contribution.id, index);
};

const showDropdown = () => {
  return props.isProfessor || props.studentIndex === -1;
};

const hideBlocked = (contribution: contributionType) => {
  return (
    !contribution.blocked || props.isProfessor || props.studentIndex === -1
  );
};
</script>

<style scoped>
.border-blocked {
  border-left-color: rgb(var(--v-theme-tag-red-light)) !important;
}
.border-highlighted {
  border-left-color: rgb(var(--v-theme-warning-0)) !important;
}

.left-border {
  border-left: 3px solid transparent;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
