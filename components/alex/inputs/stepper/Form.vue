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
        avançar
      </v-btn>
    </div>
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
const { value: { handleSubmit, errors, values }} = computed(() => useForm({
  validationSchema: validationSchema,
  keepValuesOnUnmount: true
}))

const onSubmit = handleSubmit((values) => {
  if (activeStep.value - 1 !== numberSteps.value - 1) {
    activeStep.value++;
    return;
  }
  console.log(values);
});

const prevStep = () => {
  if (activeStep.value > 1) {
    activeStep.value--;
  }
};

watchEffect(() => {
console.log(validationSchema.value)
  
})
</script>

<style scoped>.controls {
  display: flex;
  width: 100%;
}

</style>
