<template>
  <div class="d-flex flex-column ga-4 w-100">
    <div v-for="(item, index) in items" :key="item.id" class="tw-border rounded-lg pa-4">
      <div class="d-flex align-center ga-2 mb-3">
        <span class="text-body-3 text-gray-500">{{ index + 1 }}.</span>
        <alex-custom-chip
          :text="t(`${i18n}.types.${item.type}`)"
          :prepend-icon="typeIcons[item.type]"
          size="small"
          status="secondary"
          variant="tonal"
        />
        <h5 class="text-h5 text-gray-800">{{ item.title }}</h5>
      </div>

      <template v-if="item.type === 'text'">
        <p v-if="readonly" class="text-body-2 text-gray-800 tw-whitespace-pre-wrap">
          {{ model[item.id]?.text || t(`${i18n}.student.noAnswer`) }}
        </p>
        <alex-inputs-text-area
          v-else
          :model-value="model[item.id]?.text ?? ''"
          :name="`submissionText-${item.id}`"
          :label="t(`${i18n}.student.textPlaceholder`)"
          @update:model-value="(text: string) => updateAnswer(item.id, { text })"
        />
      </template>

      <template v-else-if="item.type === 'url'">
        <template v-if="readonly">
          <a
            v-if="model[item.id]?.url"
            class="text-body-2 text-secondary-0"
            :href="model[item.id]?.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ model[item.id]?.url }}
          </a>
          <p v-else class="text-body-2 text-gray-400">{{ t(`${i18n}.student.noAnswer`) }}</p>
        </template>
        <alex-inputs-text-field
          v-else
          :model-value="model[item.id]?.url ?? ''"
          :name="`submissionUrl-${item.id}`"
          :label="t(`${i18n}.student.urlPlaceholder`)"
          density="compact"
          @update:model-value="(url: string) => updateAnswer(item.id, { url })"
        />
      </template>

      <template v-else-if="item.type === 'quiz'">
        <alex-learningplan-task-submission-items-quiz-answer
          :questions="item.questions"
          :model-value="model[item.id]?.quiz ?? {}"
          :readonly="readonly"
          @update:model-value="(quiz) => updateAnswer(item.id, { quiz })"
        />
      </template>

      <template v-else>
        <div class="d-flex flex-column ga-3">
          <template v-if="item.type === 'image'">
            <div v-for="file in model[item.id]?.files ?? []" :key="file.id" class="position-relative">
              <img
                class="submission-item__image rounded-lg"
                :src="resolveFileUrl(file.url)"
                :alt="file.name"
                @click="openImageViewer(file)"
              />
              <alex-custom-button
                v-if="!readonly"
                class="submission-item__remove"
                icon="mdi-trash-can-outline"
                size="small"
                variant="text"
                :title="t(`${i18n}.remove`)"
                @click="removeFile(item.id, file.id)"
              />
            </div>
          </template>
          <template v-else-if="item.type === 'video'">
            <div v-for="file in model[item.id]?.files ?? []" :key="file.id" class="position-relative">
              <video-player class="videoFile" :options="videoPlayerOptions(file)" custom-classes="video-fluid" />
              <alex-custom-button
                v-if="!readonly"
                class="submission-item__remove"
                icon="mdi-trash-can-outline"
                size="small"
                variant="text"
                :title="t(`${i18n}.remove`)"
                @click="removeFile(item.id, file.id)"
              />
            </div>
          </template>
          <div v-else class="d-flex flex-wrap ga-2">
            <alex-learningplan-task-submission-items-file-card
              v-for="file in model[item.id]?.files ?? []"
              :key="file.id"
              :file="file"
              :removable="!readonly"
              @remove="removeFile(item.id, file.id)"
            />
          </div>
          <p v-if="readonly && !model[item.id]?.files?.length" class="text-body-2 text-gray-400">
            {{ t(`${i18n}.student.noAnswer`) }}
          </p>
          <template v-if="!readonly">
            <alex-custom-button
              class="align-self-start"
              :text="t(`${i18n}.student.upload`)"
              prepend-icon="mdi-upload-outline"
              size="small"
              variant="outlined"
              :loading="uploadingItem === item.id"
              @click="fileInputs[item.id]?.click()"
            />
            <input
              :ref="(el) => (fileInputs[item.id] = el as HTMLInputElement)"
              type="file"
              class="d-none"
              :accept="acceptByType[item.type]"
              @change="(event) => uploadFile(item.id, event)"
            />
          </template>
        </div>
      </template>
    </div>
    <alex-media-image-viewer v-model="imageViewer" :src="imageViewerFile?.src" :alt="imageViewerFile?.title" />
  </div>
