<template>
  <alex-learningplan-list
    v-if="learningPlan"
    :learning-plans="learningPlan.attributes.trails.data"
    :parent-learning-plan="learningPlan"
    @updated="loadPlan"
  />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const { learningPlan, loadPlan } = useGetData();
</script>
