<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
import EmptyState from '@/components/EmptyState.vue';

definePageMeta({
  hideLearningPlanBanner: true,
});

const route = useRoute();
const { t } = useI18n();
const { findOne } = useStrapi4();

const loading = ref(true);
const activeTab = ref(route.path.split('/').pop());

const tabs = [
  { label: t('pages.projects.overview'), value: 'overview' },
  { label: t('pages.projects.trails'), value: 'trails' },
  { label: t('pages.projects.tasks'), value: 'tasks' },
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

onMounted(fetchUser);
</script>

<template>
  <div v-if="loading">
    <Skeleton class="tw-w-[320px] tw-h-[44px] tw-mb-6 tw-rounded-xl" />
  </div>
  <div v-else-if="user">
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
