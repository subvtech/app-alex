<template>
  <div class="w-100">
    <div class="d-flex align-center w-100 bg-gray-200 rounded-t">
      
      <alex-custom-tabs
        v-if="showCode"
        v-model="activePage"
        class="w-100"
        :tabs="tabs"
        :color="'black'"
        hide-slider
      />
     
      <div class="d-flex justify-end w-100 pa-2 gap-3" color="black">
        <alex-documentation-buttons-copy
          :text="templates[parseInt(activePage)]"
          rounded
        />
        <alex-documentation-buttons-tooltip
          :tooltip-text="'script'"
          @click:button="showCode = !showCode"
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
      :templates="templates"
    />
  </div>
</template>
<script setup lang="ts">
import { TabType } from '@/components/alex/custom/Tabs.vue';

export interface ExampleType {
  template: string;
  label: string;
}

const props = defineProps({
  examples: {
    type: Array as PropType<ExampleType[]>,
    required: true,
  },
});
const { examples } = toRefs(props);
const activePage = ref('1');
const showCode = ref(false);

const tabs = computed<TabType[]>(() =>
  examples.value.map((item, index) => ({
    value: index.toString(),
    label: item.label,
  })),
);

const templates = computed<string[]>(() =>
  examples.value.map((item) => item.template),
);
</script>

<style scoped lang="scss"></style>
