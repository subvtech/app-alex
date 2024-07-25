<template>
  <node-view-wrapper
    class="w-100 d-flex flex-column justify-center align-center py-2"
  >
    <v-expand-transition>
      <alex-custom-button
        v-if="!readOnly && !media.src"
        class="tw-w-4/5"
        variant="secondary"
        :loading="isLoading"
        :prepend-icon="
          contentType === 'image'
            ? 'mdi-image-outline'
            : 'mdi-movie-play-outline'
        "
        size="large"
        @click="openModal"
        >{{
          t(`components.tiptap.mediaUpload.${contentType}.button`)
        }}</alex-custom-button
      >
      <div
        v-else-if="media.src"
        class="tw-w-4/5 d-flex flex-column justify-center align-center position-relative"
      >
        <div class="ma-2 delete-icon">
          <alex-custom-button
            color="gray-500"
            icon="mdi-close"
            style="background-color: rgba(255, 255, 255, 0.25) !important"
            @click="removeMedia"
          />
        </div>
        <nuxt-img
          :key="media.title"
          :src="media.src"
          :alt="media.title"
          class="w-100"
          :draggable="false"
        />
      </div>
    </v-expand-transition>
    <UploadModal ref="dialog" @upload-media="uploadMedia" />
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, NodeViewProps } from '@tiptap/vue-3';
import UploadModal from './FileUploader.vue';

// TODO : Adicionar um popup de resize, com opções de alinhamento

const { t } = useI18n();

const { setMessage } = useMessageStore();

const dialog = ref();
const isLoading = ref(false);

const props = defineProps({
  node: {
    type: Object as PropType<NodeViewProps['node']>,
    required: true,
  },
  extension: {
    type: Object as PropType<NodeViewProps['extension']>,
    required: true,
  },
  updateAttributes: {
    type: Function as PropType<NodeViewProps['updateAttributes']>,
    default: () => {},
  },
});

const readOnly = computed(() => props.extension.options.readOnly());

const contentType = computed(() => props.node.attrs.format);

const uploadMedia = async (newMedia: File | string) => {
  isLoading.value = true;
  if (typeof newMedia === 'string') {
    media.value = { src: newMedia, title: newMedia, id: null };
    props.updateAttributes({ media: media.value });
  } else {
    const res = await props.extension.options.uploadMedia(newMedia);
    if (res.success) {
      media.value = {
        src: res.url,
        title: res.title,
        id: res.id,
      };
      props.updateAttributes({ media: media.value });
    } else {
      setMessage('Erro ao fazer o upload, tente novamente', 'error', true);
    }
  }
  isLoading.value = false;
};

const removeMedia = () => {
  if (media.value.id) {
    props.extension.options.deleteMedia(media.value.id);
  }
  media.value = { src: '', title: '', id: null };
  props.updateAttributes({ media: media.value });
};

const openModal = () => {
  dialog.value.openModal(contentType.value);
};

interface Media {
  src: string;
  title: string;
  id: string | null;
}

const media = ref<Media>(props.node.attrs.media);
</script>

<style scoped>
.delete-icon {
  position: absolute;
  z-index: 99;
  right: 5px;
  top: 0;
}
</style>
