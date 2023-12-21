<template>
  <div class="w-100 d-flex flex-column justify-center align-center">
    <vueper-slides
      ref="vueperslides1"
      class="no-shadow mb-4 rounded d-block w-100"
      :slide-ratio="2 / 4"
      :bullets="false"
      :arrows="false"
      :dragging-distance="200"
      :touchable="false"
      :autoplay="false"
      style="z-index: 0; max-width: 850px"
    >
      <vueper-slide
        :class="!readOnly && slides.length < 1 ? '' : 'd-none'"
        class="rounded"
        @click="openAddSlidesDialog(-1)"
      >
        <template #content>
          <v-container
            class="w-100 fill-height d-flex align-center justify-center rounded py-10 bg-gray-blue"
            elevation="0"
          >
            <v-icon color="accent" size="100px" icon="mdi-image-area" />
          </v-container>
        </template>
      </vueper-slide>

      <vueper-slide
        v-for="(slide, i) in slides"
        :key="slide"
        :class="activeSlide == i ? 'vueperslide-active rounded' : 'rounded'"
        :image="
          slide.type.includes('File')
            ? uploadBaseUrl + slide.image
            : slide.image
        "
      >
        <template #content>
          <div v-if="!readOnly" class="ma-2 config-icon">
            <alex-custom-button
              color="gray-700"
              class="text-green"
              icon="mdi-cog"
              style="
                background-color: rgba(0, 0, 0, 0.25) !important;
                z-index: 0 !important;
              "
              @click="openAddSlidesDialog(-1, slides)"
            />
          </div>
          <video-player
            v-if="slide.type.includes('File') && slide.video"
            class="w-100 fill-height video-js"
            controls
            :is-active="activeSlide == i"
            :options="{
              playbackRates: [0.5, 1, 1.5, 2],
              poster: uploadBaseUrl + slide.image,
              sources: [
                {
                  src: uploadBaseUrl + slide.video,
                  type: 'video/mp4',
                },
              ],
            }"
            :data-setup="{}"
          ></video-player>
          <video-player
            v-else-if="
              slide.type.includes('youtube') || slide.type.includes('vimeo')
            "
            class="w-100 fill-height video-js"
            controls
            :options="{
              playbackRates: [0.5, 1, 1.5, 2],
            }"
            :is-active="activeSlide == i"
            :data-setup="
              JSON.stringify({
                techOrder: [slide.type],
                sources: [
                  {
                    src: slide.video,
                    type: `video/${slide.type}`,
                  },
                ],
              })
            "
          ></video-player>
        </template>
      </vueper-slide>
    </vueper-slides>
    <div
      v-if="slides.length > 0"
      class="d-flex thumbnails-container slides-track-container w-100"
      :class="slides.length == 0 ? 'justify-center' : 'justify-space-around'"
    >
      <div
        v-if="!readOnly"
        class="d-flex align-center justify-center rounded bg-gray-blue mr-2 mr-sm-4 addSlide"
        elevation="0"
        @click="openAddSlidesDialog(-1)"
      >
        <v-icon color="accent" size="36px" icon="mdi-image-plus-outline" />
      </div>
      <vueper-slides
        ref="vueperslides2"
        role="slider"
        class="no-shadow thumbnails-container slides-track-container"
        :class="slides.length == 0 ? 'w-0' : 'w-100'"
        :visible-slides="
          slides.length < 5 ? slides.length : 4.5 - Number(!readOnly)
        "
        :slide-multiple="false"
        :gap="1"
        :slide-ratio="2 / 4"
        :dragging-distance="50"
        :arrows-outside="false"
        :infinite="false"
        :bullets="false"
        :autoplay="false"
        disable-arrows-on-edges
        :breakpoints="{
          900: { visibleSlides: !readOnly ? 2.5 : 3.5 },
          600: {
            fixedHeight: '80px',
            visibleSlides: !readOnly ? 2.5 : 3.5,
          },
        }"
        fixed-height="120px"
        style="z-index: 0; max-width: 850px; max-height: 120px"
        @slide="
          $refs.vueperslides1 &&
            $refs.vueperslides1.goToSlide($event.currentSlide.index, {
              emit: false,
            }),
            (activeSlide = $event.currentSlide.index)
        "
      >
        <template #arrow-left>
          <alex-custom-button
            color="gray-600"
            icon="mdi-chevron-left"
            class="bg-white rounded-lg ml-2"
            variant="text"
          ></alex-custom-button>
        </template>
        <template #arrow-right>
          <alex-custom-button
            color="gray-600"
            icon="mdi-chevron-right"
            class="bg-white rounded-lg"
            variant="text"
          ></alex-custom-button>
        </template>
        <vueper-slide
          v-for="(slide, i) in slides"
          :key="i"
          role="img"
          :aria-label="slide.title"
          class="slide-track-item"
          style="max-width: 200px"
          :image="
            slide.type.includes('File')
              ? uploadBaseUrl + slide.image
              : slide.image
          "
          :class="activeSlide == i ? 'vueperslide-active rounded' : 'rounded'"
          @click="
            $refs.vueperslides2 &&
              $refs.vueperslides2.goToSlide(slides.indexOf(slide))
          "
        >
          <template #content>
            <div v-if="!readOnly" class="ma-2 d-flex align-center justify-end">
              <alex-custom-button
                aria-label="edit"
                elevation="0"
                color="blue"
                icon="mdi-pencil-outline"
                class="bg-gray-blue rounded-lg mr-1"
                size="28px"
                variant="secondary"
                @click="openAddSlidesDialog(i)"
              >
                <v-icon size="small" icon="mdi-pencil-outline" color="accent" />
              </alex-custom-button>
              <alex-custom-button
                aria-label="delete"
                elevation="0"
                color="red"
                icon="mdi-trash-can-outline"
                size="28px"
                variant="secondary"
                class="bg-gray-blue rounded-lg"
                @click="deleteSlide(slide)"
              >
                <v-icon
                  size="small"
                  color="red"
                  icon="mdi-trash-can-outline"
                ></v-icon>
              </alex-custom-button>
            </div>
            <div v-if="slide.video" class="rounded">
              <div
                class="pa-1 video-play-icon rounded-xl d-flex align-center justify-center"
              >
                <v-icon color="white" icon="mdi-play"></v-icon>
              </div>
            </div>
          </template>
        </vueper-slide>
      </vueper-slides>
    </div>
  </div>
  <FileModal
    ref="dialog"
    @upload-files="(f, index) => addSlide(f, index)"
    @change-slides="(f, added, deleted) => editSlides(f, added, deleted)"
  />
