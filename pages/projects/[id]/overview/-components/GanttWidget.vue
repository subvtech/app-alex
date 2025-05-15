<script setup lang="ts">
import Gantt, { GanttInstance, GanttItem, GanttSprint, GanttViewType } from '@/components/Gantt.vue';

export interface GanttWidgetProps {
  items: GanttItem[];
  loading?: boolean;
  sprints: GanttSprint[];
  fullscreen?: boolean;
  close?: boolean;
}

withDefaults(defineProps<GanttWidgetProps>(), {
  items: () => [],
  sprints: () => [],
});

const ganttRef = ref<GanttInstance | null>(null);
const ganttView = ref(GanttViewType.Month);
const viewTypes = [GanttViewType.Day, GanttViewType.Week, GanttViewType.Month];
</script>

<template>
  <alex-custom-card
    no-footer
    no-header
    title="Linha temporal"
    class="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-8"
    content-class-name="tw-flex-1"
  >
    <template #header>
      <div class="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-px-6 tw-py-4 tw-border-b">
        <div class="tw-flex tw-items-center tw-gap-4">
          <span class="tw-text-gray-600 tw-font-bold tw-text-xl tw-leading-8">
            {{ $t('pages.projects.overview.timeline') }}
          </span>
          <alex-custom-button size="small" @click="ganttRef?.changeToCurrentDate()">
            {{ $t('pages.projects.overview.timeline_today') }}
          </alex-custom-button>
        </div>
        <div class="tw-flex tw-items-center tw-gap-1 tw-overflow-auto">
          <alex-custom-button
            v-for="view in viewTypes"
            :key="view"
            :variant="ganttView === view ? 'secondary' : 'text'"
            @click="ganttView = view"
          >
            {{ $t(`pages.projects.overview.timeline_${view}`) }}
          </alex-custom-button>

          <hr v-if="fullscreen || close" class="tw-h-[24px] tw-w-[1px] tw-rounded tw-mx-1 bg-gray-300" />
          <alex-custom-button
            v-if="fullscreen || close"
            :icon="fullscreen ? 'mdi-fullscreen' : 'mdi-close'"
            variant="text"
            @click="$emit(fullscreen ? 'fullscreen' : 'close')"
          />
        </div>
      </div>
    </template>
    <template #content>
      <div class="tw-flex tw-flex-col tw-flex-1 tw-gap-2 tw-w-full tw-pt-6">
        <div v-if="loading" class="tw-flex tw-justify-center tw-items-center tw-w-full">
          <v-progress-circular indeterminate />
        </div>
        <Gantt
          v-else-if="items.length"
          ref="ganttRef"
          class="tw-flex-1"
          :max-height="!close ? 360 : undefined"
          :items="items"
          :sprints="sprints"
          :view="ganttView"
        />
        <alex-custom-empty-placeholder v-else />
      </div>
    </template>
  </alex-custom-card>
</template>
