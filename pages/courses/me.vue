<template>
  <div class="wrapper d-flex flex-column gap-6">
    <alex-custom-header
      :title="$t('pages.classes.breadcrumbs.myCourses')"
      :items="breadcrumbs"
      :has-main-button="professorMode"
      :main-button-text="$t('pages.classes.newCourse')"
      main-button-icon="mdi-plus"
      no-back-arrow
      @main-action="() => (createCourseDialog = true)"
    />
    <alex-learningplan-dialogs-create-learningplan
      v-model="createCourseDialog"
      @submit="async () => await getCourses()"
    />
    <div style="flex: 1" class="d-flex bg-white flex-column rounded-lg pa-6">
      <div
        v-if="courses.length == 0"
        style="flex: 1"
        class="d-flex align-center justify-center flex-column"
      >
        <img
          class="emptyProjects-img"
          src="@/assets/svg/EmptyProjects.svg"
          alt="Empty Projects"
        />
        <p class="text-h3 text-gray-600">
          {{ $t('pages.classes.emptyStateText') }}
        </p>
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
            style="min-width: 160px"
            density="compact"
          >
            ></alex-inputs-text-field
          >
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
          class="d-flex flex-wrap align-content-space-between"
          style="flex: 1"
        >
          <template #default="{ items }">
            <div v-if="coursesView === 'grid'" class="d-flex flex-wrap ga-4">
              <alex-learningplan-card
                v-for="(course, index) in items"
                v-show="!course.raw.hidden || professorMode"
                :key="course.raw.title + index"
                type="course"
                class="flex-stretch"
                :title="course.raw.title"
                :options="professorMode"
                :description="course.raw.description"
                :image="{
                  url: course.raw.img,
                }"
                :facilitator="{
                  name: course.raw.facilitatorName,
                  imageURL: course.raw.facilitatorImage,
                }"
                :trails-count="course.raw.trails"
                :hide="course.raw.hidden"
                :favorited="course.raw.favorited"
                @favorite="changeItemFavorited(index)"
                @toggle-visibility="changeItemVisibility(index, course.raw.id)"
                @configurations="navigate(course.raw.id, 'configurations')"
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
                      <img
                        :src="(item as any).img"
                        width="48"
                        height="36"
                        style="min-width: 48px; min-height: 36px"
                        class="rounded mr-4"
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
                  <td v-if="professorMode">
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
                          text="Opções"
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
              class="d-flex w-100 justify-space-between align-center pa-6 flex-column flex-sm-row ga-3 footer mt-6"
            >
              <p class="text-body-3 text-gray-600">
                {{ showingData(groupedItems) }}
              </p>
              <alex-custom-pagination
                v-if="pageCount > 1"
                v-model="page"
                :length="pageCount"
                :total-visible="5"
              />
            </div>
          </template>
        </v-data-iterator>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Strapi4ResponseMany } from '@nuxtjs/strapi/dist/runtime/types';
import { GetLearningPlans } from '~/assets/queries';
import { LearningPlan } from '@/models/learningPlan.model';
const rounter = useRouter();
const coursesView = ref('grid');
const search = ref('');
const page = ref(1);
const tableRef = ref(null);
const professorMode = ref(false);
const { t } = useI18n();
const graphql = useStrapiGraphQL();
const { update } = useStrapi();
const createCourseDialog = ref(false);
interface courseItem {
  id: number;
  description: string;
  facilitatorName?: string;
  facilitatorImage?: string;
  trails?: number;
  img?: string;
  institution?: string;
  tags?: string[];
  start_date: string;
  end_date?: string;
  hidden: boolean;
  favorited: boolean;
  title: string;
}

