<template>
  <div class="fill-height d-flex ga-3 flex-column" style="flex: 1">
    <alex-learningplan-trails-header
      :trails-title="trailsTitle"
      :trails-description="trailsDescription"
      :trails-cover="coverImage"
    />
    <div class="bg-white rounded w-100" style="flex: 1">
      <div class="d-flex justify-end px-6 pt-6">
        <alex-custom-button
          v-if="readOnly"
          variant="primary"
          size="large"
          prepend-icon="mdi-pencil-outline"
          @click="toggleReadOnly"
          >Editar</alex-custom-button
        >
        <div v-else>
          <alex-custom-button
            variant="secondary"
            size="large"
            prepend-icon="mdi-close"
            class="mr-2"
            @click="console.log('cancelar')"
            >Cancelar</alex-custom-button
          >
          <alex-custom-button
            variant="primary"
            size="large"
            prepend-icon="mdi-check"
            @click="toggleReadOnly"
            >Salvar</alex-custom-button
          >
        </div>
      </div>

      <div
        v-if="emptyState && readOnly"
        class="d-flex fill-height align-center justify-center container-min-height"
      >
        <v-progress-circular
          v-if="isLoading"
          color="accent"
          indeterminate
          :size="100"
          :width="6"
        ></v-progress-circular>
        <div v-else>
          <img src="/images/emptyTrail.svg" />
          <p class="text-gray-400 text-h3 empty-state-text text-center">
            Parece que não há nenhum conteúdo aqui
          </p>
        </div>
      </div>
      <div v-else class="container-min-height d-flex justify-center ma-6">
        <div class="" style="min-width: 785px">
          <p v-if="readOnly" class="text-gray-500 text-body-3 mb-4">
            Ultima atualização: {{ timeStampToDate(editorData.time) }}
          </p>
          <AppEditor ref="editor" :data="editorData" />
        </div>
        <div v-if="readOnly" class="sections-container">
          <p class="text-gray-800 text-h6 mb-4">Seções</p>
          <div>
            <v-tooltip
              v-for="section in sections"
              :key="section.title"
              :text="section.title"
              location="bottom center"
              content-class="bg-gray-800 pa-6  text-body-3 text-overflow"
              :disabled="!isAvaliableTooltip(section.title)"
              max-width="300"
            >
              <template #activator="{ props: propsTooltip }">
                <p
                  v-bind="propsTooltip"
                  class="section-text pr-4 text-body-3 align-center py-2 text-truncate"
                  :class="[
                    section.active
                      ? 'text-accent bg-gray-blue'
                      : 'text-gray-600 section-text-default',
                    calculateMargin(section.type),
                  ]"
                  @click="navigateToSection(section.title)"
                >
                  {{ section.title }}
                </p>
              </template>
            </v-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Strapi4ResponseSingle } from '@nuxtjs/strapi/dist/runtime/types';
import { ref } from 'vue';
import { getTrail } from '~/assets/queries';
import { Trail } from '@/models/trail.model';
const { create, update } = useStrapi();
const graphql = useStrapiGraphQL();
const router = useRouter();
const route = useRoute();
const emptyState = ref(false);
const isLoading = ref(false);
const readOnly = ref(false);
const editor = ref();

const trailsTitle = ref('');
const trailsDescription = ref('');
const coverImage = ref('');
const editorData = ref({});

definePageMeta({
  hideLearningPlanBanner: true,
});

const { id } = route.params;

const getTrailData = async () => {
  isLoading.value = true;
  const { data } = await useAsyncData('trails', () => {
    return graphql<{}>(getTrail, { trailId: id });
  });
  const trail = data.value.data.trail?.data.attributes;
  trailsTitle.value = trail.title;
  trailsDescription.value = trail.description;
  coverImage.value = trail.cover_image.data.attributes.url;

  editorData.value = {
    id: trail.structures.data[0].id,
    time: trail.structures.data[0].attributes.time,
    version: trail.structures.data[0].attributes.version,
    blocks: trail.structures.data[0].attributes.blocks,
  };
  isLoading.value = false;
};

getTrailData();

const sections = ref([
  {
    title: 'Início',
    type: 1,
    active: false,
  },
]);

const calculateMargin = (index: number) => {
  if (index === 1) return 'pl-4';
  return `pl-${(index - 1) * 4}`;
};

const isAvaliableTooltip = (title: string) => {
  if (title.length >= 29) return true;
  return false;
};

const toggleReadOnly = async () => {
  if (!readOnly.value) {
    const newSections = [
      {
        title: 'Início',
        type: 1,
        active: true,
      },
    ];
    const data = await editor.value.getData();
    data.blocks.forEach((block: any) => {
      if (block.type === 'header') {
        newSections.push({
          title: block.data.text,
          type: block.data.level,
          active: false,
        });
      }
    });
    sections.value = newSections;
  }

  editor.value.toggleReadOnly();
  readOnly.value = !readOnly.value;
};

const navigateToSection = (title: string) => {
  const index = sections.value.findIndex((item) => item.title === title);
  sections.value.forEach((item) => {
    item.active = false;
  });
  sections.value[index].active = true;
  editor.value.navigateToId(title);
};

// const load = async () => {
//   emptyState.value = false;

//   editor.value.loadEditor({
//     id: editorData.value.id,
//     time: editorData.value.time,
//     version: editorData.value.version,
//     blocks: editorData.value.blocks,
//   });
// };

// const saveData = async () => {
//   const data = await editor.value.getData();
//   let blockIds = [];
//   for (let block of data.blocks) {
//     const res = await create('blocks', {
//       type: block.type,
//       data: block.data,
//       tunes: block.tunes,
//     });
//     blockIds.push(res.data.id);
//   }
//   if (editorData.value.id) {
//     await update('structures', editorData.value.id, {
//       time: Date.now(),
//       version: data.version,
//       blocks: blockIds,
//     });
//   } else {
//     await create('structures', {
//       time: Date.now(),
//       version: data.version,
//       blocks: blockIds,
//     });
//   }
// };

const timeStampToDate = (timeStamp: number) => {
  const date = new Date(timeStamp);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
</script>

<style scoped lang="scss">
.pl-20 {
  padding-left: 80px;
}
.container-min-height {
  min-height: 436px;
  position: relative;
}

.empty-state-text {
  max-width: 314px;
}

.sections-container {
  max-width: 240px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
}

.text-overflow {
  white-space: wrap !important;
  text-wrap: normal !important;
  overflow: auto !important;
}
.section-text {
  width: 240px;
  vertical-align: middle;
}
.section-text-default:hover {
  cursor: pointer;
  background-color: #ebedef;
  color: #30363b !important;
}
</style>
