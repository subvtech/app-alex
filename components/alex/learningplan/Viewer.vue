<template>
  <v-row class="white" justify="space-between" style="z-index: 1">
    <v-col cols="9">
      <v-card id="header-learning-plan-card" elevation="0" class="pa-4">
        <v-row
          v-if="!blocks.length && askToEditIfEmptyBlocks"
          dense
          class="pa-0"
          align="center"
          justify="start"
        >
          <v-col cols="12">
            <v-btn
              v-if="props.hasPermission"
              color="primary"
              @click="emit('edit')"
            >
             {{ $t('viewer.addContent') }}
            </v-btn>
            <span v-else>{{ $t('viewer.noContent') }}</span>
          </v-col>
        </v-row>
        <div v-else>
          <v-row
            v-if="props.author"
            dense
            class="pa-0"
            justify="space-between"
            align="center"
            style="z-index: 2"
          >
            <v-col cols="10" style="z-index: 2; position: relative">
              <alex-learningplan-viewer-authors
                :structure="structure"
                :author="props.author"
                :co-authors="props.coAuthors"
              />
            </v-col>
            <v-btn v-if="props.hasPermission" icon @click="emit('edit')">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-row>
          <v-row dense class="pa-0">
            <v-col
              v-for="({ attributes, id }, idx) in blocks"
              :key="idx"
              v-viewer="{ navbar: false, scalable: false }"
              :cols="attributes.type === 'attaches' ? 4 : 12"
              class="flex flex-col my-4 pa-1"
              style="z-index: 1"
            >
              <v-row>
                <v-col v-if="props.selectBlocks" :cols="1">
                  <v-checkbox
                    v-model="checkedBlocks"
                    :value="id"
                    @input="emit('block-selected', checkedBlocks)"
                  />
                </v-col>
                <v-col :cols="props.selectBlocks ? 11 : 12">
                  <hr v-if="attributes.type === 'delimiter'" />
                  <component
                    :is="`h${attributes.data.level}`"
                    v-else-if="attributes.type === 'header'"
                    :id="`header-${attributes.id}`"
                    v-intersect="handleIntersect"
                    :class="
                      attributes.tunes && attributes.tunes.alignmentBlockTune
                        ? attributes.tunes.alignmentBlockTune.alignment
                        : 'center'
                    "
                  >
                    {{ unescape(attributes.data.text) }}
                  </component>
                  <v-row
                    v-else-if="['image', 'imageUrl'].includes(attributes.type)"
                    justify="center"
                  >
                    <img
                      :src="
                        getImageLink(attributes.data, attributes.downloaded)
                      "
                      :alt="attributes.data.caption || 'Image'"
                      :title="attributes.data.caption || ''"
                      style="max-width: 800px"
                      class="object-cover w-full m-auto p-4 shadow viewable-image"
                    />
                  </v-row>
                  <vue-plyr
                    v-else-if="
                      attributes.type === 'link' &&
                      attributes.data.meta &&
                      typeof attributes.data.meta.domain === 'string' &&
                      video.isVideo(attributes.data.meta.domain) &&
                      video.getEmbedID(attributes.data.link)
                    "
                  >
                    <video
                      v-if="isElectronEnv() && attributes.downloaded"
                      controls
                      crossorigin=""
                      playsinline
                      :data-poster="
                        attributes.data.meta.image
                          ? `file://${attributes.data.meta.image.downloadedUrl}`
                          : ''
                      "
                    >
                      <source
                        :src="`file://${attributes.data.downloadedLink}`"
                        type="video/mp4"
                      />
                    </video>
                    <div
                      v-else
                      :data-plyr-provider="
                        video.getProvider(attributes.data.link)
                      "
                      :data-plyr-embed-id="
                        video.getEmbedID(attributes.data.link)
                      "
                    />
                  </vue-plyr>

                  <alex-learningplan-viewer-blocks-link
                    v-else-if="attributes.type === 'link'"
                    :link-block="attributes.data"
                    :is-desktop="isElectronEnv()"
                    :is-downloaded="attributes.downloaded"
                  />

                  <component
                    :is="attributes.data.style === 'unordered' ? 'ul' : 'ol'"
                    v-else-if="attributes.type === 'list'"
                  >
                    <nested-list
                      :items="attributes.data.items"
                      :type="attributes.data.style"
                    />
                  </component>
                  <!-- eslint-disable-next-line -->
                  <p
                    v-else-if="attributes.type === 'paragraph'"
                    :class="
                      attributes.tunes && attributes.tunes.alignmentBlockTune
                        ? attributes.tunes.alignmentBlockTune.alignment
                        : attributes.data.alignment
                    "
                    v-html="attributes.data.text"
                  />

                  <div
                    v-else-if="attributes.type === 'quote'"
                    :class="attributes.data.alignment"
                  >
                    <b
                      ><p>"{{ attributes.data.text }}"</p></b
                    >
                    <i
                      ><p>{{ attributes.data.caption }}</p></i
                    >
                  </div>

                  <alex-learningplan-viewer-blocks-table
                    v-else-if="attributes.type === 'table'"
                    :table-block="attributes.data"
                  />

                  <alex-learningplan-viewer-blocks-attaches
                    v-else-if="attributes.type === 'attaches'"
                    :attaches-block="attributes.data"
                    :is-desktop="isElectronEnv()"
                  />

                  <alex-learningplan-viewer-blocks-alert
                    v-else-if="attributes.type === 'alert'"
                    :alert-block="attributes.data"
                  />

                  <alex-learningplan-viewer-blocks-warning
                    v-else-if="attributes.type === 'warning'"
                    :warning-block="attributes.data"
                  />

                  <prism
                    v-else-if="
                      attributes.type === 'code' && attributes.data.languageCode
                    "
                    :language="attributes.data.languageCode"
                    :code="attributes.data.code"
                  ></prism>

                  <a
                    v-else-if="attributes.type === 'socialPost'"
                    rel="nofollow noindex noreferrer"
                    class="card-link"
                    target="_blank"
                    :href="attributes.data.url"
                  >
                    <div class="flex-1">
                      <div class="font-bold">{{ attributes.data.caption }}</div>
                      <p v-if="attributes.data.description" class="my-2">
                        {{ attributes.data.description }}
                      </p>
                      <span class="text-black text-opacity-50">
                        {{ attributes.data.url }}
                      </span>
                    </div>
                    <a-icon
                      :type="attributes.data.socialMediaPlatform.toLowerCase()"
                    />
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
        <v-btn text="" @click="onTabClick({ id: 'header-learning-plan-card' })">
          {{$t('viewer.backToTop')}}
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
            :title="header.attributes.data.text"
            style="justify-content: start; text-overflow: ellipsis"
            :class="`ml-${(header.attributes.data.level - 1) * 3}`"
            @click="onTabClick({ id: `header-tab-${header.id}` })"
            @change="changeTabOnIntersect = true"
          >
            <div>
              {{ unescape(header.attributes.data.text.trim()) }}
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
    type: Array as PropType<Strapi4ResponseData<Block>[]>,
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

const emit = defineEmits(['edit', 'block-selected']);

// const videoRef = ref();
// const blocks = ref<Strapi4ResponseData<Block>[]>([]);

const checkedBlocks = ref<Block[]>([]);
const headerTabSelected = ref<number | null>(null);
const changeTabOnIntersect = ref(true);

const headersBlocks = computed(() => {
  return blocks.value.filter((b: any) => b.attributes.type === 'header');
});

onMounted(() => {
  // checkedBlocks.value = props.selectedBlocks;
});

const blocks = computed(() => {
  console.log(props.structure);
  return props.structure?.attributes?.blocks?.data || [];
});

// watch(
//   () => props.structure,
//   () => {
//     blocks.value = (props.structure.attributes.blocks || {}).data || [];
//   },
// );

// watch(
//   () => props.selectedBlocks,
//   () => {
//     checkedBlocks.value = props.selectedBlocks;
//   },
// );

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
