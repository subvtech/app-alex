<template>
  <v-form v-model="validated" @submit.prevent="nextStep" class="min-h-full">
    <template v-for="step in stepsArray">
      <slot v-if="step == stepsArray[activeStep]" :name="step" :key="step"></slot>
      <div class="controls" v-if="step == stepsArray[activeStep]">
        <v-btn
          v-if="activeStep != 0"
          type="button"
          rounded="lg"
          color="secondary"
          variant="outlined"
          size="large"
          @click="prevStep"
        >
          Voltar
        </v-btn>
        <v-btn
          :disabled="!validated"
          type="submit"
          class="ml-auto"
          rounded="lg"
          color="accent"
          size="large"
        >
          {{ activeStep != stepsArray.length - 1 ? "Avançar" : "Criar" }}
        </v-btn>
      </div>
    </template>
  </v-form>
</template>

<script setup lang="ts">
const props = defineProps<{
  steps: number;
  submit: () => void;
}>();
const activeStep = ref(0);
const validated = ref(false);
// Pega a quantidade de steps desejada e cria um array :)
const stepsArray = computed(() => {
  return Array.from({ length: props.steps }, (_, i) => `step${i + 1}`);
});

function nextStep() {
  if (activeStep.value === props.steps - 1) {
    props.submit();
    return;
  }

  activeStep.value++;
}

function prevStep() {
  if (activeStep.value <= 0) {
    return;
  }

  activeStep.value--;
}
</script>

<style scoped lang="scss">
.controls {
  display: flex;
  width: 100%;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
