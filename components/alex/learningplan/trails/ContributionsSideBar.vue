<template>
  <v-navigation-drawer
    temporary
    location="right"
    :width="380"
    class="rounded-s-lg sidebar py-6 px-4"
    :scrim="false"
    :model-value="modelValue"
    @update:model-value="handleChange"
  >
    <template #prepend>
      <div class="d-flex align-center justify-space-between mb-6">
        <p class="text-h4 text-gray-800">
          {{ $t('components.trails.contributions.highlightedContributions') }}
        </p>
        <alex-custom-button
          icon="mdi-close"
          variant="text"
          @click="handleChange(false)"
        />
      </div>
    </template>
    <template #default>
      <div class="w-100 fill-height bg-gray-blue rounded pa-3">
        <transition-group name="list">
          <div
            v-for="(contribution, index) in contributionsArray"
            :key="contribution.id"
            class="w-100 height-16 rounded px-4 py-3 d-flex align-center mb-1 ga-4 contribution-container bg-white"
            :class="[
              over == index && dragging && dragFrom !== contribution
                ? 'over'
                : '',
              { 'dropdown-hover': dropdownHover },
            ]"
            @click="() => emits('showContribution', contribution)"
            @dragover="(e) => onDragOver(index, e)"
            @dragend="
              () => {
                finishDrag(contribution, index, contributionsArray);
                emits('dragged:items', contributionsArray);
              }
            "
            @dragenter="(e) => e.preventDefault()"
          >
            <div
              class="drag-indicator"
              draggable="true"
              @dragstart="
                (e) => {
                  // console.log('dragging', contribution, index);
                  startDrag(contribution, e, '.contribution-container');
                }
              "
            >
              <v-icon
                v-if="isProfessor"
                icon="alex:DragIndicator"
                color="gray-600"
                size="20px"
              />
            </div>
            <div class="d-flex flex-column w-100">
              <span class="text-gray-600 text-body-5">
                {{ timeStampToDate(contribution.contribution.time) }}
              </span>
              <span class="text-gray-700 text-body-2 ellipsis lines-1">{{
                contribution.title
              }}</span>
            </div>
            <div
              @mouseenter="dropdownHover = true"
              @mouseleave="dropdownHover = false"
            >
              <alex-custom-dropdown
                v-if="isProfessor"
                :items="dropDownItems(contribution)"
                variant="text"
                icon="mdi-dots-vertical"
              ></alex-custom-dropdown>
            </div>
          </div>
        </transition-group>
      </div>
    </template>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
import { useDragDrop } from '@/composables/useDragDrop';
import { contributionType } from '~/pages/courses/[id]/trails/[trailId]/contributions.vue';
const { t } = useI18n();
const dropdownHover = ref(false);

type ContributionSimple = Omit<contributionType, 'highlighted' | 'blocked'>;

interface SideBar {
  modelValue: boolean;
  contributions: ContributionSimple[] | [];
  isProfessor: boolean;
}

const props = withDefaults(defineProps<SideBar>(), {
  modelValue: false,
  contributions: () => [],
  isProfessor: false,
});

const contributionsArray = computed(() => props.contributions);

const emits = defineEmits([
  'update:modelValue',
  'removeHighlight',
  'showContribution',
  'dragged:items',
]);
const handleChange = (value: boolean) => {
  emits('update:modelValue', value);
};

const timeStampToDate = (timeStamp: number) => {
  const dateTime = new Date(timeStamp);
  return `${dateTime.toLocaleDateString()} - ${dateTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })}`;
};

const dropDownItems = (contribution: ContributionSimple) => {
  return [
    {
      text: t('components.trails.contributions.card.removeHighlight'),
      icon: 'mdi-star-remove-outline',
      onClick: () => emits('removeHighlight', contribution),
    },
  ];
};

const { over, dragFrom, dragging, startDrag, finishDrag, onDragOver } =
  useDragDrop();
</script>

<style scoped>
.sidebar {
  margin-top: 1px;
}

.drag-indicator {
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
}

.over {
  background-color: rgb(var(--v-theme-gray-100)) !important;
}

.contribution-container {
  cursor: pointer;
  transition: all 0.2s ease-in;
  &:hover:not(.dropdown-hover) {
    background-color: rgb(var(--v-theme-gray-100)) !important;
  }
  &:active:not(.dropdown-hover) {
    background-color: rgb(var(--v-theme-gray-200)) !important;
  }
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(40px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}
</style>
