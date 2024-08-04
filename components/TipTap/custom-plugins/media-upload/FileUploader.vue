<template>
  <alex-custom-dialog
    v-model="dialogModel"
    :title="t(`components.tiptap.mediaUpload.${uploadType}.title`)"
    no-footer
  >
    <v-container class="px-3">
      <p class="text-gray-800 text-body-1">
        {{ t(`components.tiptap.mediaUpload.${uploadType}.button`) }}
      </p>
      <alex-inputs-radio-button
        v-model="addMediaType"
        style="margin-left: -10px"
        inline
        :buttons="[
          {
            label: t('components.tiptap.mediaUpload.fileButton'),
            value: 'upload',
          },
          {
            label: t('components.tiptap.mediaUpload.urlButton'),
            value: 'url',
          },
        ]"
      />
      <transition mode="out-in" name="slide-fade">
        <div
          v-if="addMediaType == 'upload'"
          cols="12"
          class="pa-5 rounded inputFile d-flex justify-center align-center drop-area w-100"
          :data-active="fileDrop"
          @click="inputFile?.click()"
          @dragenter.prevent="fileDrop = true"
          @dragover.prevent="fileDrop = true"
          @dragleave.prevent="fileDrop = false"
          @drop.prevent="addMedia($event), (fileDrop = false)"
        >
          <input
            ref="inputFile"
            accept="image/, video/"
            type="file"
            class="d-none"
            :multiple="false"
            @change="(event) => addMedia(event)"
          />
          <div
            class="drop-text d-flex flex-column align-center justify-center"
            style="max-width: 250px"
          >
            <img src="@/assets/svg/MediaUpload.svg" height="105" width="150" />

            <p
              v-if="!fileDrop"
              class="text-h5 font-weight-bold text-gray-600 text-center"
            >
              {{
                $t(
                  `components.tiptap.mediaUpload.${uploadType}.filePlaceholder`,
                )
              }}
              <strong class="text-accent text-decoration-underline">
                {{ $t(`components.tiptap.mediaUpload.${uploadType}.action`) }}
              </strong>
            </p>
            <p
              v-else
              class="text-h5 font-weight-bold text-secondary-0 text-center"
            >
              {{
                $t(`components.tiptap.mediaUpload.${uploadType}.dropMessage`)
              }}
            </p>
          </div>
        </div>
        <div v-else-if="addMediaType == 'url'" class="w-100">
          <div class="d-flex w-100">
            <alex-inputs-text-field
              v-model="urlInput"
              name="url"
              :placeholder="
                $t('components.tiptap.mediaUpload.inputPlaceholder')
              "
              :rules="urlRules"
              variant="outlined"
              density="compact"
              class="w-100"
            >
            </alex-inputs-text-field>

            <alex-custom-button
              icon="mdi-plus"
              class="ml-2"
              :disabled="!urlInput || pastedLink == ''"
              @click="addUrl()"
            ></alex-custom-button>
          </div>
          <div class="rounded d-flex justify-center align-center w-100">
            <div
              style="position: relative"
              class="d-flex flex-column align-center justify-center preview-area w-100 preview-area-border"
              :class="urlInput && pastedLink ? '' : 'preview-area-border'"
            >
              <transition mode="out-in" name="url-preview">
                <div
                  v-if="!pastedLink || urlInput == ''"
                  class="d-flex flex-column align-center"
                >
                  <img
                    src="@/assets/svg/UrlUpload.svg"
                    height="95"
                    width="120"
                  />

                  <p
                    style="max-width: 60%"
                    class="text-h5 font-weight-bold text-gray-600 text-center mt-1"
                  >
                    {{
                      $t(
                        `components.tiptap.mediaUpload.${uploadType}.urlPlaceholder`,
                      )
                    }}
                  </p>
                </div>
                <div
                  v-else
                  class="w-100 fill-height d-flex justify-center align-center rounded"
                >
                  <v-progress-circular
                    indeterminate
                    color="accent"
                    class="loading"
                    theme="light"
                  ></v-progress-circular>
                  <img
                    v-if="uploadType == 'image'"
                    :src="urlInput"
                    class="rounded preview-content"
                  />
                  <iframe
                    v-if="
                      pastedLink && pastedLink.startsWith('YouTube') && urlInput
                    "
                    class="rounded-lg lazy preview-content"
                    width="95%"
                    height="95%"
                    :src="`https://www.youtube.com/embed/${urlInput.replace(
                      /.*v=/,
                      '',
                    )}`"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                  <iframe
                    v-if="
                      pastedLink && pastedLink.startsWith('Vimeo') && urlInput
                    "
                    :src="`https://player.vimeo.com/video/${urlInput.replace(
                      /.*\//,
                      '',
                    )}`"
                    width="95%"
                    height="95%"
                    frameborder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    class="rounded-lg lazy"
                  ></iframe>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </transition>
    </v-container>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const messageStore = useMessageStore();
const urlInput = ref('');
const dialogModel = ref(false);
const fileDrop = ref(false);
const addMediaType = ref('upload');
const pastedLink = ref<string>('');
const inputFile: Ref<HTMLInputElement | null> = ref(null);
const uploadType = ref<'image' | 'video'>('image');

const { t } = useI18n();

const emit = defineEmits({
  uploadMedia(Media: File | string) {
    return Media;
  },
});

const upload = (media: File | string) => {
  dialogModel.value = false;
  emit('uploadMedia', media);
};

const openModal = (type: 'video' | 'image') => {
  urlInput.value = '';
  dialogModel.value = true;
  fileDrop.value = false;
  uploadType.value = type;
};

defineExpose({
  openModal,
});

const getMediaFile = (event: DragEvent | Event): File | undefined => {
  if (event instanceof DragEvent) {
    return event.dataTransfer?.files[0];
  } else if ('target' in event && event.target instanceof HTMLInputElement) {
    return event.target.files?.[0];
  }
};

const addMedia = (event: DragEvent | Event) => {
  const mediaFile = getMediaFile(event);
  if (!mediaFile?.type.includes(uploadType.value)) {
    messageStore.message = t('components.tiptap.mediaUpload.errors.fileType');
    messageStore.color = 'red';
    messageStore.show = true;
    return;
  }
  upload(mediaFile);
};

const urlRules = [
  async (url: string) => {
    if (url === '' || urlInput.value === null) {
      pastedLink.value = '';
      return true;
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+/;
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|svg|webp)|\/(jpg|jpeg|png|gif|bmp|svg|webp)/i;

    if (imageRegex.test(url)) {
      if (uploadType.value !== 'image') {
        return t('components.tiptap.mediaUpload.errors.imageSelected');
      }
      pastedLink.value = 'image';
      return true;
    }

    if (youtubeRegex.test(url) || vimeoRegex.test(url)) {
      const res = await fetch(`https://noembed.com/embed?url=${url}`);
      const data = await res.json();

      if (!data.error) {
        if (uploadType.value !== 'video') {
          return t('components.tiptap.mediaUpload.errors.videoSelected');
        }
        pastedLink.value = `${data.provider_name} | ${data.title}`;
        return true;
      } else {
        pastedLink.value = '';
        return t('components.tiptap.mediaUpload.errors.invalidVideo');
      }
    } else {
      pastedLink.value = '';
      return t('components.tiptap.mediaUpload.errors.url');
    }
  },
];

const addUrl = () => {
  if (!pastedLink.value || urlInput.value === '') return;
  upload(urlInput.value);
};

/* const handleDelete = (index) => {
  if (editSlideMode.value === 'edit') {
    deletedSlides.value.push(slides.value[index]);
  }
}; */
</script>

<style scoped>
.inputFile {
  cursor: pointer;
}

.drop-area {
  transition: 0.3s ease;
  border-radius: 8px;
  border: 2px dashed #ebedef;
  height: 360px;
  &[data-active='true'] {
    display: block;
    background-color: #d1f6fa;
    border: 2px dashed #47d9eb;
  }
}

.preview-area {
  border-radius: 8px;
  height: 360px !important;
}

.preview-area-border {
  border: 2px solid #ebedef;
}
.drop-text {
  pointer-events: none;
  gap: 32px;
}

.preview-content {
  max-width: 95%;
  max-height: 95%;
  z-index: 1;
}

.loading {
  position: absolute;
  z-index: -1;
}

.url-preview-enter-active,
.url-preview-leave-active {
  transition: opacity 0.3s ease;
}

.url-preview-enter-from,
.url-preview-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

@media screen and (max-width: 600px) {
  .preview-area,
  .drop-area {
    height: 200px !important;
  }
}
</style>