const courses = ref<courseItem[]>([]);
const getCourses = async () => {
  const { isProfessor, id } = useStrapiUser<User>().value;
  professorMode.value = isProfessor;
  if (professorMode.value) {
    headers.push({
      title: '',
      key: '',
      sortable: false,
    });
  }
  const { data } = await useAsyncData('learningPlans', () => {
    const params = { userId: id };
    return graphql<{
      data: {
        learningplans: Strapi4ResponseMany<LearningPlan>;
      };
    }>(GetLearningPlans, params);
  });
  courses.value =
    data.value?.data.learningplans.data.map((plan): courseItem => {
      const { attributes } = plan;
      const id = plan.id;
      const {
        title,
        description,
        start_date,
        end_date,
        cover_image,
        hidden,
        members,
        tags,
        learning_structure,
      } = attributes;
      const facilitatorName =
        members.data[0]?.attributes?.user.data.attributes.fullname;
      const facilitatorImage =
        members.data[0]?.attributes?.user.data.attributes.avatar?.data
          ?.attributes?.url;
      const institution =
        members.data[0]?.attributes?.user.data.attributes.institutions?.data[0]
          ?.attributes?.name;
      const img = cover_image?.data?.attributes?.url;
      const trails =
        learning_structure?.data?.attributes?.trails.data.length || 0;

      return {
        id,
        title,
        description,
        start_date,
        end_date,
        img,
        hidden,
        facilitatorName,
        facilitatorImage,
        institution,
        tags: tags.data.map((tag) => tag.attributes.text),
        trails,
        favorited: false,
      };
    }) || [];
};
// eslint-disable camelcase
onBeforeMount(async () => await getCourses());

interface Item {
  raw: courseItem;
}
const setTableData = (items: readonly Item[]): courseItem[] => {
  return items.map((item) => item.raw);
};

const showingData = (groupedItems) => {
  const itemsPerPage = search.value === '' ? 12 : groupedItems.length;

  const from = (page.value - 1) * itemsPerPage + 1;
  const to =
    page.value * itemsPerPage > courses.value.length
      ? courses.value.length
      : page.value * itemsPerPage;
  const total = courses.value.length;
  const message = t('pages.classes.showingData', {
    from,
    to,
    total,
  });
  return message;
};
const breadcrumbs = [
  {
    title: t('pages.classes.breadcrumbs.home'),
    href: '/',
    disabled: false,
  },
  {
    title: t('pages.classes.breadcrumbs.myCourses'),
    href: '/course',
    disabled: false,
  },
];

const dropdownItems = (hidden, index, id) => {
  return [
    hidden
      ? {
          icon: 'mdi-eye-outline',
          text: t('components.learningPlan.card.visibility.show'),
          onClick: () => changeItemVisibility(index, id),
        }
      : {
          icon: 'mdi-eye-off-outline',
          text: t('components.learningPlan.card.visibility.hide'),
          onClick: () => changeItemVisibility(index, id),
        },
    {
      icon: 'mdi-cog-outline',
      text: t('components.learningPlan.card.configurations'),
      link: `/course/${id}/configurations`,
    },
  ];
};

interface DataTableHeader {
  title: string;
  key: string;
  sortable?: boolean;
}

const headers: DataTableHeader[] = [
  {
    title: t('pages.classes.tableHeaders.course'),
    key: 'title',
  },
  {
    title: t('pages.classes.tableHeaders.description'),
    key: 'description',
  },
  {
    title: t('pages.classes.tableHeaders.facilitator'),
    key: 'facilitatorName',
  },
  {
    title: t('pages.classes.tableHeaders.trails'),
    key: 'trails',
  },
];

const changeViewMode = () => {
  coursesView.value = coursesView.value === 'grid' ? 'table' : 'grid';
};

const changeItemVisibility = (index: number, id) => {
  update('learningPlans', id, {
    hidden: !courses.value[index].hidden,
  }).then(() => {
    courses.value[index].hidden = !courses.value[index].hidden;
  });
};

const changeItemFavorited = (index: number) => {
  courses.value[index].favorited = !courses.value[index].favorited;
};

const navigate = (id: number, page) => {
  if (page === 'configurations') {
    rounter.push(`/course/${id}/configurations`);
  } else {
    rounter.push(`/course/${id}`);
  }
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

.flex-stretch {
  flex: 1 !important;
  flex-basis: fit-content;
}

.footer {
  border-top: 1px #ebedef solid;
  max-height: 95px;
}

.hidden {
  opacity: 0.5;
}
</style>
