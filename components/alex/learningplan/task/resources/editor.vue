<template>
  <div class="w-100 height-15 mb-6 d-flex ga-4">
    <div
      class="trail-img width-15 height-15 rounded-lg bg-cover"
      :style="`background-image: url('${trailCover}')`"
    />
    <div>
      <p class="text-gray-500 text-h5">Trilha Selecionada</p>
      <p class="text-gray-800 text-h3">{{ selectedTrail.title }}</p>
    </div>
  </div>
  <alex-custom-skeleton
    v-if="isEditorLoading"
    class="w-100 height-150 bg-blue"
    color="gray-200"
  />
  <app-editor
    ref="editor"
    :select-blocks-mode="blocks"
    :class="isEditorLoading ? 'opacity-0' : ''"
    @update:selected-blocks="(blocks) => (selectedBlocks = blocks)"
  />
</template>

<script setup lang="ts">
interface propsType {
  selectedTrail: TrailSimple;
  blocks?: BlockSimple[];
}

const props = withDefaults(defineProps<propsType>(), {
  blocks: undefined,
});

const blocks = computed(() => {
  return props.blocks?.map((block) => {
    return block.id;
  });
});

const trailCover = computed(
  () =>
    props.selectedTrail.cover_image?.url || '/images/cover_image_course.svg',
);
const isEditorLoading = ref(true);
const editorData = computed(() => {
  const data =
    props.selectedTrail?.structures[props.selectedTrail?.structures.length - 1];
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
  isEditorLoading.value = true;
  await checkEditorReady();
  await editor.value.loadEditor({
    blocks: editorData.value.blocks,
  });
  await editor.value.toggleReadOnly();
  isEditorLoading.value = false;
});

const selectedBlocks = ref<String[]>([]);
const getSelectedBlocks = () => {
  return selectedBlocks.value;
};

defineExpose({
  getSelectedBlocks,
});
</script>

<style scoped>
.trail-img {
  background-position: center;
}
</style>
