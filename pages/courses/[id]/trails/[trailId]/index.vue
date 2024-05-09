<template>
  <div class="fill-height d-flex ga-3 flex-column">
    <alex-learningplan-trails-contributions-side-bar
      :model-value="sidebar"
      :contributions="highlightedContributionsSimple"
      :is-professor="learningPlanStore.userIsFacilitator"
      @show-contribution="showContribution"
      @remove-highlight="removeContributionHighlight"
      @update:model-value="(value) => (sidebar = value)"
      @dragged:items="(value) => handlePositions(value)"
    />
    <div
      id="editor-container"
      class="bg-white rounded w-100 container-min-height"
    >
      <div
        section="0"
        class="d-flex justify-end px-6 pt-6"
        :class="!readOnly ? 'sticky-buttons' : ''"
      >
        <alex-custom-button
          v-if="readOnly && !trailStore.loading"
          icon="mdi-text-box-outline"
          variant="secondary"
          size="large"
          @click="sidebar = !sidebar"
        />
        <alex-custom-button
          v-if="
            readOnly &&
            learningPlanStore.userIsFacilitator &&
            !trailStore.loading
          "
          variant="primary"
          size="large"
          class="ml-2"
          prepend-icon="mdi-pencil-outline"
          @click="toggleReadOnly"
          >{{ $t('pages.trailId.overview.editBtn') }}</alex-custom-button
        >
        <div v-else-if="learningPlanStore.userIsFacilitator && !isLoading">
          <alex-custom-button
            variant="secondary"
            size="large"
            prepend-icon="mdi-close"
            class="mr-2"
            @click="resetData"
            >{{ $t('pages.trailId.overview.cancelBtn') }}</alex-custom-button
          >
          <alex-custom-button
            variant="primary"
            :loading="saveLoading"
            size="large"
            prepend-icon="mdi-check"
            @click="saveData"
            >{{ $t('pages.trailId.overview.saveBtn') }}</alex-custom-button
          >
        </div>
      </div>
      <div
        v-if="!showEditor && readOnly"
        class="d-flex fill-height align-center justify-center container-min-height"
      >
        <div
          v-if="trailStore.loading || isLoading"
          class="w-100 max-w-175 min-h-125"
        >
          <alex-custom-skeleton
            color="gray-200"
            type="list-item"
            class="width-50 height-3 mb-4"
            rounded="lg"
          ></alex-custom-skeleton>
          <div class="w-100 d-flex flex-column bg-gray-100 pa-8 rounded-lg">
            <alex-custom-skeleton
              color="gray-300"
              type="list-item"
              class="w-100 height-10"
              rounded="lg"
            ></alex-custom-skeleton>
            <alex-custom-skeleton
              color="gray-300"
              type="list-item"
              class="w-100 height-3 mt-10"
              rounded="lg"
            ></alex-custom-skeleton>
            <alex-custom-skeleton
              color="gray-300"
              type="list-item"
              class="w-100 height-3 mt-3"
              rounded="lg"
            ></alex-custom-skeleton>
            <alex-custom-skeleton
              color="gray-300"
              type="list-item"
              class="w-75 height-3 mt-3"
              rounded="lg"
            ></alex-custom-skeleton>
            <alex-custom-skeleton
              color="gray-300"
              type="list-item"
              class="w-100 height-80 mt-10"
              rounded="lg"
            />
          </div>
        </div>
        <div v-else>
          <img src="/images/emptyTrail.svg" />
          <p class="text-gray-400 text-h3 empty-state-text text-center">
            {{ $t('pages.trailId.overview.emptyState') }}
          </p>
        </div>
      </div>
      <div
        v-else
        class="container-min-height justify-center ma-6 align-start d-flex"
      >
        <div class="width-187">
          <p
            v-show="readOnly && editorData.time"
            class="text-gray-500 text-body-3 mb-4 mx-auto max-width-187"
          >
            {{ $t('pages.trailId.overview.lastUpdated') }}
            {{ timeStampToDate(editorData.time) }}
          </p>
          <AppEditor ref="editor" key-id="editorjs" />
          <div v-if="readOnly">
            <div
              v-for="contribution in highlightedContributions"
              :id="`${contribution.title}-${contribution.id}`"
              :key="contribution.id"
              class="w-100 my-12"
            >
              <div class="d-flex w-100 mb-2 align-center position-relative">
                <app-user-avatar
                  class="mr-2 user-avatar"
                  :size="24"
                  :profile-picture="
                    contribution.student.photo
                      ? {
                          url: contribution.student.photo,
                          id: contribution.student.id,
                        }
                      : null
                  "
                  :placeholder="contribution.student.name"
                ></app-user-avatar>
                <alex-learningplan-trails-user-card
                  class="user-card"
                  :student="contribution.student"
                  :trail-id="trailId"
                  :learning-plan-id="learningPlanId"
                />

                <span class="text-gray-600 text-body-5">
                  {{ timeStampToDate(contribution.time) }}
                </span>
              </div>
              <h3 class="text-gray-800 text-h3 ellipsis lines-1 mb-4">
                {{ contribution.title }}
              </h3>
              <div>
                <AppEditor
                  :ref="`contribution-${contribution.id}`"
                  :key-id="`contribution-${contribution.id}`"
                  :data="contribution.contribution"
                  :read-only="readOnly"
                />
              </div>
            </div>
            <div
              v-if="!learningPlanStore.userIsFacilitator"
              class="w-100 pt-12 d-flex justify-center align-center contributions-container"
            >
              <alex-custom-button
                class="ma-auto"
                prepend-icon="mdi-plus"
                size="large"
                @click="goToContributions()"
              >
                {{ t('pages.trailId.overview.contribute') }}
              </alex-custom-button>
            </div>
          </div>
        </div>
        <div v-if="readOnly" class="d-lg-block sections-col h-100" cols="2">
          <div class="sections-container">
            <p class="text-gray-800 text-h6 mb-4">Seções</p>
            <div>
              <v-tooltip
                v-for="(section, index) in sections"
                :key="section.title"
                :text="section.title"
                location="bottom center"
                content-class="bg-gray-800 pa-6  text-body-3 text-overflow"
                :disabled="!isAvailableTooltip(section.title)"
                max-width="300"
              >
                <template #activator="{ props: propsTooltip }">
                  <p
                    v-bind="propsTooltip"
                    class="section-text pr-4 text-body-3 align-center py-2 text-truncate"
                    :class="[
                      activeSection == index
                        ? 'text-accent bg-gray-blue'
                        : 'text-gray-600 section-text-default',
                      calculateMargin(section.type),
                    ]"
                    @click="navigateToSection(index)"
                  >
                    {{ section.title }}
                  </p>
                </template>
              </v-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { contributionType } from '~/pages/courses/[id]/trails/[trailId]/contributions.vue';