</template>

<script setup lang="ts">
import VideoPlayer from '~/components/TipTap/custom-plugins/VideoJS.vue';
import type {
  SubmissionAnswers,
  SubmissionItem,
  SubmissionItemAnswer,
  SubmissionItemType,
  SubmissionUploadedFile,
} from '~/composables/useSubmissionItems';

withDefaults(defineProps<{ items: SubmissionItem[]; readonly?: boolean }>(), { readonly: false });
const model = defineModel<SubmissionAnswers>({ default: () => ({}) });
const { t } = useI18n();
const { setMessage } = useMessageStore();
const strapiClient = useStrapiClient();
const config = useRuntimeConfig();
const i18n = 'components.courses.tasks.submission_items';

const typeIcons: Record<SubmissionItemType, string> = {
  text: 'mdi-text',
  image: 'mdi-image-outline',
  video: 'mdi-video-outline',
  file: 'mdi-paperclip',
  url: 'mdi-link-variant',
  quiz: 'mdi-help-circle-outline',
};

const acceptByType: Partial<Record<SubmissionItemType, string>> = {
  image: 'image/*',
  video: 'video/*',
};

const fileInputs = ref<Record<string, HTMLInputElement | null>>({});
const uploadingItem = ref<string | null>(null);

const updateAnswer = (itemId: string, changes: SubmissionItemAnswer) => {
  model.value = { ...model.value, [itemId]: { ...model.value[itemId], ...changes } };
};

const resolveFileUrl = (url: string) => (url.startsWith('/') ? new URL(url, config.public.strapiUrl).toString() : url);

const uploadFile = async (itemId: string, event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  uploadingItem.value = itemId;
  try {
    const formData = new FormData();
    formData.append('files', file, file.name);
    const [uploaded] = await strapiClient<Upload[]>('/upload', { method: 'POST', body: formData });
    const newFile: SubmissionUploadedFile = {
      id: uploaded.id,
      name: uploaded.name?.slice(0, uploaded.name.lastIndexOf('.')) || file.name,
      ext: uploaded.ext || '',
      size: uploaded.size || 0,
      url: uploaded.url,
    };
    updateAnswer(itemId, { files: [...(model.value[itemId]?.files ?? []), newFile] });
  } catch {
    setMessage(t(`${i18n}.student.uploadError`), 'error', true);
  } finally {
    uploadingItem.value = null;
    input.value = '';
  }
};

const removeFile = (itemId: string, fileId: number) => {
  updateAnswer(itemId, { files: (model.value[itemId]?.files ?? []).filter((file) => file.id !== fileId) });
};

const imageViewer = ref(false);
const imageViewerFile = ref<{ src: string; title: string } | null>(null);

const openImageViewer = (file: SubmissionUploadedFile) => {
  imageViewerFile.value = { src: resolveFileUrl(file.url), title: file.name };
  imageViewer.value = true;
};

const videoMimeTypes: Record<string, string> = {
  '.webm': 'video/webm',
  '.ogv': 'video/ogg',
};

const videoPlayerOptions = (file: SubmissionUploadedFile) => ({
  controls: true,
  fluid: true,
  playbackRates: [0.5, 1, 1.5, 2],
  sources: [
    {
      src: resolveFileUrl(file.url),
      type: videoMimeTypes[file.ext.toLocaleLowerCase()] || 'video/mp4',
    },
  ],
});
</script>

<style scoped>
.submission-item__image {
  display: block;
  max-width: 100%;
  max-height: 420px;
  cursor: zoom-in;
}

.submission-item__remove {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(255, 255, 255, 0.9);
}
</style>
