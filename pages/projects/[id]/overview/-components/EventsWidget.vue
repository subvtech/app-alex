<script setup lang="ts">
const { t } = useI18n();

const props = defineProps<{ ganttMaximized?: boolean }>();
</script>

<template>
  <alex-custom-card
    full-width
    no-footer
    class="flex-1 tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4"
    :class="props.ganttMaximized && 'lg:!tw-col-span-12'"
    content-class-name="d-flex justify-center align-center h-100"
    title="Eventos"
  >
    <template #content>
      <div
        class="tw-flex tw-flex-col tw-gap-2 tw-w-full d-flex align-center margin-auto d-flex justify-center align-center"
      >
        <alex-custom-empty-placeholder
          grayscale
          empty-text-image="/svg/EmptyInstitutional.svg"
          :empty-text-message="t('pages.projects.overview.empty_meetings')"
        />
      </div>
    </template>
  </alex-custom-card>
</template>
