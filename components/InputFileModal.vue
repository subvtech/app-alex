<template>
  <v-dialog v-model="dialog" width="1024">
    <v-card class="pa-3">
      <v-card-title class="d-flex justify-space-between px-3">
        <span class="text-h5 font-weight-bold">Adicione Novos Slides</span>
        <v-btn variant="text" icon="mdi-close" @click="dialog = false" />
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
              placeholder="Insira o link"
              v-model="urlInput"
              variant="solo"
            >
              <template v-slot:append-inner>
                <v-btn
                  icon="mdi-plus"
                  variant="text"
                  @click="addUrl(urlInput)"
                ></v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" class="px-0">
            <v-list v-if="slides.length > 0">
              <p class="text-primary text-h6 font-weight-bold">Slides</p>
              <!-- <v-list-item v-for="slide in slides" :key="slide"></v-list-item> -->
              <v-list-item>
                <span>Arquivos Carregados {{ slides.length }}</span>
                <v-icon icon="mdi-file-multiple" color="accent" />
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="font-weight-bold"
          elevation="1"
          size="large"
          @click="dialog = false"
        >
          Fechar
        </v-btn>
        <v-btn
          elevation="10"
          class="bg-accent font-weight-bold"
          size="large"
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
  if (!url) return;
  return slides.value.push(url);
};
</script>

<style>
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
