<template>
  <alex-custom-card
    class="mb-6"
    :title="title"
    :is-editing="isEditingAndCanEdit"
    :show-icon="canEdit"
    :cancel="onCancel"
    :save="onSave"
    full-width
    @toggle:is-editing="toggleIsEditing"
  >
    <template #content>
      <div class="d-flex flex-column w-100 align-self-center gap-8">
        <alex-custom-empty-placeholder
          v-if="images.length === 0 && !isEditingAndCanEdit"
          :empty-text-image="'/svg/emptyMedia.svg'"
          :empty-text-message="
            emptyTextMessage ?? $t('pages.courses.media.empty')
          "
        />
        <alex-custom-carousel
          v-else
          v-model="images"
          :read-only="!isEditingAndCanEdit"
        />
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
defineEmits(['update']);

type AppMediaProps = {
  title: string;
  courseId: number;
  canEdit: boolean;
  emptyTextImage?: string;
  emptyTextMessage?: string;
  fullWidth?: boolean;
  images: any[];
  learningplanId: number;
};
const props = withDefaults(defineProps<AppMediaProps>(), {
  fullWidth: false,
  emptyTextImage: undefined,
  emptyTextMessage: undefined,
});
const { delete: _delete } = useStrapi();
const { setMessage } = useMessageStore();
const client = useStrapiClient();
const images = ref([...props.images]);
const initialImages = ref([...props.images]);
const isEditing = ref(false);
const isEditingAndCanEdit = computed(() => isEditing.value && props.canEdit);
const onCancel = async () => {
  const deletedMedia = images.value
    .filter(
      (initialItem) =>
        !initialImages.value.find((newItem) => newItem.id === initialItem.id) &&
        initialItem.imgId,
    )
    .map((media) => _delete('upload/files', media.imgId));
  images.value = initialImages.value;
  await Promise.all(deletedMedia);
};
const toggleIsEditing = () => {
  isEditing.value = !isEditing.value;
};

const onSave = async () => {
  const updatedMedia: Omit<TagSimple, 'learningplans'>[] = await client(
    `/learningplans/${props.learningplanId}/media`,
    {
      method: 'PUT',
      body: {
        media: images.value,
      },
      onResponse: ({ response }) => {
        if (!response.ok) {
          setMessage('Algo deu errado ao salvar as alterações', 'red', true);
          return;
        }
        initialImages.value = updatedMedia;
        images.value = updatedMedia;
      },
    },
  );
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
