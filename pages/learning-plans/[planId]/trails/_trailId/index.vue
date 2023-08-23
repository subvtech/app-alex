<template>
  <alex-learningplan-page
    v-if="learningPlan"
    :learning-plan="learningPlan"
    :has-permission="hasAccess"
  />
  <div v-else>
    <span>fail {{ learningPlan }}</span>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const hasAccess = useAccess('learningplan', 'update');
const { learningPlan } = useGetData();
</script>
