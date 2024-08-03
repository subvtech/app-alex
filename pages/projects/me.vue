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
    <div class="d-flex bg-white flex-grow-1 flex-column rounded-lg pa-6">
      <div
        v-if="projects?.data.length === 0"
        class="tw-flex-1 d-flex align-center justify-center flex-column"
      >
        <v-progress-circular
          v-if="isFetching"
          color="accent"
          indeterminate
          :size="100"
          :width="6"
        ></v-progress-circular>
        <div v-else>
          <img
            class="emptyProjects-img"
            src="/images/emptyCourses.svg"
            alt="Empty Projects"
          />
          <p class="text-h3 text-gray-600 text-center">
            {{ 'Nenhum projeto encontrado!' }}
          </p>
        </div>
      </div>
      <div v-else class="d-flex w-100 flex-column h-100 tw-flex-1">
        <div class="d-flex justify-space-between flex-wrap w-100 mb-6">
          <alex-inputs-text-field
            v-model="search"
            name="search"
            :placeholder="$t('pages.classes.searchPlaceholder')"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            class="w-50 tw-min-w-[160px] tw-max-w-[320px]"
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
          :items="projects.data"
          :items-per-page="itemsPerPageValue"
          :filter-keys="[
            'project.title',
            'project.description',
            'facilitator?.user.fullname',
            'project.start_date',
            'project.end_date',
          ]"
          class="d-flex tw-flex-col tw-flex-grow h-full tw-relative tw-max-h-min"
        >
          <template #default="{ items }">
            <div
              v-if="coursesView === 'grid'"
              class="project-container w-100"
              :class="{ 'grid-none': isSingleColumn }"
            >
              <alex-learningplan-card
                v-for="(item, index) in setTableData(items)"
                v-show="!item.project.hidden || isProfessor"
                :key="item.project.title + index"
                type="project"
                class="tw-w-full"
                :title="item.project.title"
                :options="item.project.userIsFacilitator"
                :description="item.project.description"
                :image="{
                  url: item.project.cover_image?.url || '',
                }"
                :facilitator="{
                  name: item.facilitator?.user.fullname || '',
                  imageURL: item.facilitator?.user.avatar?.url,
                }"
                :members="
                  item.project.members.map((member) => ({
                    name: member.user.fullname,
                    ...(member.user.avatar?.url && {
                      image: { url: member.user.avatar?.url },
                    }),
                  }))
                "
                :hide="item.project.hidden"
                :product="'Software'"
                hide-favorited-button
                @toggle-visibility="
                  changeItemVisibility({
                    learninplanId: item.project.id,
                    value: !item.project.hidden,
                  })
                "
                @configurations="navigate(item.project.id, 'settings')"
                @open="navigate(item.project.id, 'page')"
              />
            </div>
            <v-data-table
              v-else
              id="project-table"
              ref="tableRef"
              :items-per-page="itemsPerPageValue"
              :items="setTableData(items)"
              :headers="headers"
              class="tw-flex-1"
            >
              <template #item="{ item }">
                <tr
                  v-show="!item.project.hidden || isProfessor"
                  class="table-row text-body-3 text-gray course-row"
                  :class="{ hidden: item.project.hidden }"
                  @click="navigate(item.project.id, 'page')"
                >
                  <td class="max-width-[596px]">
                    <div class="d-flex align-center">
                      <v-img
                        :src="
                          item.project.cover_image?.url ||
                          '/images/cover_image_course.svg'
                        "
                        width="48"
                        height="36"
                        class="rounded mr-4 !tw-max-w-[48px] !tw-max-h-[36px]"
                        cover
                      />
                      <p class="text-gray-900 text-body-4 text-overflow">
                        {{ item.project.title }}
                      </p>
                    </div>
                  </td>
                  <td class="text-overflow max-width-[596px]">
                    {{ item.project.description }}
                  </td>
                  <td class="text-overflow max-width-[150px]">
                    {{ item.facilitator.user.fullname }}
                  </td>
                  <td class="text-overflow max-width-[596px]">software</td>
                  <td v-if="item.facilitator?.user.id === user.id">
                    <alex-custom-dropdown
                      :items="
                        dropdownItems(item.project.hidden, item.project.id)
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
              class="d-flex tw-h-min w-100 justify-space-between align-center pa-6 pb-0 flex-column flex-sm-row ga-3 footer mt-6"
            >
              <p
                v-if="groupedItems.length"
                class="show-cardlist text-body-3 text-gray-600"
              >
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
          <template #no-data>
            <div
              class="tw-flex tw-flex-grow tw-justify-center tw-items-center tw-flex-col"
            >
              <img
                class="emptyProjects-img"
                src="/images/emptyCourses.svg"
                alt="Empty Projects"
              />
              <p class="text-h3 text-gray-600 text-center">
                {{ 'Nenhum projeto encontrado!' }}
              </p>
            </div></template
          >
        </v-data-iterator>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ProjectData,
  useGetMyProjects,
  useUpdateVisibility,
} from './mutations';
interface DataTableHeader {
  title: string;
  key: string;
  sortable?: boolean;
}
interface Item {
  raw: ProjectData;
}
const { t } = useI18n();
const user = useStrapiUser<User>();
const { data: projects, isFetching } = useGetMyProjects(user.value?.id);
const search = ref('');
const page = ref(1);
const tableRef = ref(null);
const coursesView = ref('grid');
const direction = useDirection();
const { mutateAsync: changeItemVisibility } = useUpdateVisibility();
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
const headers: DataTableHeader[] = [
  {
    title: 'Projeto',
    key: 'project.title',
  },
  {
    title: t('pages.classes.tableHeaders.description'),
    key: 'project.description',
  },
  {
    title: t('pages.classes.tableHeaders.facilitator'),
    key: 'facilitator?.user.fullname',
  },
  {
    title: 'Produto',
    key: 'project.product',
  },
];

