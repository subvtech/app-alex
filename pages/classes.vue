<template>
  <div class="wrapper d-flex flex-column">
    <header class="d-flex justify-space-between flex-column flex-sm-row mb-2">
      <alex-custom-breadcrumbs
        :title="$t('pages.classes.breadcrumbs.myCourses')"
        :items="breadcrumbs"
      />
      <alex-custom-button
        v-if="professorMode"
        prepend-icon="mdi-plus"
        size="large"
        class="text-body-4"
        >{{ $t('pages.classes.newCourse') }}</alex-custom-button
      >
    </header>
    <div style="flex: 1" class="d-flex bg-white flex-column rounded-lg pa-6">
      <div
        v-if="courses.length == 0"
        style="flex: 1"
        class="d-flex align-center justify-center flex-column"
      >
        <img
          class="emptyProjects-img"
          src="@/assets/svg/EmptyProjects.svg"
          alt="Empty Projects"
        />
        <p class="text-h3 text-gray-600">
          {{ $t('pages.classes.emptyStateText') }}
        </p>
      </div>
      <div v-else class="d-flex w-100 flex-column h-100" style="flex: 1">
        <div class="d-flex justify-space-between flex-wrap w-100 mb-6">
          <alex-inputs-text-field
            v-model="search"
            :placeholder="$t('pages.classes.searchPlaceholder')"
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
              :text="$t('pages.classes.viewModeTooltip')"
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
              :text="$t('pages.classes.filterTooltip')"
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
        <v-data-iterator
          v-model:search="search"
          v-model:page="page"
          :items="courses"
          :items-per-page="12"
          :filter-keys="[
            'title',
            'description',
            'facilitatorName',
            'trails',
            'institution',
            'generalCompetencies',
            'technicalCompetencies',
            'startDate',
            'endDate',
          ]"
          class="d-flex flex-wrap align-content-space-between"
          style="flex: 1"
        >
          <template #default="{ items }">
            <div v-if="coursesView === 'grid'" class="d-flex flex-wrap ga-4">
              <alex-learningplan-card
                v-for="(course, index) in items"
                v-show="!course.raw.hidden || professorMode"
                :key="course.raw.title + index"
                type="course"
                class="flex-stretch"
                :options="professorMode"
                :title="course.raw.title"
                :description="course.raw.description"
                :image="{
                  url: course.raw.img,
                }"
                :facilitator="{
                  name: course.raw.facilitatorName,
                  imageURL: course.raw.facilitatorImage,
                }"
                style="flex: 1"
                :trails-count="course.raw.trails"
                :hide="course.raw.hidden"
                :favorited="course.raw.favorited"
                @favorite="changeItemFavorited(index)"
                @toggle-visibility="changeItemVisibility(index)"
                @configurations="console.log('configurations')"
              />
            </div>
            <v-data-table
              v-else
              id="courses-table"
              ref="tableRef"
              :items-per-page="12"
              :items="setTableData(items)"
              :headers="headers"
            >
              <template #item="{ item, index }">
                <tr
                  v-show="!(item as any).hidden || professorMode"
                  class="table-row text-body-3 text-gray"
                  :class="{ hidden: (item as any).hidden }"
                >
                  <td style="max-width: 596px">
                    <div class="d-flex align-center">
                      <img
                        :src="(item as any).img"
                        width="48"
                        height="36"
                        style="min-width: 48px; min-height: 36px"
                        class="rounded mr-4"
                      />
                      <p class="text-gray-900 text-body-4 text-overflow">
                        {{ (item as any).title }}
                      </p>
                    </div>
                  </td>
                  <td class="text-overflow" style="max-width: 596px">
                    {{ (item as any).description }}
                  </td>
                  <td class="text-overflow" style="max-width: 150px">
                    {{ (item as any).facilitatorName }}
                  </td>
                  <td class="text-overflow" style="max-width: 90px">
                    {{ (item as any).trails }}
                  </td>
                  <td>
                    <alex-inputs-dropdown
                      v-if="professorMode"
                      :items="dropdownItems((item as any).hidden, index)"
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
              <template #bottom />
            </v-data-table>
          </template>
          <template #footer="{ pageCount, groupedItems }">
            <div
              class="d-flex w-100 justify-space-between align-center pa-6 flex-column flex-sm-row ga-3 footer mt-6"
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
    </div>
  </div>
