<template>
  <div class="bg-white">
    <div class="w-100 height-27 mb-6 d-flex ga-4 pa-6 header-border">
      <div
        class="trail-img width-15 height-15 rounded-lg bg-cover"
        :style="`background-image: url('${trailCover}')`"
      />
      <div>
        <p class="text-gray-500 text-h5">
          {{
            $t('components.learningPlan.drawer.task.learningResources.selected')
          }}
        </p>
        <p class="text-gray-800 text-h3">{{ selectedTrail.title }}</p>
      </div>
    </div>
    <div class="px-6">
      <alex-custom-skeleton
        v-if="isEditorLoading"
        class="w-100 height-150 bg-blue"
        color="gray-200"
      />
      <app-editor
        ref="editor"
        :selected-blocks="selectMode ? blocksIds : undefined"
        :class="isEditorLoading ? 'opacity-0' : ''"
        @update:selected-blocks="(blocks) => (selectedBlocks = blocks)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface propsType {
  selectedTrail: TrailSimple;
  blocks?: BlockSimple[] | number[];
  selectMode?: boolean;
}

const props = withDefaults(defineProps<propsType>(), {
  blocks: () => [],
  selectMode: false,
});

const blocksIds = computed(() => {
  return props.blocks?.map((block) => {
    return block.id ? block.id : block;
  }) as number[];
});

const trailCover = computed(
  () =>
    props.selectedTrail.cover_image?.url || '/images/cover_image_course.svg',
);
const isEditorLoading = ref(false);
const editorData = computed(() => {
  const data =
    props.selectedTrail?.structures[props.selectedTrail?.structures.length - 1];
  return {
    time: data && data.time ? parseInt(data.time.toString()) : 0,
    version: data?.version || '',
    blocks:
      data?.blocks
        .filter(
          (block) => props.selectMode || blocksIds.value.includes(block.id),
        )
        .map((block) => ({
          type: block.type,
          data: block.data,
          tunes: block.tunes || {},
          id: block.id || '',
        })) || [],
  };
});

const editor = ref();
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

onMounted(async () => {
  if (editorData.value.blocks.length) {
    isEditorLoading.value = true;
    await checkEditorReady();
    await editor.value.loadEditor({
      blocks: editorData.value.blocks,
    });
    await editor.value.toggleReadOnly();
    isEditorLoading.value = false;
  }
});

const selectedBlocks = ref<String[]>([]);
const getSelectedBlocks = () => {
  return selectedBlocks.value;
};

const handleNewTrail = async () => {
  return await editor.value.getData();
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
