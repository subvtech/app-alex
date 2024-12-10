<template>
  <div class="flex-grow-1 d-flex flex-column">
    <!-- Header -->
    <div class="pa-6 d-flex tw-flex-col sm:tw-flex-row tw-items-stretch tw-gap-[12px] sm:tw-gap-[16px]">
      <alex-inputs-text-field
        v-model="search"
        class="criteria-group-textfield sm:tw-max-w-[320px] sm:tw-flex-[1_1_150px]"
        :placeholder="$t(`${i18Dir}.search`)"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        name="search"
        size="default"
        density="comfortable"
      />
      <alex-inputs-select
        v-model="type"
        class="criteria-group-select sm:tw-max-w-[240px] sm:tw-flex-[1_1_150px]"
        :items="[$t(`${i18Dir}.public`), $t(`${i18Dir}.private`)]"
        :placeholder="$t(`${i18Dir}.type`)"
        name="select"
        density="comfortable"
        clearable
      />

      <alex-custom-button
        class="sm:tw-ml-auto"
        :text="$t(`${i18Dir}.new`)"
        size="large"
        @click="() => (createModal = true)"
      />
    </div>

    <!-- Content -->
    <v-data-table
      class="criteria-groups-table px-6 pb-6 tw-flex-grow"
      :headers="headers"
      :items="slicedItems"
      :items-per-page="itemsPerPage"
    >
      <template #headers="{ columns, getSortIcon, toggleSort }"
        ><tr>
          <template v-for="column in columns" :key="column.key">
            <td>
              <div class="tw-cursor-pointer d-flex align-center" @click="() => toggleSort(column)">
                <span class="text-body-2 text-gray-600 mr-2 tw-leading-none">{{ column.title }}</span>

                <!-- Sort icons -->
                <v-icon v-if="column.sortable" :icon="getSortIcon(column)" color="#ABB2B9"></v-icon>
              </div>
            </td>
          </template></tr
      ></template>

      <!-- Content -->
      <template #item.name="{ value }">
        <p class="text-body-4 text-gray-900">{{ value }}</p>
      </template>

      <template #item.criteria="{ value: criterias }">
        <div class="d-flex align-center tw-overflow-x-auto" style="gap: 10px">
          <alex-custom-chip
            v-for="criteria in criterias"
            :key="criteria"
            :text="criteria"
            status="secondary"
            size="small"
          />
        </div>
      </template>

      <template #item.options="{ value }">
        <div class="d-flex align-center tw-justify-end">
          <alex-custom-dropdown
            :items="[
              {
                text: $t('pages.evaluations.rubrics.edit'),
                onClick: () => editGroup(value),
              },
              {
                text: $t('pages.evaluations.rubrics.delete'),
                warning: true,
                onClick: () => deleteGroup(value),
              },
            ]"
          >
            <template #activator="{ props }">
              <v-icon v-bind="props" class="tw-ml-auto" color="gray-600">mdi-dots-vertical</v-icon>
            </template>
          </alex-custom-dropdown>
        </div></template
      >

      <template #no-data><Empty :empty-message="$t('pages.evaluations.groupsSec.empty')" /></template>

      <!-- Pagination -->
      <template #bottom
        ><div
          v-if="filteredItems.length"
          class="d-flex tw-justify-between md:tw-flex-row tw-flex-col align-center tw-flex-wrap py-6 tw-gap-[8px] tw-text-center md:tw-text-start"
        >
          <p
            class="tw-flex-1 tw-min-w-[250px] text-body-3 text-gray-600 !tw-leading-none"
            :class="paginationLength === 1 && 'text-center'"
          >
            {{ paginationText }}
          </p>
          <alex-custom-pagination
            v-if="paginationLength > 1"
            v-model="activePage"
            :length="paginationLength"
            total-visible="5"
          /></div
      ></template>
    </v-data-table>

    <Create v-model="createModal" :edit-content="editContent" @update="refresh" />
  </div>
</template>

<script setup lang="ts">
import { useMessageStore } from '~/stores/message';
import Empty from './-components/EmptyState.vue';
import Create from './-components/groups/Create.vue';

