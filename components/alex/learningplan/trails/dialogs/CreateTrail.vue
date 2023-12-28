<template>
  <alex-custom-dialog
    title="Criar nova Trilha de Aprendizagem"
    no-footer
    body-classes="bg-white px-6 pt-3 rounded-b-lg"
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
          color="blue"
          icon="mdi-pencil-outline"
          class="bg-gray-blue rounded-lg mr-1"
          size="28px"
          variant="secondary"
          @click="openFileInput"
        >
          <v-icon size="small" icon="mdi-pencil-outline" color="accent" />
        </alex-custom-button>
        <alex-custom-button
          aria-label="delete"
          elevation="0"
          color="red"
          icon="mdi-trash-can-outline"
          size="28px"
          variant="secondary"
          class="bg-gray-blue rounded-lg"
          @click="image = null"
        >
          <v-icon
            size="small"
            color="red"
            icon="mdi-trash-can-outline"
          ></v-icon>
        </alex-custom-button>
      </div>
      <div v-else class="d-flex flex-column align-center ga-2">
        <p class="text-h5 text-secondary-0">Capa da Trilha</p>
        <alex-custom-button prepend-icon="mdi-pencil" @click="openFileInput">
          Editar
        </alex-custom-button>
      </div>
    </div>
    <v-form @submit.prevent="createTrail">
      <alex-inputs-text-field
        class="mt-2 mb-1"
        label="Do que se trata sua Trilha de Aprendizagem?"
        placeholder="Digite o título da sua trilha"
        required
        density="comfortable"
        name="title"
      />
      <alex-inputs-text-area
        label="Conte-nos mais sobre a trilha"
        placeholder="Descreva a sua trilha"
        required
        density="comfortable"
        name="description"
      />
      <v-file-input
        ref="fileInputRef"
        accept="image/*"
        class="d-none"
        @change="handleFileChange"
      ></v-file-input>
      <alex-custom-dialog-footer class="rounded mt-1">
        <template #mainSlotButton>
          <alex-custom-button
            :loading="isLoading"
            text="Criar Trilha"
            size="large"
            type="submit"
            prepend-icon="mdi-plus"
          />
        </template>
        <template #secondarySlotButton>
          <alex-custom-button
            text="Cancelar"
            variant="secondary"
            size="large"
            prepend-icon="mdi-close"
            @click="$emit('update:modelValue', false)"
          />
        </template>
      </alex-custom-dialog-footer>
    </v-form>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
const { createTrailsRules } = useFormRules();
const { create } = useStrapi();
const strapiClient = useStrapiClient();

const isLoading = ref(false);
const fileInputRef = ref(null);
const image = ref(null);

const { setMessage } = useMessageStore();

const emit = defineEmits(['courseCreated']);

const props = defineProps({
  learningStructure: {
    type: Number,
    required: true,
  },
});

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

const { handleSubmit } = useForm({
  validationSchema: createTrailsRules,
  initialValues: {
    title: '',
    description: '',
    image: null,
  },
});

const createTrail = handleSubmit(async (values) => {
  isLoading.value = true;
  const { title, description } = values;
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
      title,
      description,
      cover_image: imageData,
      learning_structure: props.learningStructure,
    };
    await create('trails', data);
    setMessage('Trilha Criada com sucesso!', 'success', true);
    emit('courseCreated');
  } catch (error) {
    setMessage(
      'Ocorreu um erro ao criar a trilha, tente novamente',
      'error',
      true,
    );
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.image-container {
  height: 250px;
  width: 100%;
}
</style>
