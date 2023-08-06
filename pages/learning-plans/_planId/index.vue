<template>
  <alex-learningplan-page
    :learning-plan="learningPlan"
    :has-permission="hasAccess('learningplan', 'update')"
    @updated="loadPlan"
  />
</template>

<script setup lang="ts">
import { useGetData } from '~/composables/getData';
import { useAccess } from '~/composables/access';

const hasAccess = useAccess();
const { learningPlan, loadPlan } = useGetData();
</script>
