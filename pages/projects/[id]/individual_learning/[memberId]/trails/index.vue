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
const userStore = useStrapiUser();
const strapiClient = useStrapiClient();
const learningPlanStore = useLearningPlanStore();
const route = useRoute();

const isGuest = ref<boolean>(true);
const search = ref('');
const showAddTrailDialog = ref(false);

const openCopyDialog = ref<TrailSimple | null>(null);
const yourProjects = ref<LearningPlanMemberSimple[]>([]);
const yourCourses = ref<LearningPlanMemberSimple[]>([]);
const selectedTrails = ref<number[]>([]);
const isCopying = ref<boolean>(false);

const myCollabs = ref<TrailSimple[] | undefined>(undefined);
const myTrails = ref<TrailSimple[] | undefined>(undefined);

const learningStructure = computed<number | null>(
  () =>
    learningPlanStore.learningPlan?.learning_structures?.find(
      (structure) => structure.type === 'standard' && structure.author_member?.user?.id === +route.params.memberId,
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

const toggleSelectedTrails = (id: number) => {
  if (selectedTrails.value.includes(id)) {
    selectedTrails.value = selectedTrails.value.filter((value) => value !== id);
  } else {
    selectedTrails.value = [...selectedTrails.value, id];
  }
};

const copyTrail = async () => {
  isCopying.value = true;

  await strapiClient('/learningplans/copy-trail', {
    method: 'POST',
    body: {
      trailId: openCopyDialog.value?.id,
      learningPlans: selectedTrails.value,
    },
  })
    .then(() => {
      setMessage(
        selectedTrails.value.length === 1 ? `Trilha copiada com sucesso` : `Trilhas copiadas com sucesso`,
        'success',
        true,
      );
      openCopyDialog.value = null;
      getData();
    })
    .catch(() => {
      setMessage(
        selectedTrails.value.length === 1 ? `Falha ao copiar trilha` : `Falha ao copiar trilhas`,
        'error',
        true,
      );
    })
    .finally(() => {
      isCopying.value = false;
    });
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
  navigateTo(`/projects/${id}/trails/${trailId}${slug}?from=${route.params.memberId}`);
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

const getData = async () => {
  const user = +route.params.memberId;

  if (!learningPlanStore.learningPlan) {
    await learningPlanStore.loadLearningPlan(+route.params.id);
  }

  isGuest.value =
    !learningPlanStore.userIsFacilitator &&
    !learningPlanStore.userIsActiveMember &&
    !learningPlanStore.userIsPendingMember;

  // My trails
  find('trails', {
    populate: ['structures.blocks', 'cover_image'],
    filters: {
      learning_structure: {
        author_member: {
          user: {
            id: user,
          },
        },
        learningplan: learningPlanStore.learningPlan?.id,
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
      learning_structure: {
        learningplan: learningPlanStore.learningPlan?.id,
      },
    },
  })
    .then(({ data }) => {
      myCollabs.value = (data as TrailSimple[]).map(formatTrail);
    })
    .catch(() => setMessage(t(`${i18dir}.messages.failMyCollabs`), 'error', true));
};

onBeforeMount(async () => {
  getData();
});

onMounted(() => {
  find('learning-plan-members', {
    filters: { user: userStore?.value?.id },
    populate: ['learningplan.cover_image'],
  }).then(({ data }) => {
    yourProjects.value = (data as LearningPlanMemberSimple[]).filter(
      (member) => member.status === 'joined' && ['project', 'course-project'].includes(member.learningplan.type),
    );
    yourCourses.value = (data as LearningPlanMemberSimple[]).filter(
      (member) => member.status === 'joined' && member.learningplan.type === 'course' && member.role === 'facilitator',
    );
  });
});

watch(openCopyDialog, () => {
  selectedTrails.value = [];
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
      <alex-custom-button v-if="!isGuest" prepend-icon="mdi-plus" size="large" @click="showAddTrailDialog = true">
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
          class="flex-stretch tw-flex-[0_0_316px]"
          :can-edit="!isGuest"
          @toggle-visibility="toggleVisibility(item.id, item.hidden)"
          @configurations="navigate(item.id, 'settings')"
          @open="navigate(item.id)"
          @copy="() => (openCopyDialog = item)"
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
          class="flex-stretch tw-flex-[0_0_316px]"
          can-edit
          @toggle-visibility="toggleVisibility(item.id, item.hidden)"
          @configurations="navigate(item.id, 'settings')"
          @open="navigate(item.id)"
          @copy="() => (openCopyDialog = item)"
        />
      </div>
    </div>

    <alex-custom-dialog
      v-model="openCopyDialog"
      title="Copiar trilha"
      main-button-text="Copiar"
      :main-button-disabled="!selectedTrails.length"
      :main-button-loading="isCopying"
      @on-main-action="() => copyTrail()"
      @on-secondary-action="() => (openCopyDialog = null)"
    >
      <p class="text-h4 text-gray-600 mb-3">Seus projetos</p>
      <div v-if="yourProjects.length" class="tw-flex tw-flex-col tw-gap-1">
        <div
          v-for="project in yourProjects"
          :key="project.learningplan.id"
          class="tw-flex tw-items-center tw-gap-4 tw-rounded-xl tw-px-2 tw-py-2 tw-cursor-pointer hover:tw-shadow tw-transition"
          @click="() => toggleSelectedTrails(project.id)"
        >
          <div class="tw-w-full tw-overflow-hidden tw-flex-[0_0_88.8px] tw-h-[60px] tw-rounded-xl tw-shadow-lg">
            <img
              class="tw-w-full tw-h-full tw-object-cover tw-bg-center"
              :src="project.learningplan?.cover_image?.url || '/images/cover_image_course.svg'"
              alt="Capa do projeto"
              aspect-ratio="16/9"
            />
          </div>
          <div class="tw-flex-1">
            <p class="tw-text-lg tw-font-semibold text-gray-800">
              {{ project.learningplan.title }}
            </p>
            <p class="tw-text-sm tw-font-semibold text-gray-700">Em sua jornada individual</p>
          </div>
          <v-checkbox
            v-model="selectedTrails"
            class="tw-pointer-events-none !tw-pa-0 !tw-ma-0"
            color="rgb(0, 183, 204)"
            :value="project.id"
            hide-spin-buttons
            hide-details
          />
        </div>
      </div>
      <div v-else class="text-center mt-4">
        <p class="text-gray-600 text-h4 mb-1">Não há projetos disponíveis</p>
        <p class="text-gray-500 tw-text-sm">Participe de projetos para copiar trilhas</p>
      </div>

      <p class="text-h4 text-gray-600 mb-3 mt-6">Seus cursos</p>
      <!-- Lembrar de mudar pra yourProjects -->
      <div v-if="yourCourses.length" class="tw-flex tw-flex-col tw-gap-1">
        <div
          v-for="project in yourCourses"
          :key="project.learningplan.id"
          class="tw-flex tw-items-center tw-gap-4 tw-rounded-xl tw-px-2 tw-py-2 tw-cursor-pointer hover:tw-shadow tw-transition"
          @click="() => toggleSelectedTrails(project.id)"
        >
          <div class="tw-w-full tw-overflow-hidden tw-flex-[0_0_88.8px] tw-h-[60px] tw-rounded-xl tw-shadow-lg">
            <img
              class="tw-w-full tw-h-full tw-object-cover tw-bg-center"
              :src="project.learningplan?.cover_image?.url || '/images/cover_image_course.svg'"
              alt="Capa do projeto"
              aspect-ratio="16/9"
            />
          </div>
          <div class="tw-flex-1">
            <p class="tw-text-lg tw-font-semibold text-gray-800">
              {{ project.learningplan.title }}
            </p>
            <p class="tw-text-sm tw-font-semibold text-gray-700">Disponível para todos</p>
          </div>
          <div class="tw-flex-[0_0_50px] tw-pt-[3px] tw-items-center tw-justify-center">
            <v-checkbox
              v-model="selectedTrails"
              class="tw-pointer-events-none tw-h-[24px] tw-w-[24px] !tw-pa-0 !tw-ma-0"
              color="rgb(0, 183, 204)"
              :value="project.id"
              hide-spin-buttons
              hide-details
            />
          </div>
        </div>
      </div>
      <div v-else class="text-center mt-4">
        <p class="text-gray-600 text-h4 mb-1">Não há cursos disponíveis</p>
        <p class="text-gray-500 tw-text-sm">Em cursos, você precisa ser facilitador para criar ou copiar trilhas</p>
      </div>
    </alex-custom-dialog>
    <alex-learningplan-trails-dialogs-create
      :model-value="showAddTrailDialog"
      :learning-structure="learningStructure"
      :user-id="+route.params.memberId"
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
