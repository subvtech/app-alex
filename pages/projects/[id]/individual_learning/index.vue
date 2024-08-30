<script setup lang="ts">
import { ref } from 'vue';

const route = useRoute();
const { findOne } = useStrapi();

const hasError = ref(false);
const loading = ref(false);
const members = ref<User[]>([]);
const search = ref('');

const filteredMembers = computed(() => {
  return members.value.filter((member) => {
    return (
      contains(member.email, search.value) ||
      contains(member.fullname, search.value)
    );
  });
});

onMounted(async () => {
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
});
</script>

<template>
  <div
    class="tw-bg-white tw-flex tw-flex-col tw-rounded-lg tw-p-6 tw-min-h-[500px] !tw-text-slate-500"
  >
    <div
      class="tw-flex tw-flex-1 tw-flex-wrap tw-mb-6 tw-w-full tw-gap-6 tw-gap-sm-1"
    >
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
        <div class="tw-flex tw-flex-wrap tw-gap-6">
          <Card v-for="user in filteredMembers" :key="user.id" class="tw-w-1/3">
            <CardContent class="tw-flex tw-flex-col tw-gap-6 tw-pt-6">
              <div class="tw-flex tw-items-center tw-gap-6">
                <v-avatar
                  :size="48"
                  class="alex-avatar-group-border alex-avatar-group-margin"
                  color="gray-100"
                >
                  <template #default>
                    <span>
                      {{ getInitials(user.fullname) }}
                    </span>
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
                  <span>Meus Objetivos</span>
                  <span>10%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </template>
      <template v-else>
        <div v-if="loading">
          <alex-custom-skeleton
            color="gray-200"
            class="tw-w-1/3 tw-h-[44px] tw-mb-6"
            rounded="lg"
          />
          <div class="tw-flex tw-gap-6">
            <alex-learningplan-skeleton-trail-card
              v-for="index in 3"
              :key="index"
            />
          </div>
        </div>
        <div
          v-else
          class="tw-flex tw-flex-col tw-m-auto tw-items-center tw-justify-center tw-gap-6"
        >
          <img
            class="tw-max-h-[360px] tw-max-w-[400px] tw-w-[240px]"
            src="@/assets/svg/empty-journey.svg"
            :alt="
              $t(hasError ? 'errors.default' : 'pages.projects.empty_members')
            "
          />
          <p class="tw-text-xl tw-opacity-45 tw-mt-4">
            {{
              $t(hasError ? 'errors.default' : 'pages.projects.empty_members')
            }}
          </p>
        </div>
      </template>
    </div>
  </div>
</template>
