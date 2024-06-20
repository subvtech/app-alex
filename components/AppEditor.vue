<template>
  <client-only>
    <div
      :id="keyId"
      class="editorjs w-100 pa-0 show-drop-area"
      :class="viewerId"
      :is-editing="isEditing"
      v-bind="$attrs"
      :data-active="fileDrop && isEditing"
      @dragenter.prevent="handleDragEnter"
      @dragover.prevent="handleDragEnter"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    ></div>
    <alex-custom-viewer
      ref="viewer"
      v-model="viewerInstance"
      :container="viewerId"
    />
  </client-only>
</template>

<script setup lang="ts">
import EditorJS from '@editorjs/editorjs';
import Delimiter from '@editorjs/delimiter';
import ImageUrl from '@editorjs/simple-image';
import InlineCode from '@editorjs/inline-code';
import Link from '@editorjs/link';
import List from '@editorjs/nested-list';
import Marker from '@editorjs/marker';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import Hyperlink from 'editorjs-hyperlink';
import AlignmentBlockTune from 'editorjs-text-alignment-blocktune';
import Code from '@editorjs/code';
import Alert from 'editorjs-alert';
import Paragraph from '@editorjs/paragraph';
import Warning from '@editorjs/warning';
import Undo from 'editorjs-undo';
import Embed from '@editorjs/embed';
import { Upload } from '../models/upload.model';
import Carousel from '../editor-js/plugins/carousel/CarouselBlock';
import header from '../editor-js/plugins/header/HeaderBlock';
import Fileset from '../editor-js/plugins/fileset/filesetBlock';
import CustomImage from '../editor-js/plugins/image/ImageBlock';
import Wrapper from '../editor-js/plugins/wrapper/tune';

import { i18n } from '~/assets/editor-i18n';
import { useMessageStore } from '~/stores/message';
import AIText from '~/editor-js/plugins/AiText';
const messageStore = useMessageStore();
const strapiClient = useStrapiClient();
const isEditing = ref(true);
const emit = defineEmits(['ready', 'change', 'update:selectedBlocks']);
const instance = ref();

interface editorData {
  time: number;
  blocks: Array<{
    type: string;
    data: any;
  }>;
  version: string;
}
const app = useNuxtApp();
const viewerInstance = ref(null);
const viewer = ref<null | {
  createInstance: () => void;
  destroyInstance: () => void;
  reCreateInstance: () => void;
}>(null);
const viewerId = computed(() => `viewer-images-${crypto.randomUUID()}`);
const mediaToDelete = ref<number[]>([]);
const temporaryMedia = ref<number[]>([]);
const selectedBlocks = ref<string[]>([]);
const fileDrop = ref(false);

const deletePendingMediaOnSave = async (mediaArray: Array<number>) => {
  if (mediaArray.length > 0) {
    await Promise.all(
      mediaArray.map((id) =>
        strapiClient(`/upload/files/${id}`, {
          method: 'DELETE',
        }),
      ),
    );
    mediaToDelete.value = [];
    temporaryMedia.value = [];
  }
};

const dropIsTargetEditor = (event: DragEvent) => {
  const targetElement = event.target as Element;
  return isEditing && targetElement.id === 'editorjs';
};

const handleDragEnter = (event: DragEvent) => {
  if (dropIsTargetEditor(event)) {
    fileDrop.value = true;
  }
};

const handleDragLeave = () => {
  if (isEditing) {
    fileDrop.value = false;
  }
};

const handleDrop = (event: DragEvent) => {
  if (dropIsTargetEditor(event)) {
    fileDrop.value = false;
    const dropFiles = event.dataTransfer?.files;
    if (dropFiles?.length === 1 && dropFiles[0].type.startsWith('image')) {
      instance.value.blocks.insert('image', { file: dropFiles });
    } else if (dropFiles) {
      instance.value.blocks.insert(
        'fileset',
        { dropFiles },
        {},
        instance.value.blocks.getBlocksCount() + 1,
        false,
      );
      instance.value.blocks.insert(
        'paragraph',
        {},
        {},
        instance.value.blocks.getBlocksCount() + 1,
        true,
      );
      instance.value.caret.setToLastBlock('start', 0);
    }
  }
};