// Computed values
const isSingleColumn = computed(() => direction.value !== 'VERTICAL');
const isProfessor = computed(() => {
  return user.value?.role?.type === UserRoles.PROFESSOR;
});

// Functions
const changeViewMode = () => {
  coursesView.value = coursesView.value === 'grid' ? 'table' : 'grid';
};
const setTableData = (items: readonly Item[]): ProjectData[] => {
  return items.map((item) => item.raw);
};
const dropdownItems = (hidden: boolean, id: number) => {
  return [
    hidden
      ? {
          icon: 'mdi-eye-outline',
          text: t('components.learningPlan.card.visibility.show'),
          onClick: () =>
            changeItemVisibility({ value: false, learninplanId: id }),
        }
      : {
          icon: 'mdi-eye-off-outline',
          text: t('components.learningPlan.card.visibility.hide'),
          onClick: () =>
            changeItemVisibility({ value: true, learninplanId: id }),
        },
    {
      icon: 'mdi-cog-outline',
      text: t('components.learningPlan.card.configurations'),
      link: `/courses/${id}/settings`,
    },
  ];
};

const navigate = (id: number, page: string) => {
  if (page === 'settings') {
    navigateTo(`/courses/${id}/settings`);
  } else {
    navigateTo(`/courses/${id}`);
  }
};
const itemsPerPageValue = 3;
const showingData = (groupedItems: any) => {
  const itemsPerPage =
    search.value === '' ? itemsPerPageValue : groupedItems.length;
  const from = (page.value - 1) * itemsPerPage + 1;
  const to =
    page.value * itemsPerPage > projects?.value?.data.length
      ? projects.value.data.length
      : page.value * itemsPerPage;
  const total = projects.value.data.length;
  const message = t('pages.courses.showingData', {
    from,
    to,
    total,
    entity: t('pages.courses.projects'),
  });
  if (to === 0) {
    return t('pages.classes.noData');
  }
  return message;
};
onBeforeMount(() => {
  if (isProfessor.value) {
    headers.push({
      title: '',
      key: '',
      sortable: false,
    });
  }
});
</script>

<style scoped lang="scss">
#project-table thead > tr > th {
  height: 40px;
}

#project-table tr:not(:last-child) > td,
#project-table thead > tr > th {
  border-bottom: 1px solid #ebedef !important;
}

#project-table .v-data-table__th {
  color: var(--cinza-cinza-600, #6e7a87);
}
.project-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 24px;
  flex: 1;
}
.hidden {
  opacity: 0.5;
}
@media screen and (max-width: 1280px) and (min-width: 960px) {
  .project-container {
    flex-wrap: nowrap;
    flex-direction: column;
  }
}
.course-row:hover {
  cursor: pointer;
  background-color: rgb(var(--v-theme-gray-100)) !important;
}

@media screen and (max-width: 870px) {
  .project-container {
    justify-content: center;
  }
}
</style>
