<template>
  <div
    style="flex: 1"
    class="d-flex bg-white flex-column rounded-lg pa-6 wrapper"
  >
    <div
      class="d-flex flex-wrap w-100 mb-6"
      :class="trails.length == 0 ? 'justify-end' : 'justify-space-between'"
    >
      <alex-inputs-text-field
        v-show="trails.length > 0"
        v-model="search"
        name="search"
        :placeholder="$t('pages.trails.newTrail')"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        class="w-50"
        style="min-width: 160px; max-width: 320px"
        density="compact"
      />
      <alex-custom-button
        v-if="professorMode"
        prepend-icon="mdi-plus"
        size="large"
        @click="createTrailDialog = true"
      >
        {{ $t('pages.trails.newTrail') }}</alex-custom-button
      >
    </div>
    <div
      v-if="trails.length == 0"
      style="flex: 1"
      class="d-flex align-center justify-center flex-column"
    >
      <v-progress-circular
        v-if="isLoading"
        color="accent"
        indeterminate
        :size="100"
        :width="6"
      ></v-progress-circular>
      <div v-else class="d-flex align-center justify-center flex-column">
        <img
          class="emptyProjects-img"
          src="/images/emptyTrails.svg"
          alt="Empty Projects"
        />
        <p class="text-h3 text-gray-400 mt-4">
          <!-- {{ $t('pages.classes.emptyStateText') }} -->
          Parece que não há trilhas criadas
        </p>
      </div>
    </div>
    <div v-else class="d-flex w-100 flex-column h-100" style="flex: 1">
      <v-data-iterator
        v-model:search="search"
        v-model:page="page"
        :items="trails"
        :items-per-page="12"
        :filter-keys="['name', 'description', 'blocks']"
        class="d-flex flex-wrap"
        style="flex: 1; position: relative"
      >
        <template #default="{ items }">
          <div class="d-flex ga-6 flex-wrap w-100 card-container">
            <alex-learningplan-trails-card
              v-for="(item, index) in items"
              :key="item.raw.name + index"
              :hide="item.raw.hidden"
              :name="item.raw.name"
              :description="item.raw.description"
              :image="{
                url: item.raw.image.url,
              }"
              :blocks="item.raw.blocks !== undefined ? item.raw.blocks : []"
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
      v-if="professorMode && learningStructure"
      v-model="createTrailDialog"
      :learning-structure="parseInt(learningStructure)"
      @course-created="handleCreatedCourse"
    ></CreateDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Strapi4ResponseMany } from '@nuxtjs/strapi/dist/runtime/types';
import { GetTrails } from '~/assets/queries';
import CreateDialog from '@/components/alex/learningplan/trails/dialogs/CreateTrail.vue';

const emit = defineEmits(['update']);
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const graphql = useStrapiGraphQL();
const { update } = useStrapi();

const search = ref('');
const page = ref(1);
const professorMode = ref(false);
const isLoading = ref(false);

const createTrailDialog = ref(false);
const learningStructure = ref(null);

interface trail {
  id?: number;
  name: string;
  description: string;
  hidden: boolean;
  image: {
    url: string;
  };
  blocks: [
    {
      type: string;
    },
  ];
}

const trails = ref<trail[]>([]);
const { learningPlan } = useLearningPlanStore();

const { isProfessor } = useStrapiUser<User>().value;
const getCourses = async () => {
  professorMode.value = isProfessor;
  emit('update');
  isLoading.value = true;
  const { data } = await useAsyncData('learningPlan', () => {
    const params = { learningPlanId: learningPlan!.id };
    return graphql<{
      data: {
        learningplans: Strapi4ResponseMany<LearningPlan>;
      };
    }>(GetTrails, params);
  });
  learningStructure.value =
    data.value?.data.learningplan.data?.attributes.learning_structures?.data[0]
      .id;
  trails.value = [];
  data.value?.data.learningplan.data?.attributes.learning_structures?.data[0].attributes.trails.data.forEach(
    (trail) => {
      trails.value.push({
        name: trail.attributes.title,
        description: trail.attributes.description,
        hidden: trail.attributes.hidden,
        image: {
          url: trail.attributes.cover_image.data?.attributes.url,
        },
        blocks: trail.attributes.structures.data[0]?.attributes.blocks.data.map(
          (block) => {
            return {
              type: block.attributes.type,
            };
          },
        ),
        id: trail.id,
      });
    },
  );
  isLoading.value = false;
};
// eslint-disable camelcase
onMounted(async () => await getCourses());

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

const changeItemVisibility = (index: number, id) => {
  trails.value[index].hidden = !trails.value[index].hidden;
  try {
    update('trails', id, {
      hidden: trails.value[index].hidden,
    });
  } catch (error) {
    trails.value[index].hidden = !trails.value[index].hidden;
  }
};

const isJoinRoutePath = computed(() => {
  return route.name === 'courses-id-join-hash';
});

const learningPlanId = computed(() => {
  if (isJoinRoutePath.value) return parseInt(route.fullPath.split('/')[2]);

  return learningPlan ? learningPlan.id : parseInt(route.params?.id.toString());
});

const navigate = (trailId: number, page) => {
  if (page === 'settings') {
    router.push(`/courses/${learningPlanId.value}/trails/${trailId}/settings/`);
  } else {
    router.push(`/courses/${learningPlanId.value}/trails/${trailId}/`);
  }
};

const handleCreatedCourse = () => {
  getCourses();
  createTrailDialog.value = false;
};
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