const { update, create } = useStrapi();
const route = useRoute();
const { setMessage } = useMessageStore();

const learningPlanId = computed(() => parseInt(route.params?.id.toString()));
const trailId = computed(() => parseInt(route.params?.trailId.toString()));

const headerStore = usePageHeaderStore();
const learningPlanStore = useLearningPlanStore();

definePageMeta({
  hideLearningPlanBanner: true,
});

const trailStore = useTrailStore();
const saveLoading = ref(false);
const readOnly = ref(true);
const editor = ref();
const isLoading = ref(false);
const sidebar = ref(false);

const backUpEditorData = ref({ blocks: [] });
const showEditor = computed(() => {
  return (
    !trailStore.loading && (editorData.value.blocks.length || !readOnly.value)
  );
});

const { t } = useI18n();
const editorData = computed(() => {
  const data =
    trailStore.trail?.structures[trailStore.trail?.structures.length - 1];
  return {
    time: data && data.time ? parseInt(data.time.toString()) : 0,
    version: data?.version || '',
    blocks:
      data?.blocks.map((block: any) => {
        return {
          type: block.type,
          data: block.data,
          tunes: block.tunes || {},
          id: block.id || '',
        };
      }) || [],
  };
});

const highlightedContributions = computed(() => {
  return trailStore.trail?.contributions
    .filter((contribution) => contribution.highlighted)
    .sort((a, b) => (a.highlighted_order > b.highlighted_order ? 1 : -1))
    .map((contribution) => {
      return {
        id: contribution.id,
        title: contribution.title,
        contribution: contribution.contribution,
        time: contribution.contribution.time,
        student: {
          id: contribution.student_member.user.id,
          name: contribution.student_member.user.fullname,
          photo: contribution.student_member.user.avatar?.url,
          email: contribution.student_member.user.email,
          cover: contribution.student_member.user.cover?.url,
        },
      };
    });
});

const highlightedContributionsSimple = computed(() => {
  if (!highlightedContributions.value) return [];
  return highlightedContributions.value.map((contribution) => {
    return {
      id: contribution.id,
      title: contribution.title,
      contribution: contribution.contribution,
      time: contribution.contribution.time,
    };
  });
});

