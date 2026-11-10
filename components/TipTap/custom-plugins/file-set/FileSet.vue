<template>
  <node-view-wrapper class="file-set">
    <div
      id="fileset-block"
      class="d-flex flex-wrap ga-2 my-2 drop-area"
      :data-active="fileDrop && !readOnly"
      @dragenter.prevent="
        if (!readOnly) {
          fileDrop = true;
        }
      "
      @dragover.prevent="
        if (!readOnly) {
          fileDrop = true;
        }
      "
      @dragleave.prevent="
        if (!readOnly) {
          fileDrop = false;
        }
      "
      @drop.prevent="
        if (!readOnly) {
          addFileFromDrop($event);
        }
      "
    >
      <v-btn
        v-if="!readOnly"
        class="fileInput d-flex align-center justify-center px-6 py-3 rounded-lg text-body-2 text-gray-800 width-60 h-62 elevation-0 bg-transparent"
        :loading="isLoading"
        @click="fileInputRef.click()"
      >
        <v-icon class="mr-3" icon="mdi-plus"></v-icon>
        {{ t('components.editorjs.fileSet.addFile') }}
        <input
          ref="fileInputRef"
          type="file"
          multiple
          class="d-none"
          @change="
            (event) => {
              const files = (event.target as HTMLInputElement).files;
              if (files) {
                addFile(files);
              }
            }
          "
        />
      </v-btn>
      <template v-for="file in filesArray" :key="file.title">
        <div v-if="hasPreview(file)" class="file-entry--preview">
          <audio-player v-if="isAudioFile(file)" :src="resolveFileUrl(file.url)" @error="failedPreviews.push(file.id)">
            <template #actions>
              <v-btn
                :loading="isDownloading.includes(file.id)"
                variant="text"
                size="small"
                icon="mdi-cloud-download-outline"
                :aria-label="$t('components.learningPlan.link.download')"
                :title="$t('components.learningPlan.link.download')"
                @click="downloadFile(file.url, file.title, file.id)"
              >
              </v-btn>
              <v-btn
                v-if="!readOnly"
                color="error-0"
                variant="text"
                icon="mdi-trash-can-outline"
                size="small"
                :aria-label="t('components.editorjs.fileSet.remove')"
                :title="t('components.editorjs.fileSet.remove')"
                @click="() => deleteFile(file)"
              >
              </v-btn>
            </template>
          </audio-player>
          <div
            v-else
            class="file-preview position-relative rounded-lg"
            :class="{
              'file-preview--pending': getPreviewType(file.extension) === 'video' && !checkedVideos.includes(file.id),
            }"
          >
            <iframe
              v-if="getPreviewType(file.extension) === 'pdf'"
              class="file-preview__pdf"
              :src="resolveFileUrl(file.url)"
              :title="file.title"
              loading="lazy"
            ></iframe>
            <img
              v-else-if="getPreviewType(file.extension) === 'image'"
              class="file-preview__image"
              :src="resolveFileUrl(file.url)"
              :alt="file.title"
              loading="lazy"
              @error="failedPreviews.push(file.id)"
            />
            <template v-else>
              <video
                v-if="!checkedVideos.includes(file.id)"
                class="d-none"
                :src="resolveFileUrl(file.url)"
                preload="metadata"
                muted
                @loadedmetadata="checkVideoTrack($event, file.id)"
                @error="failedPreviews.push(file.id)"
              ></video>
              <video-player v-else class="videoFile" :options="videoPlayerOptions(file)" custom-classes="video-fluid" />
            </template>
            <div
              class="file-preview__actions d-flex ga-1 rounded-lg pa-1"
              :class="{ 'file-preview__actions--pdf': getPreviewType(file.extension) === 'pdf' }"
            >
              <v-btn
                :loading="isDownloading.includes(file.id)"
                variant="text"
                size="small"
                icon="mdi-cloud-download-outline"
                :aria-label="$t('components.learningPlan.link.download')"
                :title="$t('components.learningPlan.link.download')"
                @click="downloadFile(file.url, file.title, file.id)"
              >
              </v-btn>
              <v-btn
                v-if="!readOnly"
                color="error-0"
                variant="text"
                icon="mdi-trash-can-outline"
                size="small"
                :aria-label="t('components.editorjs.fileSet.remove')"
                :title="t('components.editorjs.fileSet.remove')"
                @click="() => deleteFile(file)"
              >
              </v-btn>
            </div>
          </div>
        </div>
        <div v-else class="fileItem d-flex rounded-lg text-body-2 text-gray-800 width-60 h-62">
          <v-img
            v-if="setFileBackground(file.extension) === 'img'"
            class="min-w-16 file-border"
            cover
            :src="file.url"
          ></v-img>
          <div
            v-else
            class="min-w-16 file-border d-flex justify-center align-center"
            :class="`bg-${setFileBackground(file.extension)}`"
          >
            <span class="text-body-2 text-uppercase">{{ file.extension }}</span>
          </div>
          <div class="file-content d-flex ga-3 pa-3">
            <div class="file-text d-flex flex-column min-w-0">
              <span class="text-body-2 text-gray-900 ellipsis lines-1">{{ file.title }}</span>
              <span class="text-body-5 text-gray-500">{{ formatFileSize(file.size) }}</span>
            </div>
            <div class="file-actions d-flex justify-center align-center">
              <v-btn
                :loading="isDownloading.includes(file.id)"
                variant="text"
                size="small"
                icon="mdi-cloud-download-outline"
                :aria-label="$t('components.learningPlan.link.download')"
                :title="$t('components.learningPlan.link.download')"
                @click="downloadFile(file.url, file.title, file.id)"
              >
              </v-btn>
              <v-btn
                v-if="!readOnly"
                color="error-0"
                variant="text"
                icon="mdi-trash-can-outline"
                size="small"
                @click="() => deleteFile(file)"
              >
              </v-btn>
            </div>
          </div>
        </div>
      </template>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3';
