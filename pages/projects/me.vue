<template>
  <div class="flex-grow-1 d-flex flex-column">
    <alex-custom-header
      class="mb-6 mt-6"
      :title="'Meus Projetos'"
      :items="breadcrumbs"
      :has-main-button="isProfessor"
      :button-size="'large'"
      :main-button-text="'Novo Projeto'"
      main-button-icon="mdi-plus"
      no-back-arrow
    />
    <alex-learningplan-listing type="project" />
  </div>
</template>

<script setup lang="ts">
// import { queryClient } from '~/plugins/query';

const { t } = useI18n();
const user = useStrapiUser<User>();

// Static Values
const breadcrumbs = [
  {
    title: t('pages.classes.breadcrumbs.home'),
    to: '/',
    disabled: false,
  },
  {
    title: 'Projetos',
    to: '/courses/me',
    disabled: true,
  },
];

// Computed values
const isProfessor = computed(() => {
  return user.value?.role?.type === UserRoles.PROFESSOR;
});
// const updateProjects = () => {
//   queryClient.invalidateQueries({ queryKey: ['my-projects'] });
// };
</script>

<style scoped lang="scss"></style>
