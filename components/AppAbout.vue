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
      <div
        class="d-flex flex-column gap-6 w-100"
        :class="fullWidth ? 'w-100' : ''"
      >
        <alex-custom-empty-placeholder
          v-if="isTextEmpty && !isEditingAndCanEdit"
          :empty-text-message="
            emptyTextMessage ?? $t('components.appAbout.empty')
          "
        />
        <span
          v-else
          class="info"
          :contenteditable="isEditingAndCanEdit"
          :data-placeholder="$t('components.appAbout.placeholder')"
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
    required: true,
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
});

const { canEdit, text } = toRefs(props);
const myText = ref(props.text);

const isEditing = ref(false);

const isEditingAndCanEdit = computed(() => isEditing.value && canEdit.value);
const isTextEmpty = computed(
  () => myText.value === null || myText.value === '',
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
