<template>
  <v-container fluid>
    <v-row justify="center" align="center" width="100%">
      <v-col cols="12">
        <v-row justify="space-between" align="center">
          <v-col v-if="learningPlans.length" cols="3">
            <v-text-field
              :label="searchText"
              outlined
              background-color="white"
              dense
            />
          </v-col>
          <v-btn color="accent" @click="openModal = true">
            {{ newButtonText }}
          </v-btn>
        </v-row>
      </v-col>
      <v-row>
        <v-col
          v-for="(learningPlan, i) in learningPlans"
          :key="`plan-${i}`"
          cols="3"
        >
          <app-learning-plan-card
            :learning-plan="learningPlan"
            :view-plan-url="getPlanUrl(learningPlan)"
          />
        </v-col>
      </v-row>
    </v-row>
    <v-dialog v-model="openModal" width="30%" persistent>
      <v-form ref="createForm" v-model="formValid" @submit.prevent="submit">
        <v-card width="100%" class="pa-3">
          <v-card-title>{{ createPanText }}</v-card-title>
          <v-row justify="start" class="pa-5" dense>
            <v-col cols="12">
              <v-text-field
                v-model="creationForm.title"
                :rules="rules.title"
                label="Título*"
                outlined
              />
            </v-col>
            <v-col cols="12">
              <v-file-input
                v-model="creationForm.image"
                :rules="rules.image"
                accept="image/png, image/jpeg"
                label="Imagem Principal"
                prepend-inner-icon="mdi-camera"
                prepend-icon=""
                outlined
                chips
              />
            </v-col>
            <v-col cols="12">
              <v-row justify="center">
                <v-btn class="mr-3" @click="cancelCreation">Cancelar</v-btn>
                <v-btn
                  color="primary"
                  :disabled="!formValid"
                  :loading="saving"
                  type="submit"
                >
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
<script setup lang="ts">
import { Strapi4ResponseData } from '@nuxtjs/strapi/dist/runtime/types';
import { LearningPlan } from '~/models/learningPlan.model';
import { formRules } from '@/helpers/utils';

const messageStore = useMessageStore();
const { requiredRule, min5CharactersRule } = formRules;

const strapi = useStrapiClient();
const router = useRouter();

const props = defineProps({
  learningPlans: {
    type: Array as PropType<Strapi4ResponseData<LearningPlan>[]>,
    required: true,
  },
  parentLearningPlan: {
    type: Object as PropType<Strapi4ResponseData<LearningPlan>>,
    default: () => null,
  },
});

const openModal = ref(false);
const formValid = ref(false);
const rules = ref({
  title: [requiredRule, min5CharactersRule],
  image: [],
});

const creationForm = ref<{
  title: string;
  image: null | any;
}>({
  title: '',
  image: null,
});
const saving = ref(false);

const createForm = ref();

const searchText = computed(() => {
  return props.parentLearningPlan
    ? 'Buscar trilha de aprendizagem'
    : 'Buscar plano de aprendizagem';
});

const newButtonText = computed(() => {
  return props.parentLearningPlan ? 'NOVA TRILHA' : 'NOVO PLANO';
});

const createPanText = computed(() => {
  return props.parentLearningPlan
    ? 'Criar Trilha de Aprenziagem'
    : 'Criar Plano de Aprendizagem';
});

const getPlanUrl = (learningPlan) => {
  return props.parentLearningPlan
    ? `/learning-plans/${props.parentLearningPlan.id}/trails/${learningPlan.id}`
    : `/learning-plans/${learningPlan.id}`;
};
const cancelCreation = () => {
  openModal.value = false;
  createForm.value.reset();
};

const submit = async () => {
  if (!formValid.value) return;
  saving.value = true;

  const { image, title } = creationForm.value;

  const formData = new FormData();
  const user = useStrapiUser();
  const isTrail = !!props.parentLearningPlan;
  const parentPlanId = (props.parentLearningPlan || {}).id;
  const data: any = { title, author: user.value?.id, learningplan: undefined };

  if (isTrail) {
    data.learningplan = props.parentLearningPlan.id;
  }

  formData.append('data', JSON.stringify(data));

  if (image) {
    formData.append('files.image', image[0], image[0].name);
  }

  try {
    const res = await strapi<LearningPlan>('learningplans', {
      method: 'POST',
      body: formData,
    });

    console.log(res);

    router.push(
      isTrail
        ? `/learning-plans/${parentPlanId}/trails/${res.id}`
        : `/learning-plans/${res.id}`,
    );
  } catch (err) {
    saving.value = false;
    messageStore.message = err as string;
  } finally {
    saving.value = false;
  }
};
</script>