import VideoPlayer from '../VideoJS.vue';
import AudioPlayer from './AudioPlayer.vue';
const { setMessage } = useMessageStore();
const { t } = useI18n();
const config = useRuntimeConfig();
const fileInputRef = ref();
const isLoading = ref(false);
const fileDrop = ref(false);
type FileType = {
  title: string;
  extension: string;
  size: number;
  id: string;
  url: string;
};

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

const filesArray = ref<FileType[]>(
  Array.isArray(props.node.attrs.files) ? [...(props.node.attrs.files as FileType[])] : [],
);

watch(
  () => props.node.attrs.files,
  (newValue) => {
    if (Array.isArray(newValue)) {
      filesArray.value = [...(newValue as FileType[])];
    }
  },
);

const isDownloading = ref<string[]>([]);

// onBeforeMount(() => {
//   if (!Array.isArray(props.files) && props.files.dropFiles) {
//     addFile(props.files.dropFiles);
//   }
// });

const formatFileSize = (size: number) => {
  size = size * 1000;
  if (size < 1024) {
    return `${size.toFixed(2)} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
};

const fileBackground: { [key: string]: string } = {
  pdf: 'error-0',
  doc: 'blue-darken-3',
  docx: 'blue-darken-3',
  txt: 'blue-darken-3',
  rtf: 'blue-darken-3',
  odt: 'blue-darken-3',
  xls: 'green',
  xlsx: 'green',
  csv: 'green',
  ppt: 'orange-darken-1',
  pptx: 'orange-darken-1',
  key: 'orange-darken-1',
  jpg: 'img',
  jpeg: 'img',
  png: 'img',
  gif: 'img',
  bmp: 'img',
  svg: 'img',
  mp4: 'pink',
  avi: 'pink',
  mov: 'pink',
  wmv: 'pink',
  mp3: 'brown',
  wav: 'brown',
  flac: 'brown',
  aac: 'brown',
  zip: 'deep-purple-darken-1',
  rar: 'deep-purple-darken-1',
  '7z': 'deep-purple-darken-1',
  exe: 'black',
  app: 'black',
  html: 'deep-orange',
  css: 'light-blue-lighten-3',
  js: 'amber-lighten-1',
  py: 'blue-lighten-1',
  java: 'orange-darken-3',
  cpp: 'light-blue-darken-4',
  cs: 'deep-purple-darken-3',
  c: 'light-blue-darken-4',
  php: 'indigo-lighten-3',
};

const setFileBackground = (extension: string) => {
  return fileBackground[extension.toLocaleLowerCase()] || 'gray-blue';
};

type PreviewType = 'pdf' | 'image' | 'video' | 'audio';

const previewTypes: { [key: string]: PreviewType } = {
  pdf: 'pdf',
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  gif: 'image',
  bmp: 'image',
  svg: 'image',
  webp: 'image',
  mp4: 'video',
  webm: 'video',
  ogv: 'video',
  mov: 'video',
  mp3: 'audio',
  wav: 'audio',
  ogg: 'audio',
  oga: 'audio',
  aac: 'audio',
  m4a: 'audio',
  flac: 'audio',
};

const getPreviewType = (extension: string): PreviewType | undefined => {
  return previewTypes[extension?.toLocaleLowerCase()];
};

const failedPreviews = ref<string[]>([]);
const checkedVideos = ref<string[]>([]);
const audioOnlyVideos = ref<string[]>([]);

const hasPreview = (file: FileType) => !!getPreviewType(file.extension) && !failedPreviews.value.includes(file.id);

const isAudioFile = (file: FileType) =>
  getPreviewType(file.extension) === 'audio' || audioOnlyVideos.value.includes(file.id);

const checkVideoTrack = (event: Event, id: string) => {
  const video = event.target as HTMLVideoElement;
  if (!video.videoWidth && !video.videoHeight) {
    audioOnlyVideos.value.push(id);
  }
  checkedVideos.value.push(id);
};

const videoMimeTypes: { [key: string]: string } = {
  webm: 'video/webm',
  ogv: 'video/ogg',
};

const videoPlayerOptions = (file: FileType) => ({
  controls: true,
  fluid: true,
  playbackRates: [0.5, 1, 1.5, 2],
  sources: [
    {
      src: resolveFileUrl(file.url),
      type: videoMimeTypes[file.extension?.toLocaleLowerCase()] || 'video/mp4',
    },
  ],
});

const resolveFileUrl = (url: string) => {
  if (url.startsWith('/')) {
    return new URL(url, config.public.strapiUrl).toString();
  }
  if (!url.startsWith('http')) {
    return `https://${url}`;
  }
  return url;
};

