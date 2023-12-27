<template>
  <alex-custom-card
    class="mb-6"
    :title="title"
    :isEditing="isEditingAndCanEdit"
    :showIcon="canEdit"
    @toggle:isEditing="toggleIsEditing"
    :cancel="onCancel"
    :save="() => emit('update', myText)"
    full-width
  >
    <template v-slot:content class="pa-6">
      <div class="d-flex flex-column w-100">
        <alex-custom-empty-placeholder
          v-if="isTextEmpty && !isEditingAndCanEdit && !isOptional"
          :empty-text-image="emptyTextImage ?? undefined"
          :empty-text-message="
            emptyTextMessage ?? $t('pages.courses.about.empty')
          "
        />
        <span
          v-else
          class="info"
          :contenteditable="isEditingAndCanEdit"
          :data-placeholder="
            textPlaceholder ?? $t('pages.courses.about.placeholder')
          "
          @input="updateText"
          >{{ myText }}</span
        >
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
const { t } = useI18n();

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
  },
  textPlaceholder: { type: String },
  emptyTextImage: {
    type: String,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  images: {
    type: Array as PropType<any[]>,
    default: [],
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

const { canEdit, text } = toRefs(props);
const myText = ref(props.text);

const isEditing = ref(false);

const isEditingAndCanEdit = computed(() => isEditing.value && canEdit.value);
const isTextEmpty = computed(
  () =>
    myText.value === null || myText.value === undefined || myText.value === '',
);

const updateText = (event: Event) => {
  const target = event.target as HTMLSpanElement;
  myText.value = target.innerText;
};

const onCancel = async () => {};

const toggleIsEditing = () => {
  isEditing.value = !isEditing.value;
};

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

.info {
  text-align: justify;
  text-justify: inter-word;
  align-self: stretch;
  color: #5d6872;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;

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