</template>

<script setup lang="ts">
const coursesView = ref('grid');
const search = ref('');
const page = ref(1);
const tableRef = ref(null);
const professorMode = ref(false);
const { t } = useI18n();

onBeforeMount(() => {
  const { isProfessor } = useStrapiUser<User>().value;
  console.log(useStrapiUser<User>().value);
  professorMode.value = isProfessor;
  if (professorMode.value) {
    headers.push({
      title: '',
      key: '',
      sortable: false,
    });
  }
});

interface RawItem {
  description: string;
  facilitatorName: string;
  facilitatorImage: string;
  trails: number;
  img: string;
  institution: string;
  generalCompetencies: string[];
  technicalCompetencies: string[];
  startDate: string;
  endDate: string;
  hidden: boolean;
  favorited: boolean;
}

interface Item {
  raw: RawItem;
}
const setTableData = (items: readonly Item[]): RawItem[] => {
  return items.map((item) => item.raw);
};

const showingData = (groupedItems) => {
  const itemsPerPage = search.value === '' ? 12 : groupedItems.length;

  const from = (page.value - 1) * itemsPerPage + 1;
  const to =
    page.value * itemsPerPage > courses.value.length
      ? courses.value.length
      : page.value * itemsPerPage;
  const total = courses.value.length;
  const message = t('pages.classes.showingData', {
    from,
    to,
    total,
  });
  return message;
};
const breadcrumbs = [
  {
    title: t('pages.classes.breadcrumbs.home'),
    href: '/',
    disabled: false,
  },
  {
    title: t('pages.classes.breadcrumbs.myCourses'),
    href: '/course',
    disabled: false,
  },
];

const dropdownItems = (hidden, index) => {
  return [
    hidden
      ? {
          icon: 'mdi-eye-outline',
          text: t('components.learningPlan.card.visibility.show'),
          onClick: () => changeItemVisibility(index),
        }
      : {
          icon: 'mdi-eye-off-outline',
          text: t('components.learningPlan.card.visibility.hide'),
          onClick: () => changeItemVisibility(index),
        },
    {
      icon: 'mdi-cog-outline',
      text: t('components.learningPlan.card.configurations'),
      link: `/course/settings/${index}`,
    },
  ];
};

interface DataTableHeader {
  title: string;
  key: string;
  sortable?: boolean;
}

const headers: DataTableHeader[] = [
  {
    title: t('pages.classes.tableHeaders.course'),
    key: 'title',
  },
  {
    title: t('pages.classes.tableHeaders.description'),
    key: 'description',
  },
  {
    title: t('pages.classes.tableHeaders.facilitator'),
    key: 'facilitatorName',
  },
  {
    title: t('pages.classes.tableHeaders.trails'),
    key: 'trails',
  },
];

