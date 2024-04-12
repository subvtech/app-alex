<template>
  <div class="d-flex flex-wrap ga-2 my-2">
    <v-btn
      v-if="!readOnly"
      class="fileInput d-flex align-center justify-center px-6 py-3 rounded-lg text-body-2 text-gray-800 width-60 h-62 elevation-0"
      :loading="isLoading"
      @click="fileInputRef.click()"
    >
      <v-icon class="mr-3" icon="mdi-plus"></v-icon>
      Adicionar Arquivo
      <input
        ref="fileInputRef"
        type="file"
        multiple
        class="d-none"
        @change="
          (event) => {
            const files = (event.target as HTMLInputElement).files;
            if (files) {
              addFile(files);
            }
          }
        "
      />
    </v-btn>

    <div
      v-for="file in filesArray"
      :key="file.title"
      class="fileItem d-flex rounded-lg text-body-2 text-gray-800 width-60 h-62"
    >
      <div
        class="min-w-16 teste d-flex justify-center align-center"
        :class="`bg-${setFileColor(file.extension)}`"
      >
        <span class="text-body-2 text-uppercase">{{ file.extension }}</span>
      </div>
      <div class="ma-3 d-flex ga-3 w-100">
        <div class="w-100 d-flex flex-column">
          <span class="text-body-2 text-gray-900 ellipsis lines-1 width-28">{{
            file.title
          }}</span>
          <span class="text-body-5 text-gray-500">{{
            formatFileSize(file.size)
          }}</span>
        </div>
        <div class="min-w-7 d-flex justify-center align-center">
          <alex-custom-button
            v-if="!readOnly"
            color="error--1"
            variant="text"
            icon="mdi-trash-can-outline"
            @click="() => deleteFile(file)"
          >
          </alex-custom-button>
          <alex-custom-button
            v-else
            variant="text"
            icon="mdi"
            @click="downloadFile(file.url, file.title)"
          >
            <v-icon icon="mdi-cloud-download-outline" size="20" />
          </alex-custom-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const fileInputRef = ref();
const isLoading = ref(false);
type FileType = {
  title: string;
  extension: string;
  size: number;
  id: string;
  url: string;
};

const props = defineProps({
  files: {
    type: Array as PropType<FileType[]>,
    default: () => [],
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  onAddFiles: {
    type: Function,
    default: () => {},
  },
  onDeleteFile: {
    type: Function,
    default: () => {},
  },
  onUpdateFiles: {
    type: Function,
    default: () => {},
  },
});

const formatFileSize = (size: number) => {
  size = size * 1000;
  if (size < 1024) {
    return `${size.toFixed(2)} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
};

const filesArray = ref<FileType[]>([...(props.files as FileType[])]);

const fileColors: { [key: string]: string } = {
  pdf: 'red',
  doc: 'blue',
  docx: 'blue',
  txt: 'blue',
  rtf: 'blue',
  odt: 'blue',
  xls: 'green',
  xlsx: 'green',
  csv: 'green',
  ppt: 'orange',
  pptx: 'orange',
  key: 'orange',
  jpg: 'purple',
  jpeg: 'purple',
  png: 'purple',
  gif: 'purple',
  bmp: 'purple',
  svg: 'purple',
  mp4: 'pink',
  avi: 'pink',
  mov: 'pink',
  wmv: 'pink',
  mp3: 'brown',
  wav: 'brown',
  flac: 'brown',
  aac: 'brown',
  zip: 'grey',
  rar: 'grey',
  '7z': 'grey',
  exe: 'black',
  app: 'black',
  html: 'lime',
  css: 'lime',
  js: 'lime',
  py: 'lime',
  java: 'lime',
  cpp: 'lime',
  cs: 'lime',
  c: 'lime',
  php: 'lime',
  sql: 'lime',
  json: 'lime',
};

const setFileColor = (extension: string) => {
  return fileColors[extension.toLocaleLowerCase()] || 'gray';
};

const downloadFile = (url: string, title: string) => {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement('a');
      link.setAttribute('download', title);
      link.download = title;
      const href = URL.createObjectURL(blob);
      link.href = href;
      link.click();
      URL.revokeObjectURL(href);
    });
};

const addFile = async (files: FileList) => {
  isLoading.value = true;
  const res = await props.onAddFiles(files);
  if (res.success) {
    filesArray.value.push(...res.files);
  }
  props.onUpdateFiles(filesArray.value);
  isLoading.value = false;
};

const deleteFile = (file: FileType) => {
  const index = filesArray.value.findIndex((f) => f.id === file.id);
  filesArray.value.splice(index, 1);
  props.onDeleteFile(file);
  props.onUpdateFiles(filesArray.value);
};
</script>

<style scoped>
.fileInput {
  border: 2px dashed var(--Cinza-Cinza-200, #d2d6da);
  &:hover {
    border: 2px dashed var(--Cinza-Cinza-300, #b9bfc6);
  }
}

.fileItem {
  border: 1px solid var(--Cinza-Cinza-100, #ebedef);
  &:hover {
    border: 1px solid var(--Cinza-Cinza-300, #b9bfc6);
  }
}

.teste {
  border-radius: 7px 0 0 7px;
}

.h-62 {
  height: 62px;
}
</style>
