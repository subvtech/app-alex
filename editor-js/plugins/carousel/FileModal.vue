<template>
  <v-dialog v-model="dialog" width="1024" persistent>
    <v-card class="pa-3">
      <v-container class="d-flex justify-space-between px-3 align-center">
        <span class="text-h5 font-weight-bold"
          >Adicione Novos Vídeos ou imagens à Playlist</span
        >
        <v-btn
          variant="text"
          icon="mdi-close"
          color="black"
          class=""
          @click="dialog = false"
        />
      </v-container>
      <v-card-text>
        <v-row
          class="pa-5 rounded inputFile d-flex justify-center align-center drop-area"
          style="border: 2px dashed #00b8cc; min-height: 150px"
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
            multiple
            @change="(file) => addSlides(file, 'input')"
          />
          <div class="drop-text">
            <v-col cols="12" class="d-flex justify-center align-itens-center">
              <v-icon icon="mdi-upload" class="pa-5 bg-accent rounded-xl" />
            </v-col>
            <v-col cols="12">
              <p
                v-if="!dragActive"
                class="text-h5 font-weight-bold text-primary text-center"
              >
                Arraste e Solte ou
                <strong class="text-accent">Selecione os arquivos</strong>
                para fazer upload
              </p>
              <p
                v-else
                class="text-h5 font-weight-bold text-primary text-center"
              >
                Solte os arquivos aqui!
              </p>
            </v-col>
          </div>
        </v-row>
        <div id="orRow" class="my-10">
          <div class="orLine bg-grey-lighten-2"></div>
          <div id="orText" class="text-blue-grey-lighten-1">OU</div>
          <div class="orLine bg-grey-lighten-2"></div>
        </div>
        <v-row>
          <v-col cols="12" class="px-0">
            <p class="text-primary text-h6 font-weight-bold">
              Adicione através de URL
            </p>
          </v-col>
          <v-col cols="12" class="px-0">
            <v-text-field
              v-model="urlInput"
              placeholder="Insira o link"
              variant="solo"
              :error-messages="errors"
              @keydown.enter="addUrl(urlInput)"
            >
              <template #append-inner>
                <v-btn
                  icon="mdi-plus"
                  variant="text"
                  type="submit"
                  color="black"
                  @click="addUrl(urlInput)"
                ></v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col
            v-if="slides.length > 0 && !editSlideMode"
            cols="12"
            class="px-0"
          >
            <p class="text-primary text-h6 font-weight-bold">Playlist</p>
            <v-list style="max-height: 250px">
              <transition-group name="flip-list" tag="div">
                <v-list-item
                  v-for="(slide, i) in slides"
                  :key="slide"
                  class="text-overflow my-1 rounded-lg bg-accent"
                  :class="over.pos == i && dragging ? 'over' : ''"
                  draggable="true"
                  @dragover="(e) => onDragOver(slide, i, e)"
                  @dragend="(e) => finishDrag(slide, i, e)"
                  @dragstart="(e) => startDrag(slide, e)"
                >
                  {{ i + 1 }} -
                  <v-icon class="mr-2">
                    {{
                      typeof slide.url === 'string'
                        ? slide.url.startsWith('https://www.youtube.com') ||
                          slide.url.startsWith('https://vimeo.com/') ||
                          slide.url.startsWith('https://youtu.be')
                          ? 'mdi-play-box'
                          : 'mdi-image'
                        : slide.type.includes('video')
                        ? 'mdi-play-box'
                        : 'mdi-image'
                    }}</v-icon
                  >
                  <span>
                    {{ slide.name }}
                  </span>
                  <template #append>
                    <v-btn
                      icon="mdi-close"
                      variant="text"
                      color="white"
                      @click="removeSlide(i)"
                    ></v-btn>
                  </template>
                </v-list-item>
              </transition-group>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions v-if="!editSlideMode">
        <v-spacer></v-spacer>
        <v-btn
          class="font-weight-bold text-grey"
          variant="text"
          size="large"
          color="grey"
          @click="dialog = false"
        >
          Cancelar
        </v-btn>
        <v-btn
          class="bg-accent font-weight-bold"
          size="large"
          color="white"
          @click="upload()"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { ref } from 'vue';
const messageStore = useMessageStore();

const urlInput = ref('');
const slides = ref([]);
const dialog = ref(false);
const fileDrop = ref(false);
const editSlideMode = ref(false);
const editIndex = ref(-1);

const emit = defineEmits({
  uploadFiles(slides) {
    return slides;
  },
});

const upload = () => {
  if (slides.value.length === 0) return (dialog.value = false);
  dialog.value = false;
  emit('uploadFiles', slides.value, editIndex.value);
  slides.value = [];
};

const openModal = (index) => {
  urlInput.value = '';
  slides.value = [];
  dialog.value = true;
  fileDrop.value = false;
  editIndex.value = index;
  editSlideMode.value = index !== -1;
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
    return slides.value.push(f);
  });
  if (editSlideMode.value) upload();
};

const addUrl = async (url) => {
  if (url === '') return;
  // const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com)\/.+/;
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/;
  const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+/;
  const imageRegex =
    /\.(jpg|jpeg|png|gif|bmp|svg|webp)|\/(jpg|jpeg|png|gif|bmp|svg|webp)/i;

  let videoName = '';
  if (imageRegex.test(url)) {
    videoName = url;
  } else if (youtubeRegex.test(url) || vimeoRegex.test(url)) {
    videoName = await fetch(`https://noembed.com/embed?url=${url}`).then(
      (res) =>
        res.json().then((data) => {
          return data.title;
        }),
    );
  } else {
    messageStore.message = 'URL inválida';
    messageStore.color = 'red';
    messageStore.show = true;
    return;
  }

  slides.value.push({ url, name: videoName });
  urlInput.value = '';
  if (editSlideMode.value) upload();
};

const removeSlide = (index) => {
  slides.value.splice(index, 1);
};
const over = reactive({});
const dragFrom = ref({});
const dragging = ref(false);

const startDrag = (slide, e) => {
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', slide);
  dragging.value = true;
  dragFrom.value = slide;
};

const finishDrag = (slide, pos) => {
  slides.value.splice(pos, 1);
  slides.value.splice(over.pos, 0, slide);
  over.slide = null;
  over.pos = null;
  dragging.value = false;
};

const onDragOver = (slide, pos) => {
  over.slide = slide;
  over.pos = pos;
};
</script>

<style scoped>
#orRow {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.orLine {
  width: 100%;
  height: 1px;
}

#orText {
  margin: 0 10px;
  font-family: Sen;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
}

.inputFile {
  cursor: pointer;
}

.drop-area {
  transition: 0.3s ease;
  &[data-active='true'] {
    display: block;
    background-color: rgba(0, 184, 204, 0.1);
  }
}
.drop-text {
  pointer-events: none;
}

.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transform: all ease 0.3s;
}

.text-overflow:active {
  background-color: #00b8cca1 !important;
}

.over {
  transform: all ease 3s;
  opacity: 0.5;
}

.v-list-item {
  cursor: grab;
}

.flip-list-move {
  transition: transform 0.2s;
}
</style>
