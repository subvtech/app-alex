<template>
  <alex-custom-card
    :title="title"
    :is-editing="isEditingAndCanEdit"
    no-icon="canEdit"
    :align-content="displayEmptyPlaceholder ? 'align-center' : 'align-start'"
    :disable-save="disableSave"
    no-footer
    @toggle:is-editing="toggleIsEditing"
    @click:cancel="onCancel"
    @click:save="onSave"
  >
    <template #content>
      <alex-custom-skeleton
        v-if="loading"
        class="w-100 height-30"
        color="gray-200"
      />
      <div v-else class="d-flex flex-column flex-wrap w-100">
        <alex-custom-empty-placeholder
          v-if="displayEmptyPlaceholder"
          :empty-text-image="emptyTextImage ?? undefined"
          :empty-text-message="
            emptyTextMessage ?? $t('pages.courses.about.empty')
          "
        />
        <alex-inputs-text-area
          v-else-if="usingMyText"
          class="w-100"
          :model-value="myText"
          variant="solo"
          name="info"
          :hide-details="isOptional"
          flat
          auto-grow
          density="comfortable"
          :readonly="!isEditingAndCanEdit"
          :placeholder="
            textPlaceholder ?? $t('pages.courses.about.placeholder')
          "
          type="text-area"
          @input="updateText"
        />
        <alex-inputs-text-area
          v-else
          v-model="value"
          density="comfortable"
          name="description"
          auto-grow
          autofocus
          :label="$t('pages.courses.about.placeholder')"
          :placeholder="$t('pages.courses.about.placeholder')"
          theme="light"
          :hide-details="isOptional"
          :error-messages="errorMessage"
          required
        />
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';

export interface AboutComponentType {
  title?: string;

  text: string;

  userId: number;
  canEdit?: boolean;
  loading?: boolean;
  emptyTextMessage?: string;
  textPlaceholder?: string;
  emptyTextImage?: string;

  images?: any[];
  showMedia?: boolean;
  isOptional?: boolean;
}

const emit = defineEmits(['update']);

const props = withDefaults(defineProps<AboutComponentType>(), {
  canEdit: false,
  loading: false,
  title: '',
  images: () => [],
  emptyTextMessage: undefined,
  textPlaceholder: undefined,
  emptyTextImage: undefined,
});

const { canEdit, text } = toRefs(props);

const { descriptionRules } = useFormRules();

const myText = ref(props.text);

const isEditing = ref(false);

const isEditingAndCanEdit = computed(() => isEditing.value && canEdit.value);
const isTextEmpty = computed(
  () =>
    myText.value === null || myText.value === undefined || myText.value === '',
);

const notOptionalAndNotEditing = computed(
  () => !isEditingAndCanEdit.value && !props.isOptional,
);
const usingMyText = computed(
  () => props.isOptional || notOptionalAndNotEditing.value,
);

const disableSave = computed(() => {
  const comparisonValue = usingMyText.value
    ? myText.value ?? ''
    : value.value ?? '';

  const comparisonOriginalValue = props.text || '';

  const hasError = errorMessage.value !== undefined && !props.isOptional;
  return comparisonValue === comparisonOriginalValue || hasError;
});

const displayEmptyPlaceholder = computed(
  () => isTextEmpty.value && props.isOptional && !isEditing.value,
);

const updateText = (event: Event) => {
  const target = event.target as HTMLInputElement;
  myText.value = target.value;
};

const toggleIsEditing = () => {
  isEditing.value = !isEditing.value;
};
const onCancel = () => {
  myText.value = props.text;
  value.value = props.text;
  toggleIsEditing();
};
const onSave = () => {
  if (usingMyText.value) value.value = myText.value;
  else myText.value = value.value;
  emit('update', myText.value);
  toggleIsEditing();
};

const { value, errorMessage } = useField(
  'description',
  descriptionRules.description,
  {
    initialValue: myText.value,
  },
);

watch(text, () => {
  myText.value = props.text;
});
</script>

<style scoped lang="scss">
.gap-8 {
  gap: 32px;
}
.text-color {
  color: rgb(175, 175, 175);
}
span[contenteditable='true']:empty::before {
  content: attr(data-placeholder);
  color: #aaa;
}
.about-container {
  max-width: 100%;
}

.about-description {
  text-align: justify;
  text-justify: inter-word;
  align-self: stretch;
  color: #5d6872;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;

  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: fit-content;

  &:focus {
    outline: none;
  }
}
.img-size {
  height: 160px;
  width: 160px;
}
.gap-6 {
  gap: 24px;
}
</style>
