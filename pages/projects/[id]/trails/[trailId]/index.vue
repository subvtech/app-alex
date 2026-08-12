<template>
  <div class="fill-height d-flex ga-3 flex-column">
    <alex-learningplan-trails-contributions-side-bar
      :model-value="sidebar"
      :contributions="highlightedContributionsSimple"
      :is-professor="canEdit"
      @show-contribution="showContribution"
      @remove-highlight="removeContributionHighlight"
      @update:model-value="(value) => (sidebar = value)"
      @dragged:items="(value) => handlePositions(value)"
    />
    <div id="editor-container" class="bg-white rounded w-100 container-min-height">
      <div section="0" class="d-flex justify-end px-6 pt-6" :class="!readOnly ? 'sticky-buttons' : ''">
        <alex-custom-button
          v-if="readOnly && !trailStore.loading && highlightedContributionsSimple.length"
          icon="mdi-text-box-outline"
          variant="secondary"
          size="large"
          @click="sidebar = !sidebar"
        />
        <alex-custom-button
          v-if="readOnly && canEdit && !trailStore.loading"
          variant="primary"
          size="large"
          class="ml-2"
          prepend-icon="mdi-pencil-outline"
          @click="toggleReadOnly"
          >{{ $t('pages.trailId.overview.editBtn') }}</alex-custom-button
        >
        <div v-else-if="canEdit && !isLoading">
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
      <div v-if="!showEditor && readOnly" class="d-flex fill-height align-center justify-center container-min-height">
        <div v-if="trailStore.loading || isLoading" class="w-100 max-w-175 min-h-125">
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
            <alex-custom-skeleton color="gray-300" type="list-item" class="w-100 height-80 mt-10" rounded="lg" />
          </div>
        </div>
        <div v-else>
          <img src="public/images/emptyTrail.svg" />
          <p class="text-gray-400 text-h3 empty-state-text text-center">
            {{ $t('pages.trailId.overview.emptyState') }}
          </p>
        </div>
      </div>
      <div v-else class="container-min-height justify-center ma-6 align-start d-flex">
        <div style="width: 800px">
          <p v-show="readOnly && editorData.time" class="text-gray-500 text-body-3 mb-4 mx-auto max-width-187">
            {{ $t('pages.trailId.overview.lastUpdated') }}
            {{ timeStampToDate(editorData.time) }}
          </p>
          <Tiptap
            ref="editor"
            @update:model-value="onTiptapUpdate"
            :edit="!readOnly"
            :doc-name="`trail-${trailId}`"
            :collaboration="true"
          />
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
                <Tiptap :ref="(el) => setContributionRef(el, contribution.id)" :edit="false" :collaboration="false" />
              </div>
            </div>
            <div v-if="!canEdit" class="w-100 pt-12 d-flex justify-center align-center contributions-container">
              <alex-custom-button
                v-if="!isGuest"
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
                      activeSection == index ? 'text-accent bg-gray-blue' : 'text-gray-600 section-text-default',
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
import { ref, onMounted, computed } from 'vue';
import { contributionType } from '~/pages/projects/[id]/trails/[trailId]/contributions.vue';
import Tiptap from '~/components/TipTap/index.vue';
import { convertEditorJsBlocksToTiptap, isEditorJsFormat } from '~/utils/convertEditorJsToTiptap';

definePageMeta({
  hideLearningPlanBanner: true,
});
useHeaderTrails('', '', true);

const { update, create } = useStrapi();
const { setMessage } = useMessageStore();
const { t } = useI18n();
const route = useRoute();
const trailStore = useTrailStore();
const user = useStrapiUser();
const trailId = computed(() => parseInt(route.params?.trailId.toString()));
const learningPlanStore = useLearningPlanStore();
const learningPlanId = computed(() => parseInt(route.params?.id.toString()));
const saveLoading = ref(false);
const editor = ref();
const isLoading = ref(false);
const sidebar = ref(false);
const backUpEditorData = ref({});
const tiptapContent = ref<Record<string, any>>({});
const contributionRefs = ref<Record<string, any>>({});
const readOnly = ref(true);

const setContributionRef = (el: any, id: number) => {
  if (el) {
    contributionRefs.value[`contribution-${id}`] = el;
  }
};

const defaultTipTapDocument = () => ({
  type: 'doc',
  content: [{ type: 'paragraph' }],
});

