<template>
  <v-form @submit="onSubmit">
    <slot :errors="errors" :activeStep="activeStep" :values="values"></slot>
    <div class="controls">
      <v-btn
        v-if="activeStep > 1"
        :disabled="loading"
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
        :disabled="!isValid"
        :loading="loading"
        class="ml-auto"
        rounded="lg"
        color="accent"
        size="large"
      >
        {{ (activeStep - 1 !== numberSteps - 1) ? "Avançar" : "Criar"}}
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">

import { useForm } from 'vee-validate';
const props = defineProps({
  schemes: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    required: false
  }
});

const emit = defineEmits(['onSuccess'])
const activeStep = ref(1);
const numberSteps = computed(() => props.schemes.length);
const validationSchema = computed(() => props.schemes[(activeStep.value - 1)]);

const { handleSubmit, errors, values, controlledValues } =  useForm({
  validationSchema: validationSchema,
  keepValuesOnUnmount: true
})

const onSubmit = handleSubmit((values) => {
  if (activeStep.value - 1 !== numberSteps.value - 1) {
    activeStep.value++;
    return;
  }
  emit('onSuccess', values)
});

const isValid = computed(() => !Object.values(controlledValues.value).includes(undefined) && !Object.values(errors.value).length)

const prevStep = () => {
  if (activeStep.value > 1) {
    activeStep.value--;
  }
};


</script>

<style scoped>.controls {
  display: flex;
  width: 100%;
}

button[type="submit"]:disabled {
  background-color: gray !important;
}

</style>