const courses = ref([
  {
    title:
      'Gerenciamento de sistemas operacionais e projeto de redes utilizando o packet tracer',
    description:
      'Fala pessoal, tudo bem? Sejam bem vindos ao Plano de Aprendizagem sobre Gerenciamento de Projetos e aprendizagem',
    facilitatorName: 'Alexandre',
    facilitatorImage: 'https://picsum.photos/200/300',
    trails: 3,
    img: 'https://picsum.photos/400/600',
    institution: 'IFAL',
    generalCompetencies: ['Teamwork', 'Communication', 'Problem Solving'],
    technicalCompetencies: ['Networking', 'Project Management'],
    startDate: '2023-01-10',
    endDate: '2023-03-15',
    hidden: true,
    favorited: true,
  },
  {
    title: 'Introdução à programação em Python',
    description:
      'Olá pessoal! Este é um curso introdutório sobre programação em Python. Espero que aproveitem!',
    facilitatorName: 'Isabella',
    facilitatorImage: 'https://picsum.photos/201/301',
    trails: 5,
    img: 'https://picsum.photos/401/601',
    institution: 'UFAL',
    generalCompetencies: ['Problem Solving', 'Logic', 'Communication'],
    technicalCompetencies: ['Python Programming'],
    startDate: '2023-02-01',
    endDate: '2023-04-15',
    hidden: false,
    favorited: false,
  },
  {
    title: 'Desenvolvimento web com React.js',
    description:
      'Bem-vindos ao curso de desenvolvimento web com React.js! Vamos explorar juntos as maravilhas do React.',
    facilitatorName: 'Carlos',
    facilitatorImage: 'https://picsum.photos/202/302',
    trails: 4,
    img: 'https://picsum.photos/402/602',
    institution: 'UNCISAL',
    generalCompetencies: ['Web Development', 'React.js'],
    technicalCompetencies: ['Frontend Development'],
    startDate: '2023-03-05',
    endDate: '2023-05-20',
    hidden: false,
    favorited: false,
  },
  {
    title: 'Aprendendo machine learning com scikit-learn',
    description:
      'Oi pessoal! Vamos mergulhar no mundo do machine learning com o scikit-learn. Animados?',
    facilitatorName: 'Camila',
    facilitatorImage: 'https://picsum.photos/203/303',
    trails: 6,
    img: 'https://picsum.photos/403/603',
    institution: 'LAPP',
    generalCompetencies: ['Machine Learning', 'Data Analysis'],
    technicalCompetencies: ['Scikit-learn'],
    startDate: '2023-04-15',
    endDate: '2023-07-01',
    hidden: false,
    favorited: false,
  },
  {
    title: 'Segurança da informação e ethical hacking',
    description:
      'Este curso aborda tópicos essenciais sobre segurança da informação e ethical hacking. Fiquem atentos!',
    facilitatorName: 'Diego',
    facilitatorImage: 'https://picsum.photos/204/304',
    trails: 5,
    img: 'https://picsum.photos/404/604',
    institution: 'IFAL',
    generalCompetencies: ['Cybersecurity', 'Ethical Hacking'],
    technicalCompetencies: ['Information Security'],
    startDate: '2023-06-01',
    endDate: '2023-08-15',
    hidden: false,
    favorited: false,
  },
  {
    title: 'Desenvolvimento mobile com Flutter',
    description:
      'Vamos construir aplicativos incríveis com Flutter! Este curso é para quem quer mergulhar no desenvolvimento mobile.',
    facilitatorName: 'Eduarda',
    facilitatorImage: 'https://picsum.photos/205/305',
    trails: 4,
    img: 'https://picsum.photos/405/605',
    institution: 'LAPP',
    generalCompetencies: ['Mobile Development', 'Flutter'],
    technicalCompetencies: ['Mobile App Development'],
    startDate: '2023-07-10',
    endDate: '2023-10-01',
    hidden: false,
    favorited: false,
  },
  {
    title: 'Gestão de projetos ágeis com Scrum',
    description:
      'Sejam bem-vindos ao curso de Gestão de Projetos Ágeis com Scrum. Preparem-se para uma jornada de aprendizado!',
    facilitatorName: 'Fernando',
    facilitatorImage: 'https://picsum.photos/206/306',
    trails: 3,
    img: 'https://picsum.photos/406/606',
    institution: 'UNCISAL',
    generalCompetencies: ['Agile Project Management', 'Scrum'],
    technicalCompetencies: ['Project Management'],
    startDate: '2023-08-15',
    endDate: '2023-11-01',
    hidden: false,
    favorited: false,
  },
  {
    title: 'Inteligência artificial e redes neurais',
    description:
      'Este curso explora os fundamentos da inteligência artificial e as maravilhas das redes neurais. Animados para aprender?',
    facilitatorName: 'Gabriela',
    facilitatorImage: 'https://picsum.photos/207/307',
    trails: 6,
    img: 'https://picsum.photos/407/607',
    institution: 'LAPP',
    generalCompetencies: ['Artificial Intelligence', 'Neural Networks'],
    technicalCompetencies: ['AI Fundamentals'],
    startDate: '2023-09-01',
    endDate: '2023-12-15',
    hidden: false,
    favorited: false,
  },
]);

courses.value = [
  ...courses.value,
  ...courses.value,
  // ...courses.value,
  // ...courses.value,
];

const changeViewMode = () => {
  coursesView.value = coursesView.value === 'grid' ? 'table' : 'grid';
};

const changeItemVisibility = (index: number) => {
  courses.value[index].hidden = !courses.value[index].hidden;
};

const changeItemFavorited = (index: number) => {
  courses.value[index].favorited = !courses.value[index].favorited;
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

.footer {
  border-top: 1px #ebedef solid;
  max-height: 95px;
}

.hidden {
  opacity: 0.5;
}
</style>
