<template>
  <v-dialog v-model="dialog" width="1024" persistent>
    <v-card class="pa-3">
      <v-card-title class="d-flex justify-space-between px-3">
        <span class="text-h5 font-weight-bold">Adicione Novos Slides</span>
        <v-btn
          variant="text"
          icon="mdi-close"
          color="black"
          @click="dialog = false"
        />
      </v-card-title>
      <v-card-text>
        <v-row
          class="pa-5 rounded inputFile"
          style="border: 2px dashed #00b8cc"
          @click="$refs.inputFile.click()"
        >
          <input
            ref="inputFile"
            accept="image/*, video/*"
            type="file"
            class="d-none"
            multiple
            @change="(file) => addSlides(file, -1)"
          />
          <v-col cols="12" class="d-flex justify-center align-itens-center">
            <v-icon icon="mdi-upload" class="pa-5 bg-accent rounded-xl" />
          </v-col>
          <v-col cols="12">
            <p class="text-h5 font-weight-bold text-primary text-center">
              Arraste e Solte ou
              <strong class="text-accent">Selecione os arquivos</strong>
              para fazer upload
            </p>
          </v-col>
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
          <v-col v-if="slides.length > 0" cols="12" class="px-0">
            <p class="text-primary text-h6 font-weight-bold">Slides</p>
            <v-list style="max-height: 250px">
              <v-list-item v-for="(slide, i) in slides" :key="slide">
                {{ i + 1 }} -
                <v-icon class="mr-2">
                  {{
                    typeof slide === 'string'
                      ? slide.startsWith('https://www.youtube.com') ||
                        slide.startsWith('https://vimeo.com/') ||
                        slide.startsWith('https://youtu.be')
                        ? 'mdi-play-box'
                        : 'mdi-image'
                      : slide.type.includes('video')
                      ? 'mdi-play-box'
                      : 'mdi-image'
                  }}</v-icon
                >
                <span>
                  {{
                    typeof slide == 'string'
                      ? slide.startsWith('https://www.youtube.com') ||
                        slide.startsWith('https://youtu.be')
                        ? 'Youtube Video'
                        : slide.startsWith('https://vimeo.com/')
                        ? 'Vimeo Video'
                        : 'Image URL'
                      : slide.name
                  }}
                </span>
                <template #append>
                  <v-btn
                    icon="mdi-close"
                    variant="text"
                    color="black"
                    @click="removeSlide(i)"
                  ></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
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

const emit = defineEmits({
  uploadFiles(slides) {
    return slides;
  },
});

const upload = () => {
  if (slides.value.length === 0) return (dialog.value = false);
  dialog.value = false;
  emit('uploadFiles', slides.value);
  slides.value = [];
};

const openModal = () => {
  urlInput.value = '';
  slides.value = [];
  dialog.value = true;
};

defineExpose({
  openModal,
});

const addSlides = (files) => {
  const filesArray = Array.from(files.target.files);
  if (filesArray.length === 0) return;
  filesArray.forEach((f) => {
    return slides.value.push(f);
  });
};

const addUrl = (url) => {
  if (url === '') return;
  // const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com)\/.+/;
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/;
  const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+/;
  const imageRegex =
    /\.(jpg|jpeg|png|gif|bmp|svg|webp)|\/(jpg|jpeg|png|gif|bmp|svg|webp)/i;
  if (!imageRegex.test(url)) {
    if (!youtubeRegex.test(url) && !vimeoRegex.test(url)) {
      messageStore.message = 'URL inválida';
      messageStore.color = 'red';
      messageStore.show = true;
      return;
    }
  }
  slides.value.push(url);
  urlInput.value = '';
};

const removeSlide = (index) => {
  slides.value.splice(index, 1);
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
</style>
