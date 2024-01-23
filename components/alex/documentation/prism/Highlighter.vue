<template>
  <v-window v-model="activePage" class="w-100">
    <v-window-item v-for="(item, index) in templates" :value="index">
      <div class="bg-grey-lighten-5 pa-3" style="position: relative">
        <prism class="bg-grey-lighten-5">
          {{ item }}
        </prism>
      </div>
    </v-window-item>
    <v-window-item v-if="hasExample" :value="templates.length">
      <slot name="example" />
    </v-window-item>
  </v-window>
</template>
<script setup lang="ts">
import 'prismjs';
import 'prismjs/themes/prism.css';
import Prism from 'vue-prism-component';
const props = defineProps({
  activePage: {
    type: String,
    required: true,
  },
  templates: {
    type: Array as PropType<String[]>,
    required: true,
  },

  hasExample: {
    type: Boolean,
    default: false,
  },
});
const { activePage } = toRefs(props);
</script>
