<template>
  <div class="bg-white rounded w-100">
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
      class="create-rubrics-table px-6 pb-6"
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
                <v-icon :icon="getSortIcon(column)" color="#ABB2B9"></v-icon>
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

      <template #no-data><Empty /></template>

      <!-- Pagination -->
      <template #bottom
        ><div class="d-flex tw-justify-between md:tw-flex-row tw-flex-col align-center tw-flex-wrap pa-6 tw-gap-[8px]">
          <p class="tw-flex-1 tw-min-w-[250px] text-body-3 text-gray-600 !tw-leading-none">
            {{ paginationText }}
          </p>
          <alex-custom-pagination
            v-model="activePage"
            class="tw-flex-1"
            :length="totalItems / itemsPerPage || 1"
            total-visible="5"
          /></div
      ></template>
    </v-data-table>

    <CreateModal v-model="createModal" />
  </div>
</template>
<script setup lang="ts">
import CreateModal from './-components/Create.vue';
import Empty from './-components/EmptyState.vue';

const itemsPerPage = 10;
const i18Dir = 'pages.evaluations.rubrics';
const { t } = useI18n();

const headers = [
  { title: t(`${i18Dir}.name`), key: 'name' },
  { title: t(`${i18Dir}.criteria`), key: 'criteria' },
];

const search = ref<string>('');
const activePage = ref<number>(1);
const createModal = ref<boolean>(false);

const totalItems = ref<number>(0);
const items = ref([
  { name: 'Lucas', criteria: ['Hohoho', 'Hohoho', 'Hohoho', 'Hohoho', 'Hohoho', 'Hohoho', 'Hohoho', 'Hohoho'] },
]);

const paginationText = computed<string>(() => {
  const from = (activePage.value - 1) * itemsPerPage;
  const to = Math.min(activePage.value * itemsPerPage, totalItems.value);
  const total = totalItems.value;

  return t(`${i18Dir}.pagination`, {
    from,
    to,
    total,
  });
});

const filteredItems = computed(() => {
  return items.value.filter(({ name, criteria }) => {
    if (name.toLowerCase().includes(search.value.toLocaleLowerCase())) {
      return true;
    }

    if (criteria.some((value) => value.toLowerCase().includes(search.value.toLowerCase()))) {
      return true;
    }

    return false;
  });
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
