<template>
  <div
    class="d-flex bg-white fill-height flex-column rounded-lg pa-6 contributions-wrapper"
  >
    <div
      v-if="!isLoading"
      class="d-flex flex-wrap w-100"
      :class="
        !contributions.otherContributions.length
          ? 'justify-end'
          : 'justify-space-between mb-6'
      "
    >
      <alex-inputs-text-field
        v-show="contributions.otherContributions.length"
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
        v-if="!isProfessor"
        prepend-icon="mdi-plus"
        size="large"
        @click="handleShow(-1, -1)"
      >
        {{ $t('components.trails.contributions.contribute') }}
      </alex-custom-button>
    </div>
    <div
      v-if="
        contributions.otherContributions.length ||
        contributions.myContributions.length
      "
      class="ga-3 py-6 d-flex flex-column"
    >
      <p
        v-if="contributions.myContributions.length"
        class="text-gray-800 text-h5"
      >
        {{ $t('components.trails.contributions.myContributions') }}
      </p>
      <div
        v-if="contributions.myContributions.length"
        class="w-100 pa-4 bg-gray-blue rounded"
      >
        <alex-learningplan-trails-contribution-card
          :contributions="contributions.myContributions"
          :is-professor="false"
          @delete="handleDelete"
          @edit="handleEdit"
          @show="handleShow"
        />
      </div>
      <p
        v-if="!isProfessor && contributions.otherContributions.length"
        class="text-gray-800 text-h5"
      >
        {{ $t('components.trails.contributions.otherContributions') }}
      </p>
      <div
        v-if="contributions.otherContributions.length"
        class="w-100 pa-4 bg-gray-blue rounded"
      >
        <v-expansion-panels
          id="contributions-panels"
          class="ga-1"
          variant="accordion"
        >
          <v-expansion-panel
            v-for="(student, index) in contributions.otherContributions"
            :key="student.name + index"
            elevation="0"
          >
            <v-expansion-panel-title class="elevation-0 px-6 py-3 d-flex ga-4">
              <app-user-avatar
                :size="40"
                :profile-picture="
                  student.photo ? { url: student.photo, id: student.id } : null
                "
                :placeholder="student.name"
              ></app-user-avatar>
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
                v-if="student.class"
                :text="student.class"
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
                @show="handleShow"
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
    <alex-learningplan-trails-dialogs-create-contribution ref="dialog" />
  </div>
</template>

<script setup lang="ts">
interface contributionType {
  id: number;
  title: string;
  updatedAt: string;
  highlighted: boolean;
  blocked: boolean;
  contribution?: JSON;
}

interface studentsContributionsType {
  id: number;
  name: string;
  email: string;
  class: string;
  photo: string;
  contributions: contributionType[];
}

const studentSearch = ref('');
const isLoading = computed(
  () => trailStore.loading || learningPlanStore.loading,
);
const isProfessor = ref(false);
const dialog = ref();

const trailStore = useTrailStore();
const learningPlanStore = useLearningPlanStore();
const user = useStrapiUser<User>();

onBeforeMount(() => {
  // isProfessor.value = learningPlanStore.userIsFacilitator;
});

const contributions = computed(() => {
  const contributions = trailStore.trail?.contributions;
  const myContributions = [];
  const otherContributions: studentsContributionsType[] = [];
  contributions?.forEach((contribution) => {
    if (contribution.student_member.user.id === user.value.id) {
      myContributions.push(contribution);
    } else {
      const studentIndex = otherContributions.findIndex(
        (student) => student.id === contribution.student_member.user.id,
      );
      if (studentIndex > -1) {
        otherContributions[studentIndex].contributions.push(contribution);
      } else {
        otherContributions.push({
          id: contribution.student_member.user.id,
          name: contribution.student_member.user.fullname,
          email: contribution.student_member.user.email,
          class: contribution.student_member.learning_class?.name,
          photo: contribution.student_member.user.avatar?.url,
          contributions: [contribution],
        });
      }
    }
  });
  return { myContributions, otherContributions };
});

const handleHighlight = (student: number, contributionIndex: number) => {
  const contribution =
    contributions.value.otherContributions[student].contributions[
      contributionIndex
    ];
  contribution.highlighted = !contribution.highlighted;
  if (contribution.blocked) {
    contribution.blocked = false;
  }
};

const handleBlock = (student: number, contributionIndex: number) => {
  const contribution =
    contributions.value.otherContributions[student].contributions[
      contributionIndex
    ];
  contribution.blocked = !contribution.blocked;
  if (contribution.highlighted) {
    contribution.highlighted = false;
  }
};

const handleDelete = (index: number) => {
  contributions.value.myContributions.splice(index, 1);
};

const handleEdit = (index: number) => {
  console.log('edit' + index);
};

const handleShow = (studentIndex: number, index: number) => {
  if (studentIndex > -1) {
    dialog.value.openDialog(
      'readonly',
      contributions.value.otherContributions[studentIndex].contributions[index]
        .contribution,
      contributions.value.otherContributions[studentIndex].contributions[index]
        .title,
    );
  } else if (index > -1) {
    dialog.value.openDialog(
      'edit',
      contributions.value.myContributions[index].contribution,
      contributions.value.myContributions[index].title,
    );
  } else {
    dialog.value.openDialog('create');
  }
};
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
    border-color: #ebedef !important;
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

<!-- Todo:
-i18n
single contribution type
passar o id junto do show pra salvar e editar
dropdown do professor dentro do dialog
filtro de estudantes
-->
