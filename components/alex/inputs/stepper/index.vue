<template>
  <v-form @submit="onSubmit">
    <div v-if="!noHeader" class="d-flex gap-4 py-3 px-1">
      <alex-inputs-stepper-indicator
        v-for="({ title, subtitle, icon, completed }, index) in stepsList"
        :key="index"
        :stepNumber="index + 1"
        :active="index == activeStep - 1"
        :checked="activeStep - 1 > index"
        :title="title || 'Title'"
        :subtitle="subtitle || 'Subtitle'"
        :icon="icon"
        :disabled="false"
        :completed="completed"
        @onSelect="() => onSelectStep(index + 1)"
      />
    </div>
    <template v-for="(_, index) in stepsList" :key="index">
      <slot
        v-if="index == activeStep - 1"
        :name="`step${index + 1}`"
        :errors="errors"
        :values="values"
      />
    </template>
    <div v-if="!showControls" class="step-controls">
      <v-btn
        v-if="activeStep > 1"
        :disabled="submitLoading"
        type="button"
        rounded="lg"
        color="secondary"
        variant="outlined"
        size="large"
        @click="onPrevStep"
        text="Voltar"
      />

      <v-btn
        type="submit"
        :disabled="!isValid"
        :loading="submitLoading"
        class="ml-auto"
        rounded="lg"
        color="accent"
        size="large"
        :text="activeStep == numberSteps ? 'Criar' : 'Avançar'"
      />
    </div>
    <slot
      name="controls"
      :onPrevStep="onPrevStep"
      :isValid="isValid"
      :isLastStep="activeStep == numberSteps"
      :isFirstStep="activeStep == 1"
      :submitLoading="submitLoading"
    />
  </v-form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup';

interface StepsConfig {
  title: string;
  subtitle: string;
  icon: string;
  scheme: yup.Schema;
  completed: boolean;
}

type StepType<T extends string[], U> = Record<ElementType<T>, U>;

// Props/events
const props = withDefaults(
  defineProps<{
    noHeader?: boolean;
    stepsConfig: StepType<typeof stepsCounter.value, Partial<StepsConfig>>;
    submitLoading?: boolean;
  }>(),
  { submitLoading: false, noHeader: false },
);
const emit = defineEmits(['onSuccess']);

// Slots
const slots = useSlots();
const showControls = computed(() => !!slots.controls);

// Steps Logic
const stepsCounter = computed(() =>
  literalArray(
    Object.entries(slots).map((slot) => slot[0]) as unknown as string,
  ),
);

const activeStep = ref(1);
const numberSteps = computed(() => stepsCounter.value[0].length);
const stepsList = ref(Object.values(props.stepsConfig));

// Steps Logic Get Schema
const validationSchema = computed(() => {
  const configStep = props.stepsConfig['step' + activeStep.value];
  const emptyObject = yup.object({ empty: yup.string().optional().nullable() });
  return configStep && configStep.scheme ? configStep.scheme : emptyObject;
});

const { handleSubmit, errors, values, controlledValues } = useForm({
  validationSchema: validationSchema,
  keepValuesOnUnmount: true,
});

// Functions
const onSubmit = handleSubmit((values) => {
  if (activeStep.value - 1 !== numberSteps.value - 1) {
    stepsList.value[activeStep.value - 1].completed = true;
    activeStep.value++;
    return;
  }
  emit('onSuccess', values);
});

const isValid = computed(() => {
  if ((validationSchema.value as yup.AnyObject).fields.empty) return true;
  else if (
    !Object.values(controlledValues.value).includes(undefined) &&
    !Object.values(errors.value).length
  ) {
    return true;
  }

  return false;
});

const onPrevStep = () => {
  if (activeStep.value > 1) {
    activeStep.value--;
    stepsList.value[activeStep.value - 1].completed = false;
  }
};

const onSelectStep = (step: number) => {
  if (step > activeStep.value && !isValid.value) {
    return;
  }

  if (step > activeStep.value) {
    stepsList.value[activeStep.value - 1].completed = true;
    activeStep.value = step;
  } else {
    activeStep.value = step;
    stepsList.value[activeStep.value - 1].completed = false;
  }
  

};
</script>

<style scoped>
.step-controls {
  display: flex;
  width: 100%;
}

button[type='submit']:disabled {
  background-color: gray !important;
}
</style>
