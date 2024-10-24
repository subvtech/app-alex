<script setup lang="ts">
import EmptyState from '@/components/EmptyState.vue';
import { Card, CardContent } from '@/components/ui/card';

definePageMeta({
  hideLearningPlanBanner: true,
});

const route = useRoute();
const { t } = useI18n();
const { findOne } = useStrapi4();

const loading = ref(true);
const activeTab = ref(route.path.split('/').pop());

const tabs = [
  { label: t('pages.projects.individual_learning.overview'), value: 'overview' },
  { label: t('pages.projects.individual_learning.trails'), value: 'trails' },
  { label: t('pages.projects.individual_learning.tasks'), value: 'tasks' },
];

const user = ref<User | null>(null);

const fetchUser = async () => {
  loading.value = true;

  try {
    const res = await findOne<User>(`users/${route.params.memberId}`, {
      populate: ['avatar'],
    });

    user.value = res;
  } catch (_) {
  } finally {
    loading.value = false;
  }
};

watch(activeTab, (slug) => {
  navigateTo(`${route.path.split('/').slice(0, -1).join('/')}/${slug}`);
});

watch(
  () => route.fullPath,
  (path) => {
    // Caso o usuario seja direcionado para tasks/[tarefa]
    // A tab ativa será atualizada
    const tab = path?.split('/')?.at(-1) ?? '';

    if (tab.includes('tasks')) {
      activeTab.value = tab;
    }
  },
);

onMounted(fetchUser);
</script>

<template>
  <div v-if="loading">
    <Skeleton class="tw-w-[320px] tw-h-[44px] tw-mb-6 tw-rounded-xl" />
  </div>
  <div v-else-if="user">
    <div class="tw-flex tw-flex-col tw-gap-6 tw-mt-6">
      <Card>
        <CardContent class="tw-flex tw-flex-col tw-gap-6 tw-pt-6 tw-pb-0 px-6">
          <div class="tw-flex tw-items-center tw-gap-6">
            <v-avatar :size="104" color="gray-100">
              <v-img v-if="user.avatar?.url" :src="user.avatar?.url" alt="avatar" class="rounded-16px" cover />
              <span v-else class="text-gray-800 text-h2">
                {{ getInitials(user.fullname) }}
              </span>
            </v-avatar>
            <div class="tw-flex tw-flex-col">
              <h1 class="text-gray-800 text-h2 ellipsis lines-2">
                {{ user.fullname }}
              </h1>
              <h2 class="text-subtitle-2 text-gray-600 ellipsis lines-1">{{ user.email }}</h2>
            </div>
          </div>
          <alex-custom-tabs v-model="activeTab" :tabs="tabs" />
        </CardContent>
      </Card>
      <NuxtPage />
    </div>
  </div>
  <div v-else>
    <EmptyState :empty-message="$t('pages.projects.empty_members')" />
  </div>
</template>
