<template>
  <alex-custom-card
    :title="$t('components.courses.settings.general.title')"
    :show-icon="false"
    show-footer-divider
  >
    <template #content>
      <div class="d-flex flex-column w-100">
        <alex-inputs-text-field
          :v-model="myTitle"
          label="Nome da trilha"
          name="title"
          class="w-100"
          density="comfortable"
          :error-messages="errors.title"
          required
        ></alex-inputs-text-field>
        <alex-inputs-text-area
          :v-model="myDescription"
          label="Descrição da trilha"
          name="description"
          class="w-100"
          density="comfortable"
          :error-messages="errors.description"
          required
        ></alex-inputs-text-area>
      </div>
    </template>
    <template #footer>
      <div class="d-flex w-100 justify-end gap-4 pt-6">
        <alex-custom-button
          variant="secondary"
          prepend-icon="mdi-close"
          @click="onCancel"
          >{{
            $t('components.courses.settings.general.cancel')
          }}</alex-custom-button
        >
        <alex-custom-button
          variant="primary"
          prepend-icon="mdi-check"
          @click="onSave"
          :disabled="theresError"
          >{{
            $t('components.courses.settings.general.save')
          }}</alex-custom-button
        >
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';

import { useI18n } from 'vue-i18n';

const { find, update } = useStrapi();
const { setMessage } = useMessageStore();

const emit = defineEmits(['update']);
const props = defineProps({
  title: {
    type: String,
    required: true,
  },

  trailId: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
});

const i18n = useI18n();

const { generalTrailSchema } = useFormRules();

const { title, description } = toRefs(props);
const myTitle = toRef(title.value);
const myDescription = toRef(description.value);

const { handleSubmit, errors, values, controlledValues, setFieldError } =
  useForm({
    validationSchema: generalTrailSchema,
    keepValuesOnUnmount: true,
  });

const onSave = handleSubmit(async (e) => {
  await update(`trails/${props.trailId}`, {
    title: controlledValues.value.title,
    description: controlledValues.value.description,
  });

  emit('update', i18n.t('components.trails.settings.general.update'));
});

const onCancel = () => {
  myDescription.value = props.description;
  myTitle.value = props.title;
};

const theresError = computed(() => Object.keys(errors.value).length !== 0);

watch(title, () => {
  myTitle.value = title.value;
});
watch(description, () => {
  myDescription.value = description.value;
});
</script>
<style scoped lang="scss">
.content-area {
  margin-top: 24px;
  border: 1px solid var(--cinza-cinza-200, #d2d6da) !important;
  box-shadow: none !important;
}
</style>