const parseMaybeJson = (value: any) => {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const getValidTiptapContent = (value: any) => {
  const parsed = parseMaybeJson(value);

  if (parsed && typeof parsed === 'object' && parsed.type === 'doc' && Array.isArray(parsed.content)) {
    return parsed;
  }

  const nestedBlocks = parseMaybeJson(parsed?.blocks);
  if (
    nestedBlocks &&
    typeof nestedBlocks === 'object' &&
    nestedBlocks.type === 'doc' &&
    Array.isArray(nestedBlocks.content)
  ) {
    return nestedBlocks;
  }

  return defaultTipTapDocument();
};

const onTiptapUpdate = (val: Record<string, any>) => {
  tiptapContent.value = val;
};

const editorData = computed(() => {
  const data = trailStore.trail?.structures[trailStore.trail?.structures.length - 1];
  return {
    time: data && data.time ? parseInt(data.time.toString()) : 0,
    version: data?.version || '',
    blocks: getValidTiptapContent(data?.blocks),
  };
});

const showEditor = computed(() => {
  const currentBlocks = editorData.value.blocks as any;
  const currentContent = tiptapContent.value as any;
  return (
    !trailStore.loading && (!!currentBlocks?.content?.length || !!currentContent?.content?.length || !readOnly.value)
  );
});

const canEdit = computed<boolean>(() => {
  const learningStructure = trailStore.trail?.learning_structure as any;
  const isAuthor = learningStructure?.author_member?.user?.id === (user.value?.id ?? null);

  if (isAuthor) {
    return true;
  }

  const isPartner = trailStore.trail?.partners.some((partner) => partner.user.id === (user.value?.id ?? null));

  return !!isPartner;
});

const highlightedContributions = computed(() => {
  return trailStore.trail?.contributions
    .filter((contribution) => contribution.highlighted)
    .sort((a, b) => (a.highlighted_order > b.highlighted_order ? 1 : -1))
    .map((contribution) => {
      const contributionContent = getValidTiptapContent(contribution.contribution?.blocks ?? contribution.contribution);
      return {
        id: contribution.id,
        title: contribution.title,
        contribution: contributionContent,
        time: contribution.contribution?.time || 0,
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
      time: contribution.time,
    };
  });
});

onMounted(async () => {
  learningPlanStore.loadLearningPlan(+route.params.id).then(() => {
    isGuest.value =
      !learningPlanStore.userIsFacilitator &&
      !learningPlanStore.userIsActiveMember &&
      !learningPlanStore.userIsPendingMember;
  });

  isLoading.value = true;
  while (trailStore.loading) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  if (editorData.value.blocks) {
    loadEditor();
  }
  isLoading.value = false;
});

const isGuest = ref<boolean>(true);
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
  if (title?.length >= 29) return true;
  return false;
};

const toggleReadOnly = () => {
  readOnly.value = !readOnly.value;

  if (!readOnly.value) {
    backUpEditorData.value = JSON.parse(JSON.stringify(tiptapContent.value));
    if (observer) observer.disconnect();

    setTimeout(() => {
      if (editor.value) {
        editor.value.setContent(tiptapContent.value);
      }
    }, 300);
  } else {
    setTimeout(() => {
      if (editor.value) {
        editor.value.setContent(tiptapContent.value);
      }
      setSections();
      setObserver();
    }, 300);
  }
};

const assignSectionAttributes = () => {
  const headings = document.querySelectorAll('.tiptap h1, .tiptap h2, .tiptap h3, .tiptap h4, .tiptap h5, .tiptap h6');
  let sectionIndex = 1;
  headings.forEach((heading) => {
    heading.setAttribute('section', String(sectionIndex));
    sectionIndex++;
  });

  highlightedContributions.value?.forEach((contribution) => {
    const contributionSection = document.getElementById(`${contribution.title}-${contribution.id}`);
    if (contributionSection) {
      contributionSection.setAttribute('section', String(sectionIndex));
      sectionIndex++;
    }
  });
};

const setSections = () => {
  const newSections = [
    {
      title: t('pages.trailId.overview.sectionTitle'),
      type: 1,
      active: true,
    },
  ];

  const contentArray = tiptapContent.value?.content || [];

  contentArray.forEach((node: any) => {
    if (node.type === 'heading') {
      const text = node.content?.map((n: any) => n.text).join('') || '';
      newSections.push({
        title: text,
        type: node.attrs?.level || 2,
        active: false,
      });
    }
  });

  highlightedContributions.value?.forEach((contribution) => {
    newSections.push({
      title: contribution.title,
      type: 3,
      active: false,
    });
  });

  sections.value = newSections;

  setTimeout(() => {
    assignSectionAttributes();
  }, 0);
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
    const contribution = trailStore.trail?.contributions.find((contribution) => contribution.id === id);
    if (!contribution) throw new Error('Contribution not found');
    contribution.highlighted = false;
    await update('trail-contributions', contribution.id, {
      highlighted: contribution.highlighted,
      blocked: false,
    });
  } catch (e) {
    setMessage(t('components.trails.contributions.error.updateHighlight'), 'red', true);
    if (trailStore.trail?.id !== undefined) trailStore.loadTrailData(trailStore.trail.id);
  }
};

