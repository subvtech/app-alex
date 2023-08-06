<template>
  <alex-learningplan-list
    :learning-plans="learningPlan.trails"
    :parent-learning-plan="learningPlan"
    @updated="loadPlan"
  />

</template>

<script setup lang="ts">
import { useGetData } from '~/composables/getData';
import { useAccess } from '~/composables/access';

const {learningPlan, loadPlan} = useGetData()

</script>
