<template>
  <div class="w-100 d-flex flex-column justify-center align-center">
    <v-progress-linear
      v-if="uploading"
      indeterminate
      class="mb-1"
      color="accent"
    />
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
        @click="openAddSlidesDialog(-1, false)"
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
      >
        <template #content>
          <div v-if="!readOnly" class="ma-2 config-icon">
            <alex-custom-button
              color="gray-500"
              icon="mdi-cog"
              style="
                background-color: rgba(255, 255, 255, 0.25) !important;
                z-index: 0 !important;
              "
              @click="openAddSlidesDialog(-1, slides)"
            />
          </div>
          <video-player
            v-if="slide.type.includes('File') && slide.video"
            ref="videoJS"
            class="w-100 fill-height video-js"
            controls
            :is-active="activeSlide == i"
            :options="videoPlayerOptions(slide)"
          ></video-player>
          <video-player
            v-else-if="
              slide.type.includes('youtube') || slide.type.includes('vimeo')
            "
            ref="videoJSWeb"
            class="w-100 fill-height video-js"
            controls
            :options="videoPlayerOptions(slide)"
            :is-active="activeSlide == i"
            :data-setup="JSON.stringify({ techOrder: [slide.type] })"
          ></video-player>
          <nuxt-img
            v-else
            :key="slide.title"
            :src="slide.image"
            :alt="slide.title"
          />
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
        @click="openAddSlidesDialog(-1, false)"
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
        :breakpoints="carouselBreakPoints"
        fixed-height="120px"
        style="z-index: 0; max-width: 850px; max-height: 120px"
        @slide="onCarouselSlide($event)"
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
          :image="slide.image"
          :class="activeSlide == i ? 'vueperslide-active rounded' : 'rounded'"
          @click="onSlideClick(slide)"
        >
          <template #content>
            <div v-if="!readOnly" class="ma-2 d-flex align-center justify-end">
              <alex-custom-button
                aria-label="edit"
                elevation="0"
                icon="mdi-pencil-outline"
                class="bg-gray-blue rounded-lg mr-1"
                size="small"
                variant="secondary"
                @click="openAddSlidesDialog(i, false)"
              >
                <v-icon size="20px" icon="mdi-pencil-outline" color="accent" />
              </alex-custom-button>
              <alex-custom-button
                aria-label="delete"
                elevation="0"
                icon="mdi-trash-can-outline"
                size="small"
                variant="secondary"
                class="bg-gray-blue rounded-lg"
                @click="deleteSlide(slide)"
              >
                <v-icon
                  size="20px"
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
    <FileModal
      ref="dialog"
      @upload-files="addSlide"
      @change-slides="editSlides"
    />
  </div>
</template>

