<template>
  <alex-custom-card
    class="mb-6"
    :title="title"
    :is-editing="isEditingAndCanEdit"
    :show-icon="canEdit"
    :cancel="onCancel"
    :save="() => emit('update', isOptional ? text : value)"
    :disable-save="errorMessage !== undefined || textNotChanged"
    full-width
    @toggle:is-editing="toggleIsEditing"
  >
    <template #content>
      <div class="d-flex flex-column w-100">
        <alex-custom-empty-placeholder
          v-if="isTextEmpty && !isOptional && !isEditing"
          :empty-text-image="emptyTextImage ?? undefined"
          :empty-text-message="
            emptyTextMessage ?? $t('pages.courses.about.empty')
          "
        />
        <span
          v-else-if="usingMyText"
          class="about-description"
          :contenteditable="isEditingAndCanEdit"
          :data-placeholder="
            textPlaceholder ?? $t('pages.courses.about.placeholder')
          "
          @input="updateText"
          >{{ text }}</span
        >
        <alex-inputs-text-area
          v-else
          v-model="value"
          density="comfortable"
          name="description"
          autofocus
          theme="light"
          :label="$t('pages.courses.about.placeholder')"
          :placeholder="$t('pages.courses.about.placeholder')"
          :error-messages="errorMessage"
          required
        />
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
const emit = defineEmits(['update']);
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    required: true,
  },

  userId: {
    type: Number,
    required: true,
  },
  canEdit: { type: Boolean, required: true },
  emptyTextMessage: {
    type: String,
    required: true,
  },
  textPlaceholder: { type: String, default: undefined },
  emptyTextImage: {
    type: String,
    default: undefined,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  images: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  showMedia: {
    type: Boolean,
    default: false,
  },
  isOptional: {
    type: Boolean,
    default: false,
  },
});
const { canEdit } = toRefs(props);
const { longDescriptionRules } = useFormRules();
const { value, errorMessage, setValue } = useField(
  'description',
  longDescriptionRules.description,
  {
    initialValue: props.text,
  },
);

const isEditing = ref(false);

const isEditingAndCanEdit = computed(() => isEditing.value && canEdit.value);
const isTextEmpty = computed(() => !value.value);
const notOptionalAndNotEditing = computed(
  () => !isEditingAndCanEdit.value && !props.isOptional,
);
const usingMyText = computed(
  () => props.isOptional || notOptionalAndNotEditing.value,
);
const textNotChanged = computed(() => props.text === value.value);

const updateText = (event: Event) => {
  const target = event.target as HTMLSpanElement;
  value.value = target.innerText;
};

const onCancel = () => {
  setValue(props.text);
};

const toggleIsEditing = () => {
  isEditing.value = !isEditing.value;
};
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

.about-description {
  text-align: justify;
  text-justify: inter-word;
  align-self: stretch;
  color: #5d6872;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  overflow-wrap: break-word;

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
