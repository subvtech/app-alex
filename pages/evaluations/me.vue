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
        <NuxtPage :key="selectedOption" />
      </div>
    </v-col>
  </v-container>
</template>

<script setup lang="ts">
type options = 'criteria' | 'groups' | 'rubrics';

const { t } = useI18n();
const selectedOption = ref<options>('criteria');
const route = useRoute();
const router = useRouter();

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
  selectedOption.value = value as options;
  navigateTo(`/evaluations/me/${value}`);
  updateBreadcrumbs(value as options);
};

const updateBreadcrumbs = (tabValue: options) => {
  const tab = tabs.find(({ value }) => value === tabValue);
  breadCrumbs.value = [
    { disabled: false, title: t('pages.evaluations.home'), to: '/' },
    { disabled: false, title: t('pages.evaluations.my_evaluations'), to: '/evaluations/me' },
    { disabled: true, title: tab?.label || '', to: `/evaluations/me/${tabValue}` },
  ] as never[];
};

const syncTabWithRoute = () => {
  const finalRoute = route.fullPath.split('/').at(-1) as options | undefined;
  if (!finalRoute || !tabs.some((tab) => tab.value === finalRoute)) {
    router.push('/evaluations/me/criteria');
  } else {
    selectedOption.value = finalRoute;
    updateBreadcrumbs(finalRoute);
  }
};

onMounted(syncTabWithRoute);
watch(() => route.fullPath, syncTabWithRoute);
</script>

<style lang="scss" scoped></style>
