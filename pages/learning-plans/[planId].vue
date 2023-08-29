<template>
  <v-container fluid>
    <v-row align="center" class="mb-5" @click="handleBack">
      <v-btn icon color="primary">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1>{{ planTitle }}</h1>
    </v-row>
    <v-tabs v-if="!isTrailRoute" class="mb-5">
      <v-tab nuxt :to="generalInfoLink" replace>
        {{ $t('pages.planId.general') }}
      </v-tab>
      <v-tab
        v-if="!isTrailRoute"
        nuxt
        :to="`/learning-plans/${route.params.planId}/trails`"
        replace
      >
        {{ $t('pages.planId.trails') }}
      </v-tab>
      <v-tab
        v-if="!isTrailRoute"
        nuxt
        :to="`/learning-plans/${route.params.planId}/tasks`"
        replace
      >
        {{ $t('pages.planId.assignments') }}
      </v-tab>
      <v-tab
        v-if="!isTrailRoute"
        nuxt
        :to="`/learning-plans/${route.params.planId}/settings`"
        replace
      >
        {{ $t('pages.planId.options') }}
      </v-tab>
    </v-tabs>
    <NuxtPage @loaded="onLoadedChild" />
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const { isTrailRoute, handleBack } = useGetData();

const route = useRoute();

const planTitle = ref('');

const generalInfoLink = computed(() => {
  const { trailId, planId } = route.params;
  return isTrailRoute
    ? `/learning-plans/${planId}/trails/${trailId}`
    : `/learning-plans/${planId}`;
});

console.log('generalInfoLink', generalInfoLink.value);
const onLoadedChild = (learningPlan) => {
  planTitle.value = learningPlan.title;
};
</script>
