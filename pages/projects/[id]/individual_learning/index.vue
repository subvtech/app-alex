<script setup lang="tsx">
import { ref, computed, onMounted } from 'vue';
import { Strapi4ResponseData } from '@nuxtjs/strapi/dist/runtime/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { get } from '@/utils/get';

const { t } = useI18n();
const { findOne } = useStrapi();
const route = useRoute();

const hasError = ref(false);
const loading = ref(true);
const members = ref<User[]>([]);
const search = ref('');

const cardClass = computed(() => {
  return [
    !loading.value && 'tw-cursor-pointer tw-transition-all hover:tw-shadow-md',
    'tw-w-full tw-mt-4 tw-ml-0 sm:tw-ml-4',
    'sm:tw-w-[calc(50.00%-0.50rem-3px)] f-sm:[&:nth-child(odd)]:tw-ml-0 f-md:[&:nth-child(odd)]:tw-ml-0',
    'lg:tw-w-[calc(33.33%-0.66rem-3px)] f-lg:[&:nth-child(3n+1)]:tw-ml-0',
    'xl:tw-w-[calc(25.00%-0.75rem-3px)] xl:[&:nth-child(4n+1)]:tw-ml-0',
  ].join(' ');
});

const filteredMembers = computed(() => {
  return members.value.filter((member) => {
    return (
      contains(member.email, search.value) ||
      contains(member.fullname, search.value)
    );
  });
});

const emptyMessage = computed(() => {
  return hasError.value
    ? t('errors.default')
    : t('pages.projects.empty_members');
});

const fetchMembers = async () => {
  loading.value = true;

  try {
    const res = await findOne<LearningPlan>(
      `learningplans/${route.params.id}`,
      { populate: ['members.user'] },
    );

    const getUser = get<Strapi4ResponseData<User>>('attributes.user.data');
    members.value = res.data.attributes.members.data.map((r) => {
      const { id, attributes: user } = getUser(r);
      return { ...user, id };
    });
  } catch (_) {
    hasError.value = true;
  } finally {
    loading.value = false;
  }
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
          <EmptyState
            v-if="!filteredMembers.length"
            :empty-message="emptyMessage"
            class="tw-mt-6"
          />
          <Card
            v-for="user in filteredMembers"
            :key="user.id"
            :class="cardClass"
          >
            <CardContent
              class="tw-flex tw-flex-col tw-gap-6 tw-pt-6"
              @click="
                navigateTo(
                  `/projects/${route.params.id}/individual_learning/${user.id}`,
                )
              "
            >
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
        <EmptyState v-else :empty-message="emptyMessage" />
      </template>
    </div>
  </div>
</template>