const downloadFile = async (url: string, title: string, id: string) => {
  isDownloading.value.push(id);
  try {
    const downloadUrl = resolveFileUrl(url);
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`File download failed with status ${response.status}`);
    }

    const objectUrl = URL.createObjectURL(await response.blob());
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = title;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch {
    setMessage(t('components.editorjs.fileSet.error.download'), 'error', true);
  } finally {
    const downloadingIndex = isDownloading.value.indexOf(id);
    if (downloadingIndex !== -1) {
      isDownloading.value.splice(downloadingIndex, 1);
    }
  }
};

const addFileFromDrop = (event: DragEvent) => {
  event.preventDefault();
  fileDrop.value = false;
  const dropFiles = event.dataTransfer?.files;
  if (dropFiles) {
    addFile(dropFiles);
  }
};

const addFile = async (files: FileList) => {
  const addFiles = Array.from(files);
  isLoading.value = true;
  for (let i = 0; i < addFiles.length; i++) {
    const file = addFiles[i];
    if (file.size > 200 * 1024 * 1024) {
      setMessage(
        t('components.editorjs.fileSet.error.maxFileSize', {
          maxFilesize: '200MB',
          filename: file.name,
        }),
        'error',
        true,
      );
      addFiles.splice(i, 1);
      if (!addFiles.length) {
        isLoading.value = false;
        return;
      }
    }
  }
  const res = await props.extension.options.uploadFiles(addFiles);
  if (res.success) {
    filesArray.value.push(...res.files);
    props.updateAttributes({
      files: filesArray.value,
    });
  } else {
    setMessage(t('components.editorjs.fileSet.error.addFile'), 'error', true);
  }
  isLoading.value = false;
};

const deleteFile = (file: FileType) => {
  props.extension.options.handleDeletedFiles(file.id);
  const index = filesArray.value.findIndex((f) => f.id === file.id);
  filesArray.value.splice(index, 1);
  props.updateAttributes({
    files: filesArray.value,
  });
};
</script>

<style scoped>
.fileInput {
  border: 2px dashed var(--Cinza-Cinza-200, #d2d6da);
  &:hover {
    border: 2px dashed var(--Cinza-Cinza-300, #b9bfc6);
  }
}

.fileItem {
  border: 1px solid var(--Cinza-Cinza-100, #ebedef);
  &:hover {
    border: 1px solid var(--Cinza-Cinza-300, #b9bfc6);
  }
}

.file-border {
  border-radius: 7px 0 0 7px;
}

.h-62 {
  height: 62px;
}

.file-content {
  flex: 1 1 auto;
  min-width: 0;
}

.file-text {
  flex: 1 1 auto;
  min-width: 0;
}

.file-actions {
  flex-shrink: 0;
  column-gap: 4px;
}

.file-entry--preview {
  flex-basis: 100%;
}

.file-preview {
  border: 1px solid var(--Cinza-Cinza-100, #ebedef);
  overflow: hidden;
}

.file-preview--pending {
  height: 0;
  border: 0;
  visibility: hidden;
}

.file-preview__actions {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.file-preview__actions--pdf {
  top: 56px;
  right: 24px;
}

.file-preview__pdf {
  display: block;
  width: 100%;
  height: min(70vh, 720px);
  border: 0;
}

.file-preview__image {
  display: block;
  max-width: 100%;
  max-height: 70vh;
  margin: 0 auto;
  object-fit: contain;
}

.drop-area {
  transition: 0.3s ease;
  border-radius: 8px;
  &[data-active='true']:not([readonly]) {
    display: block;
    background-color: #d1f6fa7e;
  }
}
</style>
