<template>
  <div class="d-flex flex-wrap ga-2">
    <div
      class="fileInput d-flex align-center justify-center px-6 py-3 rounded text-body-2 text-gray-800 width-60 h-62 ga-3"
      @click="fileInputRef.click()"
    >
      <v-icon icon="mdi-plus"></v-icon>
      <p>Adicionar Arquivo</p>
      <input
        ref="fileInputRef"
        type="file"
        multiple
        class="d-none"
        @change="onFileChange"
      />
    </div>

    <div
      v-for="file in files"
      :key="file.title"
      class="fileItem d-flex rounded text-body-2 text-gray-800 width-60 h-62"
    >
      <div
        class="min-w-16 rounded-s-lg d-flex justify-center align-center"
        :class="`bg-${setFileColor(file.extension)}`"
      >
        <span class="text-body-2 text-uppercase">{{ file.extension }}</span>
      </div>
      <div class="ma-3 d-flex ga-3 w-100">
        <div class="w-100 d-flex flex-column">
          <!-- Add ellipsis -->
          <span class="text-body-2 text-gray-900">{{ file.title }}</span>
          <span class="text-body-5 text-gray-500">{{ file.size }}</span>
        </div>
        <div class="min-w-7 d-flex justify-center align-center">
          <v-icon icon="mdi-trash-can-outline"></v-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const fileInputRef = ref();
const editMode = ref(false);

const files = [
  { title: 'File1', extension: 'txt', size: 1000 },
  { title: 'File2', extension: 'pdf', size: 2000 },
  { title: 'File3', extension: 'doc', size: 3000 },
];

const setFileColor = (extension: string) => {
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
  };

  return fileColors[extension] || 'gray';
};

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files) {
    for (let i = 0; i < files.length; i++) {
      console.log(files[i]);
    }
  }
};
</script>

<style scoped>
.fileInput {
  cursor: pointer;
  border-radius: 8px;
  border: 2px dashed var(--Cinza-Cinza-200, #d2d6da);
  display: flex;
}

.fileItem {
  border-radius: 8px;
  border: 1px solid var(--Cinza-Cinza-100, #ebedef);
}

.h-62 {
  height: 62px;
}
</style>
