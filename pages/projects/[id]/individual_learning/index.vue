<script setup lang="ts">
import { ref } from 'vue';
import { TrailSimple } from '@/models/simple/trailSimple.model';

const { t } = useI18n();
const { update } = useStrapi();
const route = useRoute();
const headerStore = usePageHeaderStore();
const learningPlanStore = useLearningPlanStore();
const search = ref('');
const page = ref(1);

const trails = computed<TrailSimple[]>(() => {
  return (
    learningPlanStore.studentTrails?.map((trail) => {
      const lastStructure =
        trail.structures[trail.structures?.length - 1] || {};
      return { ...trail, blocks: lastStructure.blocks || [] };
    }) || []
  );
});

const showingData = (groupedItems) => {
  const itemsPerPage = search.value === '' ? 12 : groupedItems.length;
  const to =
    page.value * itemsPerPage > trails.value.length
      ? trails.value.length
      : page.value * itemsPerPage;

  return to === 0
    ? t('pages.trails.empty_journey')
    : t('pages.trails.showingData', {
        from: (page.value - 1) * itemsPerPage + 1,
        to,
        total: trails.value.length,
      });
};

const changeItemVisibility = (index: number, id: number) => {
  const status = !trails.value[index].hidden;

  try {
    learningPlanStore.studentTrails[index].hidden = status;
    update('trails', id, { hidden: status });
  } catch (error) {
    learningPlanStore.studentTrails[index].hidden = !status;
  }
};

onBeforeMount(() => {
  headerStore.showHeader = true;
});
</script>

<template>
  <div
    style="flex: 1"
    class="d-flex bg-white flex-column rounded-lg pa-6 wrapper"
  >
    <div
      class="d-flex flex-wrap w-100 gap-4 gap-sm-1"
      :class="!trails.length ? 'justify-end' : 'justify-space-between mb-6'"
    >
      <alex-inputs-text-field
        v-show="trails.length"
        v-model="search"
        name="search"
        :placeholder="$t('pages.trails.searchPlaceholder')"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        class="w-50"
        size="default"
        style="min-width: 160px; max-width: 320px"
        density="comfortable"
      />
    </div>
    <div
      v-if="!trails.length"
      style="flex: 1"
      class="d-flex"
      :class="
        learningPlanStore.loading
          ? ''
          : 'align-center justify-center flex-column'
      "
    >
      <div v-if="learningPlanStore.loading">
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
          :alt="$t('pages.projects.empty_journey')"
        />
        <p class="text-h3 text-gray-400 mt-4">
          {{ $t('pages.projects.empty_journey') }}
        </p>
      </div>
    </div>
    <div v-else class="d-flex w-100 flex-column h-100" style="flex: 1">
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
              :image="{
                url: item.raw?.cover_image?.url,
              }"
              :blocks="item.raw.blocks ?? []"
              class="flex-stretch"
              @toggle-visibility="changeItemVisibility(index, item.raw.id)"
              @open="
                navigateTo(
                  `/projects/${route.params.id}/individual_learning/${item.raw.id}`,
                )
              "
            />
          </div>
        </template>
        <template #footer="{ pageCount, groupedItems }">
          <div
            class="d-flex w-100 justify-space-between align-center pa-6 pb-0 flex-column flex-sm-row ga-3 footer mt-6"
          >
            <p class="show-cardlist text-body-3 text-gray-600">
              {{ showingData(groupedItems) }}
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
