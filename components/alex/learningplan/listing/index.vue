<template>
  <div class="d-flex bg-white flex-grow-1 flex-column rounded-lg">
    <div
      v-if="
        customDataLoading !== undefined
          ? customDataRef?.courseProjects?.length === 0
          : query.data?.value.data.length === 0
      "
      class="tw-flex-1 d-flex align-center justify-center flex-column pa-6"
    >
      <v-progress-circular
        v-if="customDataLoading !== undefined ? customDataLoading : query.isFetching.value"
        color="accent"
        indeterminate
        :size="100"
        :width="6"
      ></v-progress-circular>
      <div v-else>
        <img class="emptyProjects-img" src="public/images/emptyCourses.svg" alt="Empty Projects" />
        <p class="text-h3 text-gray-600 text-center">
          {{
            $t('pages.courses.emptyStateText', {
              type: $t(`pages.courses.${simplifiedType}`),
            })
          }}
        </p>
      </div>
    </div>
    <div v-else class="d-flex w-100 flex-column h-100 tw-flex-1">
      <div class="d-flex justify-space-between flex-wrap w-100 pa-6 pb-0">
        <alex-inputs-text-field
          v-model="search"
          name="search"
          :placeholder="
            $t('pages.courses.searchPlaceholder', {
              type: $t(`pages.courses.${simplifiedType}`),
            })
          "
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          class="w-50 tw-min-w-[160px] tw-max-w-[320px]"
          density="comfortable"
        />
        <div>
          <v-tooltip :text="$t('pages.classes.viewModeTooltip')" location="bottom" content-class="bg-gray-800">
            <template #activator="{ props: propsCourseView }">
              <alex-custom-button
                v-bind="propsCourseView"
                :icon="learningPlanView == 'grid' ? 'mdi-format-list-bulleted' : 'mdi-view-grid-outline'"
                size="large"
                variant="secondary"
                @click="changeViewMode"
              />
            </template>
          </v-tooltip>
          <v-tooltip :text="$t('pages.classes.filterTooltip')" location="bottom" content-class="bg-gray-800">
            <template #activator="{ props: propsFilter }">
              <alex-custom-button
                v-bind="propsFilter"
                class="mx-2"
                icon="mdi-filter-variant"
                size="large"
                variant="secondary"
                @click="filterDrawer = true"
              />
            </template>
          </v-tooltip>
        </div>
      </div>
      <v-slide-y-transition>
        <div v-if="hasFilters" class="tw-flex tw-flex-wrap gap-2 tw-pb-4 pa-6 pb-0">
          <template v-for="(filter, key) in filters" :key="filter?.title">
            <alex-custom-chip
              v-if="checkValidFilters(key, filter)"
              :text="filter?.title"
              status="secondary"
              clickable
              closable
              @click:close="handleRemoveFilter(key)"
            />
          </template>
        </div>
      </v-slide-y-transition>
      <v-data-iterator
        v-model:search="search"
        v-model:page="page"
        :items="filteredByLeader"
        :items-per-page="itemsPerPageValue"
        :filter-keys="[
          'learningPlan.title',
          'learningPlan.description',
          'facilitator?.user?.fullname',
          'learningPlan.start_date',
          'learningPlan.end_date',
        ]"
        class="d-flex tw-flex-col tw-flex-grow h-full tw-relative tw-max-h-min"
      >
        <template #default="{ items }">
          <div
            v-if="learningPlanView === 'grid'"
            class="learningPlan-container w-100 pa-6"
            :class="{ 'grid-none': isSingleColumn }"
          >
            <alex-learningplan-card
              v-for="(item, index) in setTableData(items)"
              v-show="!item.learningPlan.hidden || isProfessor"
              :key="item.learningPlan.title + index"
              class="tw-w-full"
              :type="type"
              :title="item.learningPlan.title"
              :options="item.facilitator?.user.id === user?.id"
              :description="item.learningPlan.description"
              :image="{
                url: item.learningPlan.cover_image?.url || '',
              }"
              :institution="item.learningPlan.type === 'course' ? undefined : item.learningPlan.institutions?.[0]"
              :facilitator="{
                name: item.facilitator?.user?.fullname || '',
                imageURL: item.facilitator?.user?.avatar?.url,
              }"
              :leader="
                item.leader && {
                  name: item.leader?.user?.fullname || '',
                  imageURL: item.leader?.user?.avatar?.url,
                }
              "
              :members="getUrlNameMembers(item.learningPlan.members)"
              :hide="item.learningPlan.hidden"
              :unavailable="!isAvailable(item.learningPlan.id)"
              :trails-count="item.learningPlan.type === 'course' ? item.trails.count : undefined"
              :product="item.learningPlan.type !== 'course' ? item.learningPlan.product?.text : undefined"
              hide-favorited-button
              @toggle-visibility="
                changeItemVisibility({
                  learninplanId: item.learningPlan.id,
                  value: !item.learningPlan.hidden,
                  type,
                })
              "
              @configurations="navigate(item.learningPlan.id, 'settings')"
              @open="isAvailable(item.learningPlan.id) ? navigate(item.learningPlan.id, 'page') : displayUnavailable()"
            />
          </div>
          <v-data-table
            v-else
            id="learningPlan-table"
            ref="tableRef"
            :items-per-page="itemsPerPageValue"
            :items="setTableData(items)"
            :headers="headers"
            class="tw-flex-1 pa-6 pt-0"
          >
            <template #item="{ item }">
              <tr
                class="table-row text-body-3 text-gray learning-row"
                :class="{
                  hidden: item.learningPlan.hidden,
                  'tw-grayscale tw-opacity-40': !isAvailable(item.learningPlan.id),
                }"
                @click="
                  isAvailable(item.learningPlan.id) ? navigate(item.learningPlan.id, 'page') : displayUnavailable()
                "
              >
                <td class="max-width-[596px]">
                  <div class="d-flex align-center">
                    <v-img
                      :src="item.learningPlan.cover_image?.url || '/images/cover_image_course.svg'"
                      width="48"
                      height="36"
                      class="rounded mr-4 !tw-max-w-[48px] !tw-max-h-[36px]"
                      cover
                    />
                    <p class="text-gray-900 text-body-4 text-overflow">{{ item.learningPlan.title }}</p>
                  </div>
                </td>
                <td class="text-overflow max-width-[596px]">
                  {{ item.learningPlan.description }}
                </td>
                <td class="text-overflow max-width-[150px]">
                  {{
                    item.learningPlan.type === 'course' ? item.facilitator?.user?.fullname : item.leader?.user?.fullname
                  }}
                </td>
                <td class="text-overflow max-width-[596px]">
                  {{ item.learningPlan.type === 'course' ? item.trails.count : item.learningPlan.product?.text }}
                </td>
                <td v-if="item.facilitator?.user.id === user.id">
                  <alex-custom-dropdown :items="dropdownItems(item.learningPlan.hidden, item.learningPlan.id)">
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
            v-if="groupedItems.length"
            class="d-flex w-100 tw-h-[92px] justify-space-between align-center px-6 flex-column flex-sm-row ga-3 tw-border-t-[1px] tw-border-gray-100 tw-mt-auto"
          >
            <p class="show-cardlist text-body-3 text-gray-600">
              {{ showingData(groupedItems, filteredByLeader) }}
            </p>
            <alex-custom-pagination
              v-if="pageCount > 1"
              v-model="page"
              :length="pageCount"
              :total-visible="itemsPerPageValue"
              class="extra-mb"
            />
          </div>
        </template>
        <template #no-data>
          <div class="tw-flex tw-flex-grow tw-justify-center tw-items-center tw-flex-col">
            <img class="emptyProjects-img" src="public/images/emptyCourses.svg" alt="Empty Projects" />
            <p class="text-h3 text-gray-600 text-center">
              {{
                $t('pages.classes.noData', {
                  object: $t(`pages.classes.tableHeaders.${simplifiedType}`),
                })
              }}
            </p>
          </div></template
        >
      </v-data-iterator>
      <alex-learningplan-filter ref="filterRef" v-model="filterDrawer" :type="type" @submit="mapFiltersValue" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { LearningPlanFilter } from '../Filter.vue';
