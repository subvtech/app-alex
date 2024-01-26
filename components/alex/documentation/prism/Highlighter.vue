<template>
  <v-window v-model="activePage" class="w-100">
    <v-window-item
      v-for="(item, index) in templates"
      :value="index"
      :key="index"
    >
      <div class="bg-grey-lighten-5 pa-3">
        <prism class="bg-grey-lighten-5">
          {{ item.template }}
        </prism>
      </div>
    </v-window-item>
    <v-window-item
      v-if="hasExample && templates.length.toString() === activePage"
      class="d-flex w-100 justify-center bg-gray-300"
      :value="templates.length"
    >
      <div class="w-75 gray-300">
        <slot name="example" />
      </div>
    </v-window-item>
  </v-window>
</template>
<script setup lang="ts">
import 'prismjs';
import 'prismjs/themes/prism.css';
import Prism from 'vue-prism-component';

export interface HighlightItemType {
  template: string;
}

const props = defineProps({
  activePage: {
    type: String,
    required: true,
  },
  templates: {
    type: Array as PropType<HighlightItemType[]>,
    required: true,
  },

  hasExample: {
    type: Boolean,
    default: false,
  },
});
const { activePage } = toRefs(props);
</script>
