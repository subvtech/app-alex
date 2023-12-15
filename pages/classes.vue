<template>
  <div class="wrapper pa-6">
    <div class="d-flex justify-space-between flex-column flex-sm-row mb-2">
      <alex-custom-breadcrumbs title="Meus Cursos" :items="breadcrumbs" />
      <alex-custom-button
        prepend-icon="mdi-plus"
        size="large"
        class="text-body-4"
        >Novo Curso</alex-custom-button
      >
    </div>
    <div
      class="d-flex align-center justify-center bg-white flex-column fill-height rounded-lg pa-6"
    >
      <div
        v-if="courses.length == 0"
        class="d-flex align-center justify-center flex-column"
      >
        <img
          class="emptyProjects-img"
          src="@/assets/svg/EmptyProjects.svg"
          alt="Empty Projects"
        />
        <p class="text-h3 text-gray-600">Nenhum curso encontrado!</p>
      </div>
      <div v-else class="d-flex fill-height w-100 bg-white flex-column">
        <div class="d-flex justify-space-between">
          <alex-inputs-text-field
            v-model="search"
            placeholder="Buscar"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            style="width: 320px"
            density="compact"
          >
            ></alex-inputs-text-field
          >
          <div>
            <v-tooltip
              text="Alterar Visualização"
              location="bottom"
              content-class="bg-gray-800"
            >
              <template #activator="{ props }">
                <alex-custom-button
                  v-bind="props"
                  :icon="
                    coursesView == 'grid'
                      ? 'mdi-format-list-bulleted'
                      : 'mdi-view-grid-outline'
                  "
                  size="large"
                  variant="secondary"
                  @click="changeViewMode"
                />
              </template>
            </v-tooltip>
            <v-tooltip
              text="Filtrar"
              location="bottom"
              content-class="bg-gray-800"
            >
              <template #activator="{ props }">
                <alex-custom-button
                  v-bind="props"
                  class="mx-2"
                  icon="mdi-filter-variant"
                  size="large"
                  variant="secondary"
                  @click="console.log('filter')"
                />
              </template>
            </v-tooltip>
          </div>
        </div>
        <div
          v-if="coursesView == 'grid'"
          class="d-flex flex-wrap w-100 py-6"
          style="gap: 24px"
        >
          <v-card
            v-for="course in courses"
            :key="course"
            class="course-card rounded"
            max-width="400"
          >
            <img
              src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
              class="card-image"
            />
            <v-card-item>
              <v-card-title class="text-h5 text-gray-900 card-title">{{
                course.title
              }}</v-card-title>
              <v-card-text class="text-gray-600 text-body-3 card-text pa-0">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam voluptatum, voluptate, quibusdam, quia voluptas quod
                quos voluptatem quas quibusdam, quia voluptas quod quos
                voluptatem quas
              </v-card-text>
            </v-card-item>
          </v-card>
        </div>
        <div v-if="coursesView == 'table'">
          <v-data-table
            id="courses-table"
            ref="tableRef"
            v-model:search="search"
            v-model:page="page"
            :items="courses"
            :headers="headers"
            class="py-6"
          >
            <template #item="{ item }">
              <tr class="table-row text-body-3 text-gray">
                <td style="max-width: 596px">
                  <div class="d-flex align-center">
                    <img
                      :src="item.img"
                      width="48"
                      height="36"
                      class="rounded mr-4"
                    />
                    <p class="text-gray-900 text-body-4 text-overflow">
                      {{ item.title }}
                    </p>
                  </div>
                </td>
                <td class="text-overflow" style="max-width: 596px">
                  {{ item.Descrição }}
                </td>
                <td class="text-overflow" style="max-width: 150px">
                  {{ item.Facilitador }}
                </td>
                <td class="text-overflow" style="max-width: 90px">
                  {{ item.Trilhas }}
                </td>
                <td>
                  <v-tooltip
                    text="Opções"
                    location="bottom"
                    content-class="bg-gray-800"
                  >
                    <template #activator="{ props }">
                      <div v-bind="props">
                        <alex-inputs-dropdown
                          :items="[
                            {
                              icon: 'mdi-eye-outline',
                              text: 'Mostrar',
                            },
                            {
                              icon: 'mdi-cog-outline',
                              text: 'Configurações',
                            },
                          ]"
                        >
                          <template #activator="{ props }">
                            <alex-custom-button
                              v-bind="props"
                              variant="text"
                              icon="mdi-dots-vertical"
                            />
                          </template>
                        </alex-inputs-dropdown>
                      </div>
                    </template>
                  </v-tooltip>
                </td>
              </tr>
            </template>
            <template #bottom> </template>
          </v-data-table>
        </div>
        <div
          class="d-flex w-100 justify-space-between align-center px-6 bg-white"
          style="border-top: 1px #ebedef solid"
        >
          <p class="text-body-3 text-gray-600">
            Mostrando do {{ showingData.from }} ao {{ showingData.to }} de um
            total de {{ showingData.total }} cursos
          </p>
          <alex-custom-pagination
            v-if="pageCount > 1"
            v-model="page"
            :length="pageCount"
            :total-visible="5"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
