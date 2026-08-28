<template>
  <div class="bg-white" :class="{ 'rounded-b-lg': !editMode }">
    <div class="w-100 height-27 mb-6 d-flex ga-4 pa-6 header-border">
      <div
        class="trail-img width-15 height-15 rounded-lg tw-bg-cover"
        :style="`background-image: url('${trailCover}')`"
      />
      <div>
        <p class="text-gray-500 text-h5">
          {{ $t('components.learningPlan.drawer.task.learningResources.selected') }}
        </p>
        <p class="text-gray-800 text-h3">{{ selectedTrail.title }}</p>
      </div>
    </div>
    <div class="px-6 min-h-150">
      <alex-custom-skeleton v-if="isEditorLoading" class="w-100 height-150 bg-blue" color="gray-200" />
      <Tiptap
        :edit="false"
        :doc-name="`trail-${selectedTrail.id}`"
        :collaboration="true"
        show-loader
        :class="isEditorLoading ? 'tw-opacity-0' : ''"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Tiptap from '~/components/TipTap/index.vue';

interface propsType {
  selectedTrail: TrailSimple;
  blocks?: BlockSimple[] | number[];
  editMode?: boolean;
}

const props = withDefaults(defineProps<propsType>(), {
  blocks: () => [],
  editMode: false,
});

const trailCover = computed(() => props.selectedTrail.cover_image?.url || '/images/cover_image_course.svg');
const isEditorLoading = ref(false);
const editorData = computed(() => {
  const data = props.selectedTrail?.structures[props.selectedTrail?.structures.length - 1];
  let content: any = data?.blocks;
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch {
      content = undefined;
    }
  }

  return {
    time: data && data.time ? parseInt(data.time.toString()) : 0,
    version: data?.version || '',
    content: content?.type === 'doc' ? content : { type: 'doc', content: [] },
  };
});

onMounted(() => {
  isEditorLoading.value = false;
});

const getSelectedBlocks = () => {
  const blocks = props.selectedTrail.structures[props.selectedTrail.structures.length - 1]?.blocks;
  return Array.isArray(blocks) ? blocks.map((block) => block.id) : [];
};

const handleNewTrail = () => {
  return {
    success: 1,
    data: {
      version: 'tiptap-1.0',
      blocks: editorData.value.content,
    },
  };
};

defineExpose({
  getSelectedBlocks,
  handleNewTrail,
});
</script>

<style scoped>
.trail-img {
  background-position: center;
}
.header-border {
  border-bottom: 1px solid rgb(var(--v-theme-gray-100));
}
</style>
