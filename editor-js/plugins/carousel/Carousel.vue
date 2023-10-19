<template>
  <vueper-slides
    ref="vueperslides1"
    class="no-shadow mb-3 rounded"
    :slide-ratio="2 / 4"
    :bullets="false"
    :arrows="false"
    :dragging-distance="200"
    :touchable="false"
    :autoplay="false"
    style="z-index: 0"
  >
    <vueper-slide v-if="editMode" class="rounded">
      <template #content>
        <v-container
          class="w-100 fill-height d-flex align-center justify-center rounded py-10 bg-blue-grey-lighten-4"
          elevation="0"
        >
          <v-icon
            color="blue-grey-lighten-1"
            size="100px"
            icon="mdi-image-area"
          />
        </v-container>
      </template>
    </vueper-slide>

    <vueper-slide
      v-for="(slide, i) in slides"
      :key="slide"
      :class="activeSlide == i ? 'vueperslide-active rounded' : 'rounded'"
      :image="
        slide.type.includes('File') ? uploadBaseUrl + slide.image : slide.image
      "
    >
      <template #content>
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
          data-setup="{}"
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
  <vueper-slides
    ref="vueperslides2"
    class="no-shadow"
    :visible-slides="slides.length > 4 ? 5.5 : slides.length + 1"
    :slide-multiple="false"
    :gap="1"
    :slide-ratio="1 / 4"
    :dragging-distance="50"
    :arrowsOutside="false"
    :infinite="false"
    :bullets="false"
    :autoplay="false"
    disable-arrows-on-edges
    :breakpoints="{
      900: { visibleSlides: slides.length < 1 ? 0 : 3.5 },
      600: { fixedHeight: '80px', visibleSlides: slides.length < 1 ? 0 : 3.5 },
    }"
    fixedHeight="120px"
    style="z-index: 0"
    @slide="
      $refs.vueperslides1 &&
        $refs.vueperslides1.goToSlide($event.currentSlide.index, {
          emit: false,
        }),
        (activeSlide = editMode
          ? $event.currentSlide.index - 1
          : $event.currentSlide.index)
    "
  >
    <template #arrow-left>
      <v-icon color="black" icon="mdi-chevron-left" class="bg-white rounded" />
      />
    </template>
    <template #arrow-right>
      <v-icon color="black" icon="mdi-chevron-right" class="bg-white rounded" />
    </template>
    <vueper-slide v-if="editMode">
      <template #content>
        <v-container
          class="w-100 fill-height d-flex align-center justify-center rounded py-10"
          elevation="0"
          style="border: 3px dashed #abb2b9"
          @click="openAddSlidesDialog(-1)"
        >
          <p color="blue-grey-darken-1" style="font-size: 30px">+</p>
        </v-container>
      </template>
    </vueper-slide>
    <vueper-slide
      v-for="(slide, i) in slides"
      :key="slide"
      :image="
        slide.type.includes('File') ? uploadBaseUrl + slide.image : slide.image
      "
      :class="activeSlide == i ? 'vueperslide-active rounded' : 'rounded'"
      @click="
        $refs.vueperslides2 &&
          $refs.vueperslides2.goToSlide(
            !editMode ? slides.indexOf(slide) : slides.indexOf(slide) + 1,
          )
      "
    >
      <template #content>
        <div v-if="editMode" class="ma-2">
          <v-btn
            icon="mdi-pencil-outline"
            variant="text"
            @click="openAddSlidesDialog(i)"
          >
            <v-icon
              size="x-small"
              icon="mdi-pencil-outline"
              class="bg-green-lighten-5 rounded-lg pa-3"
              color="green-lighten-1"
            />
          </v-btn>
          <V-icon
            size="x-small"
            icon="mdi-trash-can-outline"
            class="pa-3 bg-red-lighten-5 rounded-lg"
            color="red"
            @click="deleteSlide(slide)"
          />
        </div>
        <div v-if="slide.video" class="rounded">
          <div class="pa-1 bg-grey video-play-icon rounded-xl">
            <v-icon color="white" size="28px" icon="mdi-play"></v-icon>
          </div>
        </div>
      </template>
    </vueper-slide>
  </vueper-slides>
  <FileModal ref="dialog" @upload-files="(f, index) => addSlide(f, index)" />
</template>

<script setup>
import { VueperSlides, VueperSlide } from 'vueperslides';
import 'vueperslides/dist/vueperslides.css';
import { ref } from 'vue';
import VideoPlayer from './VideoJS.vue';
import FileModal from './FileModal.vue';
import { useMessageStore } from '~/stores/message';
const messageStore = useMessageStore();
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
  uploadBaseUrl: {
    type: String,
    default: '',
  },
});

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
      name: file.name,
      image: res.url.url,
      type: 'FileImage',
    };
  } else {
    return {
      name: file.name,
      video: res.url.url,
      image: res.thumbnail.thumbnail,
      type: 'FileVideo',
    };
  }
}
// eslint-disable-next-line vue/no-setup-props-destructure
const editMode = ref(!props.readOnly);
const dialog = ref(null);
const activeSlide = ref(0);
const openAddSlidesDialog = (index) => {
  dialog.value.openModal(index);
};
// eslint-disable-next-line vue/no-setup-props-destructure
const slides = ref([...props.slides]);
const deleteSlide = (item) => {
  if (item.type.includes('File')) {
    props.onDeletedSlide(item);
  }
  slides.value.splice(slides.value.indexOf(item), 1);
  props.onUpdateSlides(slides.value);
};

const addSlide = async (slide, index) => {
  const slidesArray = [...slide];
  if (index !== -1) {
    props.onDeletedSlide(slides.value[index]);
  }
  for (const s of slidesArray) {
    if (typeof s.url === 'string') {
      addSlideByUrl(s, index);
    } else {
      await addSlideByFile(s, index);
    }
  }
};

const addSlideByFile = async (f, index) => {
  const files = [f];
  if (f.type.includes('video')) {
    await captureVideoFrame(f).then((res) => {
      files.push(res);
    });
  }
  try {
    const res = await props.onSelectFile(files);
    index === -1
      ? slides.value.push(newSlide(f, res))
      : slides.value.splice(index, 1, newSlide(f, res));
    props.onUpdateSlides(slides.value);
  } catch (error) {
    messageStore.message = error;
  }
};

const addSlideByUrl = (slide, index) => {
  let newSlide = {};
  if (
    slide.url.startsWith('https://www.youtube.com') ||
    slide.url.startsWith('https://vimeo.com/')
  ) {
    newSlide = {
      name: slide.name,
      video: slide.url,
      image: slide.url.includes('www.youtube')
        ? `https://img.youtube.com/vi/${slide.url.split('v=')[1]}/0.jpg`
        : `https://vumbnail.com/${slide.url.split('vimeo.com/')[1]}.jpg`,
      type: slide.url.includes('www.youtube') ? 'youtube' : 'vimeo',
    };
  } else {
    newSlide = {
      name: slide.name,
      image: slide.url,
      type: 'UrlImage',
    };
  }
  index === -1
    ? slides.value.push(newSlide)
    : slides.value.splice(index, 1, newSlide);
  props.onUpdateSlides(slides.value);
};
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
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

@media (max-width: 800px) {
  .video-play-icon {
    left: 70%;
  }
}
</style>
