<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <p class="text-h5 text-gray-800">
        {{ titleHeader }}
      </p>
      <slot name="action-button" />
    </div>
    <div
      v-if="!showItens"
      class="d-flex flex-column align-center justify-center gap-2"
    >
      <v-img width="150px" height="120px" :src="img" />
      <div>
        <h2 class="text-body-2 text-gray-800 max-w-200 text-center">
          {{ title }}
        </h2>
        <p class="text-body-5 text-gray-800 max-w-200 text-center">
          {{ subtitle }}
        </p>
      </div>
    </div>
    <slot v-else name="items" />
  </div>
</template>

<script setup lang="ts">
type ClassScheduleProps = {
  titleHeader: string;
  title: string;
  subtitle: string;
  img: string;
  showItens?: boolean;
};
const { showItens = false } = defineProps<ClassScheduleProps>();
</script>

<style scoped>
.max-w-200 {
  max-width: 200px;
}
</style>
