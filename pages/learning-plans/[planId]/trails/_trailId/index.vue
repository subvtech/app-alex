<template>
  <alex-learningplan-page
    v-if="learningPlan"
    :learning-plan="learningPlan"
    :has-permission="hasAccess"
  />
  <div v-else>
    <span>{{ $t('fail', { learningPlan: learningPlan }) }}</span>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const hasAccess = useAccess();
const { learningPlan } = useGetData();
</script>
