<template>
  <alex-custom-dialog
    v-model="dialog"
    :title="$t('components.carousel.dialogTitle')"
    :secondary-button-text="$t('components.carousel.dialogSecondaryButton')"
    :main-button-text="
      editSlideMode === 'config'
        ? $t('components.carousel.dialogMainButtonConfig')
        : $t('components.carousel.dialogMainButton')
    "
    :no-footer="editSlideMode == 'edit'"
    @on-main-action="() => upload()"
    @on-secondary-action="() => (dialog = false)"
  >
    <v-container class="px-3">
      <p class="text-gray-800 text-body-1">
        {{ $t('components.carousel.mediaType') }}
      </p>
      <alex-inputs-radio-button
        v-model="addMediaType"
        style="margin-left: -10px"
        inline
        :buttons="[
          {
            label: 'Upload',
            value: 'upload',
          },
          {
            label: 'Url',
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
          @click="$refs.inputFile.click()"
          @dragenter.prevent="fileDrop = true"
          @dragover.prevent="fileDrop = true"
          @dragleave.prevent="fileDrop = false"
          @drop.prevent="addSlides($event, 'drop'), (fileDrop = false)"
        >
          <input
            ref="inputFile"
            accept="image/, video/"
            type="file"
            class="d-none"
            :multiple="editSlideMode === 'edit' ? false : true"
            @change="(file) => addSlides(file, 'input')"
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
              {{ $t('components.carousel.fileDropText') }}
              <strong class="text-accent text-decoration-underline">
                {{ $t('components.carousel.fileDropHighlightedText') }}
              </strong>
            </p>
            <p
              v-else
              class="text-h5 font-weight-bold text-secondary-0 text-center"
            >
              {{ $t('components.carousel.fileDropActionText') }}
            </p>
          </div>
        </div>
        <div v-else-if="addMediaType == 'url'" class="w-100">
          <div class="d-flex w-100">
            <alex-inputs-text-field
              v-model="urlInput"
              name="url"
              :placeholder="$t('components.carousel.linkPlaceholder')"
              :rules="urlRules"
              variant="outlined"
              density="compact"
              class="w-100"
            >
            </alex-inputs-text-field>

            <alex-custom-button
              icon="mdi-plus"
              class="ml-2"
              size="42px"
              :loading="isLoading"
              @click="addUrl(urlInput)"
            ></alex-custom-button>
          </div>
          <div class="rounded d-flex justify-center align-center w-100">
            <div
              style="position: relative"
              class="d-flex flex-column align-center justify-center preview-area w-100"
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
                    {{ $t('components.carousel.linkPreviewText') }}
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
                    v-if="pastedLink == 'image'"
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
      <div v-if="slides.length > 0 && editSlideMode !== 'edit'" class="w-100">
        <p class="text-primary text-h6 font-weight-bold mt-5 mb-2">Playlist</p>
        <alex-custom-accordion v-model:data="slides">
          <template #content="{ index }">
            <alex-inputs-text-field
              v-model="slides[index].title"
              placeholder="Insira o título"
              label="Titulo da Mídia"
              :name="`title+${index}`"
            >
            </alex-inputs-text-field>
          </template>
        </alex-custom-accordion>
      </div>
    </v-container>
  </alex-custom-dialog>
</template>

<script setup>
import { ref } from 'vue';
const messageStore = useMessageStore();
const urlInput = ref('');
const slides = ref([]);
const dialog = ref(false);
const fileDrop = ref(false);
const editSlideMode = ref('add');
const editIndex = ref(-1);
const addMediaType = ref('upload');
const pastedLink = ref(false);
const isLoading = ref(false);
const deletedSlides = ref([]);
const addedSlides = ref([]);

const emit = defineEmits({
  uploadFiles(slides) {
    return slides;
  },
  changeSlides(slides, deletedSlides, addedSlides) {
    return { slides, deletedSlides, addedSlides };
  },
});

const upload = () => {
  if (slides.value.length === 0) return (dialog.value = false);
  dialog.value = false;
  if (editSlideMode.value === 'config') {
    emit('changeSlides', slides.value, deletedSlides.value, addedSlides.value);
  } else {
    emit('uploadFiles', slides.value, editIndex.value);
  }

  slides.value = [];
};

const openModal = (index, editSlides) => {
  urlInput.value = '';
  dialog.value = true;
  fileDrop.value = false;
  editIndex.value = index;
  slides.value.length =
    deletedSlides.value.length =
    addedSlides.value.length =
      0;
  if (index !== -1) editSlideMode.value = 'edit';
  else if (editSlides) {
    editSlideMode.value = 'config';
    slides.value = [...editSlides];
  } else editSlideMode.value = 'add';
  addMediaType.value = 'upload';
  pastedLink.value = false;
};

defineExpose({
  openModal,
});

const addSlides = (files, type) => {
  const filesArray =
    type === 'drop'
      ? Array.from(files.dataTransfer.files)
      : Array.from(files.target.files);
  if (filesArray.length === 0) return;
  filesArray.forEach((f) => {
    if (!f.type.includes('video') && !f.type.includes('image')) {
      messageStore.message = 'Formato de arquivo inválido';
      messageStore.color = 'red';
      messageStore.show = true;
      return;
    }
    const slide = {
      url: f,
      title: f.name,
      type: f.type,
      icon: f.type.includes('video') ? 'mdi-youtube' : 'mdi-image',
    };
    addedSlides.value.push(slide);
    return slides.value.push(slide);
  });
  if (editSlideMode.value === 'edit') upload();
};

const urlRules = [
  async (v) => {
    if (v === '' || urlInput.value === null) {
      pastedLink.value = false;
      return true;
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+/;
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|svg|webp)|\/(jpg|jpeg|png|gif|bmp|svg|webp)/i;

    if (imageRegex.test(v)) {
      pastedLink.value = 'image';
      return true;
    }

    if (youtubeRegex.test(v) || vimeoRegex.test(v)) {
      const res = await fetch(`https://noembed.com/embed?url=${v}`);
      const data = await res.json();

      if (!data.error) {
        pastedLink.value = `${data.provider_name} | ${data.title}`;
        return true;
      } else {
        pastedLink.value = false;
        return 'A URL para o video inserido é inválida';
      }
    } else {
      pastedLink.value = false;
      return 'Por favor, insira uma URL válida';
    }
  },
];

const addUrl = (url) => {
  if (!pastedLink.value || urlInput.value === '') return;
  isLoading.value = true;
  let videoTitle = url;
  let type = 'UrlImage';
  let icon = 'mdi-image';
  if (pastedLink.value !== 'image') {
    videoTitle = pastedLink.value.split(' | ')[1];
    type = 'UrlVideo';
    icon = 'mdi-youtube';
  }
  addedSlides.value.push({ url, title: videoTitle, type, icon });
  slides.value.push({ url, title: videoTitle, type, icon });
  if (editSlideMode.value === 'edit') upload();
  urlInput.value = '';
  isLoading.value = false;
  pastedLink.value = false;
};
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
