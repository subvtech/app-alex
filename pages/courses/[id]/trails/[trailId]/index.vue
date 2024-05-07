<template>
  <div class="fill-height d-flex ga-3 flex-column">
    <div
      id="editor-container"
      class="bg-white rounded w-100 container-min-height"
    >
      <div
        id="Início"
        section="0"
        class="d-flex justify-end px-6 pt-6"
        :class="!readOnly ? 'sticky-buttons' : ''"
      >
        <alex-custom-button
          v-if="
            readOnly &&
            learningPlanStore.userIsFacilitator &&
            !trailStore.loading
          "
          variant="primary"
          size="large"
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
          style="max-width: 700px; min-height: 500px"
          class="w-100"
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
        <div style="width: 800px">
          <p
            v-show="readOnly && editorData.time"
            style="max-width: 700px"
            class="text-gray-500 text-body-3 mb-4 mx-auto"
          >
            {{ $t('pages.trailId.overview.lastUpdated') }}
            {{ timeStampToDate }}
          </p>
          <AppEditor ref="editor" :data="editorData" />
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
                    @click="navigateToSection(section.title)"
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
const { create } = useStrapi();
const route = useRoute();
const { setMessage } = useMessageStore();
const trailStore = useTrailStore();
const trailId = computed(() => parseInt(route.params?.trailId.toString()));
useHeaderTrails('');
const learningPlanStore = useLearningPlanStore();

definePageMeta({
  hideLearningPlanBanner: true,
});

const saveLoading = ref(false);
const readOnly = ref(true);
const editor = ref();
const isLoading = ref(false);
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
onMounted(async () => {
  isLoading.value = true;
  while (trailStore.loading) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  if (editorData.value.blocks.length) {
    if (await checkEditorReady()) {
      readOnly.value = false;
      await loadEditor();
      toggleReadOnly('save');
    } else {
      setMessage(t('pages.trailId.overview.loadError'), 'green', true);
    }
  }
  isLoading.value = false;
});
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

const toggleReadOnly = async (mode: string | '') => {
  readOnly.value = !readOnly.value;
  if (editor.value && editorData.value.blocks.length) {
    await editor.value.toggleReadOnly(mode);
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
    const element = document.querySelector(`[data-id="${block.id}"]`);
    if (element) {
      element.setAttribute('section', String(newSections.length - 1));
    }
  });
  sections.value = newSections;
};

const navigateToSection = (title: string) => {
  if (title === 'Início') {
    const element = document.getElementById(title);
    if (element) {
      element.scrollIntoView({
        block: 'end',
        inline: 'nearest',
        behavior: 'smooth',
      });
    }
  } else editor.value.navigateToId(title);
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
    toggleReadOnly('save');
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

  toggleReadOnly('cancel');
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

const timeStampToDate = computed(() => {
  const date = new Date(editorData.value.time);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
});

const pageHeight = ref(0);
const activeSection = ref(0);

const handleIntersection = (entries) => {
  entries.forEach((entry) => {
    const entrySection = parseInt(entry.target.getAttribute('section'));
    if (activeSection.value !== entrySection && entry.isIntersecting) {
      if (entry.target.id === 'Início') return (activeSection.value = 0);
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

  editorData.value.blocks.forEach((section) => {
    const element = document.querySelector(`[data-id="${section.id}"]`);
    if (element) {
      observer.observe(element);
    }
  });

  const startSection = document.getElementById('Início');
  if (startSection) {
    observer.observe(startSection);
  }
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
  transition:
    opacity 200ms,
    display 200ms;
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

#editor-container {
  container-type: inline-size;
  container-name: editor;
}

@keyframes slideaway {
  from {
    display: block;
  }
  to {
    transform: translateX(40px);
    opacity: 0;
  }
}

@keyframes slidein {
  from {
    transform: translateX(40px);
    opacity: 0;
  }
  to {
    display: block;
  }
}

.sticky-buttons {
  position: -webkit-sticky;
  position: sticky;
  top: 88px;
  z-index: 1;
}

@container editor (max-width: 1330px) {
  .sections-container {
    animation: slideaway 200ms;
    display: none;
  }
  .sticky-buttons {
    position: static;
  }
}
@container editor (min-width: 1310px) {
  .sections-container {
    animation: slidein 200ms;
    display: block;
  }
}
</style>
