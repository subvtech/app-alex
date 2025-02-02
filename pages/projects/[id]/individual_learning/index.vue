<script setup lang="tsx">
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { computed, onMounted, ref } from 'vue';

const user = useStrapiUser();

const { t } = useI18n();
const { findOne } = useStrapiUtils();
const route = useRoute();

const hasError = ref(false);
const loading = ref(true);
const members = ref<UserSimple[] | undefined>(undefined);
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
  return (members?.value ?? []).filter((member) => {
    return contains(member.email, search.value) || contains(member.fullname, search.value);
  });
});

const emptyMessage = computed(() => {
  return hasError.value ? t('errors.default') : t('pages.projects.individual_learning.empty_members');
});

const getPercentage = (amount: number, total: number): number => {
  const result = amount > 0 ? Math.floor((amount / total) * 100) : 0;
  return !Number.isNaN(result) ? result : 100;
};

const fetchMembers = async () => {
  loading.value = true;

  try {
    const res = await findOne<LearningPlanSimple>('learningplans', Number(route.params.id), {
      populate: ['members.user.avatar', 'members.task_members.task.learning_goals'],
    });

    const teste = res.data.members.map((member) => {
      let goals = 0;
      let completedGoals = 0;

      member.task_members.forEach((taskMember) => {
        goals += taskMember?.task?.learning_goals?.length;

        if (taskMember?.status === 'done') {
          completedGoals += taskMember?.task?.learning_goals?.length;
        }
      });

      const percentage = !goals && !completedGoals ? 0 : getPercentage(completedGoals, goals);

      return {
        ...member.user,
        percentage,
      };
    });
    // console.log(teste);
    members.value = teste;
  } catch (_) {
    hasError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchMembers);
</script>

<template>
  <div class="tw-bg-white tw-flex tw-flex-col tw-rounded-lg tw-p-6 tw-min-h-[500px] !tw-text-slate-500">
    <div class="tw-flex tw-flex-1 tw-flex-col tw-mb-6 tw-w-full tw-gap-6">
      <template v-if="members?.length">
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
          :placeholder="$t('pages.projects.individual_learning.search_member')"
        />
        <div class="tw-flex tw-flex-wrap">
          <Transition name="slide-up">
            <EmptyState v-if="!filteredMembers.length" :empty-message="emptyMessage" class="tw-mt-6" />
            <div v-else class="w-100 tw-flex tw-flex-wrap">
              <TransitionGroup name="list">
                <Card v-for="member in filteredMembers" :key="member.id" :class="cardClass">
                  <CardContent
                    class="tw-flex tw-flex-col tw-gap-6 tw-pt-6 pa-6"
                    @click="navigateTo(`/projects/${route.params.id}/individual_learning/${member.id}`)"
                  >
                    <div class="tw-flex tw-items-center tw-gap-6 tw-flex-col align-start">
                      <div class="w-100 d-flex justify-space-between">
                        <v-avatar :size="64" color="gray-100" class="rounded-16px">
                          <v-img
                            v-if="member.avatar?.url"
                            :src="member.avatar?.url"
                            alt="avatar"
                            class="rounded-16px"
                            cover
                          />
                          <span v-else class="text-gray-800 text-h2">
                            {{ getInitials(member.fullname) }}
                          </span>
                        </v-avatar>
                        <alex-custom-chip
                          v-if="member.id == user?.id"
                          :text="t('pages.projects.individual_learning.myJourney')"
                          size="small"
                          class="bg-info--2 text-body-5 text-secondary-2"
                          variant="text"
                        />
                      </div>
                      <div class="tw-flex tw-flex-col tw-overflow-hidden w-100">
                        <span class="text-gray-800 text-h5 tw-truncate" :title="member.fullname">
                          {{ member.fullname }}
                        </span>
                        <span class="text-gray-600 text-body-3 tw-truncate" :title="member.email">
                          {{ member.email }}
                        </span>
                      </div>
                    </div>
                    <div class="tw-flex tw-flex-col">
                      <v-progress-linear
                        rounded
                        color="accent"
                        class="tw-mb-2"
                        :height="8"
                        :model-value="member.percentage"
                        bg-color="gray-600"
                      />
                      <div class="tw-flex tw-justify-between tw-items-center tw-text-sm tw-opacity-45">
                        <span>{{ $t('pages.projects.individual_learning.my_goals') }}</span>
                        <span>{{ member.percentage }}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TransitionGroup>
            </div>
          </Transition>
        </div>
      </template>
      <template v-else>
        <div v-if="members === undefined">
          <Skeleton class="tw-w-[320px] tw-h-[44px] tw-mb-6 tw-rounded-xl" />
          <div class="tw-flex tw-flex-wrap">
            <Skeleton v-for="index in 8" :key="index" :class="[cardClass, 'tw-h-[230px] tw-w-[300px] tw-rounded-xl']" />
          </div>
        </div>
        <EmptyState v-else :empty-message="emptyMessage" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-active {
  transition-delay: 0.5s;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.rounded-16px {
  border-radius: 16px !important;
}
</style>
