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
    <alex-learningplan-dialogs-create v-model="createCourseDialog" @submit="updateCourses" />
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

<style>
#courses-table thead > tr > th {
  height: 40px;
}

#courses-table tr:not(:last-child) > td,
#courses-table thead > tr > th {
  border-bottom: 1px solid #ebedef !important;
}

#courses-table .v-data-table__th {
  color: var(--cinza-cinza-600, #6e7a87);
  font-family: Sen;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 135%;
  letter-spacing: 0.32px;
}

.course-row {
  cursor: pointer;
}

.text-overflow {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
.emptyProjects-img {
  max-width: 400px;
  max-height: 360px;
}

.wrapper {
  min-height: calc(100vh - 130px);
}

.grid-container {
  display: grid !important;

  height: min-content;
  column-gap: 24px;
  row-gap: 24px;
  /* grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important; */
  grid-template-columns: repeat(auto-fit, minmax(300px, 375px)) !important;
  justify-content: start; /* Centers the grid items horizontally */
}

.flex-stretch {
  box-sizing: border-box !important;
}

.footer {
  border-top: 1px #ebedef solid;
  max-height: 95px;
  align-self: flex-end !important;
}

.hidden {
  opacity: 0.5;
}

.grid-none {
  grid-template-columns: 1fr !important;
}

@media (max-width: 1280px) {
  .flex-stretch {
    flex: 1;
    box-sizing: border-box !important;
  }
}
@media (max-width: 725px) {
  .flex-stretch {
    justify-self: center;
  }
}

@media (max-width: 477px) {
  .show-cardlist {
    font-size: 12px !important;
    letter-spacing: 0.4px !important;
  }
}

@media (max-width: 431px) {
  .extra-mb {
    translate: 0 -16px;
  }
}
</style>
