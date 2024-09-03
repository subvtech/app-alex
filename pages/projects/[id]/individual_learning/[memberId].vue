<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';

definePageMeta({
  hideLearningPlanBanner: true,
});

const { t } = useI18n();
const route = useRoute();
const headerStore = usePageHeaderStore();

const activeTabIndex = ref(0);

const tabs = [
  { label: 'Visão geral', value: 'overview' },
  { label: 'Trilhas', value: 'trails' },
  { label: 'Tarefas', value: 'tasks' },
];

const user = ref({
  id: +route.params.memberId,
  fullname: 'Douglas Lopes Silva Ribeiro',
  username: 'douglas.lopes',
  avatar: 'https://avatars.githubusercontent.com/u/10240250?v=4',
});

headerStore.title = t('pages.projects.individual_learning');
headerStore.items = [
  { title: 'Home', to: '/' },
  { title: 'Projetos', to: '/projetos' },
  {
    title: 'Sistemas Operacionais',
    to: '/projetos/sistemas-operacionais',
  },
  { title: 'Douglas Lopes Silva Ribeiro', to: '#' },
];

watch(activeTabIndex, (slug) => {
  navigateTo(`${route.path.split('/').slice(0, -1).join('/')}/${slug}`);
});
</script>

<template>
  <div class="tw-flex tw-flex-col tw-gap-6 tw-mt-6">
    <Card>
      <CardContent class="tw-flex tw-flex-col tw-gap-6 tw-pt-6 tw-pb-0">
        <div class="tw-flex tw-items-center tw-gap-6">
          <v-avatar :size="64" color="gray-100">
            <template #default>
              {{ getInitials(user.fullname) }}
            </template>
          </v-avatar>
          <div class="tw-flex tw-flex-col">
            <h1 class="tw-text-2xl tw-font-bold">{{ user.fullname }}</h1>
            <h2 class="tw-text-lg tw-font-medium">{{ user.username }}</h2>
          </div>
        </div>
        <alex-custom-tabs v-model="activeTabIndex" :tabs="tabs" />
      </CardContent>
    </Card>
    <NuxtPage />
  </div>
</template>