onMounted(() => {
  instance.value = new EditorJS({
    autofocus: false,
    tools: {
      delimiter: Delimiter,
      embed: Embed,
      header: {
        class: header,
        shortcut: 'CMD+SHIFT+H',
        tunes: [
          'alignmentBlockTune',
          ...(props.selectBlocksMode ? ['wrapper'] : []),
        ],
        config: {
          allowAnchor: true,
          anchorLength: 100,
        },
      },
      image: {
        class: CustomImage,
        config: {
          uploader: {
            uploadByFile: (file) => {
              const formData = new FormData();

              formData.append('files', file, file.name);

              return strapiClient<Upload>('/upload', {
                method: 'POST',
                body: formData,
              })
                .then((res) => {
                  const url = res[0].url;
                  return { success: 1, file: { url } };
                })
                .catch((err) => {
                  messageStore.message = err;
                });
            },
          },
        },
      },
      /* imageUrl: ImageUrl, */
      aiText: {
        class: AIText,
        config: {
          openAiKey: app.$config.public.openAiKey,
        },
      },
      inlineCode: {
        class: InlineCode,
        shortcut: 'CMD+SHIFT+C',
      },
      link: {
        class: Link,
        config: {
          endpoint: '/api/fetch-url',
        },
      },
      list: {
        class: List,
        inlineToolbar: true,
      },
      marker: {
        class: Marker,
        shortcut: 'CMD+SHIFT+M',
      },
      quote: {
        class: Quote,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+O',
        config: {
          quotePlaceholder: 'Insira uma citação',
          captionPlaceholder: 'Autor da citação',
        },
      },
      table: {
        class: Table,
        inlineToolbar: true,
        config: {
          rows: 2,
          cols: 3,
        },
      },
      alignmentBlockTune: {
        class: AlignmentBlockTune,
        config: {
          default: 'left',
          blocks: {
            header: 'center',
            list: 'left',
          },
        },
      },
      hyperlink: {
        class: Hyperlink,
        config: {
          shortcut: 'CMD+L',
          target: '_blank',
          rel: 'nofollow',
          availableTargets: ['_blank', '_self'],
          availableRels: ['author', 'noreferrer'],
          validate: false,
        },
      },
      code: {
        class: Code,
        config: {
          placeholder: 'Escreva o código aqui...',
        },
      },
      // code: require('editorjs-codemirror'),
      alert: {
        class: Alert,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+A',
        config: {
          defaultType: 'info',
          messagePlaceholder: 'Enter something',
        },
      },
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
        tunes: [
          'alignmentBlockTune',
          ...(props.selectBlocksMode ? ['wrapper'] : []),
        ],
      },
      warning: {
        class: Warning,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+W',
        config: {
          titlePlaceholder: 'Título',
          messagePlaceholder: 'Mensagem',
        },
      },
      carousel: {
        class: Carousel,
        config: {
          handleFileSelected: async (slides) => {
            const formData = new FormData();
            slides.forEach((slide) => {
              if (slide.url instanceof File) {
                formData.append('files', slide.url, slide.title);
              } else if (
                typeof slide.url === 'string' &&
                slide.url.startsWith('data:')
              ) {
                const base64Data = slide.url.split(',')[1];
                const binaryString = window.atob(base64Data);
                const byteArray = new Uint8Array(binaryString.length);

                for (let i = 0; i < binaryString.length; i++) {
                  byteArray[i] = binaryString.charCodeAt(i);
                }

                let mimeType = 'image/png';
                if (slide.url.startsWith('data:image/jpeg')) {
                  mimeType = 'image/jpeg';
                }

                const blob = new Blob([byteArray], { type: mimeType });
                const imageFile = new File([blob], slide.title, {
                  type: mimeType,
                });
                formData.append('files', imageFile, imageFile.name);
              }
            });
            const res = await strapiClient<Upload[]>('/upload', {
              method: 'POST',
              body: formData,
            });
            if (slides.length > 1) {
              const url = res[0].url;
              const videoId = res[0].id;
              const thumbnail = res[1].url;
              const imgId = res[1].id;
              temporaryMedia.value.push(videoId);
              temporaryMedia.value.push(imgId);
              return { success: 1, url, thumbnail, videoId, imgId };
            } else {
              const { url, id } = res[0];
              temporaryMedia.value.push(id);
              return { success: 1, url, imgId: id };
            }
          },
          handleDeletedFiles: (file) => {
            if (file.videoId) mediaToDelete.value.push(file.videoId);
            if (file.imgId) mediaToDelete.value.push(file.imgId);
          },
        },
      },
      fileset: {
        class: Fileset,
        config: {
          uploadFiles: async (files) => {
            const formData = new FormData();
            const filesArray: File[] = Array.from(files);
            filesArray.forEach((file: File) => {
              formData.append('files', file, file.name);
            });
            try {
              const res = await strapiClient<Upload[]>('/upload', {
                method: 'POST',
                body: formData,
              });

              return {
                success: 1,
                files: res.map((file) => {
                  temporaryMedia.value.push(file.id);
                  return {
                    title: file.name?.slice(0, file.name?.lastIndexOf('.')),
                    extension: file.ext?.slice(1),
                    size: file.size,
                    id: file.id,
                    url: file.url,
                  };
                }),
              };
            } catch (error) {
              return { success: 0, error };
            }
          },
          handleDeletedFiles: (id: number) => {
            mediaToDelete.value.push(id);
          },
        },
      },
      fileset: {
        class: Fileset,
        config: {
          uploadFiles: async (files) => {
            const formData = new FormData();
            const filesArray: File[] = Array.from(files);
            filesArray.forEach((file: File) => {
              formData.append('files', file, file.name);
            });
            try {
              const res = await strapiClient<Upload[]>('/upload', {
                method: 'POST',
                body: formData,
              });

              return {
                success: 1,
                files: res.map((file) => {
                  temporaryMedia.value.push(file.id);
                  return {
                    title: file.name?.slice(0, file.name?.lastIndexOf('.')),
                    extension: file.ext?.slice(1),
                    size: file.size,
                    id: file.id,
                    url: file.url,
                  };
                }),
              };
            } catch (error) {
              return { success: 0, error };
            }
          },
          handleDeletedFiles: (id: number) => {
            mediaToDelete.value.push(id);
          },
        },
      },
      wrapper: {
        class: Wrapper,
        config: {
          toggleSelect: (value, block) => {
            selectedBlocks.value = value
              ? [...selectedBlocks.value, block.id]
              : selectedBlocks.value.filter((id) => id !== block.id);
            emit('update:selectedBlocks', selectedBlocks.value);
          },
        },
      },
    },
    tunes: props.selectBlocksMode ? ['wrapper'] : [],
    i18n,
    minHeight: 400,
    data: props.data,
    holder: props.keyId,
    // logLevel: 'ERROR',
    placeholder: 'Clique para iniciar...',
    onReady: async () => {
      const data = await instance.value.save();
      if (data.blocks.length > 0 && !props.keyId.includes('contribution')) {
        /* eslint-disable-next-line */
        new Undo({ editor: instance.value });
      }
      if (props.readOnly) {
        instance.value.readOnly.toggle();
        isEditing.value = false;
      }
      emit('ready');
    },
    onChange: () => emit('change'),
  });
});

