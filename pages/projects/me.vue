<template>
  <div class="flex-grow-1 d-flex flex-column">
    <alex-custom-header
      class="mb-6"
      :title="'Meus Projetos'"
      :items="breadcrumbs"
      :has-main-button="isProfessor"
      :main-button-text="'Novo Projeto'"
      button-size="large"
      main-button-icon="mdi-plus"
      no-back-arrow
      @main-action="() => (createProjectDialog = true)"
    />
    <alex-learningplan-listing type="project" />
    <alex-project-dialogs-create
      v-model="createProjectDialog"
      @submit="updateProjects"
    />
  </div>
</template>

<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';

const { t } = useI18n();
const user = useStrapiUser<User>();
const createProjectDialog = ref(false);
const queryClient = useQueryClient();
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
const updateProjects = () => {
  queryClient.invalidateQueries({ queryKey: ['my-projects'] });
};
</script>

<style scoped lang="scss"></style>
