<template>
  <div class="tw-w-full d-flex align-center justify-center flex-column text-center" style="height: 370px; gap: 10px">
    <img
      style="max-width: 170px; max-height: 170px"
      src="public/svg/EmptyRubric.svg"
      :alt="$t('pages.evaluations.rubrics.emptyAlt')"
    />
    <p class="text-h3 text-gray-400">{{ emptyMessage }}</p>
  </div>
</template>
<script setup lang="ts">
type props = {
  emptyMessage: string;
};

const props = defineProps<props>();
</script>
