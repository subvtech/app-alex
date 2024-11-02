<script setup lang="ts">
import Card from './-components/card.vue';
import createCriteria from './-components/daialogs/createCriteria.vue';

const search = ref('');
const page = ref(1);
const { t } = useI18n();
const user = useStrapiUser();
const createCriteriaRef = ref(createCriteria);
const { getUserEvaluations } = useTaskEvaluation(0, 0, user);
const { setMessage } = useMessageStore();

const { data: cards } = getUserEvaluations();

interface Criteria {
  id: number;
  name: string;
  description: string;
  public: boolean;
  user?: User;
}

const itemsPerPageValue = 20;

interface Item {
  raw: Criteria;
}

const showDialog = () => {
  createCriteriaRef?.value.openDialog();
};

const showingData = (groupedItems: any, items: Array<any>) => {
  const itemsPerPage = search.value === '' ? itemsPerPageValue : groupedItems.length;
  const from = (page.value - 1) * itemsPerPage + 1;
  const to = page.value * itemsPerPage > (items?.length ?? 0) ? items?.length ?? 0 : page.value * itemsPerPage;
  const total = items?.length ?? 0;
  const message = t('pages.evaluations.showingData', {
    from,
    to,
    total,
    entity: t('pages.evaluations.criteria'),
  });
  if (to === 0) {
    return t('pages.classes.noData');
  }
  return message;
};

const setTableData = (items: readonly Item[]): Criteria[] => {
  return items.map((item) => item.raw);
};
</script>

<template>
  <div class="tw-flex tw-p-6 tw-justify-between">
    <alex-inputs-text-field
      v-model="search"
      name="search"
      :placeholder="$t('pages.evaluations.search_criteria')"
      prepend-inner-icon="mdi-magnify"
      density="comfortable"
      class="tw-w-[320px]"
    />
    <alex-custom-button size="large" @click="showDialog">
      Novo critério
      <createCriteria ref="createCriteriaRef" />
    </alex-custom-button>
  </div>
  <!-- TODO: Trocar imagem de empty state-->
  <alex-custom-empty-placeholder
    v-if="cards?.length === 0"
    :empty-text-message="t('pages.evaluations.no_criteria')"
    empty-text-image="/svg/EmptyAbout.svg"
  />
  <v-data-iterator
    v-model:search="search"
    v-model:page="page"
    :items="cards"
    :items-per-page="itemsPerPageValue"
    class="d-flex tw-flex-col tw-flex-grow h-full"
  >
    <template #default="{ items }">
      <div class="d-flex flex-wrap gap-6 w-100 px-6">
        <Card v-for="(item, index) in setTableData(items)" :key="item.id" :item="item" />
      </div>
    </template>
    <template #footer="{ pageCount, groupedItems }">
      <div class="d-flex w-full th-h-[92px] justify-space-between align-center px-6 flex-column flex-sm-row ga-3">
        <p class="show-cardlist text-body-3 text-gray-600">
          {{ showingData(groupedItems, cards) }}
        </p>

        <alex-custom-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="itemsPerPageValue"
          class="extra-mb"
        />
      </div>
    </template>
  </v-data-iterator>
</template>