const { t } = useI18n();
const { setMessage } = useMessageStore();
const user = useStrapiUser();
const { getUserEvaluationGroupsByType, deleteUserEvaluationGroupMutation } = useTaskEvaluation(0, 0, user);

const { data: items, refetch: refresh } = getUserEvaluationGroupsByType({ value: 'standard' });
const { mutateAsync: deleteUserEvaluationGroup } = deleteUserEvaluationGroupMutation();

const i18Dir = 'pages.evaluations.groupsSec';

// Data
const headers = [
  { title: t(`pages.evaluations.rubrics.name`), key: 'name' },
  { title: t(`pages.evaluations.rubrics.criteria`), key: 'criteria' },
  { key: 'options', sortable: false },
];

// const items = ref([]);
const search = ref<string>('');
const type = ref<string | null>(null);

const filteredItems = computed(() => {
  let filtered: never[] = items.value;

  // Filter by type
  let typeFilter: null | 'private' | 'public' = null;

  if (type.value === t(`${i18Dir}.private`)) {
    typeFilter = 'private';
  } else if (type.value === t(`${i18Dir}.public`)) {
    typeFilter = 'public';
  }

  filtered =
    items.value?.filter((item) => {
      if (typeFilter === 'public') {
        return !!item.public;
      } else if (typeFilter === 'private') {
        return !item.public;
      }

      return true;
    }) ?? [];

  // Filter by name or criteria
  filtered = filtered.filter((group) => {
    if (group.name.toLowerCase().includes(search.value.toLocaleLowerCase())) {
      return true;
    }

    if (group.evaluation_criterias.some(({ name }) => name.toLowerCase().includes(search.value.toLowerCase()))) {
      return true;
    }

    return false;
  });

  return filtered.map((group) => ({
    name: group.name,
    criteria: group.evaluation_criterias.map(({ name }) => name),
    public: group.public,
    options: group,
  }));
});

const slicedItems = computed(() => {
  return filteredItems.value.slice(
    Math.max((activePage.value - 1) * itemsPerPage, 0),
    Math.min((activePage.value + 1) * itemsPerPage, totalItems.value),
  );
});

const totalItems = computed<number>(() => items?.value?.length ?? 0);

const editGroup = (group) => {
  createModal.value = true;
  editContent.value = group;
};

const deleteGroup = async (group) => {
  if (group.task_submission_evaluations.length) {
    setMessage(t(`${i18Dir}.associated`), 'warning', true);
    return;
  }

  try {
    await deleteUserEvaluationGroup(group.id);
    await refresh();
    setMessage(t(`${i18Dir}.deleteSuccess`), 'success', true);
  } catch (e) {
    console.error(e);
    setMessage(t(`${i18Dir}.deleteFail`), 'error', true);
  }
};

// Create | Edit
const createModal = ref<boolean>(false);
const editContent = ref<any | null>(null);

// Pagination
const itemsPerPage = 10;

const activePage = ref<number>(0);

const paginationLength = computed<number>(() => {
  const add = totalItems.value % itemsPerPage ? 1 : 0;
  return Math.floor(totalItems.value / itemsPerPage + add) || 1;
});

const paginationText = computed<string>(() => {
  const from = Math.max((activePage.value - 1) * itemsPerPage + 1, Number(!!slicedItems.value.length));
  const to = Math.min((activePage.value + 1) * itemsPerPage, slicedItems.value.length);
  const total = totalItems.value;

  return t(`${i18Dir}.pagination`, {
    from,
    to,
    total,
  });
});

// Events
onMounted(() => {
  refresh();
});

watch(totalItems, (val) => {
  if (activePage.value > (Math.floor(val / itemsPerPage) || 1)) {
    activePage.value = Math.floor(val / itemsPerPage) || 1;
  }
});

watch(createModal, (open) => {
  if (!open) {
    editContent.value = null;
  }
});
</script>

<style>
.criteria-group-textfield .v-input__details,
.criteria-group-select .v-input__details {
  display: none;
}

.criteria-groups-table thead tr:first-child,
.criteria-groups-table tbody tr:last-child {
  border-bottom: 1px #ebedef solid !important;
}

.criteria-groups-table .v-data-table__wrapper > table {
  border-spacing: 0 16px !important;
}
</style>
