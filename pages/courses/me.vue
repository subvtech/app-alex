<template>
  <div class="d-flex flex-column w-100 flex-grow-1">
    <alex-custom-header
      class="mb-6"
      :title="$t('pages.classes.breadcrumbs.myCourses')"
      :items="breadcrumbs"
      :has-main-button="professorMode"
      :main-button-text="$t('pages.classes.newCourse')"
      main-button-icon="mdi-plus"
      button-size="large"
      no-back-arrow
      @main-action="() => (createCourseDialog = true)"
    />
    <alex-learningplan-dialogs-create
      v-model="createCourseDialog"
      @submit="updateCourses"
    />
    <alex-learningplan-listing ref="listing" type="course" />
  </div>
</template>

<script setup lang="ts">
import { useQueryClient, UseQueryDefinedReturnType } from '@tanstack/vue-query';
import { LearningPlanData } from '~/components/alex/learningplan/listing/mutations';
definePageMeta({
  middleware: 'auth',
});
const { t } = useI18n();
const createCourseDialog = ref(false);
const queryClient = useQueryClient();
const user = useStrapiUser<User>();
const listing = ref<null | {
  query: UseQueryDefinedReturnType<
    {
      meta: {};
      data: LearningPlanData[];
    },
    Error
  >;
}>(null);
const professorMode = computed(() => {
  return user.value?.role?.type === UserRoles.PROFESSOR;
});

const breadcrumbs = [
  {
    title: t('pages.classes.breadcrumbs.home'),
    to: '/',
    disabled: false,
  },
  {
    title: t('pages.classes.breadcrumbs.myCourses'),
    to: '/courses/me',
    disabled: true,
  },
];

const updateCourses = () => {
  queryClient.invalidateQueries({ queryKey: ['my-courses'] });
};
</script>

<style></style>
