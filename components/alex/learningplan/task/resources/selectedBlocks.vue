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
      <div v-else-if="legacyBlocks.length && editMode" class="resource-list">
        <div v-for="(block, index) in legacyBlocks" :key="block.id" class="resource-item">
          <v-checkbox
            :model-value="selectedLegacyIndexes.includes(index)"
            :label="resourceLabel(block)"
            hide-details
            density="compact"
            @update:model-value="toggleLegacyNode(index, $event)"
          />
          <AppEditor
            :key-id="`task-resource-${selectedTrail.id}-${block.id}`"
            :data="legacyBlockDocument(block)"
            read-only
          />
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
  blocks?: (BlockSimple | number)[];
  editMode?: boolean;
  savedTrailId?: number;
}

const props = withDefaults(defineProps<propsType>(), {
  blocks: () => [],
  editMode: false,
  savedTrailId: undefined,
});

const trailCover = computed(() => props.selectedTrail.cover_image?.url || '/images/cover_image_course.svg');
const isEditorLoading = ref(false);
const selectedNodeIndexes = ref<number[]>([]);
const selectedLegacyIndexes = ref<number[]>([]);
const { create } = useStrapiUtils();
const { t } = useI18n();
const editorData = computed(() => {
  const data = latestStructure.value;
  let content: any = data?.blocks;
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch {
      content = undefined;
    }
  }

  if (content?.data && typeof content.data === 'object') {
    content = content.data;
  }

  return {
    time: data && data.time ? parseInt(data.time.toString()) : 0,
    version: data?.version || '',
    content: content?.type === 'doc' && Array.isArray(content.content) ? content : { type: 'doc', content: [] },
  };
});

const latestStructure = computed(() => {
  const structures = props.selectedTrail?.structures || [];
  return structures[structures.length - 1];
});

const isTiptapDocument = computed(() => editorData.value.content.content.length > 0);
const trailNodes = computed(() => editorData.value.content.content || []);
const legacyBlocks = computed(() => {
  const blocks = latestStructure.value?.blocks;
  return Array.isArray(blocks)
    ? blocks.filter(
        (block): block is BlockSimple =>
          typeof block === 'object' &&
          block !== null &&
          typeof block.id === 'number' &&
          typeof block.type === 'string' &&
          'data' in block,
      )
    : [];
});
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

const taskBlockIds = computed(() => {
  const blocks = Array.isArray(props.blocks) ? props.blocks : [];
  return new Set(
    blocks
      .map((block) => (typeof block === 'object' && block !== null && 'id' in block ? block.id : block))
      .filter((id): id is number => typeof id === 'number'),
  );
});

watch(
  [trailNodes, () => props.blocks, () => props.editMode, () => props.savedTrailId, () => props.selectedTrail.id],
  () => {
    const taskBlocks = Array.isArray(props.blocks) ? props.blocks : [];
    const hasSavedSelection = trailNodes.value.some((node) =>
      taskBlocks.some(
        (block) => typeof block === 'object' && block !== null && 'data' in block && blockDataMatches(block, node),
      ),
    );
    const selectAllByDefault = props.savedTrailId !== props.selectedTrail.id;

    selectedNodeIndexes.value = trailNodes.value.reduce<number[]>((selected, node, index) => {
      const isSelected = hasSavedSelection
        ? taskBlocks.some((block) => typeof block === 'object' && block !== null && blockDataMatches(block, node))
        : selectAllByDefault;
      if (isSelected) {
        selected.push(index);
      }
      return selected;
    }, []);
  },
  { immediate: true },
);

watch(
  [legacyBlocks, () => props.blocks, () => props.savedTrailId, () => props.selectedTrail.id],
  () => {
    const hasSavedSelection = legacyBlocks.value.some((block) => taskBlockIds.value.has(block.id));
    const selectAllByDefault = props.savedTrailId !== props.selectedTrail.id;
    selectedLegacyIndexes.value = legacyBlocks.value.reduce<number[]>((selected, block, index) => {
      const isSelected = hasSavedSelection ? taskBlockIds.value.has(block.id) : selectAllByDefault;
      if (isSelected) {
        selected.push(index);
      }
      return selected;
    }, []);
  },
  { immediate: true },
);

const nodeKey = (node: Record<string, any>, index: number) => node.attrs?.id || `${node.type}-${index}`;
const nodeDocument = (node: Record<string, any>) => ({ type: 'doc', content: [node] });
const legacyBlockDocument = (block: BlockSimple) => ({
  time: editorData.value.time,
  version: editorData.value.version,
  blocks: [{ type: block.type, data: block.data }],
});
const resourceLabel = (node: Record<string, any> | BlockSimple) => {
  let type = node.type;
  if (type === 'mediaUpload' && 'attrs' in node) type = node.attrs?.format || type;
  if (type === 'embed') type = 'video';
  if (type === 'header') type = 'heading';
  if (type === 'quote') type = 'blockquote';
  if (type === 'code') type = 'codeBlock';
  return t(`components.learningPlan.drawer.task.learningResources.types.${type}`, type);
};

const toggleNode = (index: number, selected: boolean | null) => {
  selectedNodeIndexes.value = selected
    ? [...new Set([...selectedNodeIndexes.value, index])]
    : selectedNodeIndexes.value.filter((selectedIndex) => selectedIndex !== index);
};

const toggleLegacyNode = (index: number, selected: boolean | null) => {
  selectedLegacyIndexes.value = selected
    ? [...new Set([...selectedLegacyIndexes.value, index])]
    : selectedLegacyIndexes.value.filter((selectedIndex) => selectedIndex !== index);
};

onMounted(() => {
  isEditorLoading.value = false;
});

const getSelectedBlocks = () => {
  if (!isTiptapDocument.value) {
    if (legacyBlocks.value.length) {
      return selectedLegacyIndexes.value.map((index) => legacyBlocks.value[index]);
    }
    const blocks = latestStructure.value?.blocks;
    return Array.isArray(blocks) ? blocks : [];
  }

  return Promise.all(
    selectedNodeIndexes.value.map(async (index) => {
      const node = trailNodes.value[index];
      const existingBlock = (Array.isArray(props.blocks) ? props.blocks : []).find(
        (block): block is BlockSimple =>
          typeof block === 'object' && block !== null && 'data' in block && blockDataMatches(block, node),
      );
      if (existingBlock) return existingBlock;

      const createdBlock = await create<BlockSimple>('blocks', {
        type: node.type,
        data: node,
        order: index,
        tunes: {},
        structure: latestStructure.value?.id,
      } as Partial<BlockSimple>);
      return createdBlock.data;
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
