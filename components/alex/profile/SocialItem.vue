<template>
  <a
    class="d-flex flex-row align-center justify-space-between pointer w-100 overflow-hidden text-decoration-none"
    :href="absolutePath(contentData?.url)"
    target="_blank"
  >
    <div class="mr-4 icon-border">
      <img :src="icon" />
    </div>

    <span class="text-body-3 text-gray-600 text-overflow" data-testid="text">
      <span>{{ toUpperCase(' ' + title) }}</span>
    </span>
    <v-spacer />

    <v-icon class="ml-4" size="24px" icon="mdi-chevron-right" color="#8291A1" />
  </a>
</template>
<script setup lang="ts">
import { AccordionItemType } from '@/components/alex/custom/Accordion.vue';

export interface SocialItemComponentType extends AccordionItemType{};

withDefaults(defineProps<SocialItemComponentType>(), {});

const absolutePath = (url: string, https = true) => {
  if (!url) return;
  const regex = /^https?:\/\//;

  if (regex.test(url)) return url;

  const protocol = https ? 'https://' : 'http://';

  return protocol + url;
};

const toUpperCase = (str: string) => str.toUpperCase();
</script>
