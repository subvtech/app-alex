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
        placeholder="Encontrar Trilha"
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
        >Nova Trilha</alex-custom-button
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
          src="@/assets/svg/EmptyTrails.svg"
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
        :filter-keys="[
          'title',
          'description',
          'facilitatorName',
          'trails',
          'institution',
          'start_date',
          'end_date',
          'tags',
        ]"
        class="d-flex flex-wrap"
        style="flex: 1; position: relative"
      >
        <template #default="{ items }">
          <div class="d-flex ga-6 flex-wrap w-100 card-container">
            <alex-learningplan-trails-card
              v-for="(trail, index) in items"
              :key="trail.raw.name + index"
              :hide="trail.raw.visible"
              :name="trail.raw.name"
              :description="trail.raw.description"
              :image="{
                url: trail.raw.image.url,
              }"
              :blocks="[{ type: 'article' }]"
              class="flex-stretch"
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
      v-if="professorMode"
      v-model="createTrailDialog"
    ></CreateDialog>
  </div>
</template>

<script setup lang="ts">
import { Strapi4ResponseMany } from '@nuxtjs/strapi/dist/runtime/types';
import { GetTrails } from '~/assets/queries';
import { LearningPlan } from '@/models/learningPlan.model';
import CreateDialog from '@/components/alex/learningplan/trails/dialogs/CreateTrail.vue';
const router = useRouter();
const route = useRoute();
const search = ref('');
const page = ref(1);
const professorMode = ref(false);
const isLoading = ref(false);
const { t } = useI18n();
const graphql = useStrapiGraphQL();
const { update } = useStrapi();
const createTrailDialog = ref(false);

interface trail {
  name: string;
  description: string;
  visible: boolean;
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

// trails.value = [
// {
//   name: 'Gerenciamento de sistemas operacionais e projeto de redes utilizando o packet tracer',
//   description:
//     'Fala pessoal, tudo bem? Sejam bem vindos ao Plano de Aprendizagem sobre Gerenciamento de Projetos e aprendizagem',
//   image: {
//     url: 'https://picsum.photos/401/601',
//   },
//   blocks: [{ type: 'article' }],
// },
// {
//   name: 'Introdução à programação em Python',
//   description:
//     'Olá pessoal! Este é um curso introdutório sobre programação em Python. Espero que aproveitem!',
//   image: {
//     url: 'https://picsum.photos/402/602',
//   },
//   blocks: [{ type: 'video' }],
// },
// {
//   name: 'Desenvolvimento web com React.js',
//   description:
//     'Bem-vindos ao curso de desenvolvimento web com React.js! Vamos explorar juntos as maravilhas do React.',
//   image: {
//     url: 'https://picsum.photos/403/603',
//   },
//   blocks: [{ type: 'quiz' }],
// },
// {
//   name: 'Aprendendo machine learning com scikit-learn',
//   description:
//     'Oi pessoal! Vamos mergulhar no mundo do machine learning com o scikit-learn. Animados?',
//   image: {
//     url: 'https://picsum.photos/404/604',
//   },
//   blocks: [{ type: 'assignment' }],
// },
// {
//   name: 'Segurança da informação e ethical hacking',
//   description:
//     'Este curso aborda tópicos essenciais sobre segurança da informação e ethical hacking. Fiquem atentos!',
//   image: {
//     url: 'https://picsum.photos/405/605',
//   },
//   blocks: [{ type: 'article' }, { type: 'video' }],
// },
// {
//   name: 'Desenvolvimento mobile com Flutter',
//   description:
//     'Vamos construir aplicativos incríveis com Flutter! Este curso é para quem quer mergulhar no desenvolvimento mobile.',
//   image: {
//     url: 'https://picsum.photos/406/606',
//   },
//   blocks: [{ type: 'quiz' }, { type: 'assignment' }],
// },
// {
//   name: 'Gestão de projetos ágeis com Scrum',
//   description:
//     'Sejam bem-vindos ao curso de Gestão de Projetos Ágeis com Scrum. Preparem-se para uma jornada de aprendizado!',
//   image: {
//     url: 'https://picsum.photos/407/607',
//   },
//   blocks: [{ type: 'video' }],
// },
// {
//   name: 'Inteligência artificial e redes neurais',
//   description:
//     'Este curso explora os fundamentos da inteligência artificial e as maravilhas das redes neurais. Animados para aprender?',
//   image: {
//     url: 'https://picsum.photos/408/608',
//   },
//   blocks: [{ type: 'article' }, { type: 'quiz' }],
// },
// ];

// trails.value = [
//   ...trails.value,
//   ...trails.value,
//   ...trails.value,
//   ...trails.value,
// ];
const { isProfessor } = useStrapiUser<User>().value;
const { id } = route.params;
const getCourses = async () => {
  professorMode.value = isProfessor;
  isLoading.value = true;
  const { data } = await useAsyncData('learningPlans', () => {
    const params = { learningPlanId: id };
    return graphql<{
      data: {
        learningplans: Strapi4ResponseMany<LearningPlan>;
      };
    }>(GetTrails, params);
  });
  data.value?.data.learningplan.data.attributes.learning_structure.data.attributes.trails.data.forEach(
    (trail) => {
      trails.value.push({
        name: trail.attributes.title,
        description: trail.attributes.description,
        visible: !trail.attributes.visible,
        image: {
          url: trail.attributes.cover_image.data.attributes.url,
        },
        blocks: [{ type: 'article' }],
      });
    },
  );
  console.log(data.value);
  isLoading.value = false;
};
// eslint-disable camelcase
onBeforeMount(async () => await getCourses());

const showingData = (groupedItems) => {
  const itemsPerPage = search.value === '' ? 12 : groupedItems.length;

  const from = (page.value - 1) * itemsPerPage + 1;
  const to =
    page.value * itemsPerPage > trails.value.length
      ? trails.value.length
      : page.value * itemsPerPage;
  const total = trails.value.length;
  const message = t('pages.classes.showingData', {
    from,
    to,
    total,
  });
  if (to === 0) {
    return t('pages.classes.noData');
  }
  return message;
};

const changeItemVisibility = (index: number, id) => {
  trails.value[index].hidden = !trails.value[index].hidden;
  try {
    update('learningPlans', id, {
      hidden: !trails.value[index].hidden,
    });
  } catch (error) {
    trails.value[index].hidden = !trails.value[index].hidden;
  }
};

// const changeItemFavorited = (index: number) => {
//   trails.value[index].favorited = !trails.value[index].favorited;
// };

// const navigate = (id: number, page) => {
//   if (page === 'settings') {
//     router.push(`/course/${id}/settings`);
//   } else {
//     router.push(`/course/${id}`);
//   }
// };

const createTrail = () => {
  createTrailDialog.value = false;
  console.log('criar trilha');
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
