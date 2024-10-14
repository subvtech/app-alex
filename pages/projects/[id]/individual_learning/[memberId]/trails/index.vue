<script setup lang="ts">
import { ref } from 'vue';
import { TrailSimple } from '@/models/simple/trailSimple.model';
import EmptyState from './-components/EmptyState.vue';
import Loader from './-components/Loader.vue';

const i18dir = 'components.projects.individual_learning.trails';

const { t } = useI18n();
const { update } = useStrapi();
const { findOne, find } = useStrapiUtils();
const { setMessage } = useMessageStore();
const user = useStrapiUser();
const learningPlanStore = useLearningPlanStore();
const route = useRoute();

const search = ref('');
const showAddTrailDialog = ref(false);

const myCollabs = ref<TrailSimple[] | undefined>(undefined);
const myTrails = ref<TrailSimple[] | undefined>(undefined);

const learningStructure = computed<number | null>(
  () =>
    learningPlanStore.learningPlan?.learning_structures?.find(
      (structure) => structure.type === 'standard' && structure.author_member?.user?.id === user.value?.id,
    )?.id ?? null,
);

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

const formattedCount = (count: number | undefined) => {
  if (count === undefined) {
    count = 0;
  }

  return count.toString().padStart(2, '0');
};

const formatTrail = (trail: TrailSimple) => {
  const { blocks = [] } = trail.structures?.at(-1) ?? {};
  return { ...trail, blocks };
};

// Toggle visibility
const updateTrailHidden = (trail: TrailSimple, id: number, hidden: boolean) => {
  if (trail.id === id) {
    trail.hidden = hidden;
  }

  return trail;
};

const toggleVisibility = async (id: number, hidden: boolean) => {
  hidden = !hidden;

  try {
    learningPlanStore.standardTrails.map((trail) => updateTrailHidden(trail, id, hidden));

    myCollabs.value?.map((trail) => updateTrailHidden(trail, id, hidden));
    myTrails.value?.map((trail) => updateTrailHidden(trail, id, hidden));

    await update('trails', id, { hidden });
  } catch (error) {
    learningPlanStore.standardTrails.map((trail) => updateTrailHidden(trail, id, !hidden));

    myCollabs.value?.map((trail) => updateTrailHidden(trail, id, !hidden));
    myTrails.value?.map((trail) => updateTrailHidden(trail, id, !hidden));

    setMessage(t(`${i18dir}.messages.failHidden`), 'error', true);
  }
};

const navigate = (trailId: number, page?: string) => {
  const { id } = route.params;
  const slug = page === 'settings' ? '/settings' : '';
  navigateTo(`/projects/${id}/trails/${trailId}${slug}`);
};

const handleTrailCreate = async (trailId: number, newStructure) => {
  const populate = ['cover_image', 'structures.blocks'];
  const trail = await findOne('trails', trailId, { populate });
  learningPlanStore.standardTrails.unshift(trail.data as TrailSimple);
  showAddTrailDialog.value = false;

  if (myTrails.value) {
    myTrails.value = [...myTrails.value, formatTrail(trail.data as TrailSimple)];
  }

  if (newStructure && learningPlanStore.learningPlan) {
    learningPlanStore.learningPlan.learning_structures = [
      ...learningPlanStore.learningPlan.learning_structures,
      newStructure,
    ];
  }
};

onBeforeMount(() => {
  const user = +route.params.memberId;

  // My trails
  find('trails', {
    populate: ['structures.blocks', 'cover_image'],
    filters: {
      learning_structure: {
        author_member: {
          user,
        },
      },
    },
  })
    .then(({ data }) => {
      myTrails.value = (data as TrailSimple[]).map(formatTrail);
    })
    .catch(() => setMessage(t(`${i18dir}.messages.failMyTrails`), 'error', true));

  // My collabs
  find('trails', {
    populate: ['structures.blocks', 'cover_image'],
    filters: {
      partners: {
        user,
      },
    },
  })
    .then(({ data }) => {
      myCollabs.value = (data as TrailSimple[]).map(formatTrail);
    })
    .catch(() => setMessage(t(`${i18dir}.messages.failMyCollabs`), 'error', true));
});
</script>

<template>
  <div class="tw-flex tw-flex-1 tw-flex-col tw-bg-white tw-rounded-lg tw-p-6 tw-min-h-[500px]">
    <!-- Inputs -->
    <div class="tw-flex tw-flex-wrap tw-w-full tw-gap-6 tw-gap-sm-1 tw-justify-between tw-mb-6">
      <alex-inputs-text-field
        v-model="search"
        :placeholder="$t(`${i18dir}.search`)"
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
        <p class="text-gray-800 text-h5 tw-leading-[100%]">{{ $t(`${i18dir}.myTrails`) }}</p>
        <p class="text-gray-400 text-body-2 tw-leading-[100%]">{{ formattedCount(myTrails?.length) }}</p>
      </div>
      <Loader v-if="myTrails === undefined" />
      <EmptyState v-else-if="!myTrails.length" />
      <div v-else class="tw-flex tw-flex-wrap tw-gap-6 mb-4">
        <alex-learningplan-trails-card
          v-for="item in filteredMyTrails"
          :key="item.id"
          :hide="item.hidden"
          :name="item.title"
          :description="item.description"
          :image="{ url: item?.cover_image?.url }"
          :blocks="item?.blocks ?? []"
          class="flex-stretch"
          can-edit
          hide-copy
          @toggle-visibility="toggleVisibility(item.id, item.hidden)"
          @configurations="navigate(item.id, 'settings')"
          @open="navigate(item.id)"
        />
      </div>
    </div>

    <!-- Minhas colaborações -->
    <div>
      <div class="d-flex align-center ga-4 mb-4">
        <p class="text-gray-800 text-h5 tw-leading-[100%]">{{ $t(`${i18dir}.myCollabs`) }}</p>
        <p class="text-gray-400 text-body-2 tw-leading-[100%]">{{ formattedCount(myCollabs?.length) }}</p>
      </div>
      <Loader v-if="myCollabs === undefined" />
      <EmptyState v-else-if="!myCollabs.length" />
      <div v-else class="tw-flex tw-flex-wrap tw-gap-6 mb-4">
        <alex-learningplan-trails-card
          v-for="item in filteredMyCollabs"
          :key="item.id"
          :hide="item.hidden"
          :name="item.title"
          :description="item.description"
          :image="{ url: item?.cover_image?.url }"
          :blocks="item?.blocks ?? []"
          class="flex-stretch"
          can-edit
          hide-copy
          @toggle-visibility="toggleVisibility(item.id, item.hidden)"
          @configurations="navigate(item.id, 'settings')"
          @open="navigate(item.id)"
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
