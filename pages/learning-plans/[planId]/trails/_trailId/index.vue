<template>
  <alex-learningplan-page
    :learning-plan="learningPlan"
    :has-permission="hasAccess"
  />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const hasAccess = useAccess('learningplan', 'update');
const { learningPlan } = useGetData();
</script>
