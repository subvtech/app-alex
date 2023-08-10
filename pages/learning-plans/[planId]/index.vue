<template>
  <alex-learningplan-page
    v-if="learningPlan"
    :learning-plan="learningPlan"
    :has-permission="hasAccess"
    @updated="loadPlan"
  />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const hasAccess = useAccess('learningplan', 'update');
const { learningPlan, loadPlan } = useGetData();
console.log('learningPlan', learningPlan.value);
</script>
