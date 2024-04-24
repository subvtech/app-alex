<template>
  <div class="bg-white rounded">
    <div
      v-for="(contribution, index) in contributions"
      :key="contribution.title + index"
      class="bg-white pa-3 px-4 rounded cursor-pointer left-border"
      :class="displayBorder(contribution)"
      @click="emits('show', index)"
    >
      <div class="w-100 py-3 h-10 d-flex justify-space-between">
        <div class="d-flex flex-column">
          <span class="text-gray-600 text-body-5">{{
            formatDateTime(contribution.dateAndTime)
          }}</span>
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
            @click.stop="emits('highlight', studentIndex, index)"
          ></v-btn>
        </div>
        <alex-custom-dropdown
          :items="dropDownItems(contribution, index)"
          variant="text"
          icon="mdi-dots-vertical"
        ></alex-custom-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['edit', 'delete', 'highlight', 'block', 'show']);
const { t } = useI18n();

interface Contribution {
  title: string;
  dateAndTime: string;
  blocked: boolean;
  highlighted: boolean;
}

const props = defineProps<{
  contributions: Contribution[];
  isProfessor: boolean;
  studentIndex?: number;
}>();

const formatDateTime = (date: string) => {
  const dateTime = new Date(date);
  return `${dateTime.toLocaleDateString()} - ${dateTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })}`;
};

const displayBorder = (contribution: Contribution) => {
  if (!props.isProfessor) return;
  if (contribution.blocked) return 'border-blocked';
  if (contribution.highlighted) return 'border-highlighted';
  return 'bg-green';
};

const professorOptions = (
  contribution: Contribution,
  student: number,
  contributionIndex: number,
) => {
  return [
    {
      text: contribution.highlighted
        ? t('components.trails.contributions.card.removeHighlight')
        : t('components.trails.contributions.card.highlight'),
      icon: contribution.highlighted
        ? 'mdi-star-remove-outline'
        : 'mdi-star-check-outline',
      onClick: () => {
        emits('highlight', student, contributionIndex);
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
        emits('block', student, contributionIndex);
      },
    },
  ];
};

const studentOption = (index: number) => {
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
        emits('delete', index);
      },
    },
  ];
};

const dropDownItems = (contribution: Contribution, index: number) => {
  return props.isProfessor && props.studentIndex !== undefined
    ? professorOptions(contribution, props.studentIndex, index)
    : studentOption(index);
};
</script>

<style scoped>
.border-blocked {
  border-left-color: #ff8484 !important;
}
.border-highlighted {
  border-left-color: #ff9733 !important;
}

.left-border {
  border-left: 3px solid transparent;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
