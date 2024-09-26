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
<<<<<<< Updated upstream
    <alex-learningplan-listing ref="listing" type="course" />
=======
    <div
      style="flex: 1"
      class="d-flex bg-white wrapper flex-column rounded-lg pa-6"
    >
      <div
        v-if="courses.length == 0"
        style="flex: 1"
        class="d-flex align-center justify-center flex-column"
      >
        <v-progress-circular
          v-if="isLoading"
          color="accent"
          indeterminate
          :size="100"
          :width="6"
        ></v-progress-circular>
        <div v-else>
          <img
            class="emptyProjects-img"
            src="public/images/emptyCourses.svg"
            alt="Empty Projects"
          />
          <p class="text-h3 text-gray-600 text-center">
            {{ $t('pages.classes.emptyStateText') }}
          </p>
        </div>
      </div>
      <div v-else class="d-flex w-100 flex-column h-100" style="flex: 1">
        <div class="d-flex justify-space-between flex-wrap w-100 mb-6">
          <alex-inputs-text-field
            v-model="search"
            name="search"
            :placeholder="$t('pages.classes.searchPlaceholder')"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            class="w-50"
            style="min-width: 160px; max-width: 320px"
            density="comfortable"
          />
          <div>
            <v-tooltip
              :text="$t('pages.classes.viewModeTooltip')"
              location="bottom"
              content-class="bg-gray-800"
            >
              <template #activator="{ props }">
                <alex-custom-button
                  v-bind="props"
                  :icon="
                    coursesView == 'grid'
                      ? 'mdi-format-list-bulleted'
                      : 'mdi-view-grid-outline'
                  "
                  size="large"
                  variant="secondary"
                  @click="changeViewMode"
                />
              </template>
            </v-tooltip>
            <v-tooltip
              :text="$t('pages.classes.filterTooltip')"
              location="bottom"
              content-class="bg-gray-800"
            >
              <template #activator="{ props }">
                <alex-custom-button
                  v-bind="props"
                  class="mx-2"
                  icon="mdi-filter-variant"
                  size="large"
                  variant="secondary"
                  @click="console.log('filter')"
                />
              </template>
            </v-tooltip>
          </div>
        </div>
        <v-data-iterator
          v-model:search="search"
          v-model:page="page"
          :items="courses"
          :items-per-page="12"
          :filter-keys="[
            'title',
            'description',
            'facilitatorName',
            'trails',
            'institution',
            'start_date',
            'end_date',
            'tags',
          ]"
          class="d-flex flex-wrap"
          style="flex: 1; position: relative; max-height: min-content"
        >
          <template #default="{ items }">
            <div
              v-if="coursesView === 'grid'"
              :class="[
                'grid-container w-100',
                isSingleColumn ? 'grid-none' : '',
              ]"
            >
              <alex-learningplan-card
                v-for="(course, index) in items"
                v-show="!course.raw.hidden || professorMode"
                :key="course.raw.title + index"
                type="course"
                :title="course.raw.title"
                :options="course.raw.userIsFacilitator"
                :description="course.raw.description"
                :image="{
                  url: course.raw.cover_image?.url,
                }"
                :facilitator="{
                  name: course.raw.facilitatorName,
                  imageURL: course.raw.facilitatorImage,
                }"
                class="flex-stretch w-100 h-100"
                :trails-count="course.raw.trails"
                :hide="course.raw.hidden"
                :hide-favorited-button="true"
                @toggle-visibility="changeItemVisibility(index, course.raw.id)"
                @configurations="navigate(course.raw.id, 'settings')"
                @open="navigate(course.raw.id, 'page')"
              />
            </div>
            <v-data-table
              v-else
              id="courses-table"
              ref="tableRef"
              :items-per-page="12"
              :items="setTableData(items)"
              :headers="headers"
            >
              <template #item="{ item, index }">
                <tr
                  v-show="!(item as any).hidden || professorMode"
                  class="table-row text-body-3 text-gray course-row"
                  :class="{ hidden: (item as any).hidden }"
                  @click="navigate((item as any).id, 'page')"
                >
                  <td style="max-width: 596px">
                    <div class="d-flex align-center">
                      <v-img
                        :src="
                          (item as any).img || '/images/cover_image_course.svg'
                        "
                        width="48"
                        height="36"
                        style="max-width: 48px; max-height: 36px"
                        class="rounded mr-4"
                        cover
                      />
                      <p class="text-gray-900 text-body-4 text-overflow">
                        {{ (item as any).title }}
                      </p>
                    </div>
                  </td>
                  <td class="text-overflow" style="max-width: 596px">
                    {{ (item as any).description }}
                  </td>
                  <td class="text-overflow" style="max-width: 150px">
                    {{ (item as any).facilitatorName }}
                  </td>
                  <td class="text-overflow" style="max-width: 90px">
                    {{ (item as any).trails }}
                  </td>
                  <td v-if="(item as any).userIsFacilitator">
                    <alex-custom-dropdown
                      :items="
                        dropdownItems(
                          (item as any).hidden,
                          index,
                          items[index].raw.id,
                        )
                      "
                    >
                      <template #activator="{ props: propsMenu }">
                        <v-tooltip
                          :text="$t('components.learningPlan.card.options')"
                          location="bottom"
                          content-class="bg-gray-800"
                        >
                          <template #activator="{ props: optionsTooltipProps }">
                            <alex-custom-button
                              name="options"
                              v-bind="{ ...propsMenu, ...optionsTooltipProps }"
                              variant="text"
                              icon="mdi-dots-vertical"
                            />
                          </template>
                        </v-tooltip>
                      </template>
                    </alex-custom-dropdown>
                  </td>
                </tr>
              </template>
              <template #bottom />
            </v-data-table>
          </template>
          <template #footer="{ pageCount, groupedItems }">
            <div
              class="d-flex w-100 justify-space-between align-center pa-6 pb-0 flex-column flex-sm-row ga-3 footer mt-6"
            >
              <p class="show-cardlist text-body-3 text-gray-600">
                {{ showingData(groupedItems) }}
              </p>
              <alex-custom-pagination
                v-if="pageCount > 1"
                v-model="page"
                :length="pageCount"
                :total-visible="5"
                class="extra-mb"
              />
            </div>
          </template>
        </v-data-iterator>
      </div>
    </div>
>>>>>>> Stashed changes
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