const coursesView = ref('table');
const search = ref('');
const page = ref(1);
const tableRef = ref(null);
const pageCount = ref(0);
const courses = ref([]);
const showingData = ref({
  from: 0,
  to: 0,
  total: 0,
});

const setShowingData = () => {
  showingData.value = {
    from:
      page.value * tableRef.value.itemsPerPage -
      tableRef.value.itemsPerPage +
      1,
    to:
      page.value * tableRef.value.itemsPerPage > courses.value.length
        ? courses.value.length
        : page.value * tableRef.value.itemsPerPage,
    total: courses.value.length,
  };
};

const breadcrumbs = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Meus Cursos',
    href: '/course',
  },
];
onMounted(() => {
  pageCount.value = Math.ceil(
    courses.value.length / tableRef.value.itemsPerPage,
  );
  setShowingData();
});

watch([page, courses], () => {
  if (!tableRef.value) return;
  pageCount.value = Math.ceil(
    courses.value.length / tableRef.value.itemsPerPage,
  );
  setShowingData();
});

const headers = [
  {
    title: 'Curso',
    key: 'title',
  },
  {
    title: 'Descrição',
    key: 'Descrição',
  },
  {
    title: 'Facilitador',
    key: 'Facilitador',
  },
  {
    title: 'Trilhas',
    key: 'Trilhas',
  },
  {
    title: '',
  },
];

courses.value = [
  {
    title: 'Introdução à Segurança da Informação',
    img: 'https://picsum.photos/400/300',
    Descrição:
      'Explore os fundamentos da segurança da informação e práticas de proteção de dados.',
    Facilitador: 'Carolina',
    Trilhas: '4',
  },
  {
    title: 'Desenvolvimento Web Avançado',
    img: 'https://picsum.photos/800/600',
    Descrição:
      'Aprofunde-se no desenvolvimento web, abordando tecnologias modernas e práticas avançadas.',
    Facilitador: 'Gabriel',
    Trilhas: '8',
  },
  {
    title: 'Machine Learning Aplicado',
    img: 'https://picsum.photos/200/150',
    Descrição:
      'Conheça aplicações práticas de machine learning e como implementá-las em projetos do mundo real.',
    Facilitador: 'Isabela',
    Trilhas: '6',
  },
  {
    title: 'Inteligência Artificial para Iniciantes',
    img: 'https://picsum.photos/100/75',
    Descrição:
      'Um curso introdutório para entender os conceitos básicos de inteligência artificial.',
    Facilitador: 'Ricardo',
    Trilhas: '3',
  },
  {
    title: 'Gestão Ágil de Projetos',
    img: 'https://picsum.photos/400/300',
    Descrição:
      'Aprenda metodologias ágeis para gerenciar eficientemente projetos de software.',
    Facilitador: 'Daniela',
    Trilhas: '5',
  },
  {
    title: 'Cibersegurança Avançada',
    img: 'https://picsum.photos/48/36',
    Descrição:
      'Explore técnicas avançadas de cibersegurança para proteger sistemas contra ameaças sofisticadas.',
    Facilitador: 'Alexandre',
    Trilhas: '8',
  },
];

courses.value = [
  ...courses.value,
  ...courses.value,
  ...courses.value,
  ...courses.value,
];

const changeViewMode = () => {
  coursesView.value = coursesView.value === 'grid' ? 'table' : 'grid';
};
</script>

<style>
#courses-table thead > tr > th {
  height: 40px;
}

#courses-table tr:not(:last-child) > td,
#courses-table thead > tr > th {
  border-bottom: 1px solid #ebedef !important;
}

#courses-table .v-data-table__th {
  color: var(--cinza-cinza-600, #6e7a87);
  font-family: Sen;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 135%;
  letter-spacing: 0.32px;
}

.text-overflow {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
.emptyProjects-img {
  max-width: 400px;
  max-height: 360px;
}

.wrapper {
  height: calc(100vh - 150px);
}
.course-card {
  min-width: 300px;
  max-width: 400px;
}

.card-image {
  height: 250px;
  flex-shrink: 0;
  align-self: stretch;
  width: 100%;
}

.card-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  align-self: stretch;
}
.card-text {
  display: -webkit-box;
  max-height: 60px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  align-self: stretch;
}
</style>
