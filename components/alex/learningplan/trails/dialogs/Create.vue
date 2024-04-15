<template>
  <alex-custom-dialog
    v-model="dialog"
    :title="$t('pages.trails.newTrailText')"
    no-footer
    body-classes="bg-white px-6 pt-3 rounded-b-lg"
    @update:model-value="(event) => $emit('update:modelValue', event)"
  >
    <div
      class="bg-gray-blue d-flex flex-column justify-center align-center ga-2 image-container rounded"
    >
      <div
        v-if="image"
        class="w-100 h-100 d-flex justify-end pa-3"
        style="position: relative"
      >
        <img
          :src="image"
          class="rounded-lg w-100 h-100"
          style="
            position: absolute;
            top: 0;
            left: 0;

            object-fit: cover;
          "
        />
        <alex-custom-button
          aria-label="edit"
          elevation="0"
          icon="mdi-pencil-outline"
          class="bg-gray-blue rounded-lg mr-1"
          size="small"
          variant="secondary"
          @click="openFileInput"
        >
          <v-icon size="small" icon="mdi-pencil-outline" color="accent" />
        </alex-custom-button>
        <alex-custom-button
          aria-label="delete"
          elevation="0"
          icon="mdi-trash-can-outline"
          size="small"
          variant="secondary"
          class="bg-gray-blue rounded-lg"
          @click="clearImage"
        >
          <v-icon
            size="small"
            color="red"
            icon="mdi-trash-can-outline"
          ></v-icon>
        </alex-custom-button>
      </div>
      <div v-else class="d-flex flex-column align-center ga-2">
        <p class="text-h5 text-secondary-0">
          {{ $t('pages.trails.newTrailCoverText') }}
        </p>
        <alex-custom-button prepend-icon="mdi-pencil" @click="openFileInput">
          {{ $t('pages.trails.newTrailCoverAction') }}
        </alex-custom-button>
      </div>
    </div>
    <div>
      <alex-inputs-text-field
        v-model="titleValue"
        class="mt-2 mb-1"
        :label="$t('pages.trails.newTrailTitleLabel')"
        :placeholder="$t('pages.trails.newTrailTitlePlaceholder')"
        required
        :error-messages="titleErrorMsg"
        density="comfortable"
        name="title"
      />

      <alex-inputs-text-area
        v-model="descriptionValue"
        :label="$t('pages.trails.newTrailDescriptionLabel')"
        :placeholder="$t('pages.trails.newTrailDescriptionPlaceholder')"
        name="description"
        required
        density="comfortable"
        :schema="createTrailsRules.description"
        :error-messages="descriptionErrorMsg"
      />
      <v-file-input
        ref="fileInputRef"
        v-model="imageRef"
        accept="image/*"
        class="d-none"
        @change="handleFileChange"
      ></v-file-input>
      <alex-custom-dialog-footer class="rounded mt-1">
        <template #mainSlotButton>
          <alex-custom-button
            :loading="isLoading"
            prepend-icon="mdi-plus"
            :text="$t('pages.trails.newTrailAction')"
            size="large"
            :disabled="disabledButton"
            @click="createTrail"
          />
        </template>
        <template #secondarySlotButton>
          <alex-custom-button
            :text="$t('pages.trails.newTrailCancel')"
            variant="secondary"
            size="large"
            prepend-icon="mdi-close"
            @click="$emit('update:modelValue', false)"
          />
        </template>
      </alex-custom-dialog-footer>
    </div>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useField } from 'vee-validate';

export interface CreateTrailDialogComponentType {
  learningStructure: number;
}

const { createTrailsRules } = useFormRules();
const { create } = useStrapi();
const strapiClient = useStrapiClient();

const isLoading = ref(false);
const fileInputRef = ref();
const imageRef = ref();
const image = ref(null);
const dialog = ref(false);

const { setMessage } = useMessageStore();
const { t } = useI18n();

const emit = defineEmits(['courseCreated', 'update:modelValue']);

const props = withDefaults(defineProps<CreateTrailDialogComponentType>(), {});
const { value: descriptionValue, errorMessage: descriptionErrorMsg } = useField(
  'description',
  createTrailsRules.description,
);

const { value: titleValue, errorMessage: titleErrorMsg } = useField(
  'title',
  createTrailsRules.title,
);

const clearImage = () => {
  image.value = null;
  imageRef.value = null;
  fileInputRef.value = null;
};

const openFileInput = () => {
  fileInputRef.value.click();
};

const handleFileChange = () => {
  const fileInput = fileInputRef.value;
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      image.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

const disabledButton = computed(
  () =>
    !!descriptionErrorMsg.value ||
    !!titleErrorMsg.value ||
    !titleValue.value ||
    !descriptionValue.value,
);

const createTrail = async () => {
  isLoading.value = true;
  const uploadImage = fileInputRef.value.files[0];
  const formData = new FormData();
  formData.append('files', uploadImage);
  let imageData = null;
  try {
    if (uploadImage) {
      imageData = await strapiClient('/upload', {
        method: 'POST',
        body: formData,
      });
    }
    const data = {
      title: titleValue.value,
      description: descriptionValue.value,
      cover_image: imageData,
      learning_structure: props.learningStructure,
    };
    const trailData = await create('trails', data);
    setMessage(t('pages.trails.success'), 'success', true);
    emit('courseCreated', trailData.data.id);
  } catch (error) {
    setMessage(t('pages.trails.error'), 'error', true);
  } finally {
    fileInputRef.value = null;
    image.value = null;
    isLoading.value = false;
  }
};
</script>

<style scoped>
.image-container {
  height: 250px;
  width: 100%;
}
</style>
