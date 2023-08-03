<template>
  <alex-learningplan-list :learning-plans="learningPlans" />
</template>

<script setup>
import { authorLearningPlans } from '~/assets/queries';

const user = useStrapiUser();
const graphql = useStrapiGraphQL();
const learningPlans = await useAsyncData('learningPlans', () => {
  const queryGraphQl = {
    query: authorLearningPlans,
    variables: { author_id: user.id },
  };
  return graphql(queryGraphQl).learningplans;
});
</script>
