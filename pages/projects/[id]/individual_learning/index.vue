<script setup lang="ts">
import { ref } from 'vue';
// import { Input } from '@/components/ui/input';

// const { t } = useI18n();
const route = useRoute();
const { findOne } = useStrapi();

const hasError = ref(false);
const loading = ref(false);
const members = ref<User[]>([]);
const search = ref('');

const filteredMembers = computed(() => {
  const res = members.value.filter((member) => {
    return (
      contains(member.email, search.value) ||
      contains(member.fullname, search.value)
    );
  });

  return res;
});

onMounted(async () => {
  loading.value = true;

  try {
    const learnPlan = await findOne<LearningPlan>(
      `learningplans/${route.params.id}`,
      { populate: ['members.user'] },
    );

    members.value = learnPlan.data.attributes.members.data.map(
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
    style="flex: 1"
    class="d-flex bg-white flex-column rounded-lg pa-6 wrapper"
  >
    <div
      class="d-flex flex-wrap w-100 gap-4 gap-sm-1"
      :class="!members.length ? 'justify-end' : 'justify-space-between mb-6'"
    >
      <alex-inputs-text-field
        v-show="members.length"
        v-model="search"
        hide-details
        name="search"
        class="w-50"
        density="comfortable"
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        style="min-width: 160px; max-width: 320px"
        :placeholder="$t('pages.projects.search_member')"
      />
    </div>
    <div
      v-if="!members.length"
      style="flex: 1"
      class="d-flex"
      :class="loading && 'align-center justify-center flex-column'"
    >
      <div v-if="loading">
        <alex-custom-skeleton
          color="gray-200"
          class="width-80 height-10 mb-6"
          rounded="lg"
        />
        <div class="d-flex gap-5">
          <alex-learningplan-skeleton-trail-card
            v-for="index in 3"
            :key="index"
          />
        </div>
      </div>
      <div
        v-else
        class="d-flex align-center justify-center flex-column tw-gap-4"
      >
        <img
          class="emptyProjects-img tw-w-[240px]"
          src="@/assets/svg/empty-journey.svg"
          :alt="
            $t(hasError ? 'errors.default' : 'pages.projects.empty_members')
          "
        />
        <p class="text-h3 text-gray-400 mt-4">
          {{ $t(hasError ? 'errors.default' : 'pages.projects.empty_members') }}
        </p>
      </div>
    </div>
    <div v-else class="tw-flex tw-flex-wrap tw-gap-4">
      <Card v-for="user in filteredMembers" :key="user.id" class="tw-w-1/3">
        <CardContent
          class="tw-flex tw-flex-col tw-gap-4 tw-pt-6 tw-text-slate-600"
        >
          <div class="tw-flex tw-items-center tw-gap-4">
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
              class="mb-1"
              color="accent"
              :height="6"
            />
            <div class="tw-flex tw-justify-between tw-items-center tw-text-sm">
              <span class="tw-opacity-65">Meus Objetivos</span>
              <span class="tw-opacity-65">10%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  min-height: 500px !important;
}

.emptyProjects-img {
  max-height: 360px;
  max-width: 400px;
}

.flex-stretch {
  box-sizing: border-box !important;
}

.card-container {
  align-items: center;
  column-gap: 24px;
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
  justify-content: center;
  row-gap: 24px;
}

.footer {
  align-self: flex-end !important;
  border-top: 1px #ebedef solid;
  max-height: 95px;
}

.hidden {
  opacity: 0.5;
}

@media (min-width: 959px) and (max-width: 976px) {
  .card-container {
    align-items: center !important;
    justify-content: center !important;
  }

  .flex-stretch {
    justify-self: center;
  }
}

@media (max-width: 720px) {
  .card-container {
    align-items: center !important;
    justify-content: center !important;
  }

  .flex-stretch {
    justify-self: center;
  }
}

@media (max-width: 477px) {
  .show-cardlist {
    font-size: 12px !important;
    letter-spacing: 0.4px !important;
  }
}

@media (max-width: 431px) {
  .extra-mb {
    translate: 0 -16px;
  }
}
</style>
