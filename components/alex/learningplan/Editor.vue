<template>
  <v-row justify="center">
    <v-col cols="12">
      <v-row justify="end" class="mb-2">
        <v-btn color="white" class="mr-1" @click="$emit('back')">
          Cancelar
        </v-btn>
        <v-btn
          color="accent"
          class="mr-1"
          :loading="saving"
          :disabled="!updateFormValid"
          @click="() => save()"
        >
          Salvar
        </v-btn>
        <v-btn
          v-if="!data.isTrail"
          color="accent"
          :loading="saving"
          @click="openModal = true"
        >
          Criar Versão
        </v-btn>
      </v-row>
    </v-col>
    <v-col cols="11" class="pa-0 mb-8">
      <v-card class="pa-5">
        <v-card-title class="pa-0 mb-6">Informações do plano</v-card-title>
        <v-form v-model="updateFormValid">
          <v-row>
            <v-col cols="3">
              <alex-inputs-image-preview
                v-if="loadedImage"
                v-model="updateForm.image"
              />
            </v-col>
            <v-col cols="9">
              <v-row dense>
                <v-col cols="12" class="pa-0">
                  <v-text-field
                    v-model="updateForm.title"
                    :rules="updateRules.title"
                    label="Nome do Plano"
                    dense
                    outlined
                  />
                </v-col>
                <v-col cols="12" class="pa-0">
                  <v-textarea
                    v-model="updateForm.description"
                    :rules="updateRules.description"
                    rows="4"
                    label="Descrição do Plano"
                    dense
                    no-resize
                    auto-grow
                    outlined
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="3" class="pt-0 pl-0">
              <alex-inputs-users-autocomplete v-model="updateForm.coauthors" />
            </v-col>
            <v-col cols="9" class="pt-0">
              <alex-inputs-tag-combobox v-model="updateForm.tags" />
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-col>
    <v-col cols="11 " class="white pa-12">
      <app-editor ref="editor" :data="data.structure[0] || {}" />
      <v-dialog v-model="openModal" width="60%">
        <v-card class="pa-3">
          <v-card-title>Criar Versão</v-card-title>
          <v-form
            ref="createForm"
            v-model="formTagCreationValid"
            @submit.prevent="save(tag)"
          >
            <v-row justify="start" class="pa-5" dense>
              <v-col cols="12">
                <v-text-field
                  v-model="tag"
                  :rules="tagRules"
                  label="Versão"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-row justify="center">
                  <v-btn class="mr-3" @click="cancelTagCreation"
                    >Cancelar</v-btn
                  >
                  <v-btn
                    color="primary"
                    :disabled="!formTagCreationValid"
                    :loading="saving"
                    type="submit"
                  >
                    Criar
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { formRules, createFileFromUrl } from '@/helpers/utils';
const { requiredRule, min5CharactersRule } = formRules;

import { Tag } from 'models/tag.model';
import { User } from 'models/user.model';
const isObjectID = require('is-object-id');
const { update } = useStrapi();
const props = defineProps(['data']);

const { data } = toRefs(props);

const openModal = ref(false);
const saving = ref(false);
const visible = ref(false);
const confirmLeave = ref<Boolean | null>(null);
const formTagCreationValid = ref(false);
const modalType = ref('');

const editor = ref();
const createForm = ref();
const tag = ref('');
const tagRules = ref([requiredRule, min5CharactersRule]);
const updateFormValid = ref(false);
const loadedImage = ref(false);
const updateRules = ref({
  title: [requiredRule, min5CharactersRule],
  image: [],
  description: [],
});
const updateForm: globalThis.Ref<{
  title: string;
  image: File | null;
  description: string;
  coauthors: User[];
  tags: Tag[];
}> = ref({
  title: '',
  image: null,
  description: '',
  coauthors: [],
  tags: [],
});

watch(
  () => data!.value,
  async () => await loadUpdateForm(),
);
onMounted(async () => await loadUpdateForm());

const loadUpdateForm = async () => {
  const { title, description, image, coauthors, tags } = data!.value;
  updateForm.value = {
    title,
    description,
    image: null,
    coauthors: [],
    tags: [],
  };

  if (coauthors && coauthors.length) {
    updateForm.value.coauthors = coauthors.map((c) => c.id);
  }

  if (tags && tags.length) {
    updateForm.value.tags = tags;
  }

  if (image && !loadedImage.value) {
    const imageFile = await createFileFromUrl(image.url, image.name, image.ext);
    updateForm.value.image = imageFile;
  }

  loadedImage.value = true;
};

const save = async (tag = '') => {
  if (!updateForm.value) return;
  const route = useRoute();
  const { planId, trailId } = route.params;
  const { instance } = editor.value;

  saving.value = true;

  try {
    const structure = await instance.save();

    structure.blocks = structure.blocks.map((block, idx) => {
      if (!isObjectID(block.id)) {
        delete block.id;
      }

      block.order = idx + 1;

      return block;
    });

    const { title, description, image, coauthors, tags } = updateForm.value;

    const tagsIds = tags.map((t) => t.id);

    const data = {
      title,
      description,
      structure,
      tag,
      coauthors,
      tags: tagsIds,
    };
    const formData = new FormData();

    formData.append('data', JSON.stringify(data));

    if (image) {
      formData.append('files.image', image, image.name);
    }

    await update('learningplans', trailId || planId, formData as any);

    this.$success('Dados salvos com sucesso!');
    this.$emit('updated');
  } catch (err) {
    this.$error(err);
  } finally {
    openModal.value = false;
    saving.value = false;
    visible.value = false;
  }
};

const showModal = () => {
  visible.value = true;
};
const confirmLeaveAction = () => {
  confirmLeave.value = true;
  visible.value = false;
};
const cancelLeaveAction = () => {
  confirmLeave.value = false;
  visible.value = false;
};
const doNothing = () => {};
const cancelTagCreation = () => {
  openModal.value = false;
  createForm.value.reset();
};
</script>
