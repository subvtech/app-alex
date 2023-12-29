<template>
  <alex-custom-card
    class="mb-6"
    :title="title"
    :isEditing="isEditingAndCanEdit"
    :showIcon="canEdit"
    @toggle:isEditing="toggleIsEditing"
    :cancel="onCancel"
    :save="onSave"
    full-width
  >
    <template v-slot:content class="pa-6">
      <div class="d-flex flex-column w-100 align-self-center gap-8">
        <alex-custom-empty-placeholder
          v-if="myImages.length === 0 && !isEditingAndCanEdit"
          :empty-text-image="'/svg/emptyMedia.svg'"
          :empty-text-message="
            emptyTextMessage ?? $t('pages.courses.media.empty')
          "
        />
        <alex-custom-carousel
          v-else
          :read-only="!isEditingAndCanEdit"
          v-model="myImages"
          @slidesChanged="onSlidesChanged"
        />
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
const { t } = useI18n();

const { create, find, findOne, update, delete: _delete } = useStrapi();
const emit = defineEmits(['update']);

const props = defineProps({
  title: {
    type: String,
    required: true,
  },

  courseId: {
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

const { canEdit, images } = toRefs(props);

const isEditing = ref(false);
const myImages = toRef(props.images);
const isEditingAndCanEdit = computed(() => isEditing.value && canEdit.value);

const onCancel = async () => {
  const deletePromises = myImages.value
    .filter(
      (item) => props.images.findIndex((item2) => item2.id === item.id) !== -1,
    )
    .map((item) =>
      find('upload/files', { filters: { name: item.name } }).then((result) => {
        result.data.forEach((media) => {
          _delete('upload/files', media.id).then();
        });
      }),
    );

  await Promise.all([...deletePromises]);
  myImages.value = [...props.images];
};

const onSlidesChanged = async (data) => {
  console.log(data)
  myImages.value = data;
};
const toggleIsEditing = () => {
  isEditing.value = !isEditing.value;
};

const onSave = async () => {
  const createPromises = myImages.value
    .filter(
      (item) =>
        props.images.findIndex(
          (item2) =>
            item2.title === item.title &&
            item2.video === item.video &&
            item2.title === item.title &&
            item.image === item.image,
        ) === -1,
    )
    .map((item) => create('medias', { ...item, learningplan: props.courseId }));

  const deletePromises = props.images
    .filter(
      (item) =>
        myImages.value.findIndex((item2) => item2.id === item.id) === -1,
    )
    .map((item) => _delete('medias', item.id));

  const result = await Promise.all([...createPromises, ...deletePromises]);
  console.log({ result });
};

watch(images, () => {
  myImages.value = images.value;
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
