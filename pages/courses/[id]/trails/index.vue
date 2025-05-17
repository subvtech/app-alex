<template>
  <div style="flex: 1" class="d-flex bg-white flex-column rounded-lg pa-6 wrapper">
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

      <alex-custom-button
        v-if="learningPlanStore.userIsFacilitator"
        prepend-icon="mdi-plus"
        size="large"
        :disabled="!learningStructure"
        @click="createTrailDialog = true"
      >
        {{ $t('pages.trails.newTrail') }}</alex-custom-button
      >
    </div>
    <div
      v-if="!trails.length"
      style="flex: 1"
      class="d-flex"
      :class="learningPlanStore.loading ? '' : 'align-center justify-center flex-column'"
    >
      <div v-if="learningPlanStore.loading">
        <alex-custom-skeleton color="gray-200" class="width-80 height-10 mb-6" rounded="lg" />
        <div class="d-flex gap-5">
          <alex-learningplan-skeleton-trail-card v-for="index in 3" :key="index" />
        </div>
      </div>
      <div v-else class="d-flex align-center justify-center flex-column">
        <img class="emptyProjects-img" src="public/images/emptyTrails.svg" :alt="$t('pages.trails.emptyStateText')" />
        <p class="text-h3 text-gray-400 mt-4">
          {{ $t('pages.trails.emptyStateText') }}
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
              :can-edit="learningPlanStore.userIsFacilitator || true"
              :description="item.raw.description"
              :image="{
                url: item.raw?.cover_image?.url,
              }"
              :blocks="item.raw.blocks ?? []"
              class="flex-stretch"
              @toggle-visibility="changeItemVisibility(index, item.raw.id)"
              @configurations="navigate(item.raw.id, 'settings')"
              @open="navigate(item.raw.id, 'trails')"
              @copy="() => (openCopyDialog = item.raw)"
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

    <alex-custom-dialog
      v-model="openCopyDialog"
      title="Copiar trilha"
      main-button-text="Copiar"
      :main-button-disabled="!selectedTrails.length"
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
      v-if="learningPlanStore.userIsFacilitator && !!learningStructure"
      :model-value="createTrailDialog"
      :learning-structure="learningStructure"
      @course-created="handleCreatedTrail"
      @update:model-value="(e) => (createTrailDialog = e)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TrailSimple } from '@/models/simple/trailSimple.model';
import CreateDialog from '@/components/alex/learningplan/trails/dialogs/CreateTrail.vue';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const { find, findOne } = useStrapiUtils();
const { update } = useStrapi();
const userStore = useStrapiUser();
const strapiClient = useStrapiClient();
const { setMessage } = useMessageStore();

const openCopyDialog = ref<TrailSimple | null>(null);
const yourProjects = ref<LearningPlanMemberSimple[]>([]);
const yourCourses = ref<LearningPlanMemberSimple[]>([]);
const selectedTrails = ref<number[]>([]);

const search = ref('');
const page = ref(1);

const createTrailDialog = ref(false);

const learningPlanStore = useLearningPlanStore();

const learningStructure = computed(() => {
  return (
    learningPlanStore.learningPlan?.learning_structures.find((structure) => structure.type === 'standard')?.id || 0
  );
});

const trails = computed<TrailSimple[]>(() => {
  return (
    learningPlanStore.standardTrails?.map((trail) => {
      const lastStructure = trail.structures[trail.structures?.length - 1 || 0] || {};
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
  const to = page.value * itemsPerPage > trails.value.length ? trails.value.length : page.value * itemsPerPage;
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

const toggleSelectedTrails = (id: number) => {
  if (selectedTrails.value.includes(id)) {
    selectedTrails.value = selectedTrails.value.filter((value) => value !== id);
  } else {
    selectedTrails.value = [...selectedTrails.value, id];
  }
};

const copyTrail = async () => {
  let reloadAfter = selectedTrails.value.includes(+route.params.id);
  await strapiClient('/learningplans/copy-trail', {
    method: 'POST',
    body: {
      trailId: openCopyDialog.value?.id,
      learningPlans: selectedTrails.value,
    },
  })
    .then(() => {
      setMessage('Trilhas copiadas com sucesso', 'success', true);
      openCopyDialog.value = null;

      if (reloadAfter) learningPlanStore.loadLearningPlan(+route.params.id);
    })
    .catch(() => {
      setMessage('Falha ao copiar trilhas', 'error', true);
    });
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
  const isSettingsPage = page === 'settings';

  navigateTo(`/courses/${id}/trails/${trailId}${isSettingsPage ? '/settings' : ''}/`);
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
