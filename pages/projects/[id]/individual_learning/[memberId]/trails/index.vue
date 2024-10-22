<script setup lang="ts">
import { ref } from 'vue';
import { TrailSimple } from '@/models/simple/trailSimple.model';
import EmptyState from './-components/EmptyState.vue';
import Loader from './-components/Loader.vue';

const { t } = useI18n();
const { update } = useStrapi();
const { findOne, find } = useStrapiUtils();
const { setMessage } = useMessageStore();
const learningPlanStore = useLearningPlanStore();
const route = useRoute();

// const page = ref(1);
const search = ref('');
const showAddTrailDialog = ref(false);

const myCollabs = ref<TrailSimple[] | undefined>(undefined);
const myTrails = ref<TrailSimple[] | undefined>(undefined);

// const ITEMS_PER_PAGE = 12;

const trails = computed<TrailSimple[]>(() => {
  return (
    learningPlanStore.standardTrails?.map((trail) => {
      const { blocks = [] } = trail.structures.at(-1) || {};
      return { ...trail, blocks };
    }) || []
  );
});

const learningStructure = computed<number>(() => {
  return learningPlanStore.learningPlan?.learning_structures?.[0]?.id ?? 0;
});

const filteredMyTrails = computed<TrailSimple[]>(
  () =>
    myTrails.value?.filter(
      ({ title, description }) =>
        title.toLowerCase().includes(search.value.toLowerCase()) ||
        description.toLowerCase().includes(search.value.toLowerCase()),
    ) ?? [],
);

const filteredMyCollabs = computed<TrailSimple[]>(
  () =>
    myCollabs.value?.filter(
      ({ title, description }) =>
        title.toLowerCase().includes(search.value.toLowerCase()) ||
        description.toLowerCase().includes(search.value.toLowerCase()),
    ) ?? [],
);

// const getShowingMessage = (total: number) => {
//   const itemsPerPage = search.value === '' ? ITEMS_PER_PAGE : total;

//   const to = page.value * itemsPerPage > trails.value.length ? trails.value.length : page.value * itemsPerPage;

//   return to === 0
//     ? t('pages.trails.noData')
//     : t('pages.trails.showingData', {
//         to,
//         from: (page.value - 1) * itemsPerPage + 1,
//         total: trails.value.length,
//       });
// };

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

onBeforeMount(() => {
  const user = +route.params.memberId;

  // My trails
  find('trails', {
    populate: ['structures', 'cover_image'],
    filters: {
      learning_structure: {
        author_member: {
          user,
        },
      },
    },
  })
    .then(({ data }) => {
      myTrails.value = (data as TrailSimple[]).map((trail) => {
        const { blocks = [] } = trail.structures.at(-1) || {};
        return { ...trail, blocks };
      });
    })
    .catch(() => setMessage('Falha ao carregar suas colaborações', 'error', true));

  // My collabs
  find('trails', {
    populate: ['structures', 'cover_image'],
    filters: {
      partners: {
        user,
      },
    },
  })
    .then(({ data }) => {
      myCollabs.value = (data as TrailSimple[]).map((trail) => {
        const { blocks = [] } = trail.structures.at(-1) || {};
        return { ...trail, blocks };
      });
      console.log(data);
    })
    .catch(() => setMessage('Falha ao carregar suas colaborações', 'error', true));
});

watch(
  () => learningPlanStore.loading,
  (loading) => {
    if (!loading) {
      console.log(learningPlanStore.standardTrails);
    }
  },
);
</script>

<template>
  <div class="tw-flex tw-flex-1 tw-flex-col tw-bg-white tw-rounded-lg tw-p-6 tw-min-h-[500px]">
    <!-- Inputs -->
    <div
      class="tw-flex tw-flex-wrap tw-w-full tw-gap-6 tw-gap-sm-1"
      :class="!trails.length ? 'tw-justify-end' : 'tw-justify-between tw-mb-6'"
    >
      <alex-inputs-text-field
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

    <!-- Minhas trilhas -->
    <div class="mb-2">
      <div class="d-flex align-center ga-4 mb-4">
        <p class="text-gray-800 text-h5">Minhas Trilhas</p>
        <p class="text-gray-400 text-body-2">{{ myTrails?.length ?? 0 }}</p>
      </div>
      <Loader v-if="myTrails === undefined" />
      <EmptyState v-else-if="!myTrails.length" />
      <div v-else class="tw-flex tw-flex-wrap tw-gap-6 mb-4">
        <alex-learningplan-trails-card
          v-for="(item, index) in filteredMyTrails"
          :key="item.id"
          :hide="item.hidden"
          :name="item.title"
          :description="item.description"
          :image="{ url: item?.cover_image?.url }"
          :blocks="item?.blocks ?? []"
          class="flex-stretch"
          can-edit
          @toggle-visibility="toggleVisibility(index, item.id)"
          @configurations="navigate(item.id, 'settings')"
          @open="navigate(item.id)"
          @copy="console.log(item.id)"
        />
      </div>
    </div>

    <!-- Minhas colaborações -->
    <div>
      <div class="d-flex align-center ga-4 mb-4">
        <p class="text-gray-800 text-h5">Minhas Colaborações</p>
        <p class="text-gray-400 text-body-2">{{ myCollabs?.length ?? 0 }}</p>
      </div>
      <Loader v-if="myCollabs === undefined" />
      <EmptyState v-else-if="!myCollabs.length" />
      <div v-else class="tw-flex tw-flex-wrap tw-gap-6 mb-4">
        <alex-learningplan-trails-card
          v-for="(item, index) in filteredMyCollabs"
          :key="item.id"
          :hide="item.hidden"
          :name="item.title"
          :description="item.description"
          :image="{ url: item?.cover_image?.url }"
          :blocks="item?.blocks ?? []"
          class="flex-stretch"
          can-edit
          @toggle-visibility="toggleVisibility(index, item.id)"
          @configurations="navigate(item.id, 'settings')"
          @open="navigate(item.id)"
          @copy="console.log(item.id)"
        />
      </div>
    </div>

    <alex-learningplan-trails-dialogs-create
      :model-value="showAddTrailDialog"
      :learning-structure="learningStructure"
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
