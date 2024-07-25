<template>
  <node-view-wrapper
    class="w-100 d-flex flex-column justify-center align-center py-2"
  >
    <v-expand-transition>
      <alex-custom-button
        v-if="!readOnly && !media.src"
        class="tw-w-4/5"
        variant="secondary"
        :loading="isLoading"
        :prepend-icon="
          contentType === 'image'
            ? 'mdi-image-outline'
            : 'mdi-movie-play-outline'
        "
        size="large"
        @click="openModal"
        >{{
          t(`components.tiptap.mediaUpload.${contentType}.button`)
        }}</alex-custom-button
      >
      <div
        v-else-if="media.src"
        class="tw-w-4/5 d-flex flex-column justify-center align-center position-relative"
      >
        <div class="ma-2 delete-button">
          <alex-custom-button
            color="gray-500"
            icon="mdi-close"
            style="background-color: rgba(255, 255, 255, 0.25) !important"
            @click="removeMedia"
          />
        </div>
        <nuxt-img
          v-if="contentType === 'image'"
          :key="media.title"
          :src="media.src"
          :alt="media.title"
          class="w-100"
          :draggable="false"
        />
        <div v-else class="w-100">
          <video-player
            ref="videoPlayer"
            :options="videoPlayerOptions(media)"
            class="w-100 min-h-100"
            :class="{ videoFile: isLocalMedia }"
            :custom-classes="'video-fluid'"
            controls
            :data-setup="
              !isLocalMedia
                ? JSON.stringify({ techOrder: [getVideoProvider()] })
                : ''
            "
          />
        </div>
      </div>
    </v-expand-transition>
    <UploadModal ref="dialog" @upload-media="uploadMedia" />
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, NodeViewProps } from '@tiptap/vue-3';
import VideoPlayer from '../VideoJS.vue';
import UploadModal from './FileUploader.vue';

// TODO : Adicionar um popup de resize, com opções de alinhamento
// TODO: Watch de attrs para atualizar o media

const { t } = useI18n();

const { setMessage } = useMessageStore();

const dialog = ref();
const isLoading = ref(false);

const props = defineProps({
  node: {
    type: Object as PropType<NodeViewProps['node']>,
    required: true,
  },
  extension: {
    type: Object as PropType<NodeViewProps['extension']>,
    required: true,
  },
  updateAttributes: {
    type: Function as PropType<NodeViewProps['updateAttributes']>,
    default: () => {},
  },
});

const readOnly = computed(() => props.extension.options.readOnly());

const contentType = computed(() => props.node.attrs.format);

const uploadMedia = async (newMedia: File | string) => {
  isLoading.value = true;
  if (typeof newMedia === 'string') {
    media.value = { src: newMedia, title: newMedia, id: null };
    props.updateAttributes({ media: media.value });
  } else {
    const res = await props.extension.options.uploadMedia(newMedia);
    if (res.success) {
      media.value = {
        src: res.url,
        title: res.title,
        id: res.id,
      };
      props.updateAttributes({ media: media.value });
    } else {
      // TODO: I18N
      setMessage('Erro ao fazer o upload, tente novamente', 'error', true);
    }
  }
  isLoading.value = false;
};

const removeMedia = () => {
  if (isLocalMedia) {
    props.extension.options.deleteMedia(media.value.id);
  }
  media.value = { src: '', title: '', id: null };
  props.updateAttributes({ media: media.value });
};

const openModal = () => {
  dialog.value.openModal(contentType.value);
};

interface Media {
  src: string;
  title: string;
  id: string | null;
}

const media = ref<Media>(props.node.attrs.media);

const isLocalMedia = computed(() => media.value.id);

const getVideoProvider = () => {
  if (!isLocalMedia.value) {
    if (
      media.value.src.includes('www.youtube') ||
      media.value.src.includes('youtu.be')
    )
      return 'youtube';
    return 'vimeo';
  }
  return 'mp4';
};

const videoPlayerOptions = (media: Media) => {
  let url = media.src;
  if (isLocalMedia.value) {
    url = url?.startsWith('https') ? url : `https://${url}`;
  }
  const type = getVideoProvider();

  const data = {
    playbackRates: [0.5, 1, 1.5, 2],
    controls: true,
    fluid: true,
    sources: [
      {
        src: url,
        type: `video/${type}`,
      },
    ],
  };
  return data;
};
</script>

<style scoped>
.delete-button {
  position: absolute;
  z-index: 99;
  right: 5px;
  top: 0;
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.1);
  }
}
</style>
