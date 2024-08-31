<script setup lang="tsx">
import { ref } from 'vue';
import { Skeleton } from '@/components/ui/skeleton';
import emptyImage from '@/assets/svg/empty-journey.svg';

const { t } = useI18n();
const { findOne } = useStrapi();
const route = useRoute();

const hasError = ref(false);
const loading = ref(false);
const members = ref<User[]>([]);
const search = ref('');

const cardClass = ref(
  [
    'card tw-w-full tw-ml-0 tw-mt-4',
    'sm:tw-w-[calc(50.00%-0.50rem-3px)] sm:tw-ml-4',
    'lg:tw-w-[calc(33.33%-0.66rem-3px)]',
    'xl:tw-w-[calc(25.00%-0.75rem-3px)]',
  ].join(' '),
);

const filteredMembers = computed(() => {
  return members.value.filter((member) => {
    return (
      contains(member.email, search.value) ||
      contains(member.fullname, search.value)
    );
  });
});

const fetchMembers = async () => {
  loading.value = true;

  try {
    const res = await findOne<LearningPlan>(
      `learningplans/${route.params.id}`,
      { populate: ['members.user'] },
    );

    members.value = res.data.attributes.members.data.map(
      get('attributes.user.data.attributes'),
    );
  } catch (_) {
    hasError.value = true;
  } finally {
    loading.value = false;
  }
};

const EmptyState = () => {
  const emptyMessage = t(
    hasError.value ? 'errors.default' : 'pages.projects.empty_members',
  );

  return (
    <div class="tw-flex tw-flex-col tw-m-auto tw-items-center tw-justify-center tw-gap-6">
      <img
        class="tw-max-h-[360px] tw-max-w-[400px] tw-w-[240px]"
        src={emptyImage}
        alt={emptyMessage}
      />
      <p class="tw-text-xl tw-opacity-45 tw-mt-4">{emptyMessage}</p>
    </div>
  );
};

onMounted(fetchMembers);
</script>

<template>
  <div
    class="tw-bg-white tw-flex tw-flex-col tw-rounded-lg tw-p-6 tw-min-h-[500px] !tw-text-slate-500"
  >
    <div class="tw-flex tw-flex-1 tw-flex-col tw-mb-6 tw-w-full tw-gap-6">
      <template v-if="members.length">
        <alex-inputs-text-field
          v-show="members.length"
          v-model="search"
          hide-details
          name="search"
          class="tw-w-1/3"
          density="comfortable"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          style="min-width: 160px; max-width: 320px"
          :placeholder="$t('pages.projects.search_member')"
        />
        <div class="tw-flex tw-flex-wrap">
          <EmptyState v-if="!filteredMembers.length" />
          <Card
            v-for="user in filteredMembers"
            :key="user.id"
            :class="cardClass"
          >
            <CardContent class="tw-flex tw-flex-col tw-gap-6 tw-pt-6">
              <div class="tw-flex tw-items-center tw-gap-6">
                <v-avatar :size="48" color="gray-100">
                  <template #default>
                    {{ getInitials(user.fullname) }}
                  </template>
                </v-avatar>
                <div class="tw-flex tw-flex-col tw-overflow-hidden">
                  <span
                    class="tw-text-ellipsis tw-font-bold tw-overflow-hidden tw-whitespace-nowrap"
                    :title="user.fullname"
                  >
                    {{ user.fullname }}
                  </span>
                  <span :title="user.email">
                    {{ user.email }}
                  </span>
                </div>
              </div>
              <div class="tw-flex tw-flex-col">
                <v-progress-linear
                  rounded
                  color="accent"
                  class="tw-mb-2"
                  :height="6"
                />
                <div
                  class="tw-flex tw-justify-between tw-items-center tw-text-sm tw-opacity-45"
                >
                  <span>{{ $t('pages.projects.my_goals') }}</span>
                  <span>10%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </template>
      <template v-else>
        <div v-if="loading">
          <Skeleton class="tw-w-[320px] tw-h-[44px] tw-mb-6 tw-rounded-xl" />
          <div class="tw-flex tw-flex-wrap">
            <Skeleton
              v-for="index in 8"
              :key="index"
              :class="[cardClass, 'tw-h-[150px] tw-w-[250px] tw-rounded-xl']"
            />
          </div>
        </div>
        <EmptyState v-else />
      </template>
    </div>
  </div>
</template>

<style scoped>
/**
 * Ao alterar, levar em consideração os breakpoints do tailwind.config.js
 */

@media (min-width: 640px) and (max-width: 1023px) {
  .card:nth-child(odd) {
    margin-left: 0;
  }
}

@media (min-width: 1024px) and (max-width: 1279px) {
  .card:nth-child(3n + 1) {
    margin-left: 0;
  }
}

@media (min-width: 1280px) {
  .card:nth-child(4n + 1) {
    margin-left: 0;
  }
}
</style>
