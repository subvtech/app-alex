<template>
  <div>
    <!-- Header -->
    <div class="pa-6 d-flex tw-flex-col sm:tw-flex-row tw-items-stretch tw-gap-[12px] sm:tw-gap-[16px]">
      <alex-inputs-text-field
        v-model="search"
        class="criteria-group-textfield sm:tw-max-w-[320px] sm:tw-flex-[1_1_150px]"
        placeholder="Encontrar grupo"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        name="search"
        size="default"
        density="comfortable"
      />
      <alex-inputs-select
        v-model="type"
        class="criteria-group-select sm:tw-max-w-[240px] sm:tw-flex-[1_1_150px]"
        :items="['Público', 'Privado']"
        placeholder="Selecionar tipo"
        density="comfortable"
        clearable
      />

      <alex-custom-button class="sm:tw-ml-auto" text="Novo critério" size="large" @click="() => (createModal = true)" />
    </div>

    <!-- Content -->
    <v-data-table
      class="criteria-groups-table px-6 pb-6"
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

      <template #no-data><Empty /></template>

      <!-- Pagination -->
      <template #bottom
        ><div
          v-if="items.length"
          class="d-flex tw-justify-between md:tw-flex-row tw-flex-col align-center tw-flex-wrap pa-6 tw-gap-[8px]"
        >
          <p class="tw-flex-1 tw-min-w-[250px] text-body-3 text-gray-600 !tw-leading-none">
            {{ paginationText }}
          </p>
          <alex-custom-pagination
            v-model="activePage"
            class="tw-flex-1"
            :length="Math.floor(totalItems / itemsPerPage) || 1"
            total-visible="5"
          /></div
      ></template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
import { AlexDropdownItem } from '~/components/alex/custom/Dropdown.vue';
import { useMessageStore } from '~/stores/message';
import Empty from './-components/groups/EmptyState.vue';

const { t } = useI18n();
const { find } = useStrapi();
const { setMessage } = useMessageStore();

const i18Dir = 'pages.evaluations.rubrics';

// Data
const headers = [
  { title: t(`${i18Dir}.name`), key: 'name' },
  { title: t(`${i18Dir}.criteria`), key: 'criteria' },
  { key: 'options', sortable: false },
];

const items = ref([]);
const search = ref<string>('');
const type = ref<string | null>(null);

const filteredItems = computed(() => items.value);

const getData = () => {
  find('evaluation-groups', {
    filters: {
      type: 'standard',
    },
    populate: {
      evaluation_criterias: true,
    },
  })
    .then(({ data }) => {
      console.log('Data', data);
    })
    .catch((e) => {
      console.error(e);
      setMessage('Falha ao pesquisar grupos de critérios', 'error', true);
    });
};

const editGroup = (group) => {
  console.log(group);
};

const deleteGroup = (group) => {
  console.log(group);
};

// Create
const createModal = ref<boolean>(false);

// Pagination
const itemsPerPage = 10;

const activePage = ref<number>(0);
const totalItems = ref<number>(0);

const paginationText = computed<string>(() => 'Depois eu faço');

// Events
onMounted(() => {
  getData();
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
