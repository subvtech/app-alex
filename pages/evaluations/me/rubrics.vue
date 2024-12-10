<template>
  <div class="bg-white rounded w-100 tw-h-full tw-flex tw-flex-col tw-items-stretch">
    <!-- Header -->
    <div class="pa-6 d-flex tw-items-center sm:tw-justify-between tw-justify-center tw-flex-wrap ga-6">
      <alex-inputs-text-field
        v-model="search"
        class="rubric-textfield tw-max-w-[320px] tw-flex-[1_1_150px]"
        :placeholder="$t(`${i18Dir}.search`)"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        name="search"
        size="default"
        density="comfortable"
      />

      <alex-custom-button :text="$t(`${i18Dir}.new`)" size="large" @click="() => (createModal = true)" />
    </div>

    <!-- Content -->
    <v-data-table
      class="create-rubrics-table px-6 pb-6 tw-flex-1"
      :headers="headers"
      :items="filteredItems"
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
                onClick: () => editRubric(value),
              },
              {
                text: $t('pages.evaluations.rubrics.delete'),
                warning: true,
                onClick: () => deleteRubric(value),
              },
            ]"
          >
            <template #activator="{ props }">
              <v-icon v-bind="props" class="tw-ml-auto" color="gray-600">mdi-dots-vertical</v-icon>
            </template>
          </alex-custom-dropdown>
        </div></template
      >

      <template #no-data><Empty :empty-message="$t('pages.evaluations.rubrics.empty')" /></template>

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

    <CreateModal v-model="createModal" :edit-content="editContent" @update="refresh" />
  </div>
</template>
<script setup lang="ts">
import Empty from './-components/EmptyState.vue';
import CreateModal from './-components/rubrics/Create.vue';

const itemsPerPage = 10;
const i18Dir = 'pages.evaluations.rubrics';

const { t } = useI18n();
const user = useStrapiUser();
const { setMessage } = useMessageStore();
const { getUserEvaluationGroupsByType, deleteUserEvaluationGroupMutation } = useTaskEvaluation(0, 0, user);

const { data: items, refetch: refresh } = getUserEvaluationGroupsByType({ value: 'rubric' });
const { mutateAsync: deleteUserEvaluationGroup } = deleteUserEvaluationGroupMutation();

const headers = [
  { title: t(`${i18Dir}.name`), key: 'name' },
  { title: t(`${i18Dir}.criteria`), key: 'criteria' },
  { key: 'options', sortable: false },
];

const search = ref<string>('');
const activePage = ref<number>(1);
const createModal = ref<boolean>(false);
const editContent = ref<null | any>(null);

// const items = ref([]);

const filteredItems = computed(() => {
  const filtered =
    items.value?.filter((rubric) => {
      if (rubric.name.toLowerCase().includes(search.value.toLocaleLowerCase())) {
        return true;
      }

      if (rubric.evaluation_criterias.some(({ name }) => name.toLowerCase().includes(search.value.toLowerCase()))) {
        return true;
      }

      return false;
    }) ?? [];

  const sliced = filtered.slice(
    (activePage.value - 1) * itemsPerPage,
    Math.min(activePage.value * itemsPerPage, filtered.length),
  );

  return (
    sliced.map((rubric) => ({
      name: rubric.name,
      criteria: rubric.evaluation_criterias.map(({ name }) => name),
      options: rubric,
    })) ?? []
  );
});

const totalItems = computed<number>(() => items.value?.length ?? 0);

const paginationLength = computed<number>(() => {
  const add = totalItems.value % itemsPerPage ? 1 : 0;
  return Math.floor(totalItems.value / itemsPerPage + add) || 1;
});

const paginationText = computed<string>(() => {
  const from = (activePage.value - 1) * itemsPerPage + 1;
  const to = Math.min(activePage.value * itemsPerPage, filteredItems.value.length);
  const total = totalItems.value;

  return t(`${i18Dir}.pagination`, {
    from,
    to,
    total,
  });
});

const editRubric = (rubric) => {
  editContent.value = rubric;
  createModal.value = true;
};

const deleteRubric = async (rubric) => {
  if (rubric.task_submission_evaluations.length) {
    setMessage(t(`${i18Dir}.associated`), 'error', true);
    return;
  }

  try {
    await deleteUserEvaluationGroup(rubric.id);
    await refresh();
    setMessage(t(`${i18Dir}.deleteSuccess`), 'success', true);
  } catch (e) {
    console.error(e);
    setMessage(t(`${i18Dir}.deleteFail`), 'error', true);
  }
};

watch(createModal, (open) => {
  if (!open) {
    editContent.value = null;
  }
});
</script>
<style>
.rubric-textfield .v-input__details {
  display: none;
}

.create-rubrics-table thead tr:first-child,
.create-rubrics-table tbody tr:last-child {
  border-bottom: 1px #ebedef solid !important;
}

.create-rubrics-table .v-data-table__wrapper > table {
  border-spacing: 0 16px !important;
}
</style>
