<template>
  <div>
    <!-- Renderização das etapas do tutorial -->
    <div v-if="showSteps">
      <div v-if="!noHeader" class="d-flex gap-4 py-3 px-1">
        <alex-tutorial-stepper-item
          v-for="item in tutorialStepsData"
          :key="item.step"
          :title="item.title"
          :subtitle="item.subtitle"
          :stepNumber="item.step"
          :active="currentStep == item.step"
          :disabled="currentStep < item.step"
          :completed="currentStep > item.step"
          class="custom-style"
          @onSelect="() => (currentStep = item.step)"
        />
      </div>

      <!-- Conteúdo da etapa atual -->
      <alex-tutorial-stepper-window>
        <alex-tutorial-stepper-window-item>
          <!-- Título e conteúdo da etapa atual -->
          <v-card flat class="tutorial-content py-10">
            <v-card-title>{{
              tutorialStepsData[currentStep - 1].title
            }}</v-card-title>
            <div
              class="mt-5 ml-10 mb-15 px-5 text-justify"
              v-html="tutorialStepsData[currentStep - 1].content"
            ></div>
            <alex-tutorial-stepper-actions
              v-if="!showControls"
              class="d-flex py-10 px-5"
            >
              <v-btn
                v-if="currentStep > 1 && showNextButton"
                type="button"
                rounded="lg"
                color="accent"
                variant="outlined"
                size="large"
                @click="onPrevStep"
                text="Voltar"
              />

              <v-btn
                v-if="showNextButton"
                @click="nextStep"
                class="ml-auto"
                rounded="lg"
                color="accent"
                size="large"
                text="Avançar"
              />
              <v-btn
                v-if="!showNextButton"
                class="next-step"
                @click="restartTutorial"
                rounded="lg"
                color="accent"
                size="large"
                text="Reiniciar"
              />
              <v-btn
                v-if="!showNextButton"
                @click="finishTutorial"
                class="ml-auto"
                rounded="lg"
                color="accent"
                size="large"
                text="Finalizar"
              />
              <slot
                name="controls"
                :onPrevStep="onPrevStep"
                :isLastStep="currentStep == tutorialStepsData.length"
              />
            </alex-tutorial-stepper-actions>
          </v-card>
        </alex-tutorial-stepper-window-item>
      </alex-tutorial-stepper-window>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';

// Prop para passar os dados das etapas do tutorial
const { tutorialStepsData } = defineProps(['tutorialStepsData']);

const currentStep = ref(1);

const showSteps = computed(() => currentStep.value <= tutorialStepsData.length);
const showNextButton = computed(
  () => currentStep.value < tutorialStepsData.length,
);

const nextStep = () => {
  if (currentStep.value < tutorialStepsData.length) {
    currentStep.value++;
  }
};

const onPrevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const restartTutorial = () => {
  currentStep.value = 1;
};

const finishTutorial = () => {
  if (currentStep.value == tutorialStepsData.length) {
    window.location.href = '/';
  }
};
</script>
