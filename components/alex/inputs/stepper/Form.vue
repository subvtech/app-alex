<template>
  <v-form @submit="onSubmit">
    <slot :errors="errors" :activeStep="activeStep" :values="values"></slot>
    <div class="controls">
      <v-btn
        v-if="activeStep > 1"
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
        type="submit"
        class="ml-auto"
        rounded="lg"
        color="accent"
        size="large"
      >
        {{ (activeStep - 1 !== numberSteps - 1) ? "Avançar" : "Criar"}}
      </v-btn>
    </div>
        <!-- :disabled="isValid" -->
  </v-form>
</template>

<script setup lang="ts">

import { useForm } from 'vee-validate';
const props = defineProps({
  onSuccess: {
    type: Function,
    required: true,
  },
  schemes: {
    type: Array,
    required: true,
  },
});
const numberSteps = computed(() => props.schemes.length);
const activeStep = ref(1);
const validationSchema = computed(() => props.schemes[(activeStep.value - 1)]);
const { handleSubmit, errors, values } =  useForm({
  validationSchema: validationSchema,
  keepValuesOnUnmount: true
})
const onSubmit = handleSubmit((values) => {
  if (activeStep.value - 1 !== numberSteps.value - 1) {
    activeStep.value++;
    return;
  }
  props.onSuccess(values)
});
const isValid = computed(() => !!Object.values(errors.value).length)

const prevStep = () => {
  if (activeStep.value > 1) {
    activeStep.value--;
  }
};

watchEffect(() => {
  console.log(isValid.value)
})

</script>

<style scoped>.controls {
  display: flex;
  width: 100%;
}

</style>
