<template>
  <v-container fluid class="tw-flex tw-flex-col tw-gap-6">
    <alex-custom-breadcrumbs
      class="tw-items-center"
      breadcrumbsVClasses="pt-2 flex-wrap"
      :title="$t('pages.evaluations.my_evaluations')"
      :items="breadCrumbs"
    />
    <v-col class="tw-bg-white tw-rounded">
      <alex-custom-tabs
        v-model="selectedOption"
        :tabs="tabs"
        class="px-6"
        @update:model-value="() => onChangeTab(selectedOption)"
      >
      </alex-custom-tabs>
      <div class="w-100 tw-h-[1px] bg-gray-100"></div>
      <div>
        <NuxtPage />
      </div>
    </v-col>
  </v-container>
</template>

<script setup lang="ts">
type options = 'criteria' | 'groups' | 'rubrics';

const { t } = useI18n();
const selectedOption = ref<options>('criteria');
const route = useRoute();

const tabs = [
  {
    label: t('pages.evaluations.criteria'),
    value: 'criteria',
  },
  {
    label: t('pages.evaluations.groups'),
    value: 'groups',
  },
  {
    label: t('pages.evaluations.headings'),
    value: 'rubrics',
  },
];

const breadCrumbs = ref<never[]>([]);

const onChangeTab = async (value: string) => {
  await navigateTo(`/evaluations/me/${value}`);
};

onMounted(() => {
  const finalRoute = route?.fullPath?.split('/')?.at(-1) as options | undefined;

  const tab = tabs.find(({ value }) => value === finalRoute);

  if (finalRoute && tab) {
    selectedOption.value = finalRoute;
  }

  const items = [
    { disabled: false, title: t('pages.evaluations.home'), to: '/' },
    { disabled: false, title: t('pages.evaluations.my_evaluations'), to: '/evaluations/me' },
  ];

  if (tab) {
    items.push({
      disabled: true,
      title: tab.label,
      to: `/evaluations/me/${finalRoute}`,
    });
  }

  breadCrumbs.value = items as never[];
});

watch(
  () => route.fullPath,
  (path) => {
    // Updates breadcrumbs
    const finalRoute = path?.split('/')?.at(-1) as options | undefined;
    const tab = tabs.find((tab) => tab.value === finalRoute);

    if (!tab) {
      return;
    }

    const newItems = breadCrumbs.value;

    if (newItems.length === 3) {
      newItems.pop();
    }

    newItems.push({
      disabled: true,
      title: tab.label,
      to: `/evaluations/me/${tab.value}`,
    } as never);

    breadCrumbs.value = newItems;
  },
);
</script>

<style lang="scss" scoped></style>