onMounted(async () => {
  isLoading.value = true;
  while (trailStore.loading) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  if (editorData.value.blocks.length) {
    if (await checkEditorReady()) {
      readOnly.value = false;

      await loadEditor();
      toggleReadOnly();
    } else {
      setMessage(t('pages.trailId.overview.loadError'), 'red', true);
    }
  }
  isLoading.value = false;
});

onBeforeMount(() => {
  headerStore.showHeader = true;
});

watch(
  () => [learningPlanStore.loading, trailStore.loading],
  () => {
    if (!learningPlanStore.loading && !trailStore.loading) {
      headerStore.title = t('components.trails.header.breadcrumbs.title');
      headerStore.items = [
        {
          title: learningPlanStore.learningPlan?.title || '',
          disabled: false,
          to: `/courses/${learningPlanId.value}`,
        },
        {
          title: t('pages.courses.trails'),
          disabled: false,
          to: `/courses/${learningPlanId.value}/trails`,
        },
        {
          title: trailStore.trail?.title || '',
          disabled: true,
          to: `/courses/${learningPlanId.value}/trails/${trailId}`,
        },
      ];
    }
  },
);

const sections = ref([
  {
    title: t('pages.trailId.overview.sectionTitle'),
    type: 1,
    active: true,
  },
]);

const calculateMargin = (index: number) => {
  if (index === 1) return 'pl-4';
  return `pl-${(index - 1) * 4}`;
};

const isAvailableTooltip = (title: string) => {
  if (title.length >= 29) return true;
  return false;
};

const toggleReadOnly = async () => {
  readOnly.value = !readOnly.value;
  if (editor.value && editorData.value.blocks.length) {
    await editor.value.toggleReadOnly();
  }

  if (!readOnly.value) {
    backUpEditorData.value = JSON.parse(JSON.stringify(editorData.value));
    observer.disconnect();
  } else {
    setTimeout(() => {
      setSections();
      setObserver();
    }, 300);
  }
};

const setSections = () => {
  const newSections = [
    {
      title: t('pages.trailId.overview.sectionTitle'),
      type: 1,
      active: true,
    },
  ];
  editorData.value.blocks.forEach((block: any) => {
    if (block.type === 'header') {
      newSections.push({
        title: block.data.text,
        type: block.data.level,
        active: false,
      });
    }
    const sectionBlock = document.querySelector(`[data-id="${block.id}"]`);
    if (sectionBlock) {
      sectionBlock.setAttribute('section', String(newSections.length - 1));
    }
  });
  highlightedContributions.value?.forEach((contribution) => {
    newSections.push({
      title: contribution.title,
      type: 3,
      active: false,
    });
    const contributionSection = document.getElementById(
      `${contribution.title}-${contribution.id}`,
    );
    if (contributionSection) {
      contributionSection.setAttribute(
        'section',
        String(newSections.length - 1),
      );
    }
  });

  sections.value = newSections;
};

const navigateToSection = (index: number) => {
  const element = document.querySelector(`[section="${index}"]`);
  if (element) {
    element.scrollIntoView({
      block: 'center',
      inline: 'nearest',
      behavior: 'smooth',
    });
  }
};

const removeContributionHighlight = async (id: number) => {
  try {
    const contribution = trailStore.trail?.contributions.find(
      (contribution) => contribution.id === id,
    );
    if (!contribution) throw new Error('Contribution not found');
    contribution.highlighted = false;
    await update('trail-contributions', contribution.id, {
      highlighted: contribution.highlighted,
      blocked: false,
    });
  } catch (e) {
    setMessage(
      t('components.trails.contributions.error.updateHighlight'),
      'red',
      true,
    );
    if (trailStore.trail?.id !== undefined)
      trailStore.loadTrailData(trailStore.trail.id);
  }
};

const showContribution = (contribution: contributionType) => {
  const element = document.getElementById(
    `${contribution.title}-${contribution.id}`,
  );
  const section = element?.getAttribute('section');
  if (section) {
    navigateToSection(parseInt(section));
  }
};

const goToContributions = () => {
  navigateTo({
    path: `/courses/${learningPlanId.value}/trails/${trailId.value}/contributions`,
    query: { openModal: 'true' },
  });
};

const handlePositions = (contributions) => {
  contributions.forEach(async (contribution, index) => {
    const contributionData = trailStore.trail?.contributions.find(
      (c) => c.id === contribution.id,
    );
    if (!contributionData) return;
    contributionData.highlighted_order = index + 1;
    await update('trail-contributions', contribution.id, {
      highlighted_order: contributionData.highlighted_order,
    });
  });
};

