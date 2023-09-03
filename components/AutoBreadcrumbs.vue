<template>
  <div class="d-flex align-center">
    <h5 v-if="title" class="text-h5 font-weight-bold">{{ title }}</h5>
    <v-divider
      v-if="title"
      vertical
      :thickness="3"
      color="gray-700"
      class="ml-4"
      inset
    />
    <v-breadcrumbs :items="breadcrumbs" density="compact">
      <template #divider>
        <v-icon icon="mdi-chevron-right" color="gray-300"></v-icon>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script setup lang="ts">
interface breadcrumb {
  title: string;
  disabled: boolean;
  href: string;
}
defineProps<{ breadcrumbs: breadcrumb[]; title?: string }>();
// const route = useRoute();
// const breadcrumbsArray = route.fullPath.split('/');
// const transform = (pages: string[]) =>
//   pages.map((page) => {
//     if (page === '') return 'Home';
//     return page;
//   });
</script>

<style scoped></style>
