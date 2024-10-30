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
      <alex-custom-tabs
        :tabs="tabs"
        class="px-6"
        v-model="selectedOption"
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
const { t } = useI18n();
const selectedOption = ref<options>('criteria');

type options = 'criteria' | 'groups' | 'headings';

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
    value: 'headings',
  },
];

const onChangeTab = (value: string) => {
  navigateTo(`/evaluations/me/${value}`);
};
</script>

<style lang="scss" scoped></style>
