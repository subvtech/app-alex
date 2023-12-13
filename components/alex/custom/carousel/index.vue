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
        :class="editMode && slides.length < 1 ? '' : 'd-none'"
        class="rounded"
        @click="openAddSlidesDialog(-1)"
      >
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
          slide.type.includes('File')
            ? uploadBaseUrl + slide.image
            : slide.image
        "
      >
        <template #content>
          <div v-if="editMode" class="ma-2 config-icon">
            <v-btn
              color="grey"
              variant="text"
              @click="openAddSlidesDialog(-1, slides)"
            >
              <v-icon
                size="large"
                icon="mdi-cog"
                class="rounded-lg pa-4"
                style="background-color: #ffffff94; z-index: 0"
                color="gray-700"
              />
            </v-btn>
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
    <div
      class="d-flex thumbnails-container slides-track-container w-100"
      :class="slides.length == 0 ? 'justify-center' : 'justify-space-around'"
    >
      <div
        v-if="editMode"
        class="d-flex align-center justify-center rounded bg-gray-200 mr-2 mr-sm-10 addSlide"
        elevation="0"
        @click="openAddSlidesDialog(-1)"
      >
        <v-icon color="blue-grey-darken-1" size="36px" icon="mdi-image-plus" />
      </div>
      <vueper-slides
        ref="vueperslides2"
        class="no-shadow rounded thumbnails-container slides-track-container"
        :class="slides.length == 0 ? 'w-0' : 'w-100'"
        :visible-slides="4.5 - Number(editMode)"
        :slide-multiple="false"
        :gap="1"
        :slide-ratio="2 / 4"
        :dragging-distance="50"
        :arrowsOutside="false"
        :infinite="false"
        :bullets="false"
        :autoplay="false"
        disable-arrows-on-edges
        :breakpoints="{
          900: { visibleSlides: editMode ? 2.5 : 3.5 },
          600: {
            fixedHeight: '80px',
            visibleSlides: editMode ? 2.5 : 3.5,
          },
        }"
        fixedHeight="120px"
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
          <v-icon
            color="black"
            icon="mdi-chevron-left"
            class="bg-white rounded"
          />
        </template>
        <template #arrow-right>
          <v-icon
            color="black"
            icon="mdi-chevron-right"
            class="bg-white rounded"
          />
        </template>
        <vueper-slide
          v-for="(slide, i) in slides"
          :key="i"
          class="slide-track-item"
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
            <div v-if="editMode" class="ma-2">
              <v-btn
                size="small"
                variant="text"
                color="green"
                @click="openAddSlidesDialog(i)"
              >
                <v-icon
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
  <!-- </div> -->
</template>

<script setup lang="ts">
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
      title: file.name,
      image: res.url.url,
      type: 'FileImage',
    };
  } else {
    return {
      title: file.name,
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
const vueperslides2 = ref(null);
const openAddSlidesDialog = (index, slides) => {
  dialog.value.openModal(index, slides);
};
// eslint-disable-next-line vue/no-setup-props-destructure
const slides = ref([...props.slides]);
const deleteSlide = (item) => {
  if (item.type.includes('File')) {
    onDeletedSlide(item);
  }
  slides.value.splice(slides.value.indexOf(item), 1);
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
  try {
    const res = onSelectFile(files);
    index === -1
      ? slides.value.push(newSlide(slide, res))
      : slides.value.splice(index, 1, newSlide(slide, res));
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
      title: slide.title,
      video: slide.url,
      image: slide.url.includes('www.youtube')
        ? `https://img.youtube.com/vi/${slide.url.split('v=')[1]}/0.jpg`
        : `https://vumbnail.com/${slide.url.split('vimeo.com/')[1]}.jpg`,
      type: slide.url.includes('www.youtube') ? 'youtube' : 'vimeo',
    };
  } else {
    newSlide = {
      title: slide.title,
      image: slide.url,
      type: 'UrlImage',
    };
  }
  index === -1
    ? slides.value.push(newSlide)
    : slides.value.splice(index, 1, newSlide);
};

const editSlides = (f, deleted, added) => {
  deleted.forEach((slide) => {
    deleteSlide(slide);
  });
  slides.value = [...f];
  added.forEach((slide) => {
    const index = f.indexOf(slide);
    if (typeof slide.url === 'string') {
      addSlideByUrl(slide, index);
    } else {
      addSlideByFile(slide, index);
    }
  });
};

const onDeletedSlide = async (file) => {
  (await strapiClient)<Upload>('/upload/files', {
    method: 'GET',
  }).then((res) => {
    const files = res;
    const fileImage = files.find((f) => f.url === file.image);
    strapiClient<Upload>(`/upload/files/${fileImage.id}`, {
      method: 'DELETE',
    });
    if (file.video) {
      const fileVideo = files.find((f) => f.url === file.video);
      strapiClient<Upload>(`/upload/files/${fileVideo.id}`, {
        method: 'DELETE',
      });
    }
  });
};

const onSelectFile = (slides) => {
  const formData = new FormData();
  slides.forEach((slide) => {
    if (slide.url instanceof File) {
      formData.append('files', slide.url, slide.name);
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
      const imageFile = new File([blob], slide.name, {
        type: mimeType,
      });
      formData.append('files', imageFile, imageFile.name);
    }
  });
  strapiClient<Upload>('/upload', {
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
  color: #ffffffaf;
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
