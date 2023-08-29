<template>
  <v-app dark>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/">{{ $t('layouts.error.homePage') }}</NuxtLink>
  </v-app>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const i18n = useI18n();
// layout: 'empty'
const props = defineProps({
  error: {
    type: Object,
    default: null,
  },
});
const { error } = toRefs(props);
const pageNotFound = ref(i18n.t('layouts.error.notFound'));
const otherError = ref(i18n.t('layouts.error.other'));
function head() {
  const title =
    error.value.statusCode === 404 ? pageNotFound.value : otherError.value;
  return {
    title,
  };
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
