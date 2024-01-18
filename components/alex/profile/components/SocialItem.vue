<template>
  <a
    v-for="item in socials"
    class="d-flex flex-row align-center justify-space-between pointer w-100 overflow-hidden text-decoration-none"
    :href="item.contentData?.url"
    target="_blank"
  >
    <div class="mr-4 icon-border">
      <img :src="item.icon" />
    </div>

    <span class="text-body-3 text-gray-600 text-overflow" data-testid="text">
      <span>{{ ' ' + item.title }}</span>
    </span>
    <v-spacer></v-spacer>

    <v-icon class="ml-4" size="24px" icon="mdi-chevron-right" color="#8291A1" />
  </a>
</template>
<script setup lang="ts">
import { AccordionItemType } from '../../custom/Accordion.vue';

defineProps({
  socials: { type: Array as PropType<AccordionItemType[]>, default: [] },
});
</script>
