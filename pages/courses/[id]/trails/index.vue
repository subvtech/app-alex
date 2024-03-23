<template>
  <div
    style="flex: 1"
    class="d-flex bg-white flex-column rounded-lg pa-6 wrapper"
  >
    <div
      class="d-flex flex-wrap w-100 gap-2"
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
      <alex-custom-button
        v-if="learningPlanStore.userIsFacilitator"
        prepend-icon="mdi-plus"
        size="large"
        @click="createTrailDialog = true"
      >
        {{ $t('pages.trails.newTrail') }}</alex-custom-button
      >
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
          ></alex-learningplan-skeleton-trail-card>
        </div>
      </div>
      <div v-else class="d-flex align-center justify-center flex-column">
        <img
          class="emptyProjects-img"
          src="/images/emptyTrails.svg"
          alt="Empty Projects"
        />
        <p class="text-h3 text-gray-400 mt-4">
          {{ $t('pages.trails.emptyStateText') }}
        </p>
      </div>
    </div>
    <div v-else class="d-flex w-100 flex-column h-100" style="flex: 1">
      <v-data-iterator
        v-model:search="search"
        v-model:page="page"
        :items="trails ?? []"
        :items-per-page="12"
        :filter-keys="['name', 'description', 'blocks']"
        class="d-flex flex-wrap"
        style="flex: 1; position: relative"
      >
        <template #default="{ items }">
          <div class="d-flex ga-6 flex-wrap w-100 card-container">
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
              @configurations="navigate(item.raw.id, 'settings')"
              @open="navigate(item.raw.id, 'trails')"
              @copy="console.log(item.raw.id)"
            />
          </div>
        </template>
        <template #footer="{ pageCount, groupedItems }">
          <div
            class="d-flex w-100 justify-space-between align-center pa-6 pb-0 flex-column flex-sm-row ga-3 footer mt-6"
          >
            <p class="text-body-3 text-gray-600">
              {{ showingData(groupedItems) }}
            </p>
            <alex-custom-pagination
              v-if="pageCount > 1"
              v-model="page"
              :length="pageCount"
              :total-visible="5"
            />
          </div>
        </template>
      </v-data-iterator>
    </div>
    <CreateDialog
      v-if="learningPlanStore.userIsFacilitator && learningStructure"
      v-model="createTrailDialog"
      :learning-structure="learningStructure"
      @course-created="handleCreatedTrail"
    ></CreateDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TrailSimple } from '@/models/simple/trailSimple.model';
import CreateDialog from '@/components/alex/learningplan/trails/dialogs/CreateTrail.vue';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const { findOne } = useStrapiUtils();
const { update } = useStrapi();

const search = ref('');
const page = ref(1);

const createTrailDialog = ref(false);

const learningPlanStore = useLearningPlanStore();

const learningStructure = computed(() => {
  return (
    learningPlanStore.learningPlan?.learning_structures.find(
      (structure) => structure.type === 'standard',
    )?.id || 0
  );
});

const trails = computed<TrailSimple[]>(() => {
  return (
    learningPlanStore.standardTrails?.map((trail) => {
      const lastStructure =
        trail.structures[trail.structures?.length - 1 || 0] || {};
      return {
        ...trail,
        blocks: lastStructure.blocks || [],
      };
    }) || []
  );
});

const showingData = (groupedItems) => {
  const itemsPerPage = search.value === '' ? 12 : groupedItems.length;

  const from = (page.value - 1) * itemsPerPage + 1;
  const to =
    page.value * itemsPerPage > trails.value.length
      ? trails.value.length
      : page.value * itemsPerPage;
  const total = trails.value.length;
  const message = t('pages.trails.showingData', {
    from,
    to,
    total,
  });
  if (to === 0) {
    return t('pages.trails.noData');
  }
  return message;
};

const changeItemVisibility = (index: number, id: number) => {
  const status = !trails.value[index].hidden;
  try {
    learningPlanStore.standardTrails[index].hidden = status;
    update('trails', id, {
      hidden: status,
    });
  } catch (error) {
    learningPlanStore.standardTrails[index].hidden = !status;
  }
};
const { id } = route.params;

const navigate = (trailId: number, page) => {
  if (page === 'settings') {
    router.push(`/courses/${id}/trails/${trailId}/settings/`);
  } else {
    router.push(`/courses/${id}/trails/${trailId}/`);
  }
};

const handleCreatedTrail = async (id) => {
  const newTrail = await findOne('trails', id, {
    populate: ['cover_image', 'structures.blocks'],
  });
  const trail: TrailSimple = newTrail.data as TrailSimple;
  learningPlanStore.standardTrails.unshift({
    ...trail,
  });
  createTrailDialog.value = false;
};
const headerStore = usePageHeaderStore();
onBeforeMount(() => {
  headerStore.showHeader = true;
});

watch(
  () => learningPlanStore.loading,
  () => {
    if (!learningPlanStore.loading) {
      headerStore.title = t('components.trails.header.breadcrumbs.1.title');
      headerStore.items = [
        {
          title: t('components.trails.header.breadcrumbs.0.title'),
          disabled: false,
          to: '/',
        },
        {
          title: t('components.trails.header.breadcrumbs.1.title'),
          disabled: false,
          to: '/courses/me',
        },
        {
          title: learningPlanStore.learningPlan?.title || '',
          disabled: false,
          to: `/courses/${id}`,
        },
        {
          title: t('pages.courses.trails') || '',
          disabled: true,
          to: `/courses/${id}/trails/`,
        },
      ];
    }
  },
);
</script>

<style scoped>
.wrapper {
  min-height: 500px !important;
}
.emptyProjects-img {
  max-width: 400px;
  max-height: 360px;
}

.card-container {
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
}
.flex-stretch {
  box-sizing: border-box !important;
}

.footer {
  border-top: 1px #ebedef solid;
  max-height: 95px;
  align-self: flex-end !important;
}

.hidden {
  opacity: 0.5;
}

@media (max-width: 580px) {
  .card-container {
    justify-content: center !important;
    align-items: center !important;
  }
}
</style>