import { LearningPlanData, useGetMyLearningPlan, useUpdateVisibility } from './mutations';

interface DataTableHeader<T> {
  title: string;
  key: string;
  sortable?: boolean;
  sortRaw?: (a: T, b: T) => number;
}
interface Item {
  raw: LearningPlanData;
}
interface ListingProps {
  type: LearningPlanSimple['type'];
  // For custom listing
  customData?: LearningPlanData[];
  customDataLoading?: boolean;
}
type FilterTitle<T> = { [P in keyof T]: { title: string; value?: T[P] } };
const props = defineProps<ListingProps>();
const { t } = useI18n();
const { setMessage } = useMessageStore();
const user = useStrapiUser<User>();
const query = useGetMyLearningPlan(props.type, user.value?.id);
const search = ref('');
const page = ref(1);
const tableRef = ref(null);
const learningPlanView = ref('grid');
const direction = useDirection();
const filterDrawer = ref(false);
const customDataRef = ref<undefined | any>(undefined);
const filters = ref<FilterTitle<LearningPlanFilter>>({
  facilitator: {
    title: t('pages.classes.filter.facilitator'),
    value: null,
  },
  generalCompetences: {
    title: t('pages.classes.filter.generalCompetences'),
    value: [],
  },
  technicalCompetences: {
    title: t('pages.classes.filter.techCompetences'),
    value: [],
  },
  institution: { title: t('pages.classes.filter.institution'), value: null },
  leader: { title: t('pages.classes.filter.leader'), value: null },
  startDate: {
    title: t('pages.classes.filter.startDate'),
    value: undefined,
  },
  finalDate: {
    title: t('pages.classes.filter.finalDate'),
    value: undefined,
  },
});
const filterRef = ref<null | {
  removeFilter: (key: keyof typeof filters.value | (string & {})) => void;
}>(null);
const { mutateAsync: changeItemVisibility } = useUpdateVisibility();

