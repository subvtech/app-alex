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
        class="w-75 min-w-40 max-w-80"
        density="comfortable"
      />

      <div v-if="!isProfessor" @click="handleShow(-1, -1)">
        <alex-custom-button
          class="d-none d-sm-flex"
          prepend-icon="mdi-plus"
          size="large"
        >
          {{ $t('components.trails.contributions.contribute') }}
        </alex-custom-button>
        <alex-custom-button
          class="d-flex d-sm-none"
          icon="mdi-plus"
          size="large"
        />
      </div>
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
            v-for="(student, index) in filteredStudents"
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
                :is-professor="isProfessor"
                :student-index="index"
                @highlight="handleHighlight"
                @block="handleBlock"
                @show="handleShow"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
          <div v-if="!filteredStudents.length" class="w-100 pa-4">
            <p class="text-gray-600 text-body-3 text-center">
              {{ $t('components.trails.contributions.emptyStudentsFilter') }}
            </p>
          </div>
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
    <alex-learningplan-trails-dialogs-create-contribution
      ref="dialog"
      :student-id="contributions.userId"
      :trail-id="contributions.trailId"
      @highlight="handleHighlight"
      @block="handleBlock"
    />
  </div>
</template>

<script setup lang="ts">
interface editorData {
  time: number;
  version: string;
  blocks: JSON[];
}

export interface contributionType {
  id: number;
  title: string;
  highlighted: boolean;
  blocked: boolean;
  contribution: editorData;
  highlighted_order?: number;
}

interface studentsContributionsType {
  id: number;
  name: string;
  email: string;
  class: string;
  photo: string;
  contributions: contributionType[];
}

const { update, delete: _delete, find } = useStrapi();
const route = useRoute();
const router = useRouter();
const trailStore = useTrailStore();
const learningPlanStore = useLearningPlanStore();
const user = useStrapiUser<User>();
const messageStore = useMessageStore();
const { t } = useI18n();

const dialog = ref();
const studentSearch = ref('');

const isLoading = computed(
  () => trailStore.loading || learningPlanStore.loading,
);

onMounted(() => {
  if (route.query?.openModal) {
    dialog.value.openDialog('create');
    router.replace({ query: { ...route.query, openModal: undefined } });
  }
});

const isProfessor = computed(() => learningPlanStore.userIsFacilitator);

const filteredStudents = computed(() => {
  return contributions.value.otherContributions.filter((student) =>
    student.name.toLowerCase().includes(studentSearch.value.toLowerCase()),
  );
});

const contributions = computed(() => {
  const myContributions: contributionType[] = [];
  const otherContributions: studentsContributionsType[] = [];
  const contributions = trailStore.trail?.contributions;
  const trailId = trailStore.trail?.id;
  const userId = learningPlanStore.userIsFacilitator
    ? -1
    : learningPlanStore.activeMembers.find(
        (member) => member.user.id === user.value.id,
      )?.id;
  contributions?.forEach((contribution) => {
    const student = contribution.student_member;
    if (contribution.student_member?.user.id === user.value.id) {
      myContributions.push(contribution);
    } else {
      const studentIndex = otherContributions.findIndex(
        (student) => student.id === contribution.student_member.user.id,
      );
      if (studentIndex > -1 && !hideBlocked(contribution)) {
        otherContributions[studentIndex].contributions.push(contribution);
      } else if (!hideBlocked(contribution)) {
        otherContributions.push({
          id: student.user.id,
          name: student.user.fullname,
          email: student.user.email,
          class: student.learning_class?.name,
          photo: student.user.avatar?.url,
          contributions: [contribution],
        });
      }
    }
  });

  return { myContributions, otherContributions, trailId, userId };
});

const handleError = (text: string) => {
  messageStore.setMessage(text, 'red', true);
  if (trailStore.trail?.id !== undefined)
    trailStore.loadTrailData(trailStore.trail.id);
};

const findTrailById = (id: number) => {
  return trailStore.trail?.contributions.find(
    (contribution) => contribution.id === id,
  );
};

const countHighlights = async () => {
  const highlights = await find<contributionType>('trail-contributions', {
    filters: { trail: trailStore.trail?.id, highlighted: true },
  });
  if (highlights.data) {
    return Math.max(
      ...highlights.data.map((item) => item.attributes.highlighted_order || 0),
    );
  }
  return 0;
};


// perguntar pro djalma se precisa deixar a ordem certinha 1,2,3,4 ou se pode deixar com intervalos, ja que o novo sempre vai ser o ultimo

const updateHighlightsOrder = async (deletedOrder: number) => {
  const highlights = await find<contributionType>('trail-contributions', {
    filters: { trail: trailStore.trail?.id, highlighted: true },
  });

  highlights.data?.forEach(async (highlight) => {
    if (
      highlight.attributes.highlighted_order &&
      highlight.attributes.highlighted_order > deletedOrder
    ) {
      await update('trail-contributions', highlight.id, {
        highlighted_order: highlight.attributes.highlighted_order - 1,
      });
    }
  });
};

const handleHighlight = async (contributionId: number) => {
  try {
    const contribution = findTrailById(contributionId);
    if (!contribution) return;
    contribution.highlighted = !contribution.highlighted;
    contribution.blocked = false;
    const order = contribution.highlighted
      ? (await countHighlights()) + 1
      : contribution.highlighted_order;
    await update('trail-contributions', contribution.id, {
      highlighted: contribution.highlighted,
      highlighted_order: contribution.highlighted ? order : null,
      blocked: false,
    });
    if (!contribution.highlighted && order) {
      contribution.highlighted_order = null;
      await updateHighlightsOrder(order);
    }
  } catch (e) {
    handleError(t('components.trails.contributions.error.updateHighlight'));
  }
};

const handleBlock = async (contributionId: number) => {
  try {
    const contribution = findTrailById(contributionId);
    if (!contribution) return;
    contribution.blocked = !contribution.blocked;
    contribution.highlighted = false;
    const order = contribution.highlighted_order;
    await update('trail-contributions', contribution.id, {
      blocked: contribution.blocked,
      highlighted: false,
      highlighted_order: null,
    });
    if (order) {
      await updateHighlightsOrder(order);
    }
  } catch (e) {
    handleError(t('components.trails.contributions.error.updateBlock'));
  }
};

const handleDelete = async (contributionId: number) => {
  try {
    const deleteIndex = trailStore.trail?.contributions.findIndex(
      (contribution) => contribution.id === contributionId,
    );
    if (typeof deleteIndex === 'number') {
      trailStore.trail?.contributions.splice(deleteIndex, 1);
    }
    await _delete('trail-contributions', contributionId);
  } catch (e) {
    handleError(t('components.trails.contributions.deleteError'));
  }
};

const handleEdit = (index: number) => {
  dialog.value.openDialog('edit', contributions.value.myContributions[index]);
};

const handleShow = (studentIndex: number, index: number) => {
  if (studentIndex > -1) {
    dialog.value.openDialog(
      'readonly',
      filteredStudents.value[studentIndex].contributions[index],
    );
  } else if (index > -1) {
    dialog.value.openDialog('edit', contributions.value.myContributions[index]);
  } else {
    dialog.value.openDialog('create');
  }
};

const hideBlocked = (contributions: contributionType) => {
  return contributions.blocked && !isProfessor.value;
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
