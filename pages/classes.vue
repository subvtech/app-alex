<template>
  <div class="wrapper d-flex flex-column">
    <header class="d-flex justify-space-between flex-column flex-sm-row mb-2">
      <alex-custom-breadcrumbs title="Meus Cursos" :items="breadcrumbs" />
      <alex-custom-button
        prepend-icon="mdi-plus"
        size="large"
        class="text-body-4"
        >Novo Curso</alex-custom-button
      >
    </header>
    <div
      style="flex: 1"
      class="d-flex align-center justify-center bg-white flex-column rounded-lg fill-height pa-6"
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
      <div v-else class="d-flex w-100 flex-column">
        <div class="d-flex justify-space-between flex-wrap w-100">
          <alex-inputs-text-field
            v-model="search"
            placeholder="Buscar"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            class="w-50"
            style="min-width: 160px"
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
        <!-- <div class="d-flex flex-column h-100 justify-space-between"> -->
        <div v-if="coursesView == 'grid'" class="d-flex flex-wrap w-100 py-6">
          <v-data-iterator
            v-model:search="search"
            v-model:page="page"
            :items="courses"
            :items-per-page="12"
            class="w-100 d-flex flex-wrap"
            style="gap: 16px"
          >
            <template #default="{ items }">
              <alex-learningplan-card
                v-for="course in items"
                :key="course"
                class="flex-stretch"
                :title="course.raw.title"
                :description="course.raw.description"
                :image="{
                  url: course.raw.img,
                }"
                :facilitator="{
                  name: course.raw.facilitatorName,
                  imageURL: course.raw.facilitatorImage,
                }"
                :trails="course.raw.trails"
              />
            </template>
          </v-data-iterator>
        </div>
        <div v-if="coursesView == 'table'">
          <v-data-table
            id="courses-table"
            ref="tableRef"
            v-model:search="search"
            v-model:page="page"
            :items-per-page="12"
            :items="courses"
            :headers="headers"
            class="py-4"
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
                  {{ item.description }}
                </td>
                <td class="text-overflow" style="max-width: 150px">
                  {{ item.facilitatorName }}
                </td>
                <td class="text-overflow" style="max-width: 90px">
                  {{ item.trails }}
                </td>
                <td>
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
                    <template #activator="{ props: propsMenu }">
                      <v-tooltip
                        text="Opções"
                        location="bottom"
                        content-class="bg-gray-800"
                      >
                        <template #activator="{ props: optionsTooltipProps }">
                          <alex-custom-button
                            v-bind="{ ...propsMenu, ...optionsTooltipProps }"
                            variant="text"
                            icon="mdi-dots-vertical"
                          />
                        </template>
                      </v-tooltip>
                    </template>
                  </alex-inputs-dropdown>
                </td>
              </tr>
            </template>
            <template #bottom> </template>
          </v-data-table>
        </div>
      </div>
      <!-- </div> -->
    </div>
    <div
      v-if="courses.length > 0"
      class="d-flex w-100 justify-space-between align-center pa-6 flex-column flex-sm-row ga-3 bg-white"
      style="border-top: 1px #ebedef solid"
    >
      <p class="text-body-3 text-gray-600">
        Mostrando do {{ showingData.from }} ao {{ showingData.to }} de um total
        de {{ showingData.total }} cursos
      </p>
      <alex-custom-pagination
        v-if="pageCount > 1"
        v-model="page"
        :length="pageCount"
        :total-visible="5"
      />
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
    from: page.value * 12 - 12 + 1,
    to:
      page.value * 12 > courses.value.length
        ? courses.value.length
        : page.value * 12,
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
  pageCount.value = Math.ceil(courses.value.length / 12);
  setShowingData();
});

watch([page, courses], () => {
  if (!tableRef.value) return;
  pageCount.value = Math.ceil(courses.value.length / 12);
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
    title:
      'Gerenciamento de sistemas operacionais e projeto de redes utilizando o packet tracer',
    description:
      'Fala pessoal, tudo bem? Sejam bem vindos ao Plano de Aprendizagem sobre Gerenciamento de Projetos e aprendizagem',
    facilitatorName: 'Alexandre',
    facilitatorImage: 'https://picsum.photos/200/300',
    trails: 3,
    img: 'https://picsum.photos/400/600',
  },
  {
    title: 'Introdução à programação em Python',
    description:
      'Olá pessoal! Este é um curso introdutório sobre programação em Python. Espero que aproveitem!',
    facilitatorName: 'Isabella',
    facilitatorImage: 'https://picsum.photos/201/301',
    trails: 5,
    img: 'https://picsum.photos/401/601',
  },
  {
    title: 'Desenvolvimento web com React.js',
    description:
      'Bem-vindos ao curso de desenvolvimento web com React.js! Vamos explorar juntos as maravilhas do React.',
    facilitatorName: 'Carlos',
    facilitatorImage: 'https://picsum.photos/202/302',
    trails: 4,
    img: 'https://picsum.photos/402/602',
  },
  {
    title: 'Aprendendo machine learning com scikit-learn',
    description:
      'Oi pessoal! Vamos mergulhar no mundo do machine learning com o scikit-learn. Animados?',
    facilitatorName: 'Camila',
    facilitatorImage: 'https://picsum.photos/203/303',
    trails: 6,
    img: 'https://picsum.photos/403/603',
  },
  {
    title: 'Segurança da informação e ethical hacking',
    description:
      'Este curso aborda tópicos essenciais sobre segurança da informação e ethical hacking. Fiquem atentos!',
    facilitatorName: 'Diego',
    facilitatorImage: 'https://picsum.photos/204/304',
    trails: 5,
    img: 'https://picsum.photos/404/604',
  },
  {
    title: 'Desenvolvimento mobile com Flutter',
    description:
      'Vamos construir aplicativos incríveis com Flutter! Este curso é para quem quer mergulhar no desenvolvimento mobile.',
    facilitatorName: 'Eduarda',
    facilitatorImage: 'https://picsum.photos/205/305',
    trails: 4,
    img: 'https://picsum.photos/405/605',
  },
  {
    title: 'Gestão de projetos ágeis com Scrum',
    description:
      'Sejam bem-vindos ao curso de Gestão de Projetos Ágeis com Scrum. Preparem-se para uma jornada de aprendizado!',
    facilitatorName: 'Fernando',
    facilitatorImage: 'https://picsum.photos/206/306',
    trails: 3,
    img: 'https://picsum.photos/406/606',
  },
  {
    title: 'Inteligência artificial e redes neurais',
    description:
      'Este curso explora os fundamentos da inteligência artificial e as maravilhas das redes neurais. Animados para aprender?',
    facilitatorName: 'Gabriela',
    facilitatorImage: 'https://picsum.photos/207/307',
    trails: 6,
    img: 'https://picsum.photos/407/607',
  },
];

courses.value = [
  // ...courses.value,
  // ...courses.value,
  // ...courses.value,
  // ...courses.value,
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
  min-height: calc(100vh - 130px);
}

.flex-stretch {
  flex: 1 !important;
  flex-basis: fit-content;
}
</style>
