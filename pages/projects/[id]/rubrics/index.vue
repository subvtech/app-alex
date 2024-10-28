<template>
  <div class="bg-white rounded w-100">
    <!-- Header -->
    <div class="pa-6 d-flex tw-items-center tw-justify-between ga-6">
      <alex-inputs-text-field
        v-model="search"
        class="rubric-textfield tw-flex-[0_0_320px]"
        placeholder="Econtrar rúbricas"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        name="search"
        size="default"
        density="comfortable"
      />

      <alex-custom-button text="Nova rúbrica" size="large" @click="() => (createModal = true)" />
    </div>

    <!-- Content -->
    <v-data-table
      class="create-rubrics-table px-6 pb-6"
      :headers="headers"
      :items="filteredItems"
      :items-per-page="itemsPerPage"
    >
      <template #headers="{ columns, isSorted, getSortIcon, toggleSort }"
        ><tr>
          <template v-for="column in columns" :key="column.key">
            <td>
              <div class="tw-cursor-pointer" @click="() => toggleSort(column)">
                <span class="text-body-2 text-gray-600 mr-2">{{ column.title }}</span>

                <!-- Sort icons -->
                <v-icon
                  :icon="
                    (() => {
                      const sortIcon = getSortIcon(column);
                      console.log('Sort icon', sortIcon, column);
                      return sortIcon;
                    })()
                  "
                  color="#ABB2B9"
                ></v-icon>
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
        ><div class="d-flex tw-justify-between align-center tw-flex-wrap pa-6 ga-2">
          <p class="tw-flex-1 tw-min-w-[250px] text-body-3 text-gray-600 !tw-leading-none">
            Mostrando do {{ (activePage - 1) * itemsPerPage }} ao
            {{ Math.min(activePage * itemsPerPage, totalItems) }} de um total de {{ totalItems }} cursos
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

const search = ref<string>('');
const activePage = ref<number>(1);
const createModal = ref<boolean>(true);

const totalItems = ref<number>(0);
const items = ref([
  { id: 1, name: 'Rúbrica do Lucas', criteria: ['Testando 1', 'Teste', 'Teste 2'] },
  { id: 2, name: 'Rúbrica do Breno', criteria: ['Testando 1', 'Teste'] },
]);

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

const itemsPerPage = 10;

const headers = [
  { title: 'Nome da rúbrica', key: 'name' },
  { title: 'Critérios', key: 'criteria' },
];

const getSortIcon = (value) => {
  console.log(value);
  return 'mdi-search';
};
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
