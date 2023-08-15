<template>
  <alex-learningplan-list :learning-plans="learningPlans" />
</template>

<script setup lang="ts">
import { Strapi4ResponseMany } from '@nuxtjs/strapi/dist/runtime/types';
import { authorLearningPlans } from '~/assets/queries';
import { LearningPlan } from '@/models/learningPlan.model';

definePageMeta({
  middleware: 'auth',
});

const user = useStrapiUser();
const graphql = useStrapiGraphQL();

const { data } = await useAsyncData('learningPlans', () => {
  const params = { author_id: user.value!.id };
  return graphql<{
    data: {
      learningplans: Strapi4ResponseMany<LearningPlan>;
    };
  }>(authorLearningPlans, params);
});

const learningPlans = computed(
  () => data?.value?.data?.learningplans.data ?? [],
);
</script>
