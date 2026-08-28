<template>
  <node-view-wrapper class="w-100 d-flex flex-column justify-center align-center py-2">
    <v-expand-transition>
      <alex-custom-button
        v-if="!readOnly && !media.src"
        class="w-100"
        variant="secondary"
        :loading="isLoading"
        :prepend-icon="contentType === 'image' ? 'mdi-image-outline' : 'mdi-movie-play-outline'"
        size="large"
        @click="openModal"
        >{{ t(`components.tiptap.mediaUpload.${contentType}.button`) }}</alex-custom-button
      >
      <div v-else-if="media.src" class="w-100 d-flex flex-column justify-center align-center position-relative">
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
        <Popover v-if="contentType === 'image'" :open="popover" @update:open="(e) => (popover = e)">
          <PopoverTrigger
            class="w-100 d-flex transition-justify-content"
            :style="`justify-content: ${media.align}`"
            :disabled="readOnly"
          >
            <div
              class="w-100 d-flex align-center transition-justify-content"
              :style="`max-width: ${containerWidth}; justify-content: ${media.align}`"
            >
              <div class="image-preview position-relative" :style="`width: ${media.size}%`">
                <img
                  ref="image"
                  :key="media.title"
                  :src="media.src"
                  :alt="media.title"
                  :class="{ selected: popover }"
                  preload
                  class="w-100 rounded img-component tw-transition-all"
                  :draggable="false"
                  @load="imageOriginalWidth = image.naturalWidth"
                />
                <div v-if="media.uploading" class="image-uploading">
                  <v-progress-circular indeterminate color="white" size="40" />
                </div>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent class="pa-1" side="top">
            <ImageMenu
              :image="{ size: media.size, position: media.align }"
              @update:image-position="updateAlign"
              @update:image-size="updateSize"
              @fullscreen="openFullscreen"
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
            :data-setup="!isLocalMedia ? JSON.stringify({ techOrder: [getVideoProvider()] }) : ''"
          />
        </div>
      </div>
    </v-expand-transition>
    <UploadModal ref="dialog" @upload-media="uploadMedia" />
    <alex-custom-viewer v-model="viewer" container="media-upload-container" />

    <v-overlay v-model="showFullscreen" class="d-flex align-center justify-center">
      <div class="position-relative tw-w-[90vw] tw-h-[90vh] d-flex align-center justify-center overflow-hidden">
        <alex-custom-button
          icon="mdi-close"
          class="position-absolute"
          style="top: 16px; right: 16px; z-index: 10"
          color="white"
          @click="closeFullscreen"
        />
        <div class="position-absolute d-flex flex-column ga-2" style="top: 16px; left: 16px; z-index: 10">
          <alex-custom-button
            icon="mdi-plus"
            color="white"
            size="small"
            :disabled="zoomLevel >= maxZoom"
            @click="zoomIn"
          />
          <alex-custom-button
            icon="mdi-minus"
            color="white"
            size="small"
            :disabled="zoomLevel <= minZoom"
            @click="zoomOut"
          />
          <alex-custom-button icon="mdi-backup-restore" color="white" size="small" @click="resetZoom" />
        </div>
        <div
          class="position-absolute text-white bg-black bg-opacity-50 px-2 py-1 rounded"
          style="bottom: 16px; left: 16px; z-index: 10"
        >
          {{ Math.round(zoomLevel * 100) }}%
        </div>
        <div
          ref="imageContainer"
          class="d-flex align-center justify-center w-100 h-100"
          style="cursor: grab"
          :style="{ cursor: isPanning ? 'grabbing' : zoomLevel > 1 ? 'grab' : 'default' }"
          @mousedown="startPan"
          @mousemove="handlePan"
          @mouseup="endPan"
          @mouseleave="endPan"
          @wheel.prevent="handleWheel"
        >
          <img
            ref="fullscreenImage"
            :src="media.src"
            :alt="media.title"
            class="tw-transition-transform tw-duration-200"
            style="max-height: 90vh; max-width: 90vw; user-select: none"
            :style="{
              transform: `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`,
              transformOrigin: 'center center',
            }"
            draggable="false"
          />
        </div>
      </div>
    </v-overlay>
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
  uploadKey?: string | null;
  uploading?: boolean;
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
  uploadKey: props.node.attrs.media.uploadKey || null,
  uploading: props.node.attrs.media.uploading || false,
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
      uploadKey: newMedia.uploadKey || null,
      uploading: newMedia.uploading || false,
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
      setMessage(t('components.tiptap.mediaUpload.errors.upload'), 'error', true);
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
    if (media.value.src.includes('www.youtube') || media.value.src.includes('youtu.be')) return 'youtube';
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

const viewer = ref(null);
const showFullscreen = ref(false);

const zoomLevel = ref(1);
const minZoom = 0.5;
const maxZoom = 5;
const panX = ref(0);
const panY = ref(0);
const isPanning = ref(false);
const lastPanPoint = ref({ x: 0, y: 0 });

const imageContainer = ref<HTMLElement>();
const fullscreenImage = ref<HTMLImageElement>();

const openFullscreen = () => {
  popover.value = false;
  showFullscreen.value = true;
  resetZoom();
};

const closeFullscreen = () => {
  showFullscreen.value = false;
  resetZoom();
};

const zoomIn = () => {
  if (zoomLevel.value < maxZoom) {
    zoomLevel.value = Math.min(zoomLevel.value + 0.25, maxZoom);
  }
};

const zoomOut = () => {
  if (zoomLevel.value > minZoom) {
    zoomLevel.value = Math.max(zoomLevel.value - 0.25, minZoom);
    if (zoomLevel.value <= 1) {
      panX.value = 0;
      panY.value = 0;
    }
  }
};

const resetZoom = () => {
  zoomLevel.value = 1;
  panX.value = 0;
  panY.value = 0;
};

const handleWheel = (event: WheelEvent) => {
  const delta = event.deltaY > 0 ? -0.1 : 0.1;
  const newZoom = Math.max(minZoom, Math.min(maxZoom, zoomLevel.value + delta));
  zoomLevel.value = newZoom;

  if (newZoom <= 1) {
    panX.value = 0;
    panY.value = 0;
  }
};

const startPan = (event: MouseEvent) => {
  if (zoomLevel.value > 1) {
    isPanning.value = true;
    lastPanPoint.value = { x: event.clientX, y: event.clientY };
  }
};

const handlePan = (event: MouseEvent) => {
  if (isPanning.value && zoomLevel.value > 1) {
    const deltaX = event.clientX - lastPanPoint.value.x;
    const deltaY = event.clientY - lastPanPoint.value.y;

    panX.value += deltaX / zoomLevel.value;
    panY.value += deltaY / zoomLevel.value;

    lastPanPoint.value = { x: event.clientX, y: event.clientY };
  }
};

const endPan = () => {
  isPanning.value = false;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (showFullscreen.value) {
    switch (event.key) {
      case 'Escape':
        closeFullscreen();
        break;
      case '+':
      case '=':
        zoomIn();
        break;
      case '-':
        zoomOut();
        break;
      case '0':
        resetZoom();
        break;
    }
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
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

.image-preview {
  max-width: 100%;
}

.image-uploading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 4px;
}

.transition-justify-content {
  transition: justify-content 0.3s ease-in-out;
}

.selected {
  border-color: rgb(var(--v-theme-accent));
}

.tw-transition-transform {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}
</style>
