<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';

const user = useStrapiUser<User>();
const createProjectDialog = ref(false);
const queryClient = useQueryClient();

const isProfessor = computed(() => {
  return user.value?.role?.type === UserRoles.PROFESSOR;
});

const updateProjects = () => {
  queryClient.invalidateQueries({ queryKey: ['my-projects'] });
};
</script>

<template>
  <div class="flex-grow-1 d-flex flex-column">
    <alex-custom-header
      class="mb-6"
      :title="$t('pages.projects.my_projects')"
      :has-main-button="isProfessor"
      :main-button-text="$t('pages.projects.new_project')"
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
