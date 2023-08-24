<template>
  <v-row justify="center">
    <v-col cols="12">
      <v-row justify="end" class="mb-2">
        <v-btn color="white" class="mr-1" @click="emit('back')">
          {{ $t('editor.cancel') }}
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
          v-if="!data.attributes.isTrail"
          color="accent"
          :loading="saving"
          @click="openModal = true"
        >
          {{ $t('editor.createVersion') }}
        </v-btn>
      </v-row>
    </v-col>
    <v-col cols="11" class="pa-0 mb-8">
      <v-card class="pa-5">
        <v-card-title class="pa-0 mb-6">
          {{ $t('editor.formTitle') }}</v-card-title
        >
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
                    :label="$t('editor.planTitle')"
                    dense
                    outlined
                  />
                </v-col>
                <v-col cols="12" class="pa-0">
                  <v-textarea
                    v-model="updateForm.description"
                    :rules="updateRules.description"
                    rows="4"
                    :label="$t('editor.planDescription')"
                    dense
                    no-resize
                    auto-grow
                    outlined
                  />
                </v-col>
              </v-row>
            </v-col>
            <!-- <v-col cols="3" class="pt-0 pl-0">
              <alex-inputs-users-autocomplete v-model="updateForm.coauthors" />
            </v-col> -->
            <v-col cols="9" class="pt-0">
              <alex-inputs-tag-combobox v-model="updateForm.tags" />
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-col>
    <v-col cols="11 " class="white pa-12">
      <app-editor ref="editor" :data="data.attributes.structure?.data[0]" />
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
                  :label="$t('editor.version')"
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
                    {{ $t('editor.submit') }}
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
import { Strapi4ResponseData } from '@nuxtjs/strapi/dist/runtime/types';
import { useI18n } from 'vue-i18n';
import { Tag } from 'models/tag.model';
import { formRules, createFileFromUrl } from '@/helpers/utils';
import { LearningPlan } from 'models/learningPlan.model';
const { requiredRule, min5CharactersRule } = formRules;

const i18n = useI18n();

const emit = defineEmits(['back', 'updated']);

const messageStore = useMessageStore();
const { update } = useStrapi();
const props = defineProps({
  data: {
    type: Object as PropType<Strapi4ResponseData<LearningPlan>>,
    required: true,
  },
});

// const { data } = toRefs(props);
const openModal = ref(false);
const saving = ref(false);
const visible = ref(false);
// const confirmLeave = ref<Boolean | null>(null);
const formTagCreationValid = ref(false);
// const modalType = ref('');

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
  coauthors: number[];
  tags: Strapi4ResponseData<Tag>[];
}> = ref({
  title: '',
  image: null,
  description: '',
  coauthors: [],
  tags: [],
});

watch(
  () => props.data,
  async () => await loadUpdateForm(),
);
onMounted(async () => await loadUpdateForm());

const loadUpdateForm = async () => {
  const { title, description, image, coauthors, tags } = props.data.attributes;
  updateForm.value = {
    title,
    description,
    image: null,
    coauthors: [],
    tags: [],
  };

  if (coauthors && coauthors.data.length) {
    updateForm.value.coauthors = coauthors.data.map((c) => c.id);
  }

  if (tags && tags.data.length) {
    updateForm.value.tags = tags.data;
  }

  if (image.data && !loadedImage.value) {
    const imageFile = await createFileFromUrl(
      useStrapiMedia(image.data.attributes.url),
      image.data.attributes.name,
      image.data.attributes.ext,
    );
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
      if (isNaN(parseInt(block.id))) {
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

    messageStore.message = i18n.t('editor.successMsg');
    messageStore.color = 'green';
    emit('updated');
  } catch (err) {
    messageStore.message = err as string;
    messageStore.color = 'red';
  } finally {
    openModal.value = false;
    saving.value = false;
    visible.value = false;
    messageStore.show = true;
  }
};

// const showModal = () => {
//   visible.value = true;
// };
// const confirmLeaveAction = () => {
//   confirmLeave.value = true;
//   visible.value = false;
// };
// const cancelLeaveAction = () => {
//   confirmLeave.value = false;
//   visible.value = false;
// };
// const doNothing = () => {};
const cancelTagCreation = () => {
  openModal.value = false;
  createForm.value.reset();
};
</script>