<script setup lang="ts">
import { VueperSlides, VueperSlide } from 'vueperslides';
import 'vueperslides/dist/vueperslides.css';
import VideoPlayer from './VideoJS.vue';
import FileModal from './FileModal.vue';
const props = defineProps({
  slides: {
    type: Array,
    default: () => [],
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  onUpdateSlides: {
    type: Function,
    default: () => {},
  },
  onSelectFile: {
    type: Function,
    default: () => {},
  },
  onDeletedSlide: {
    type: Function,
    default: () => {},
  },
});
const vueperslides1 = ref();
const vueperslides2 = ref();
const videoJS = ref();
const videoJSWeb = ref();
const uploading = ref(false);
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
        ctx?.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
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

function getYoutubeThumbnail(url: string) {
  return `https://img.youtube.com/vi/${url.split('v=')[1]}/0.jpg`;
}

function getVimeoThumbnail(url: string) {
  return `https://vumbnail.com/${url.split('vimeo.com/')[1]}.jpg`;
}

const videoPlayerOptions = (slide) => {
  let type = slide.type;
  let url = slide.video;
  if (slide.type.includes('File')) {
    type = 'mp4';
    url = slide.video;
  }
  const data = {
    playbackRates: [0.5, 1, 1.5, 2],
    poster: slide.image,
    sources: [
      {
        src: url,
        type: `video/${type}`,
      },
    ],
  };
  return JSON.stringify(data);
};

const carouselBreakPoints = computed(() => {
  return {
    900: { visibleSlides: !props.readOnly ? 2.5 : 3.5 },
    600: {
      fixedHeight: '80px',
      visibleSlides: !props.readOnly ? 2.5 : 3.5,
    },
  };
});

const onSlideClick = (slide) => {
  const index = slides.value.indexOf(slide);
  if (index === -1) return;
  vueperslides2.value.goToSlide(index);
};

const onCarouselSlide = (event) => {
  if (slides.value[activeSlide.value].video) {
    if (slides.value[activeSlide.value].type.includes('File')) {
      videoJS.value.forEach((video) => {
        video.pause();
      });
    } else {
      videoJSWeb.value.forEach((video) => {
        video.pause();
      });
    }
  }
  vueperslides1.value.goToSlide(event.currentSlide.index, { emit: false });
  activeSlide.value = event.currentSlide.index;
};

interface Slide {
  title: string;
  image: string;
  type: string;
  icon: string;
  imgId?: string;
  videoId?: string;
  video?: string;
  url?: string;
}

function newSlide(file, res) {
  if (file.type.includes('image')) {
    return {
      title: file.title,
      image: res.url,
      type: 'FileImage',
      icon: file.icon,
      imgId: res.imgId,
    };
  } else {
    return {
      title: file.title,
      video: res.url,
      image: res.thumbnail,
      type: 'FileVideo',
      icon: file.icon,
      imgId: res.imgId,
      videoId: res.videoId,
    };
  }
}
const activeSlide = ref(0);
const dialog = ref();
const openAddSlidesDialog = (index, slides) => {
  dialog.value.openModal(index, slides);
};
const slides = ref<Slide[]>([...(props.slides as Slide[])]);

const deleteSlide = (item) => {
  if (item.type.includes('File')) {
    props.onDeletedSlide(item);
  }
  slides.value.splice(slides.value.indexOf(item), 1);
  props.onUpdateSlides(slides.value);
};

const addSlide = async (slide, index) => {
  const slidesChanged = index !== -1;
  const slidesArray = [...slide];
  if (index !== -1) {
    props.onDeletedSlide(slides.value[index]);
  }
  for (const slide of slidesArray) {
    if (typeof slide.url === 'string') {
      addSlideByUrl(slide, index);
    } else {
      await addSlideByFile(slide, index);
    }
  }
  if (slidesChanged) {
    vueperslides2.value.goToSlide(index);
  } else {
    vueperslides2.value.goToSlide(slides.value.length - 1);
  }
};

const addSlideByFile = async (slide, index) => {
  const slidesChanged = index !== -1;
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
  uploading.value = true;
  const res = await props.onSelectFile(files);
  slidesChanged
    ? slides.value.splice(index, 1, newSlide(slide, res))
    : slides.value.push(newSlide(slide, res));
  props.onUpdateSlides(slides.value);
  uploading.value = false;
};

const addSlideByUrl = (slide, index) => {
  const slidesChanged = index !== -1;
  let newSlide = {} as Slide;
  if (
    slide.url.startsWith('https://www.youtube.com') ||
    slide.url.startsWith('https://vimeo.com/')
  ) {
    let image, type;
    if (slide.url.includes('www.youtube')) {
      type = 'youtube';
      image = getYoutubeThumbnail(slide.url);
    } else {
      type = 'vimeo';
      image = getVimeoThumbnail(slide.url);
    }
    newSlide = {
      title: slide.title,
      video: slide.url,
      image,
      type,
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
  slidesChanged
    ? slides.value.splice(index, 1, newSlide)
    : slides.value.push(newSlide);
  props.onUpdateSlides(slides.value);
};

const editSlides = async (files, deleted, added) => {
  await deleted.forEach((slide) => {
    deleteSlide(slide);
  });
  slides.value = [...files];
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
    props.onUpdateSlides(slides.value);
  }
};
const backgroundImgColor = AlexThemeColors['gray-blue'];
</script>

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
  transition: all 1s;
}
.slides-track-container .vueperslide {
  transform: scale(0.9);
}
.slides-track-container .vueperslide-active,
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
.vueperslide img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: v-bind('backgroundImgColor');
}
</style>
