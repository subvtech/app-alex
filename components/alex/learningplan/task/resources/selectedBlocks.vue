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
      <div v-else-if="isTiptapDocument && editMode" class="resource-list">
        <div v-for="(node, index) in trailNodes" :key="nodeKey(node, index)" class="resource-item">
          <v-checkbox
            :model-value="selectedNodeIndexes.includes(index)"
            :label="resourceLabel(node)"
            hide-details
            density="compact"
            @update:model-value="toggleNode(index, $event)"
          />
          <Tiptap :model-value="nodeDocument(node)" :edit="false" :collaboration="false" no-padding />
        </div>
      </div>
      <Tiptap
        v-else-if="isTiptapDocument"
        :model-value="selectedDocument"
        :edit="false"
        :collaboration="false"
        no-padding
      />
      <Tiptap
        v-else
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
const selectedNodeIndexes = ref<number[]>([]);
const { create } = useStrapiUtils();
const { t } = useI18n();
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

const isTiptapDocument = computed(() => editorData.value.content.content.length > 0);
const trailNodes = computed(() => editorData.value.content.content || []);
const selectedDocument = computed(() => {
  const selectedBlocks = Array.isArray(props.blocks) ? props.blocks : [];
  const selectedNodes = selectedBlocks
    .filter((block): block is BlockSimple => typeof block === 'object' && block !== null && 'data' in block)
    .map((block) => block.data)
    .filter((node) => node && typeof node === 'object' && typeof node.type === 'string');

  return { type: 'doc', content: selectedNodes };
});

const blockDataMatches = (block: BlockSimple, node: Record<string, any>) => {
  return JSON.stringify(block.data) === JSON.stringify(node);
};

watch(
  [trailNodes, () => props.blocks, () => props.editMode],
  () => {
    const taskBlocks = Array.isArray(props.blocks) ? props.blocks : [];
    const hasSavedSelection = trailNodes.value.some((node) =>
      taskBlocks.some(
        (block) => typeof block === 'object' && block !== null && 'data' in block && blockDataMatches(block, node),
      ),
    );

    selectedNodeIndexes.value = trailNodes.value.reduce<number[]>((selected, node, index) => {
      if (
        hasSavedSelection
          ? taskBlocks.some((block) => typeof block === 'object' && block !== null && blockDataMatches(block, node))
          : true
      ) {
        selected.push(index);
      }
      return selected;
    }, []);
  },
  { immediate: true },
);

const nodeKey = (node: Record<string, any>, index: number) => node.attrs?.id || `${node.type}-${index}`;
const nodeDocument = (node: Record<string, any>) => ({ type: 'doc', content: [node] });
const resourceLabel = (node: Record<string, any>) => {
  const type = node.type === 'mediaUpload' ? node.attrs?.format || node.type : node.type;
  return t(`components.learningPlan.drawer.task.learningResources.types.${type}`, type);
};

const toggleNode = (index: number, selected: boolean | null) => {
  selectedNodeIndexes.value = selected
    ? [...new Set([...selectedNodeIndexes.value, index])]
    : selectedNodeIndexes.value.filter((selectedIndex) => selectedIndex !== index);
};

onMounted(() => {
  isEditorLoading.value = false;
});

const getSelectedBlocks = () => {
  const blocks = props.selectedTrail.structures[props.selectedTrail.structures.length - 1]?.blocks;
  if (!isTiptapDocument.value) {
    return Array.isArray(blocks) ? blocks.map((block) => block.id) : [];
  }

  return Promise.all(
    selectedNodeIndexes.value.map(async (index) => {
      const node = trailNodes.value[index];
      const existingBlock = (Array.isArray(props.blocks) ? props.blocks : []).find(
        (block): block is BlockSimple =>
          typeof block === 'object' && block !== null && 'data' in block && blockDataMatches(block, node),
      );
      if (existingBlock) return existingBlock.id;

      const structure = props.selectedTrail.structures[props.selectedTrail.structures.length - 1];
      const createdBlock = await create<BlockSimple>('blocks', {
        type: node.type,
        data: node,
        order: index,
        tunes: {},
        structure: structure?.id,
      } as Partial<BlockSimple>);
      return createdBlock.data.id;
    }),
  );
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
.resource-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.resource-item {
  border: 1px solid rgb(var(--v-theme-gray-200));
  border-radius: 8px;
  padding: 8px 12px;
}
.trail-img {
  background-position: center;
}
.header-border {
  border-bottom: 1px solid rgb(var(--v-theme-gray-100));
}
</style>
