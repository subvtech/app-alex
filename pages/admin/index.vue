<template>
  <span> Acesse o menu lateral para consultar a área administrativa </span>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});

// const { data } = await useAsyncData('learningPlans', () => {
//   const params = { author_id: user.value!.id };
//   return graphql<{
//     data: {
//       learningplans: Strapi4ResponseMany<LearningPlan>;
//     };
//   }>(authorLearningPlans, params);
// });
</script>

<style lang="scss" scoped></style>
