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
            v-if="!readOnly"
            color="gray-500"
            icon="mdi-close"
            variant="text"
            style="background-color: rgba(255, 255, 255, 0.25) !important"
            @click="removeMedia"
          />
        </div>
        <Popover
          v-if="contentType === 'image'"
          :open="popover"
          @update:open="(e) => (popover = e)"
        >
          <PopoverTrigger
            class="w-100 d-flex transition-justify-content"
            :style="`justify-content: ${media.align}`"
            :disabled="readOnly"
          >
            <div
              class="w-100 d-flex align-center transition-justify-content"
              :style="`max-width: ${containerWidth}; justify-content: ${media.align}`"
            >
              <img
                ref="image"
                :key="media.title"
                :src="media.src"
                :alt="media.title"
                :class="{ selected: popover }"
                preload
                class="max-width-100 rounded img-component tw-transition-all"
                :draggable="false"
                :style="`width: ${media.size}%`"
                @load="imageOriginalWidth = image.naturalWidth"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent class="pa-1" side="top">
            <ImageMenu
              :image="{ size: media.size, position: media.align }"
              @update:image-position="updateAlign"
              @update:image-size="updateSize"
            />
          </PopoverContent>
        </Popover>
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
import ImageMenu from './ImageMenu.vue';

interface Media {
  src: string;
  title: string;
  id: string | null;
  size: number;
  align: string;
}

const image = ref();

const imageOriginalWidth = ref<number>(0);

const { t } = useI18n();

const { setMessage } = useMessageStore();

const dialog = ref();
const popover = ref(false);
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

const media = ref<Media>({
  src: props.node.attrs.media.src,
  title: props.node.attrs.media.title,
  id: props.node.attrs.media.id,
  size: props.node.attrs.media.size || 100,
  align: props.node.attrs.media.align || 'center',
});

const readOnly = computed(() => props.extension.options.readOnly());

const contentType = computed(() => props.node.attrs.format);

const isLocalMedia = computed(() => media.value.id);

const containerWidth = computed(() => {
  return image.value ? `${imageOriginalWidth.value}px` : '100%';
});

watch(
  () => props.node.attrs.media,
  (newMedia) => {
    media.value = {
      src: newMedia.src,
      title: newMedia.title,
      id: newMedia.id,
      size: newMedia.size || 100,
      align: newMedia.align || 'center',
    };
  },
);

const uploadMedia = async (newMedia: File | string) => {
  isLoading.value = true;
  if (typeof newMedia === 'string') {
    media.value = {
      src: newMedia,
      title: newMedia,
      id: null,
      size: 100,
      align: 'center',
    };
    props.updateAttributes({ media: media.value });
  } else {
    const res = await props.extension.options.uploadMedia(newMedia);
    if (res.success) {
      media.value = {
        src: res.url,
        title: res.title,
        id: res.id,
        size: 100,
        align: 'center',
      };
      props.updateAttributes({ media: media.value });
    } else {
      setMessage(
        t('components.tiptap.mediaUpload.errors.upload'),
        'error',
        true,
      );
    }
  }
  isLoading.value = false;
};

const removeMedia = () => {
  if (isLocalMedia) {
    props.extension.options.deleteMedia(media.value.id);
  }
  media.value = { src: '', title: '', id: null, size: 100, align: 'center' };
  props.updateAttributes({ media: media.value });
};

const openModal = () => {
  dialog.value.openModal(contentType.value);
};

const updateSize = (size: number) => {
  media.value.size = size;
  props.updateAttributes({ media: media.value });
};

const updateAlign = (align: string) => {
  media.value.align = align;
  props.updateAttributes({ media: media.value });
};

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

.img-component {
  border: 4px solid transparent;
  /* transition: all 0.5s ease; */
}

.transition-justify-content {
  transition: justify-content 0.3s ease-in-out;
}

.selected {
  border-color: rgb(var(--v-theme-accent));
}
</style>
