<template>
  <v-container fluid>
    <v-row justify="center" align="center" width="100%">
      <v-col cols="12">
        <v-row justify="space-between" align="center">
          <v-col v-if="learningPlans.length" cols="3">
            <v-text-field :label="searchText" outlined background-color="white" dense />
          </v-col>
          <v-btn color="accent" @click="openModal = true">
            {{ newButtonText }}
          </v-btn>
        </v-row>
      </v-col>
      <v-row>
        <v-col v-for="(learningPlan, i) in learningPlans" :key="`plan-${i}`" cols="3">
          <app-learning-plan-card :learning-plan="learningPlan" :view-plan-url="getPlanUrl(learningPlan)" />
        </v-col>
      </v-row>
    </v-row>
    <v-dialog v-model="openModal" width="30%" persistent>
      <v-form ref="createForm" v-model="formValid" @submit.prevent="submit">
        <v-card width="100%" class="pa-3">
          <v-card-title>{{ createPanText }}</v-card-title>
          <v-row justify="start" class="pa-5" dense>
            <v-col cols="12">
              <v-text-field v-model="creationForm.title" :rules="rules.title" label="Título*" outlined />
            </v-col>
            <v-col cols="12">
              <v-file-input v-model="creationForm.image" :rules="rules.image" accept="image/png, image/jpeg"
                label="Imagem Principal" prepend-inner-icon="mdi-camera" prepend-icon="" outlined chips />
            </v-col>
            <v-col cols="12">
              <v-row justify="center">
                <v-btn class="mr-3" @click="cancelCreation">Cancelar</v-btn>
                <v-btn color="primary" :disabled="!formValid" :loading="saving" type="submit">
                  Criar
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>
<script>
import { formRules } from "@/helpers/utils";
const { requiredRule, min5CharactersRule } = formRules;

export default {
  props: {
    learningPlans: {
      type: Array,
      required: true,
    },
    parentLearningPlan: {
      type: Object,
      default: () => null,
    }
  },
  data() {
    return {
      openModal: false,
      formValid: false,
      rules: {
        title: [requiredRule, min5CharactersRule],
        image: [],
      },
      creationForm: {
        title: '',
        image: null
      },
      saving: false,
    };
  },
  computed: {

    searchText() {
      return this.parentLearningPlan
        ? 'Buscar trilha de aprendizagem'
        : 'Buscar plano de aprendizagem'
    },
    newButtonText() {
      return this.parentLearningPlan
        ? 'NOVA TRILHA'
        : 'NOVO PLANO'
    },
    createPanText() {
      return this.parentLearningPlan
        ? 'Criar Trilha de Aprenziagem'
        : 'Criar Plano de Aprendizagem'
    }
  },
  methods: {
    getPlanUrl(learningPlan) {
      return this.parentLearningPlan
        ? `/learning-plans/${this.parentLearningPlan.id}/trails/${learningPlan.id}`
        : `/learning-plans/${learningPlan.id}`
    },
    cancelCreation() {
      this.openModal = false;
      this.$refs.createForm.reset();
    },
    async submit() {
      if (!this.formValid) return;
      this.saving = true;

      const { image, title } = this.creationForm;
      const parts = ['', 'learningplans'];
      const formData = new FormData();

      const { $http, user } = this.$strapi;
      const isTrail = !!this.parentLearningPlan;
      const parentPlanId = (this.parentLearningPlan || {}).id;
      const data = { title, author: user.id };

      if (isTrail) {
        data.learningplan = this.parentLearningPlan.id;
      }

      formData.append('data', JSON.stringify(data));

      if (image) {
        formData.append('files.image', image, image.name);
      }

      try {
        const url = parts.join('/');
        const method = '$post';
        const res = await $http[method](url, formData);

        this.$router.push(
          isTrail
            ? `/learning-plans/${parentPlanId}/trails/${res.id}`
            : `/learning-plans/${res.id}`
        );

      } catch (err) {
        this.saving = false;
        this.$error(err);
      } finally {
        this.saving = false;
      }
    },
  }
}
</script>