const props = defineProps({
  data: {
    type: Object as PropType<editorData>,
    default: () => ({ blocks: [] }),
  },
  keyId: {
    type: String,
    default: 'editor',
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  selectBlocksMode: {
    type: Boolean,
    default: false,
  },
});

watch(isEditing, () => {
  if (!viewer.value) return;
  if (!viewerInstance.value) return;
  viewer.value.destroyInstance();
  viewer.value.createInstance();
});
const getData = async () => {
  try {
    const data = await instance.value.save();
    return { success: 1, data };
  } catch (error) {
    return { success: 0 };
  }
};
const loadEditor = async (data) => {
  await instance.value.isReady;
  try {
    await instance.value.render(data);
    const editorData = await instance.value.save();
    return { success: 1, data: editorData };
  } catch (error) {
    return { success: 0 };
  }
};

const toggleReadOnly = (mode: string) => {
  instance.value.isReady.then(async () => {
    await instance.value.readOnly.toggle();
    isEditing.value = !instance.value.readOnly.isEnabled;
    if (!instance.value.readOnly.isEnabled && props.keyId === 'editorjs') {
      const index = instance.value.blocks.getBlocksCount();
      await instance.value.blocks.insert(
        'paragraph',
        { text: ' ' },
        {},
        index + 1,
        true,
      );
      setTimeout(() => {
        instance.value.focus(true);
        const block = instance.value.blocks.getBlockByIndex(index);
        const element = document.querySelector(`[data-id="${block.id}"]`);
        if (element) {
          element.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      }, 100);
    } else if (mode === 'save') deletePendingMediaOnSave(mediaToDelete.value);
    else if (mode === 'cancel') deletePendingMediaOnSave(temporaryMedia.value);
  });
};

const clearEditor = () => {
  instance.value.isReady.then(() => {
    instance.value.clear();
  });
};

const isReady = async () => {
  return await instance.value.isReady;
};

const getSelectedBlocks = () => {
  return selectedBlocks.value;
};

defineExpose({
  getData,
  loadEditor,
  toggleReadOnly,
  clearEditor,
  isReady,
  getSelectedBlocks,
});
</script>

<style lang="scss">
.editorjs {
  width: 100% !important;
  .codex-editor__redactor {
    padding-bottom: 0 !important;
  }
  .ce-paragraph {
    word-break: break-word;
  }
  .ce-block__content {
    margin: 0;
    max-width: none;
  }
  &[is-editing='true'] {
    padding-bottom: 300px !important;
  }
  &[is-editing='false'] {
    .codex-editor--narrow .codex-editor__redactor {
      margin-right: 0px;
    }
  }
  .codex-editor--narrow {
    background-color: white !important;
  }
}

@media (min-width: 651px) {
  .editorjs[is-editing='true'] {
    .codex-editor--narrow .ce-block {
      margin-right: 0;
      padding-right: 0;
    }
    .ce-block__content {
      margin: 0;
      margin-left: 40px;
    }

    .ce-toolbar__actions {
      right: auto;
      left: -20px;
    }
    .codex-editor--narrow .ce-toolbox .ce-popover,
    .codex-editor--narrow .ce-settings .ce-popover {
      right: auto;
      left: 0;
    }
    .ce-toolbar__content {
      margin: 0;
    }
  }
}
.show-drop-area {
  transition: 0.3s ease;
  border-radius: 4px;
  border: 2px dashed transparent;
  &[data-active='true'] {
    display: block;
    background-color: #d1f6fa7e;
  }
}
</style>
