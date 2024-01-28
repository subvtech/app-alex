<template>
  <div class="w-100 max-w-250">
    <div class="w-100 mb-3">
      <h2 v-if="title" class="text-h3 text-gray-800">{{ title }}</h2>
      <p v-if="description" class="text-subtitle-1 text-gray-500">
        {{ description }}
      </p>
    </div>
    <div class="d-flex align-center w-100 bg-gray-200 rounded-t">
      <alex-custom-tabs
        v-if="!isShowingComponent"
        v-model="activePage"
        class="w-100"
        :tabs="tabs"
        :color="'black'"
        hide-slider
      />
      <div class="d-flex justify-end w-100 pa-2 gap-3" color="black">
        <alex-documentation-buttons-copy
          :disabled="isShowingComponent"
          :text="snippets[parseInt(activePage)]?.template"
          rounded
        />
        <alex-documentation-buttons-tooltip
          v-if="hasExample"
          :tooltip-text="showCode ? 'script' : 'component'"
          @click:button="toggleShowCode"
          size="large"
          variant="text"
          :icon="showCode ? 'mdi-chevron-up' : 'mdi-code-tags'"
          :input-value="showCode"
          rounded
        />
      </div>
    </div>
    <alex-documentation-prism-highlighter
      :active-page="activePage"
      :templates="snippets"
      :has-example="hasExample"
    >
      <template v-slot:example>
        <slot name="component" />
      </template>
    </alex-documentation-prism-highlighter>
  </div>
</template>
<script setup lang="ts">
import { TabType } from '@/components/alex/custom/Tabs.vue';
import { HighlightItemType } from '@/components/alex/documentation/prism/Highlighter.vue';

export interface ExampleItemType extends HighlightItemType {
  label: string;
}

export interface ExampleComponentType {
  snippets: ExampleItemType[];
  title?: string;
  description?: string;
  hasExample: boolean;
}
const props = withDefaults(defineProps<ExampleComponentType>(), {
  hasExample: false,
});

const { snippets, hasExample } = toRefs(props);
const activePage = ref(snippets.value.length.toString());
const showCode = ref(false);
const toggleShowCode = () => {
  activePage.value = snippets.value.length.toString();
  showCode.value = !showCode.value;
};

const isShowingComponent = computed(
  () =>
    activePage.value === snippets.value.length.toString() &&
    hasExample.value &&
    showCode.value,
);

const tabs = computed<TabType[]>(() =>
  snippets.value.map((item, index) => ({
    value: index.toString(),
    label: item.label,
  })),
);
</script>

<style scoped lang="scss">
.max-w-250 {
  max-width: 1000px;
}
</style>
