<template>
  <v-row class="white" justify="space-between" style="z-index: 1">
    <v-col cols="9">
      <v-card id="header-learning-plan-card" elevation="0" class="pa-4">
        <v-row
          v-if="!blocks.data.length && askToEditIfEmptyBlocks"
          dense
          class="pa-0"
          align="center"
          justify="start"
        >
          <v-col cols="12">
            <v-btn v-if="hasPermission" color="primary" @click="$emit('edit')">
              Clique Aqui para adicionar conteúdo
            </v-btn>
            <span v-else>Sem conteúdo</span>
          </v-col>
        </v-row>
        <div v-else>
          <v-row
            v-if="author"
            dense
            class="pa-0"
            justify="space-between"
            align="center"
            style="z-index: 2"
          >
            <v-col cols="10" style="z-index: 2; position: relative">
              <alex-learningplan-viewer-authors
                :structure="structure"
                :author="author"
                :co-authors="coAuthors"
              />
            </v-col>
            <v-btn v-if="hasPermission" icon @click="$emit('edit')">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-row>
          <v-row dense class="pa-0">
            <v-col
              v-for="({ attributes, id }, idx) in blocks.data"
              :key="idx"
              v-viewer="{ navbar: false, scalable: false }"
              :cols="attributes.order === 'attaches' ? 4 : 12"
              class="flex flex-col my-4 pa-1"
              style="z-index: 1"
            >
              <v-row>
                <v-col v-if="selectBlocks" :cols="1">
                  <v-checkbox
                    v-model="checkedBlocks"
                    :value="id"
                    @input="$emit('block-selected', checkedBlocks)"
                  />
                </v-col>
                <v-col :cols="selectBlocks ? 11 : 12">
                  <hr v-if="type === 'delimiter'" />
                  <component
                    :is="`h${data.level}`"
                    v-else-if="type === 'header'"
                    :id="`header-${id}`"
                    v-intersect="handleIntersect"
                    :class="
                      tunes && tunes.alignmentBlockTune
                        ? tunes.alignmentBlockTune.alignment
                        : 'center'
                    "
                  >
                    {{ unescape(data.text) }}
                  </component>
                  <v-row
                    v-else-if="['image', 'imageUrl'].includes(type)"
                    justify="center"
                  >
                    <img
                      :src="getImageLink(data, downloaded)"
                      :alt="data.caption || 'Image'"
                      :title="data.caption || ''"
                      style="max-width: 800px"
                      class="object-cover w-full m-auto p-4 shadow viewable-image"
                    />
                  </v-row>
                  <vue-plyr
                    v-else-if="
                      type === 'link' &&
                      data.meta &&
                      typeof data.meta.domain === 'string' &&
                      video.isVideo(data.meta.domain) &&
                      video.getEmbedID(data.link)
                    "
                  >
                    <video
                      v-if="isElectronEnv() && downloaded"
                      controls
                      crossorigin=""
                      playsinline
                      :data-poster="
                        data.meta.image
                          ? `file://${data.meta.image.downloadedUrl}`
                          : ''
                      "
                    >
                      <source
                        :src="`file://${data.downloadedLink}`"
                        type="video/mp4"
                      />
                    </video>
                    <div
                      v-else
                      :data-plyr-provider="video.getProvider(data.link)"
                      :data-plyr-embed-id="video.getEmbedID(data.link)"
                    />
                  </vue-plyr>

                  <alex-learningplan-viewer-blocks-link
                    v-else-if="type === 'link'"
                    :link-block="data"
                    :is-desktop="isElectronEnv()"
                    :is-downloaded="downloaded"
                  />

                  <component
                    :is="data.style === 'unordered' ? 'ul' : 'ol'"
                    v-else-if="type === 'list'"
                  >
                    <nested-list :items="data.items" :type="data.style" />
                  </component>
                  <!-- eslint-disable-next-line -->
                  <p
                    v-else-if="type === 'paragraph'"
                    :class="
                      tunes && tunes.alignmentBlockTune
                        ? tunes.alignmentBlockTune.alignment
                        : data.alignment
                    "
                    v-html="data.text"
                  />

                  <div v-else-if="type === 'quote'" :class="data.alignment">
                    <b
                      ><p>"{{ data.text }}"</p></b
                    >
                    <i
                      ><p>{{ data.caption }}</p></i
                    >
                  </div>

                  <alex-learningplan-viewer-blocks-table
                    v-else-if="type === 'table'"
                    :table-block="data"
                  />

                  <alex-learningplan-viewer-blocks-attaches
                    v-else-if="type === 'attaches'"
                    :attaches-block="data"
                    :is-desktop="isElectronEnv()"
                  />

                  <alex-learningplan-viewer-blocks-alert
                    v-else-if="type === 'alert'"
                    :alert-block="data"
                  />

                  <alex-learningplan-viewer-blocks-warning
                    v-else-if="type === 'warning'"
                    :warning-block="data"
                  />

                  <prism
                    v-else-if="type === 'code' && data.languageCode"
                    :language="data.languageCode"
                    :code="data.code"
                  ></prism>

                  <a
                    v-else-if="type === 'socialPost'"
                    rel="nofollow noindex noreferrer"
                    class="card-link"
                    target="_blank"
                    :href="data.url"
                  >
                    <div class="flex-1">
                      <div class="font-bold">{{ data.caption }}</div>
                      <p v-if="data.description" class="my-2">
                        {{ data.description }}
                      </p>
                      <span class="text-black text-opacity-50">
                        {{ data.url }}
                      </span>
                    </div>
                    <a-icon :type="data.socialMediaPlatform.toLowerCase()" />
                  </a>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-col>
    <v-col cols="3">
      <div
        style="
          position: sticky;
          z-index: 2;
          top: 10%;
          overflow: hidden;
          text-overflow: ellipsis;
        "
      >
        <v-btn text="" @click="onTabClick({ id: 'learning-plan-card' })">
          Voltar para o Topo
          <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
        <v-tabs
          v-model="headerTabSelected"
          vertical
          style="text-overflow: ellipsis"
        >
          <v-tab
            v-for="header in headersBlocks"
            :key="`header-tab-${header.id}`"
            :title="header.data.text"
            style="justify-content: start; text-overflow: ellipsis"
            :class="`ml-${(header.data.level - 1) * 3}`"
            @click="onTabClick(header)"
            @change="changeTabOnIntersect = true"
          >
            <div>
              {{ unescape(header.data.text.trim()) }}
            </div>
          </v-tab>
        </v-tabs>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import 'prismjs';
