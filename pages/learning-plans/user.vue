<template>
  <alex-learningplan-list :learning-plans="learningPlans" />
</template>

<script setup lang="ts">
import { authorLearningPlans } from '~/assets/queries';

const user = useStrapiUser();
const graphql = useStrapiGraphQL();
const learningPlans = (await useAsyncData('learningPlans', () => {
  const queryGraphQl = {
    query: authorLearningPlans,
    variables: { author_id: user.value!.id },
  };
  return graphql(queryGraphQl).learningplans;
})).data.value;
</script>
