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

<script>
import { formRules, createFileFromUrl } from '@/helpers/utils';
const { requiredRule, min5CharactersRule } = formRules;
import { update } from '@nuxtjs/strapi';
const isObjectID = require('is-object-id');

export default {
  props: ['data'], // eslint-disable-line

  data() {
    return {
      openModal: false,
      saving: false,
      visible: false,
      confirmLeave: null,
      formTagCreationValid: false,
      modalType: '',
      tag: '',
      tagRules: [requiredRule, min5CharactersRule],
      updateFormValid: false,
      loadedImage: false,
      updateRules: {
        title: [requiredRule, min5CharactersRule],
        image: [],
        description: [],
      },
      updateForm: {
        title: '',
        image: null,
        description: '',
        coauthors: [],
        tags: [],
      },
    };
  },
  watch: {
    async data() {
      await this.loadUpdateForm();
    },
  },
  async created() {
    await this.loadUpdateForm();
  },
  methods: {
    async loadUpdateForm() {
      const { title, description, image, coauthors, tags } = this.data;
      this.updateForm = { title, description };

      if (coauthors && coauthors.length) {
        this.updateForm.coauthors = coauthors.map((c) => c.id);
      }

      if (tags && tags.length) {
        this.updateForm.tags = tags;
      }

      if (image && !this.loadedImage) {
        const imageFile = await createFileFromUrl(
          image.url,
          image.name,
          image.ext,
        );
        this.updateForm.image = imageFile;
      }

      this.loadedImage = true;
    },
    async save(tag = '') {
      if (!this.updateForm) return;
      const route = useRoute();
      const { planId, trailId } = route.params;
      const { instance } = this.$refs.editor;

      this.saving = true;

      try {
        const structure = await instance.save();

        structure.blocks = structure.blocks.map((block, idx) => {
          if (!isObjectID(block.id)) {
            delete block.id;
          }

          block.order = idx + 1;

          return block;
        });

        const { title, description, image, coauthors, tags } = this.updateForm;

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

        await update('learningplans', trailId || planId, formData);

        this.$success('Dados salvos com sucesso!');
        this.$emit('updated');
      } catch (err) {
        this.$error(err);
      } finally {
        this.openModal = false;
        this.saving = false;
        this.visible = false;
      }
    },
    showModal() {
      this.visible = true;
    },
    confirmLeaveAction() {
      this.confirmLeave = true;
      this.visible = false;
    },
    cancelLeaveAction() {
      this.confirmLeave = false;
      this.visible = false;
    },
    doNothing() {},
    cancelTagCreation() {
      this.openModal = false;
      this.$refs.createForm.reset();
    },
  },
};
</script>
