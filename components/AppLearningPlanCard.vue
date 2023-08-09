<template>
  <v-hover v-slot="{ isHovering }">
    <v-card
      class="rounded-xl learningplan-card"
      :elevation="isHovering ? 3 : 0"
      nuxt
      :to="viewPlanUrl"
    >
      <v-row justify="center" dense class="rounded-xl pa-2">
        <v-img
          class="rounded-xl"
          :src="getImageUrl"
          :alt="getImageName"
          width="339px"
          height="112px"
        >
        </v-img>
      </v-row>

      <v-card-title :title="learningPlan.attributes.title" class="plan-title">
        {{ learningPlan.attributes.title }}
      </v-card-title>

      <v-card-subtitle class="subtitle mt-4">
        <div class="description">{{ getDescriptionHtml }}</div>

        <div class="mt-2">
          {{ (learningPlan.attributes.trails.data || []).length }} trilhas
          existentes
        </div>
      </v-card-subtitle>
      <v-divider></v-divider>
      <v-card-actions>
        <v-row justify="end" align="center" class="pa-2">
          <v-btn color="accent" nuxt :to="viewPlanUrl"> Visualizar </v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>
<script setup lang="ts">
import { Strapi4ResponseData } from '@nuxtjs/strapi/dist/runtime/types';
import { LearningPlan } from 'models/learningPlan.model';

const strapiUrl = useStrapiUrl();
const strapiBaseUrl = computed(() => strapiUrl.replace('/api', ''));

const props = defineProps({
  learningPlan: {
    type: Object as () => Strapi4ResponseData<LearningPlan>,
    required: true,
  },
  viewPlanUrl: {
    type: String,
    default: '',
  },
});

const getImageUrl = computed(() => {
  return props.learningPlan.attributes.image.data
    ? `${strapiBaseUrl.value}${props.learningPlan.attributes.image.data.attributes.url}`
    : '/images/not-found.png';
});

const getImageName = computed(() => {
  return props.learningPlan.attributes.image.data
    ? props.learningPlan.attributes.image.data.attributes.name
    : 'Sem Imagem';
});

const getDescriptionHtml = computed(() => {
  return props.learningPlan.attributes.description || '---';
});
</script>
<style scoped lang="scss">
.learningplan-card {
  height: 365px;

  .plan-title {
    height: 65px;
  }

  .subtitle {
    > .description {
      height: 63px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
