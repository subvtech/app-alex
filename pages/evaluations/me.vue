<template>
  <v-container fluid class="tw-flex tw-flex-col tw-gap-6">
    <v-row justify="space-between">
      <alex-custom-breadcrumbs
        class="tw-items-center"
        breadcrumbsVClasses="pt-2 flex-wrap"
        :title="$t('pages.evaluations.my_evaluations')"
        :items="[
          { disabled: false, title: $t('pages.evaluations.home'), to: '/' },
          { disabled: true, title: $t('pages.evaluations.my_evaluations'), to: '/evaluations/me' },
        ]"
      />
    </v-row>
    <v-col class="tw-bg-white tw-rounded">
      <alex-custom-tabs :tabs="tabs" class="px-6"> </alex-custom-tabs>
      <div class="w-100 tw-h-[1px] bg-gray-100"></div>
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
    </v-col>
  </v-container>
</template>

<script setup lang="ts">
import Card from './me/-components/card.vue';
import createCriteria from './me/-components/daialogs/createCriteria.vue';
const search = ref('');
const page = ref(1);
const { t } = useI18n();
const createCriteriaRef = ref(createCriteria);

const showDialog = () => {
  createCriteriaRef?.value.openDialog();
};

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

const tabs = [
  {
    label: t('pages.evaluations.criteria'),
    value: '1',
  },
  {
    label: t('pages.evaluations.groups'),
    value: '2',
  },
  {
    label: t('pages.evaluations.headings'),
    value: '3',
  },
];

const showingData = (groupedItems: any, items: Array<any>) => {
  const itemsPerPage = search.value === '' ? itemsPerPageValue : groupedItems.length;
  const from = (page.value - 1) * itemsPerPage + 1;
  const to = page.value * itemsPerPage > items.length ? items.length : page.value * itemsPerPage;
  const total = items.length;
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

const cards = [
  {
    id: 1,
    name: 'Card 1',
    description: 'Description of card 1',
    public: true,
    user: {
      id: 1,
      name: 'User 1',
      email: 'user1@example.com',
    },
  },
  {
    id: 2,
    name: 'Card 2',
    description: 'Description of card 2',
    public: false,
    user: {
      id: 2,
      name: 'User 2',
      email: 'user2@example.com',
    },
  },
  {
    id: 3,
    name: 'Card 3',
    description: 'Description of card 3',
    public: true,
  },
];
</script>

<style lang="scss" scoped></style>