const isSingleColumn = computed(() => direction.value !== 'VERTICAL');
const isProfessor = computed(() => {
  return user.value?.role?.type === UserRoles.PROFESSOR;
});
const simplifiedType = computed(() => (props.type === 'course' ? 'course' : 'project'));
const hasFilters = computed(() => {
  let hasFilter = false;
  Object.values(filters.value).forEach((filter) => {
    if (!filter.value) {
      return;
    }
    if (!Array.isArray(filter.value)) {
      hasFilter = true;
    }
    if (Array.isArray(filter.value) && filter.value.length) {
      hasFilter = true;
    }
  });
  return hasFilter;
});
//      Filters
const filteredByFacilitator = computed(() => {
  const data = customDataRef.value ? customDataRef.value?.courseProjects : query.data?.value.data || [];

  return (
    data?.filter((data) =>
      filters.value.facilitator.value?.id ? data?.facilitator?.user.id === filters.value.facilitator.value?.id : true,
    ) || []
  );
});
const filteredByDate = computed(() =>
  filteredByFacilitator.value.filter((data) => {
    const isInStartDateRange = checkIntervalOfDates(
      new Date(data.learningPlan.start_date),
      filters.value.startDate.value?.start,
      filters.value.startDate.value?.end,
    );
    const isInFinalDateRange = checkIntervalOfDates(
      new Date(data.learningPlan.end_date),
      filters.value.finalDate.value?.start,
      filters.value.finalDate.value?.end,
    );
    return isInStartDateRange && isInFinalDateRange;
  }),
);
const filteredByCompetences = computed(() =>
  filteredByDate.value.filter((data) => {
    const competences = [...filters.value.generalCompetences.value!, ...filters.value.technicalCompetences.value!];
    if (!competences.length) {
      return true;
    }
    const hasCompetence = competences.filter((competence) =>
      data.learningPlan.tags.find((tag) => tag.text === competence.text),
    ).length;
    return hasCompetence;
  }),
);
const filteredByInstitutions = computed(() =>
  filteredByCompetences.value.filter((data) => {
    if (!filters.value.institution.value) {
      return true;
    }
    return !!data.learningPlan.institutions?.find(
      (institution) => institution.id === filters.value.institution.value?.id,
    );
  }),
);
const filteredByLeader = computed(() =>
  filteredByInstitutions.value.filter((data) => {
    if (props.type === 'course') {
      return true;
    }
    if (!filters.value.leader.value) {
      return true;
    }
    return data.leader?.user.id === filters.value.leader.value.id;
  }),
);

const headers = computed<DataTableHeader<LearningPlanData>[]>(() => [
  {
    title: t(`pages.courses.${simplifiedType.value}`),
    key: 'learningPlan.title',
  },
  {
    title: t('pages.classes.tableHeaders.description'),
    key: 'learningPlan.description',
  },
  {
    title:
      props.type === 'course' ? t('pages.classes.tableHeaders.facilitator') : t('pages.classes.tableHeaders.leader'),
    key: props.type === 'course' ? 'facilitator?.user?.fullname' : 'leader?.user?.fullname',
    sortRaw(a, b) {
      const hasBothFacilitators = b.facilitator?.user && a.facilitator?.user;
      const hasBothLeaders = b.leader?.user && a.leader?.user;
      if (props.type === 'course' && hasBothFacilitators) {
        return a.facilitator!.user?.fullname.localeCompare(b.facilitator!.user?.fullname);
      }
      if (props.type === 'project' && hasBothLeaders) {
        return a.leader!.user?.fullname.localeCompare(b.leader!.user?.fullname);
      }
      return 1;
    },
  },
  {
    title: props.type === 'course' ? t('pages.classes.tableHeaders.trails') : t('pages.classes.tableHeaders.product'),
    key: props.type === 'course' ? 'trails.count' : 'learningPlan.product.text',
    sortRaw(a, b) {
      const hasBothProducts = b.learningPlan.product && a.learningPlan.product;
      if (props.type === 'course') {
        return b.trails.count - a.trails.count;
      }
      if (hasBothProducts) {
        return a.learningPlan.product!.text.localeCompare(b.learningPlan.product!.text);
      }
      return 1;
    },
  },
]);

// Static Values
const itemsPerPageValue = 12;

