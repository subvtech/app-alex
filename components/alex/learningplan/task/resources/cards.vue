<template>
  <div
    class="cards d-flex align-center flex-wrap ga-4"
    :class="`justify-${justify}`"
  >
    <template v-if="!loading">
      <alex-learningplan-task-resources-card
        v-for="trail in trails"
        :key="trail.id"
        :title="trail.title"
        :cover="trail.cover_image?.url"
        :edit="edit"
      />
    </template>
    <!-- Loader -->
    <template v-else>
      <alex-custom-skeleton
        v-for="index in 4"
        :key="index"
        class="tw-w-[150px] tw-h-[100px] rounded-lg"
        color="gray-300"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
interface CompProps {
  trails: TrailSimple[];
  edit?: boolean;
  loading?: boolean;
  justify?: 'start' | 'center';
}

withDefaults(defineProps<CompProps>(), {
  edit: false,
  loading: false,
  justify: 'center',
});
</script>