const loadEditor = async () => {
  if (!editor.value || !editorData.value) return;
  const res = await editor.value.loadEditor({
    blocks: editorData.value.blocks,
  });
  if (res.success) {
    trailStore.trail?.structures.push({
      time: editorData.value.time,
      version: res.data.version,
      blocks: res.data.blocks,
      id: res.data.id,
      trail: trailId.value,
    });
  } else {
    setMessage(t('pages.trailId.overview.loadError'), 'error', true);
  }
};

const saveData = async () => {
  saveLoading.value = true;
  try {
    const res = await editor.value.getData();
    if (!res.success) {
      setMessage(t('pages.trailId.overview.saveError'), 'error', true);
      return;
    }
    await create('structures', {
      time: Date.now(),
      version: res.data.version,
      blocks: res.data.blocks,
      trail: trailId.value,
    });
    trailStore.trail?.structures.push({
      time: Date.now(),
      version: res.data.version,
      blocks: res.data.blocks,
      trail: trailId.value,
    });
    toggleReadOnly();
  } catch (e) {
    setMessage(t('pages.trailId.overview.saveError'), 'error', true);
  } finally {
    saveLoading.value = false;
  }
};

const resetData = async () => {
  if (!backUpEditorData.value.blocks.length) {
    editor.value.clearEditor();
  } else {
    editorData.value = JSON.parse(JSON.stringify(backUpEditorData.value));
    await loadEditor();
  }

  toggleReadOnly();
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const checkEditorReady = async () => {
  let attempts = 0;
  while (attempts < 10) {
    try {
      await editor.value.isReady;
      return true;
    } catch (error) {
      await sleep(100);
      attempts++;
    }
  }
  return false;
};

const timeStampToDate = (timeStamp: number) => {
  const date = new Date(timeStamp);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const pageHeight = ref(0);
const activeSection = ref(0);

const handleIntersection = (entries) => {
  entries.forEach((entry) => {
    const entrySection = parseInt(entry.target.getAttribute('section'));
    if (activeSection.value !== entrySection && entry.isIntersecting) {
      activeSection.value = entrySection;
    }
  });
};

let observer;

const setObserver = () => {
  if (observer) {
    observer.disconnect();
  }

  const observerMargin = Math.floor(pageHeight.value / 2);

  const observerConfig = {
    rootMargin: `-${
      pageHeight.value % 2 === 0 ? observerMargin - 1 : observerMargin
    }px 0px -${observerMargin}px 0px`,
  };

  observer = new IntersectionObserver(handleIntersection, observerConfig);

  const elements = document.querySelectorAll('[section]');
  elements.forEach((element) => {
    observer.observe(element);
  });
};

pageHeight.value = window.innerHeight;
setObserver();

window.addEventListener('resize', () => {
  setTimeout(() => {
    pageHeight.value = window.innerHeight;
    setObserver();
  }, 300);
});
</script>

<style scoped lang="scss">
.pl-20 {
  padding-left: 80px;
}
.container-min-height {
  min-height: 436px;
  position: relative;
}

.empty-state-text {
  max-width: 314px;
}

.sections-container {
  max-width: 240px;
  position: -webkit-sticky;
  position: sticky;
  top: 88px;
  z-index: 1;
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}

.sections-col {
  position: absolute;
  right: 0;
}

.text-overflow {
  white-space: wrap !important;
  text-wrap: normal !important;
  overflow: auto !important;
}
.section-text {
  width: 240px;
  vertical-align: middle;
  cursor: pointer;
  border-left: 1px solid #d2d6da;
  transition: all 0.2s ease-in;
}
.section-text-default {
  &:hover {
    background-color: #ebedef;
    color: #30363b !important;
  }
  &:active {
    background-color: #d2d6da;
    color: #30363b !important;
  }
}

.contributions-container {
  border-top: 1px solid rgb(var(--v-theme-gray-100));
}

#editor-container {
  container-type: inline-size;
  container-name: editor;
  padding-bottom: 100px;
}

.sticky-buttons {
  position: -webkit-sticky;
  position: sticky;
  top: 88px;
  z-index: 1;
}

.user-card {
  display: none;
  position: absolute;
  z-index: 1;
  bottom: 30px;
  &:hover {
    display: block;
  }
}

.user-avatar {
  padding: 4px 0px 4px 0px;
}

.user-avatar:hover ~ .user-card {
  display: block !important;
}

@container editor (max-width: 1310px) {
  .sections-container {
    opacity: 0;
  }
  .sticky-buttons {
    position: static;
  }
}
</style>
