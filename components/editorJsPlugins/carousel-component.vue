<template>
  <vueper-slides
    ref="vueperslides1"
    class="no-shadow mb-3 rounded"
    :slide-ratio="1 / 1.75"
    :bullets="false"
    :arrows="false"
    :dragging-distance="200"
    :touchable="false"
    :autoplay="false"
    style="z-index: 0"
    @slide="
      $refs.vueperslides2 &&
        $refs.vueperslides2.goToSlide($event.currentSlide.index, {
          emit: false,
        })
    "
  >
    <vueper-slide v-if="editMode" class="rounded">
      <template #content>
        <v-container
          class="w-100 fill-height d-flex align-center justify-center rounded py-10 bg-blue-grey-lighten-4"
          elevation="0"
          style="border: 3px dashed #abb2b9"
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
      v-for="slide in slides"
      :key="slide"
      class="rounded"
      :image="!slide.video ? uploadBaseUrl + slide.image : null"
    >
      <template #content>
        <vue-plyr v-if="slide.video">
          <video
            class="rounded w-100 fill-height video"
            controls
            :src="uploadBaseUrl + slide.video"
          ></video>
        </vue-plyr>
      </template>
    </vueper-slide>
  </vueper-slides>
  <vueper-slides
    ref="vueperslides2"
    class="no-shadow"
    :visible-slides="slides.length > 4 ? 5 : slides.length + 1"
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
      900: { visibleSlides: slides.length < 1 ? 0 : 3 },
      600: { fixedHeight: '110px', visibleSlides: slides.length < 1 ? 0 : 3 },
    }"
    fixedHeight="120px"
    style="z-index: 0"
    @slide="
      $refs.vueperslides1 &&
        $refs.vueperslides1.goToSlide($event.currentSlide.index, {
          emit: false,
        })
    "
  >
    <template #arrow-left>
      <v-icon color="white" size="60px" icon="mdi-chevron-left" />
    </template>
    <template #arrow-right>
      <v-icon color="white" size="60px" icon="mdi-chevron-right" />
    </template>
    <vueper-slide v-if="editMode">
      <template #content>
        <v-container
          class="w-100 fill-height d-flex align-center justify-center rounded py-10"
          elevation="0"
          style="border: 3px dashed #abb2b9"
        >
          <p color="blue-grey-darken-1" style="font-size: 30px">+</p>
          <input
            accept="image/*, video/*"
            type="file"
            class="w-100 h-100 bg-green inputFile"
            title=""
            @change="(file) => addSlide(file, -1)"
          />
        </v-container>
      </template>
    </vueper-slide>
    <vueper-slide
      v-for="slide in slides"
      :key="slide"
      :image="uploadBaseUrl + slide.image"
      class="bg-blue-grey-lighten-4 rounded"
      @click="
        $refs.vueperslides2 &&
          $refs.vueperslides2.goToSlide(
            !editMode ? slides.indexOf(slide) : slides.indexOf(slide) + 1,
          )
      "
    >
      <template #content>
        <div v-if="editMode" class="ma-2">
          <v-btn icon="mdi-pencil-outline" class="editBtn">
            <v-icon
              size="x-small"
              icon="mdi-pencil-outline"
              class="bg-green-lighten-5 rounded-lg pa-3"
              color="green-lighten-1"
            />
            <input
              accept="image/*, video/*"
              type="file"
              class="w-100 h-100 bg-green inputFile"
              title=""
              @change="(file) => editSlide(slide, file)"
            />
          </v-btn>
          <V-icon
            size="x-small"
            icon="mdi-trash-can-outline"
            class="pa-3 ml-2 bg-red-lighten-5 rounded-lg"
            color="red"
            @click="deleteSlide(slide)"
          />
        </div>
        <div v-if="slide.video" class="rounded">
          <div class="pa-1 bg-grey video-play-icon rounded-xl">
            <v-icon color="white" size="38px" icon="mdi-play"></v-icon>
          </div>
        </div>
      </template>
    </vueper-slide>
  </vueper-slides>
</template>

<script>
import { VueperSlides, VueperSlide } from 'vueperslides';
import 'vueperslides/dist/vueperslides.css';
import { ref, defineComponent } from 'vue';

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
export default defineComponent({
  name: 'carousel-component',
  components: { VueperSlides, VueperSlide },
  props: {
    slides: {
      type: Array,
      default: () => [],
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
    readOnly: {
      type: Boolean,
      default: false,
    },
    uploadBaseUrl: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    function newSlide(file, res) {
      if (file.target.files[0].type.includes('image')) {
        return {
          name: file.target.files[0].name,
          image: res.url.url,
          video: false,
        };
      } else {
        return {
          name: file.target.files[0].name,
          video: res.url.url,
          image: res.thumbnail.thumbnail,
        };
      }
    }
    // eslint-disable-next-line vue/no-setup-props-destructure
    const editMode = ref(!props.readOnly);
    // eslint-disable-next-line vue/no-setup-props-destructure
    const slides = ref([...props.slides]);
    const deleteSlide = (item) => {
      props.onDeletedSlide(item);
      slides.value.splice(slides.value.indexOf(item), 1);
      props.onUpdateSlides(slides.value);
    };
    const addSlide = async (file, index) => {
      if (file.target.files.length === 0) return;
      const files = [file.target.files[0]];
      if (file.target.files[0].type.includes('video')) {
        await captureVideoFrame(file.target.files[0]).then((res) => {
          files.push(res);
        });
      }
      try {
        await props.onSelectFile(files).then((res) => {
          index === -1
            ? slides.value.push(newSlide(file, res))
            : (slides.value[index] = newSlide(file, res));
          props.onUpdateSlides(slides.value);
        });
      } catch (error) {
        console.log(error);
      }
    };
    const editSlide = (slide, file) => {
      const index = slides.value.indexOf(slide);
      props.onDeletedSlide(slide);
      addSlide(file, index);
    };

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      slides,
      editMode,
      deleteSlide,
      addSlide,
      editSlide,
    };
  },
});
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
.thumbnails {
  margin: auto;
  max-width: 300px;
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

.vueperslide--active {
  opacity: 1;
  border-color: #000;
  transform: scale(1);
}

.video-play-icon {
  position: absolute;
  top: 75%;
  left: 80%;
  transform: translate(-50%, -50%);
}
</style>
