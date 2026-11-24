<template>
  <div
    class="file-card d-flex rounded-lg text-body-2 text-gray-800 width-60 h-62"
    :class="{ 'file-card--clickable': isPdf }"
    :role="isPdf ? 'button' : undefined"
    :tabindex="isPdf ? 0 : undefined"
    :title="isPdf ? t('components.editorjs.fileSet.open') : undefined"
    @click="openPreview"
    @keydown.enter="openPreview"
  >
    <div
      class="min-w-16 file-card__border d-flex justify-center align-center"
      :class="`bg-${fileBackground[extension] || 'gray-blue'}`"
    >
      <span class="text-body-2 text-uppercase">{{ extension }}</span>
    </div>
    <div class="file-card__content d-flex ga-3 pa-3">
      <div class="file-card__text d-flex flex-column min-w-0">
        <span class="text-body-2 text-gray-900 ellipsis lines-1">{{ file.name }}</span>
        <span class="text-body-5 text-gray-500">{{ formatFileSize(file.size) }}</span>
      </div>
      <div class="d-flex justify-center align-center ga-1 flex-shrink-0" @click.stop @keydown.enter.stop>
        <v-btn
          :loading="isDownloading"
          variant="text"
          size="small"
          icon="mdi-cloud-download-outline"
          :aria-label="t('components.learningPlan.link.download')"
          :title="t('components.learningPlan.link.download')"
          @click="downloadFile"
        />
        <v-btn
          v-if="removable"
          color="error-0"
          variant="text"
          icon="mdi-trash-can-outline"
          size="small"
          :aria-label="t('components.editorjs.fileSet.remove')"
          :title="t('components.editorjs.fileSet.remove')"
          @click="emit('remove')"
        />
      </div>
    </div>

    <alex-custom-dialog
      v-model="previewDialog"
      :title="file.name"
      :max-width="submissionEvaluation ? 1600 : 1080"
      body-classes="pa-0 bg-white"
      maximizable
      no-footer
    >
      <div class="d-flex ga-4" :class="{ 'pa-4': submissionEvaluation }">
        <iframe class="file-card__pdf" :src="fileUrl" :title="file.name"></iframe>
        <alex-learningplan-task-submission-evaluation-panel
          v-if="submissionEvaluation?.evaluation.value"
          class="file-card__evaluation"
          :context="submissionEvaluation"
        />
      </div>
    </alex-custom-dialog>
  </div>
</template>

<script setup lang="ts">
import type { SubmissionUploadedFile } from '~/composables/useSubmissionItems';

const props = withDefaults(defineProps<{ file: SubmissionUploadedFile; removable?: boolean }>(), {
  removable: false,
});
const emit = defineEmits<{ remove: [] }>();
const { t } = useI18n();
const { setMessage } = useMessageStore();
const config = useRuntimeConfig();
const submissionEvaluation = useSubmissionEvaluationContext();

const fileBackground: Record<string, string> = {
  pdf: 'error-0',
  doc: 'blue-darken-3',
  docx: 'blue-darken-3',
  txt: 'blue-darken-3',
  rtf: 'blue-darken-3',
  odt: 'blue-darken-3',
  xls: 'green',
  xlsx: 'green',
  csv: 'green',
  ppt: 'orange-darken-1',
  pptx: 'orange-darken-1',
  key: 'orange-darken-1',
  mp4: 'pink',
  avi: 'pink',
  mov: 'pink',
  wmv: 'pink',
  mp3: 'brown',
  wav: 'brown',
  flac: 'brown',
  aac: 'brown',
  zip: 'deep-purple-darken-1',
  rar: 'deep-purple-darken-1',
  '7z': 'deep-purple-darken-1',
};

const extension = computed(() => props.file.ext.replace('.', '').toLocaleLowerCase() || 'file');
const isPdf = computed(() => extension.value === 'pdf');
const fileUrl = computed(() =>
  props.file.url.startsWith('/') ? new URL(props.file.url, config.public.strapiUrl).toString() : props.file.url,
);

const formatFileSize = (size: number) => {
  const bytes = size * 1000;
  if (bytes < 1024) return `${bytes.toFixed(2)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const previewDialog = ref(false);
const openPreview = () => {
  if (isPdf.value) previewDialog.value = true;
};

const isDownloading = ref(false);
const downloadFile = async () => {
  isDownloading.value = true;
  try {
    const response = await fetch(fileUrl.value);
    if (!response.ok) throw new Error(`File download failed with status ${response.status}`);
    const objectUrl = URL.createObjectURL(await response.blob());
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = `${props.file.name}${props.file.ext}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch {
    setMessage(t('components.editorjs.fileSet.error.download'), 'error', true);
  } finally {
    isDownloading.value = false;
  }
};
</script>

<style scoped>
.file-card {
  border: 1px solid var(--Cinza-Cinza-100, #ebedef);
  &:hover {
    border: 1px solid var(--Cinza-Cinza-300, #b9bfc6);
  }
}

.file-card--clickable {
  cursor: pointer;
}

.file-card__border {
  border-radius: 7px 0 0 7px;
}

.h-62 {
  height: 62px;
}

.file-card__content,
.file-card__text {
  flex: 1 1 auto;
  min-width: 0;
}

.file-card__pdf {
  display: block;
  flex: 1 1 auto;
  min-width: 0;
  height: min(80vh, 900px);
  border: 0;
}

.file-card__evaluation {
  max-height: min(80vh, 900px);
}
</style>
