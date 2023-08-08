<template>
  <v-container fluid>
    <v-row align="center" class="mb-5" @click="handleBack">
      <v-btn icon color="primary">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1>{{ planTitle }}</h1>
    </v-row>
    <v-tabs v-if="!isTrailRoute" class="mb-5">
      <v-tab nuxt :to="generalInfoLink" replace> Geral </v-tab>
      <v-tab
        v-if="!isTrailRoute"
        nuxt
        :to="`/learning-plans/${route.params.planId}/trails`"
        replace
      >
        Trilhas de aprendizagem
      </v-tab>
      <v-tab
        v-if="!isTrailRoute"
        nuxt
        :to="`/learning-plans/${route.params.planId}/tasks`"
        replace
      >
        Tarefas
      </v-tab>
      <v-tab
        v-if="!isTrailRoute"
        nuxt
        :to="`/learning-plans/${route.params.planId}/settings`"
        replace
      >
        Opções do Plano
      </v-tab>
    </v-tabs>
    <NuxtChild @loaded="onLoadedChild" />
  </v-container>
</template>

<script setup lang="ts">
const { isTrailRoute, handleBack } = useGetData();
//const hasAccess = useAccess()
const route = useRoute();

const planTitle = ref('');

const generalInfoLink = computed(() => {
  const { trailId, planId } = route.params;
  return isTrailRoute
    ? `/learning-plans/${planId}/trails/${trailId}`
    : `/learning-plans/${planId}`;
});

const onLoadedChild = (learningPlan) => {
  planTitle.value = learningPlan.title;
};
</script>