import 'prismjs/themes/prism.css';
import Prism from 'vue-prism-component';
import { Strapi4ResponseData } from '@nuxtjs/strapi/dist/runtime/types';
import { PropType } from 'nuxt/dist/app/compat/capi';
import * as video from '~/helpers/video';
import 'viewerjs/dist/viewer.css';
import { User } from 'models/user.model';
import { Block } from 'models/block.model';
import { unescape } from '@/helpers/html-escaper';
import { Structure } from 'models/structure.model';

const props = defineProps({
  hasPermission: Boolean,
  structure: {
    type: Object as PropType<Strapi4ResponseData<Structure>>,
    required: true,
  },
  selectedBlocks: {
    type: Array as PropType<Block[]>,
    default: () => [],
  },
  askToEditIfEmptyBlocks: {
    type: Boolean,
    default: true,
  },
  selectBlocks: {
    type: Boolean,
    default: false,
  },
  author: {
    type: Object as PropType<Strapi4ResponseData<User>>,
    default: null,
  },
  coAuthors: {
    type: Array as PropType<Strapi4ResponseData<User>[]>,
    default: () => [],
  },
});

// const videoRef = ref();
const blocks = computed(() => props.structure.attributes.blocks);

const checkedBlocks: globalThis.Ref<Block[]> = ref([]);
const headerTabSelected = ref(null);
const changeTabOnIntersect = ref(true);

const headersBlocks = computed(() => {
  return blocks.value.data.filter((b: any) => b.attributes.type === 'header');
});

onMounted(() => {
  checkedBlocks.value = selectedBlocks.value;
});

watch(
  () => structure,
  () => {
    blocks.value = (structure!.value || {}).blocks || [];
  },
);

watch(
  () => selectedBlocks,
  () => {
    checkedBlocks.value = selectedBlocks.value;
  },
);

const isElectronEnv = () => {
  return !!process.env.isElectronEnv;
};

const getImageLink = (image, downloaded) => {
  if (downloaded) {
    const path = (image.file || {}).downloadedUrl || image.downloadedUrl;
    return `file://${path}`;
  }

  return (image.file || {}).url || image.url;
};

/*
const show = () => {
  const viewer = this.$el.querySelector('.viewable-image').$viewer;
  viewer.show();
};
*/
const handleIntersect = (entries, _observer) => {
  const intersectingElement = entries[0];

  if (intersectingElement.isIntersecting) {
    const id = intersectingElement.target.id;
    const headerId = id.split('-')[1];

    const index = headersBlocks.value.map((h) => h.id).indexOf(headerId);

    headerTabSelected.value = index;
  }
};

const onTabClick = ({ id }: { id: string }) => {
  changeTabOnIntersect.value = false;
  const el = document.getElementById(id);

  if (el) {
    el.scrollIntoView();
  }
};
</script>
<style scoped>
.center {
  text-align: center;
}

.left {
  text-align: left;
}

.right {
  text-align: right;
}

.viewable-image {
  cursor: zoom-in;
}

.avatar-section {
  display: flex;
  margin-bottom: 10px;
}

.avatar-content-section {
  padding: 2px;
}

.avatar-content-section span {
  height: 40px;
  width: 40px;
}

.avatar-content-section button {
  height: 35px;
  width: 35px;
}

.popover-avatar {
  cursor: pointer;
}
</style>

<style>
.plyr {
  margin: auto;
  max-width: 800px;
}

/* .customHeader {
  margin-top: 64px;
}

.content div:first-child .customHeader {
  margin-top: 0;
} */
</style>
