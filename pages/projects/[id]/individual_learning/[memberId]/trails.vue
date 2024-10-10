<script setup lang="ts">
import { ref } from 'vue';
import { TrailSimple } from '@/models/simple/trailSimple.model';

const { t } = useI18n();
const { update } = useStrapi();
const { findOne } = useStrapiUtils();
const learningPlanStore = useLearningPlanStore();
const route = useRoute();

const page = ref(1);
const search = ref('');
const showAddTrailDialog = ref(false);

const ITEMS_PER_PAGE = 12;

const trails = computed<TrailSimple[]>(() => {
  return (
    learningPlanStore.standardTrails?.map((trail) => {
      const { blocks = [] } = trail.structures.at(-1) || {};
      return { ...trail, blocks };
    }) || []
  );
});

const getShowingMessage = (total: number) => {
  const itemsPerPage = search.value === '' ? ITEMS_PER_PAGE : total;

  const to = page.value * itemsPerPage > trails.value.length ? trails.value.length : page.value * itemsPerPage;

  return to === 0
    ? t('pages.trails.noData')
    : t('pages.trails.showingData', {
        to,
        from: (page.value - 1) * itemsPerPage + 1,
        total: trails.value.length,
      });
};

const toggleVisibility = (index: number, id: number) => {
  const hidden = !trails.value[index].hidden;

  try {
    learningPlanStore.standardTrails[index].hidden = hidden;
    update('trails', id, { hidden });
  } catch (error) {
    learningPlanStore.standardTrails[index].hidden = !hidden;
  }
};

const navigate = (trailId: number, page?: string) => {
  const { id, memberId } = route.params;
  const slug = page === 'settings' ? '/settings' : '';
  navigateTo(`/projects/${id}/individual_learning/${memberId}/trails/${trailId}${slug}`);
};

const handleTrailCreate = async (trailId: number) => {
  const populate = ['cover_image', 'structures.blocks'];
  const trail = await findOne('trails', trailId, { populate });
  learningPlanStore.standardTrails.unshift(trail.data as TrailSimple);
  showAddTrailDialog.value = false;
};
</script>

<template>
  <div class="tw-flex tw-flex-1 tw-flex-col tw-bg-white tw-rounded-lg tw-p-6 tw-min-h-[500px]">
    <div
      class="tw-flex tw-flex-wrap tw-w-full tw-gap-6 tw-gap-sm-1"
      :class="!trails.length ? 'tw-justify-end' : 'tw-justify-between tw-mb-6'"
    >
      <alex-inputs-text-field
        v-show="trails.length"
        v-model="search"
        :placeholder="$t('pages.trails.searchPlaceholder')"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        name="search"
        size="default"
        class="w-50"
        style="min-width: 160px; max-width: 320px"
        density="comfortable"
        hide-details
      />
      <alex-custom-button prepend-icon="mdi-plus" size="large" @click="showAddTrailDialog = true">
        {{ $t('pages.trails.newTrail') }}
      </alex-custom-button>
    </div>
    <div
      v-if="!trails.length"
      class="tw-flex tw-flex-1"
      :class="!learningPlanStore.loading && 'align-center justify-center flex-column'"
    >
      <div v-if="learningPlanStore.loading">
        <alex-custom-skeleton color="gray-200" class="width-80 height-10 mb-6" rounded="lg" />
        <div class="tw-flex tw-gap-6">
          <alex-learningplan-skeleton-trail-card v-for="index in 3" :key="index" />
        </div>
      </div>
      <div v-else class="tw-flex tw-items-center tw-justify-center tw-flex-col">
        <img class="emptyProjects-img" src="public/images/emptyTrails.svg" :alt="$t('pages.trails.emptyStateText')" />
        <p class="text-h3 text-gray-400 mt-4">
          {{ $t('pages.trails.emptyStateText') }}
        </p>
      </div>
    </div>
    <div v-else class="tw-flex tw-w-full tw-flex-col tw-h-full tw-flex-1">
      <v-data-iterator
        v-model:search="search"
        v-model:page="page"
        class="d-flex flex-column justify-space-between flex-start flex-grow-1 flex-shrink-1 position-relative"
        :items="trails ?? []"
        :items-per-page="12"
        :filter-keys="['name', 'description', 'blocks']"
        style="flex-basis: 0"
      >
        <template #default="{ items }">
          <div class="card-container w-100">
            <alex-learningplan-trails-card
              v-for="(item, index) in items"
              :key="item.raw.title + index"
              :hide="item.raw.hidden"
              :name="item.raw.title"
              :can-edit="learningPlanStore.userIsFacilitator"
              :description="item.raw.description"
              :image="{ url: item.raw?.cover_image?.url }"
              :blocks="item.raw.blocks ?? []"
              class="flex-stretch"
              @toggle-visibility="toggleVisibility(index, item.raw.id)"
              @configurations="navigate(item.raw.id, 'settings')"
              @open="navigate(item.raw.id)"
              @copy="console.log(item.raw.id)"
            />
          </div>
        </template>
        <template #footer="{ pageCount, groupedItems }">
          <div
            class="d-flex w-100 justify-space-between align-center pa-6 pb-0 flex-column flex-sm-row ga-3 footer mt-6"
          >
            <p class="show-cardlist text-body-3 text-gray-600">
              {{ getShowingMessage(groupedItems.length) }}
            </p>
            <alex-custom-pagination
              v-if="pageCount > 1"
              v-model="page"
              :length="pageCount"
              :total-visible="5"
              class="extra-mb"
            />
          </div>
        </template>
      </v-data-iterator>
    </div>
    <alex-learningplan-trails-dialogs-create
      :model-value="showAddTrailDialog"
      :learning-structure="+route.params.id"
      @course-created="handleTrailCreate"
      @update:model-value="(open) => (showAddTrailDialog = open)"
    />
  </div>
</template>

<style scoped>
.emptyProjects-img {
  max-width: 400px;
  max-height: 360px;
}

.flex-stretch {
  box-sizing: border-box !important;
}

.card-container {
  display: grid !important;
  row-gap: 24px;
  column-gap: 24px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
  justify-content: center; /* Centers the grid items horizontally */
  align-items: center;
  display: grid !important;
}

.footer {
  border-top: 1px #ebedef solid;
  max-height: 95px;
  align-self: flex-end !important;
}

.hidden {
  opacity: 0.5;
}

@media (min-width: 959px) and (max-width: 976px) {
  .card-container {
    justify-content: center !important;
    align-items: center !important;
  }

  .flex-stretch {
    justify-self: center;
  }
}

@media (max-width: 720px) {
  .card-container {
    justify-content: center !important;
    align-items: center !important;
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
