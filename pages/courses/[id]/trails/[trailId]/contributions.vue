<template>
  <div
    class="d-flex bg-white fill-height flex-column rounded-lg pa-6 contributions-wrapper"
  >
    <div
      v-if="!isLoading"
      class="d-flex flex-wrap w-100"
      :class="
        !studentsContributions.length
          ? 'justify-end'
          : 'justify-space-between mb-6'
      "
    >
      <alex-inputs-text-field
        v-show="studentsContributions.length"
        v-model="studentSearch"
        name="search"
        :placeholder="$t('components.trails.contributions.inputPlaceholder')"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        class="w-50"
        style="min-width: 160px; max-width: 320px"
        density="comfortable"
      />
      <alex-custom-button
        prepend-icon="mdi-plus"
        size="large"
        @click="createContributionDialog = true"
      >
        {{
          $t('components.trails.contributions.contribute')
        }}</alex-custom-button
      >
    </div>
    <div
      v-if="studentsContributions.length || myContributions.length"
      class="ga-3 py-6 d-flex flex-column"
    >
      <p v-if="!isProfessor" class="text-gray-800 text-h5">
        {{ $t('components.trails.contributions.myContributions') }}
      </p>
      <div class="w-100 pa-4 bg-gray-blue rounded">
        <alex-learningplan-trails-contribution-card
          :contributions="myContributions"
          :is-professor="false"
          @highlight="handleHighlight"
          @block="handleBlock"
          @delete="handleDelete"
          @edit="handleEdit"
        />
      </div>
      <p v-if="!isProfessor" class="text-gray-800 text-h5">
        {{ $t('components.trails.contributions.otherContributions') }}
      </p>
      <div class="w-100 pa-4 bg-gray-blue rounded">
        <v-expansion-panels
          id="contributions-panels"
          class="ga-1"
          variant="accordion"
        >
          <v-expansion-panel
            v-for="(student, index) in studentsContributions"
            :key="student.name + index"
            elevation="0"
          >
            <v-expansion-panel-title class="elevation-0 px-6 py-3 d-flex ga-4">
              <img
                class="width-10 height-10 rounded-pill"
                cover
                src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"
              />
              <div class="d-flex flex-column ellipsis">
                <span class="text-gray-700 text-body-2 ellipsis lines-1">{{
                  student.name
                }}</span>
                <span class="text-gray-600 text-body-3 ellipsis lines-1"
                  >{{ student.email }}
                </span>
              </div>
              <v-spacer />
              <alex-custom-chip
                text="Turma A"
                status="primary"
                class="d-none d-sm-flex"
              />
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <alex-learningplan-trails-contribution-card
                :contributions="student.contributions"
                is-professor
                :student-index="index"
                @highlight="handleHighlight"
                @block="handleBlock"
                @delete="handleDelete"
                @edit="handleEdit"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </div>
    <div
      v-else
      style="flex: 1"
      class="d-flex"
      :class="isLoading ? '' : 'align-center justify-center flex-column'"
    >
      <div v-if="isLoading" class="w-100">
        <alex-custom-skeleton
          color="gray-200"
          class="width-80 height-10 mb-6"
          rounded="lg"
        />

        <alex-custom-skeleton
          color="gray-200"
          class="width-50 height-10 mb-6"
          rounded="lg"
        />
        <alex-custom-skeleton
          color="gray-200"
          class="w-100 height-75 mb-6"
          rounded="lg"
        ></alex-custom-skeleton>
      </div>
      <div v-else class="d-flex align-center justify-center flex-column">
        <img
          class="emptyProjects-img"
          src="/images/emptyContributions.svg"
          alt="Empty Projects"
        />
        <p
          class="text-h3 text-gray-400 mt-4 text-center width-62"
          style="text-wrap: pretty"
        >
          {{ $t('components.trails.contributions.emptyText') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface contributionType {
  title: string;
  dateAndTime: string;
  highlight: boolean;
  blocked: boolean;
}

interface studentsContributionsType {
  name: string;
  email: string;
  class: string;
  photo: string;
  contributions: contributionType[];
}

const studentSearch = ref('');
const myContributions = ref<contributionType[]>([
  {
    title: 'Title 1',
    dateAndTime: '2021-09-01T00:00:00',
    highlight: true,
    blocked: false,
  },
  {
    title: 'Title 2',
    dateAndTime: '2021-09-01T00:00:00',
    highlight: false,
    blocked: true,
  },
  {
    title: 'Title 3',
    dateAndTime: '2021-09-01T00:00:00',
    highlight: false,
    blocked: false,
  },
]);
const studentsContributions = ref<studentsContributionsType[]>([
  {
    name: 'Robert Judson',
    email: 'RobertJudson@gmail.com',
    class: 'Turma A',
    photo: 'https://cdn.vuetifyjs.com/images/cards/desert.jpg',
    contributions: [
      {
        title: 'Novas features VUE 3.4',
        dateAndTime: '2021-09-01T00:00:00',
        highlight: true,
        blocked: false,
      },
      {
        title: 'Title 2',
        dateAndTime: '2021-09-01T00:00:00',
        highlight: false,
        blocked: true,
      },
      {
        title: 'Title 3',
        dateAndTime: '2021-09-01T00:00:00',
        highlight: false,
        blocked: false,
      },
    ],
  },
]);
const createContributionDialog = ref(false);

const handleHighlight = (student: number, contributionIndex: number) => {
  const contribution =
    studentsContributions.value[student].contributions[contributionIndex];
  contribution.highlight = !contribution.highlight;
  if (contribution.blocked) {
    contribution.blocked = false;
  }
};

const handleBlock = (student: number, contributionIndex: number) => {
  const contribution =
    studentsContributions.value[student].contributions[contributionIndex];
  contribution.blocked = !contribution.blocked;
  if (contribution.highlight) {
    contribution.highlight = false;
  }
};

const handleDelete = (index: number) => {
  myContributions.value.splice(index, 1);
};

const handleEdit = (index: number) => {
  console.log('edit' + index);
};

const isLoading = ref(false);
const isProfessor = ref(true);
</script>

<style>
.contributions-wrapper {
  min-height: 520px !important;
}
#contributions-panels {
  .v-theme--mainTheme {
    --v-border-opacity: 0 !important;
  }

  .v-expansion-panel {
    border-radius: 8px !important;
  }

  .v-expansion-panel-title {
    height: 65px !important;
    background-color: #fff !important;
  }

  .v-expansion-panel-title--active {
    background-color: #fff !important;
    height: 73px !important;
    border-bottom: 1px solid #ebedef !important;
  }

  .v-expansion-panel-title:hover:not(:has(.delete-btn:hover)) {
    background-color: #ebedef !important;
  }

  .v-expansion-panel-title__overlay {
    display: none;
  }

  .v-expansion-panel__shadow {
    display: none !important;
  }
  .v-expansion-panel:not(:first-child)::after {
    border-top-style: none !important;
  }
  .one-item.v-expansion-panels--variant-accordion > :first-child {
    border-radius: 6px !important;
  }
}
</style>