</template>

<script setup>
import { VueperSlides, VueperSlide } from 'vueperslides';
import 'vueperslides/dist/vueperslides.css';
import { ref } from 'vue';
import VideoPlayer from './VideoJS.vue';
import FileModal from './FileModal.vue';
import { useMessageStore } from '~/stores/message';
const messageStore = useMessageStore();
const strapiClient = useStrapiClient();
const props = defineProps({
  slides: {
    type: Array,
    default: () => [],
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['slidesChanged']);

const uploadBaseUrl = computed(() => useStrapiUrl().replace('/api', ''));

const captureVideoFrame = (file) => {
  return new Promise((resolve, reject) => {
    const videoEl = document.createElement('video');
    videoEl.muted = true;
    videoEl.autoplay = false;
    videoEl.preload = 'metadata';
    videoEl.src = URL.createObjectURL(file);

    videoEl.addEventListener('loadedmetadata', () => {
      const canvas = document.createElement('canvas');
      canvas.width = videoEl.videoWidth;
      canvas.height = videoEl.videoHeight;
      const ctx = canvas.getContext('2d');
      const seekTime = Math.min(3, videoEl.duration);
      videoEl.currentTime = seekTime;

      videoEl.addEventListener('seeked', () => {
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        const thumbnailDataUrl = canvas.toDataURL('image/jpeg');
        videoEl.remove();
        canvas.remove();
        resolve(thumbnailDataUrl);
      });

      videoEl.addEventListener('error', (e) => {
        reject(e);
      });
    });
  });
};

function newSlide(file, res) {
  if (file.type.includes('image')) {
    return {
      title: file.title,
      image: res.url.url,
      type: 'FileImage',
      icon: file.icon,
    };
  } else {
    return {
      title: file.title,
      video: res.url.url,
      image: res.thumbnail.thumbnail,
      type: 'FileVideo',
      icon: file.icon,
    };
  }
}

// const editMode = ref(!props.readOnly);
const dialog = ref();
const activeSlide = ref(0);
const vueperslides2 = ref();
const openAddSlidesDialog = (index, slides) => {
  dialog.value.openModal(index, slides);
};

const slides = ref([...props.slides]);
const deleteSlide = (item) => {
  if (item.type.includes('File')) {
    onDeletedSlide(item);
  }
  slides.value.splice(slides.value.indexOf(item), 1);
  emit('slidesChanged', slides.value, 'teste');
};

const addSlide = async (slide, index) => {
  const slidesArray = [...slide];
  if (index !== -1) {
    onDeletedSlide(slides.value[index]);
  }
  for (const s of slidesArray) {
    if (typeof s.url === 'string') {
      addSlideByUrl(s, index);
    } else {
      await addSlideByFile(s, index);
    }
  }
  if (index === -1) {
    vueperslides2.value.goToSlide(slides.value.length - 1);
  } else {
    vueperslides2.value.goToSlide(index);
  }
};

const addSlideByFile = async (slide, index) => {
  const files = [slide];
  if (slide.url.type.includes('video')) {
    await captureVideoFrame(slide.url).then((res) => {
      files.push({
        url: res,
        title: `${slide.title.replace(/\.[^/.]+$/, '')}-thumbnail.jpg`,
        type: 'image/jpeg',
      });
    });
  }
  const res = await onSelectFile(files);
  if (res.success !== 1) {
    return;
  }
  index === -1
    ? slides.value.push(newSlide(slide, res))
    : slides.value.splice(index, 1, newSlide(slide, res));
  emit('slidesChanged', slides.value);
};

const addSlideByUrl = (slide, index) => {
  let newSlide = {};
  if (
    slide.url.startsWith('https://www.youtube.com') ||
    slide.url.startsWith('https://vimeo.com/')
  ) {
    newSlide = {
      title: slide.title,
      video: slide.url,
      image: slide.url.includes('www.youtube')
        ? `https://img.youtube.com/vi/${slide.url.split('v=')[1]}/0.jpg`
        : `https://vumbnail.com/${slide.url.split('vimeo.com/')[1]}.jpg`,
      type: slide.url.includes('www.youtube') ? 'youtube' : 'vimeo',
      icon: slide.icon,
    };
  } else {
    newSlide = {
      title: slide.title,
      image: slide.url,
      type: 'UrlImage',
      icon: slide.icon,
    };
  }
  index === -1
    ? slides.value.push(newSlide)
    : slides.value.splice(index, 1, newSlide);
  emit('slidesChanged', slides.value);
};

const editSlides = async (f, deleted, added) => {
  await deleted.forEach((slide) => {
    deleteSlide(slide);
  });
  slides.value = [...f];
  await added.forEach((slide) => {
    const index = slides.value.findIndex(
      (s) => s.title === slide.title && s.url === slide.url,
    );
    if (typeof slide.url === 'string') {
      addSlideByUrl(slide, index);
    } else {
      addSlideByFile(slide, index);
    }
  });
  if (added.length === 0) {
    emit('slidesChanged', slides.value);
  }
};

const onDeletedSlide = async (file) => {
  await strapiClient('/upload/files', {
    method: 'GET',
  }).then((res) => {
    const files = res;
    const fileImage = files.find((f) => f.url === file.image);
    strapiClient(`/upload/files/${fileImage.id}`, {
      method: 'DELETE',
    });
    if (file.video) {
      const fileVideo = files.find((f) => f.url === file.video);
      strapiClient(`/upload/files/${fileVideo.id}`, {
        method: 'DELETE',
      });
    }
  });
};

const onSelectFile = (slides) => {
  const formData = new FormData();
  slides.forEach((slide) => {
    if (slide.url instanceof File) {
      formData.append('files', slide.url, slide.title);
    } else if (typeof slide.url === 'string' && slide.url.startsWith('data:')) {
      const base64Data = slide.url.split(',')[1];
      const binaryString = window.atob(base64Data);
      const byteArray = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
      }

      let mimeType = 'image/png';
      if (slide.url.startsWith('data:image/jpeg')) {
        mimeType = 'image/jpeg';
      }

      const blob = new Blob([byteArray], { type: mimeType });
      const imageFile = new File([blob], slide.title, {
        type: mimeType,
      });
      formData.append('files', imageFile, imageFile.name);
    }
  });
  return strapiClient('/upload', {
    method: 'POST',
    body: formData,
  })
    .then((res) => {
      if (slides.length > 1) {
        const url = res[0].url;
        const thumbnail = res[1].url;
        return { success: 1, url: { url }, thumbnail: { thumbnail } };
      } else {
        const url = res[0].url;
        return { success: 1, url: { url } };
      }
    })
    .catch((err) => {
      messageStore.message = err;
    });
};
</script>

<style>
.vueperslides__arrow {
  opacity: 1 !important;
}
</style>
<style scoped>
.inputFile {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}
.editBtn {
  width: 24px;
  height: 24px;
}

.vueperslide {
  transition: 0.3s ease-in-out;
  opacity: 0.85;
  cursor: pointer;
  -webkit-transition: opacity 1s;
  transition: opacity 1s;
  transform: scale(0.9);
  transition: all 1s;
}

.vueperslide-active {
  opacity: 1;
  transform: scale(1);
}

.video-play-icon {
  position: absolute;
  top: 75%;
  left: 80%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.25);
  width: 36px;
  height: 36px;
}

.config-icon {
  position: absolute;
  z-index: 99;
  right: 25px;
}

.addSlide {
  width: 180px;
  height: 120px;
  max-width: 25%;
  cursor: pointer;
}

.thumbnails-container {
  transition: all ease 1s;
}

.slides-track-container {
  z-index: 0;
  max-width: 850px;
  max-height: 120px;
}

.slides-track-item {
  max-width: 213px;
  max-height: 120px;
}

@media (max-width: 600px) {
  .video-play-icon {
    left: 70%;
  }
  .addSlide {
    height: 80px;
  }
}
</style>
