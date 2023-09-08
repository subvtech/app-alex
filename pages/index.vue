<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <app-editor :data="data"></app-editor>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import { Strapi4ResponseData } from '@nuxtjs/strapi/dist/runtime/types';
import { Structure } from '@/models/structure.model';

const data: Strapi4ResponseData<Structure> = {
  id: 1,
  meta: {},
  attributes: {
    version: 'v1',
    id: 1,
    time: 1,
    updatedAt: '2023-01-01',
    blocks: {
      meta: {},
      data: [],
    },
  },
};

definePageMeta({
  middleware: 'auth',
});
</script>
