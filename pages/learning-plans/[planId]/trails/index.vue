<template>
  <alex-learningplan-list
    :learning-plans="learningPlan.trails"
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