// Functions
const isAvailable = (id: number) => {
  return customDataRef.value?.yourProjects ? customDataRef.value.yourProjects.includes(id) : true;
};

const displayUnavailable = () => {
  setMessage(t('components.learningPlan.card.notProjectMember'), 'warning', true);
};

const changeViewMode = () => {
  learningPlanView.value = learningPlanView.value === 'grid' ? 'table' : 'grid';
};
const setTableData = (items: readonly Item[]): LearningPlanData[] => {
  return items.map((item) => item.raw);
};
const dropdownItems = (hidden: boolean, id: number) => {
  return [
    hidden
      ? {
          icon: 'mdi-eye-outline',
          text: t('components.learningPlan.card.visibility.show'),
          onClick: () =>
            changeItemVisibility({
              value: false,
              learninplanId: id,
              type: props.type,
            }),
        }
      : {
          icon: 'mdi-eye-off-outline',
          text: t('components.learningPlan.card.visibility.hide'),
          onClick: () =>
            changeItemVisibility({
              value: true,
              learninplanId: id,
              type: props.type,
            }),
        },
    {
      icon: 'mdi-cog-outline',
      text: t('components.learningPlan.card.configurations'),
      link: `/courses/${id}/settings`,
    },
  ];
};
const navigate = (id: number, page: string) => {
  const listType = props.type === 'course' ? 'courses' : 'projects';
  if (page === 'settings') {
    navigateTo(`/${listType}/${id}/settings`);
  } else {
    navigateTo(`/${listType}/${id}`);
  }
};
const showingData = (groupedItems: any, items: Array<any>) => {
  const itemsPerPage = search.value === '' ? itemsPerPageValue : groupedItems.length;
  const from = (page.value - 1) * itemsPerPage + 1;
  const to = page.value * itemsPerPage > items.length ? items.length : page.value * itemsPerPage;
  const total = items.length;
  const message = t('pages.courses.showingData', {
    from,
    to,
    total,
    entity: props.type === 'course' ? t('pages.courses.courses') : t('pages.courses.projects'),
  });
  if (to === 0) {
    return t('pages.classes.noData');
  }
  return message;
};
const getUrlNameMembers = (members: LearningPlanMemberSimple[]) =>
  members.map((member) => ({
    name: member?.user?.fullname || 'Nome',
    ...(member.user?.avatar?.url && {
      image: { url: member.user?.avatar?.url },
    }),
  }));
//    Filters
const handleRemoveFilter = (key: string) => {
  if (!filters.value || !filters.value[key]) {
    return;
  }
  if (key === 'startDate' || key === 'finalDate') {
    filters.value[key].value = undefined;
  } else if (key === 'generalCompetences' || key === 'technicalCompetences') {
    filters.value[key].value = [];
  } else {
    filters.value[key].value = null;
  }
  if (filterRef.value) {
    filterRef.value.removeFilter(key);
  }
};
const mapFiltersValue = (values: Partial<LearningPlanFilter>) => {
  for (const key in values) {
    filters.value[key].value = values[key];
    if ((key === 'startDate' || key === 'finalDate') && !values[key]?.start && !values[key]?.end) {
      filters.value[key].value = undefined;
    }
  }
};
const checkValidFilters = (key: keyof typeof filters.value, filter: { title: string; value?: any }) => {
  if (key === 'startDate' || key === 'finalDate') {
    if (!filter.value?.start && !filter?.value?.end) {
      return false;
    }
  }
  if (key.includes('Competences') && !(filter.value as Array<string>)?.length) {
    return false;
  }
  if (!filter?.value) {
    return false;
  }
  return true;
};

// Actions
onBeforeMount(() => {
  if (isProfessor.value) {
    headers.value.push({
      title: '',
      key: '',
      sortable: false,
    });
  }
});

watch(
  () => props.customData,
  (value) => {
    customDataRef.value = value;
  },
);

defineExpose({ query, refetch: () => query.refetch() });
</script>

<style scoped lang="scss">
#learningPlan-table thead > tr > th {
  height: 40px;
}

#learningPlan-table tr:not(:last-child) > td,
#learningPlan-table thead > tr > th {
  border-bottom: 1px solid #ebedef !important;
}

#learningPlan-table .v-data-table__th {
  color: var(--cinza-cinza-600, #6e7a87);
}
.learningPlan-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 24px;
  flex: 1;
}
.hidden {
  opacity: 0.5;
}
@media screen and (min-width: 960px) and (max-width: 1280px) {
  .learningPlan-container {
    flex-wrap: nowrap;
    flex-direction: column;
  }
}
.learning-row:hover {
  cursor: pointer;
  background-color: rgb(var(--v-theme-gray-100)) !important;
}

@media screen and (max-width: 870px) {
  .project-container {
    justify-content: center;
  }
}
</style>
