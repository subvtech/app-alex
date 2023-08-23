<template>
  <v-card class="attaches-card pa-2">
    <v-card-title class="filename text-truncate" :title="attachesBlock.title">
      {{ attachesBlock.title }}
    </v-card-title>
    <v-card-subtitle>
      <v-icon>mdi-{{ icon }}</v-icon>
      {{ extension.toUpperCase() }} -
      {{ fileSize | bytes }}
    </v-card-subtitle>
    <v-card-actions class="pa-1">
      <v-row justify="end" class="pa-0">
        <!-- <v-btn
          v-if="extension === 'pdf'"
          icon
          color="primary"
          @click="openPDFViewer"
        >
          <v-icon>mdi-eye</v-icon>
        </v-btn> -->
        <v-btn
          v-if="isDesktop && downloaded"
          icon
          color="primary"
          @click="openFile"
        >
          <v-icon>mdi-folder-open</v-icon>
        </v-btn>
        <v-btn icon color="primary" @click="download">
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </v-row>
    </v-card-actions>
    <!-- <pdf-viewer
      :ref="'PDFViewer' + attachesBlock.id"
      :data-key="attachesBlock.id"
      :url="attachesBlock.file.downloadedUrl || attachesBlock.file.url"
      :title="attachesBlock.title"
    /> -->
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps({
  attachesBlock: {
    type: Object,
    required: true,
  },
  isDesktop: {
    type: Boolean,
    default: false,
  },
});

const { isDesktop, attachesBlock } = toRefs(props);

const url = computed(() => {
  return attachesBlock.value.file.downloadedUrl || attachesBlock.value.file.url;
});
const downloaded = computed(() => {
  return attachesBlock.value.downloaded;
});
const extension = computed(() => {
  return attachesBlock.value.file.extension;
});

const fileSize = computed(() => {
  return attachesBlock.value.file.size * 1024;
});
const icon = computed(() => {
  const formats = {
    pdf: 'file-pdf-box',
    xls: 'microsoft-excel',
    xlsx: 'microsoft-excel',
    doc: 'microsoft-word',
    docx: 'microsoft-word',
    ppt: 'microsoft-powerpoint',
    pptx: 'microsoft-powerpoint',
    zip: 'folder-zip',
    txt: 'file',
    png: 'file-image',
    jpeg: 'file-image',
    jpg: 'file-image',
    gif: 'file-image',
    svg: 'file-image',
  };

  return formats[extension.value] || 'file';
});

function download() {
  const url2 = downloaded.value ? `file://${url.value}` : url.value;
  const mode = downloaded.value ? 'modal' : '_blank';
  window.open(url2, mode);
}
function openFile() {
  if (!isDesktop.value) {
    return;
  }

  window.open(url.value);
}
/*
function openPDFViewer() {
  this.$refs[`PDFViewer${attachesBlock.value.id}`].handleModal(true);
}*/
</script>
<style scoped lang="scss">
.attaches-card {
  > .filename {
    width: 90%;
    font-size: 0.95rem;
    // white-space: nowrap !important;
    // overflow: hidden;
    // text-overflow: 'ellipsis';
  }
}
</style>