const showContribution = (contribution: contributionType) => {
  const element = document.getElementById(`${contribution.title}-${contribution.id}`);
  const section = element?.getAttribute('section');
  if (section) {
    navigateToSection(parseInt(section));
  }
};

const goToContributions = () => {
  navigateTo({
    path: `/projects/${learningPlanId.value}/trails/${trailId.value}/contributions`,
    query: { openModal: 'true' },
  });
};

const handlePositions = (contributions) => {
  contributions.forEach(async (contribution, index) => {
    const contributionData = trailStore.trail?.contributions.find((c) => c.id === contribution.id);
    if (!contributionData) return;
    await update('trail-contributions', contribution.id, {
      highlighted_order: index + 1,
    });
  });
};

const loadEditor = () => {
  const rawBlocks = editorData.value.blocks;

  // Detecta formato antigo (Editor.js) e converte em memória para ProseMirror JSON
  if (isEditorJsFormat(rawBlocks)) {
    console.info('[loadEditor] Formato Editor.js detectado em trilha de projeto, convertendo para Tiptap...');
    tiptapContent.value = convertEditorJsBlocksToTiptap(rawBlocks);
  } else {
    tiptapContent.value = getValidTiptapContent(rawBlocks);
  }

  setTimeout(() => {
    if (editor.value) {
      editor.value.setContent(tiptapContent.value);
    }

    highlightedContributions.value?.forEach((contribution) => {
      const comp = contributionRefs.value[`contribution-${contribution.id}`];
      if (comp) {
        // Contribuições antigas também podem estar em formato Editor.js
        const rawContribution = contribution.contribution;
        if (isEditorJsFormat(rawContribution)) {
          comp.setContent(convertEditorJsBlocksToTiptap(rawContribution));
        } else {
          comp.setContent(getValidTiptapContent(rawContribution));
        }
      }
    });

    setSections();
  }, 300);
};

const saveData = async () => {
  saveLoading.value = true;

  try {
    const contentToSave = tiptapContent.value;

    console.log('Content to save: ', contentToSave);

    const structurePayload: any = {
      time: Date.now(),
      version: 'tiptap-1.0',
      blocks: contentToSave,
      trail: trailId.value,
    };

    await create('structures', structurePayload);

    if (trailStore.trail?.id) {
      await trailStore.loadTrailData(trailStore.trail.id);
    }

    toggleReadOnly();
  } catch (e) {
    setMessage(t('pages.trailId.overview.saveError'), 'error', true);
  } finally {
    saveLoading.value = false;
  }
};

const resetData = () => {
  tiptapContent.value = JSON.parse(JSON.stringify(backUpEditorData.value));
  readOnly.value = true;

  setTimeout(() => {
    if (editor.value) {
      editor.value.setContent(tiptapContent.value);
    }
    setSections();
    setObserver();
  }, 300);
};

const timeStampToDate = (timeStamp: number) => {
  if (!timeStamp) return '';
  const date = new Date(timeStamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const pageHeight = ref(0);
const activeSection = ref(0);

const handleIntersection = (entries) => {
  entries.forEach((entry) => {
    const sectionAttr = entry.target.getAttribute('section');
    if (!sectionAttr) return;

    const entrySection = parseInt(sectionAttr);
    if (activeSection.value !== entrySection && entry.isIntersecting) {
      activeSection.value = entrySection;
    }
  });
};

let observer: IntersectionObserver;

const setObserver = () => {
  if (observer) {
    observer.disconnect();
  }

  const observerMargin = Math.floor(pageHeight.value / 2);

  const observerConfig = {
    rootMargin: `-${pageHeight.value % 2 === 0 ? observerMargin - 1 : observerMargin}px 0px -${observerMargin}px 0px`,
  };

  observer = new IntersectionObserver(handleIntersection, observerConfig);

  const elements = document.querySelectorAll('[section]');
  elements.forEach((element) => {
    observer.observe(element);
  });
};

onMounted(() => {
  pageHeight.value = window.innerHeight;
  setObserver();

  window.addEventListener('resize', () => {
    setTimeout(() => {
      pageHeight.value = window.innerHeight;
      setObserver();
    }, 300);
  });
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

.contributions-container {
  border-top: 1px solid rgb(var(--v-theme-gray-100));
}

#editor-container {
  container-type: inline-size;
  container-name: editor;
  padding-bottom: 100px;
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
