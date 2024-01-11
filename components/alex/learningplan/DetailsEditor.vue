<template>
  <alex-custom-card
    class="mb-6"
    :title="title"
    :isEditing="isEditing && canEdit"
    :showIcon="canEdit"
    @toggle:isEditing="toggleIsEditing"
    :cancel="cancel"
    :save="updateAbout"
    sizingClass="pa-0"
    full-width
  >
    <template v-slot:content>
      <div
        v-if="isEmptyAndIsNotEditing"
        class="d-flex flex-column w-100 justify-center align-center gap-4"
      >
        <alex-custom-empty-placeholder
          empty-text-image="/svg/EmptyAbout.svg"
          :empty-text-message="$t('components.courses.editor.emptyPlaceholder')"
        />
      </div>

      <client-only>
        <div
          id="editorjs"
          class="editorjs w-full p-6 sm:p-16"
          :class="[isEditing ? '' : 'locked']"
          :spellcheck="isEditing ? 'true' : 'false'"
        />
      </client-only>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
import EditorJS, { OutputBlockData } from '@editorjs/editorjs';
import Marker from '@editorjs/marker';

import Image from '@editorjs/image';
import ImageUrl from '@editorjs/simple-image';
import DragDrop from 'editorjs-drag-drop';
import Alert from 'editorjs-alert';
import Warning from '@editorjs/warning';
import Attaches from '@editorjs/attaches';
import Undo from 'editorjs-undo';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';
import Link from '@editorjs/link';
import List from '@editorjs/nested-list';
import Quote from '@editorjs/quote';
import Hyperlink from 'editorjs-hyperlink';
import AlignmentBlockTune from 'editorjs-text-alignment-blocktune';
import Paragraph from '@editorjs/paragraph';
import Embed from '@editorjs/embed';
import Carousel from '@/editor-js/plugins/carousel/CarouselBlock';
import header from '@/editor-js/plugins/header/HeaderBlock';
import { i18n } from '~/assets/editor-i18n';
const { create, update, delete: _delete } = useStrapi();
const { t } = useI18n();
const messageStore = useMessageStore();
const strapiClient = useStrapiClient();
const token = useStrapiToken();


const props = defineProps({
  info: {
    type: Array as PropType<
      { data: any; id: number; type: string; order: number }[]
    >,
    default: [],
  },
  courseId: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  canEdit: { type: Boolean, required: true },
});

const { info, canEdit } = toRefs(props);

const isEditing = ref(false);
const cancel = async () => {
  await instance.value.render({ blocks: info.value });
};
const emit = defineEmits(['ready', 'update']);
const instance = ref();


const initialiseEditor = () => {
  instance.value = new EditorJS({
    tools: {
      marker: {
        class: Marker,
        shortcut: 'CMD+SHIFT+M',
      },

      delimiter: Delimiter,
      embed: Embed,
      header: {
        class: header,
        shortcut: 'CMD+SHIFT+H',
        tunes: ['alignmentBlockTune'],
        config: {
          allowAnchor: true,
          anchorLength: 100,
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

      quote: {
        class: Quote,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+O',
        config: {
          quotePlaceholder: t('components.courses.editor.quote.placeholder'),
          captionPlaceholder: t('components.courses.editor.quote.caption'),
        },
      },

      image: {
        class: Image,
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
      imageUrl: ImageUrl,

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
        tunes: ['alignmentBlockTune'],
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
      attaches: {
        class: Attaches,
        config: {
          endpoint: `/api/upload-file?token=${token}`,
          buttonText: 'Selecionar arquivo',
          errorMessage: 'Erro no upload do arquivo',
        },
      },
      carousel: {
        class: Carousel,
        config: {
          handleFileSelected: (files) => {
            const formData = new FormData();
            files.forEach((file) => {
              if (file instanceof File) {
                formData.append('files', file, file.name);
              } else if (typeof file === 'string' && file.startsWith('data:')) {
                const base64Data = file.split(',')[1];
                const binaryString = window.atob(base64Data);
                const byteArray = new Uint8Array(binaryString.length);

                for (let i = 0; i < binaryString.length; i++) {
                  byteArray[i] = binaryString.charCodeAt(i);
                }

                let mimeType = 'image/png';
                if (file.startsWith('data:image/jpeg')) {
                  mimeType = 'image/jpeg';
                }

                const blob = new Blob([byteArray], { type: mimeType });
                const fileName =
                  files[0].name.slice(0, files[0].name.lastIndexOf('.')) +
                  '.jpeg';
                const imageFile = new File([blob], fileName, {
                  type: mimeType,
                });
                formData.append('files', imageFile, imageFile.name);
              }
            });

            return strapiClient<Upload>('/upload', {
              method: 'POST',
              body: formData,
            })
              .then((res) => {
                if (files.length > 1) {
                  const url = res[0].url;
                  const thumbnail = res[1].url;
                  return { success: 1, url: { url }, thumbnail: { thumbnail } };
                } else {
                  const url = res[0].url;
                  return { success: 1, url: { url } };
                }
              })
              .catch((err) => {
                messageStore.message = err;
              });
          },
          handleDeletedFiles: async (file) => {
            await strapiClient<Upload>('/upload/files', {
              method: 'GET',
            }).then((res) => {
              const files = res;
              const fileImage = files.find((f) => f.url === file.image);
              strapiClient<Upload>(`/upload/files/${fileImage.id}`, {
                method: 'DELETE',
              });
              if (file.video) {
                const fileVideo = files.find((f) => f.url === file.video);
                strapiClient<Upload>(`/upload/files/${fileVideo.id}`, {
                  method: 'DELETE',
                });
              }
            });
          },
        },
      },
    },

    onChange: () => checkBlocksLimit(instance.value),
    i18n,
    placeholder: isEditing
      ? `${t('components.profile.about.placeholder')}`
      : '',
    holder: 'editorjs',
    //readOnly: true,
    // logLevel: 'ERROR',
    data: {
      blocks: info.value as any,
    },
    onReady: () => {
      /* eslint-disable-next-line */
      new DragDrop(instance.value);
      /* eslint-disable-next-line */
      new Undo({ editor: instance.value });
      emit('ready');
    },
  });
};

onMounted(() => {
  if (!isEmptyAndIsNotEditing.value) initialiseEditor();
});

const isEmptyAndIsNotEditing = computed(
  () => info.value.length === 0 && !isEditing.value,
);

const updateAbout = async () => {
  const instanceData = await instance.value.save();

  const newData = instanceData.blocks.map((item, index) => {
    return {
      data: item.data,
      type: item.type,
      order: index,
    };
  });

  await update(`learningplans`, props.courseId, {
    details: { lines: newData },
  });
  isEditing.value = false;
  emit('update', t('components.courses.editor.update'));
};

const checkBlocksLimit = async (editor) => {
  const data = await editor.save();
  const maxBlocks = 5; // Set your maximum number of blocks
  if (data.blocks.length > maxBlocks) {
    // Remove the last block if the limit is exceeded
    editor.blocks.delete(data.blocks.length - 1);
  }
};

const toggleIsEditing = () => {
  isEditing.value = !isEditing.value;
};
watch(isEmptyAndIsNotEditing, () => {
  const theresInstance = instance.value
    ? Object.keys(instance.value).length !== 0
    : false;
  if (isEmptyAndIsNotEditing && theresInstance) instance.value.destroy();
  else initialiseEditor();
});
</script>

<style global lang="scss">
.gap-4 {
  gap: 16px;
}
#editorjs {
  max-width: 100% !important;
}
/*
@media (min-width: 550px) {
  .ce-toolbar__actions.ce-toolbar__actions--opened {
    left: 0 !important;
    margin-left: -54px;
  }
}
@media (max-width: 550px) {
  .ce-toolbar__actions.ce-toolbar__actions--opened {
    right: 0 !important;
    bottom: 0 !important;
    margin-right: -54px;
  }
}
*/
.locked {
  pointer-events: none;
  -webkit-user-select: text; /* Chrome, Safari, and Opera */
  -moz-user-select: text; /* Firefox */
  -ms-user-select: text; /* Internet Explorer/Edge */
  user-select: text;

  .ce-toolbar__actions.ce-toolbar__actions--opened {
    display: none;
  }
}

.cdx-block {
  max-width: 100% !important;
  overflow-wrap: break-word;
}
#Card {
  /*
  #editorjs {
    .codex-editor__redactor {
      padding-bottom: 24px !important;
    }
    .ce-block__content {
      margin: 0px;
    }
  }
*/
  .info {
    text-align: justify;
    text-justify: inter-word;
    align-self: stretch;
    color: #5d6872;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
  }
}

@media (min-width: 800px) {
  .ce-block__content {
    max-width: 250px !important;
  }
}
@media (min-width: 900px) {
  .ce-block__content {
    max-width: 350px !important;
  }
}

@media (min-width: 1000px) {
  .ce-block__content {
    max-width: 390px !important;
  }
}

@media (min-width: 1100px) {
  .ce-block__content {
    max-width: 500px !important;
  }
}
@media (min-width: 1200px) {
  .ce-block__content {
    max-width: 600px !important;
  }
}
@media (min-width: 1300px) {
  .ce-block__content {
    max-width: 450px !important;
  }
}

@media (min-width: 1400px) {
  .ce-block__content {
    max-width: 500px !important;
  }
}

@media (min-width: 1500px) {
  .ce-block__content {
    max-width: 550px !important;
  }
}

@media (min-width: 1600px) {
  .ce-block__content {
    max-width: 600px !important;
  }
}

@media (min-width: 1700px) {
  .ce-block__content {
    max-width: 650px !important;
  }
}

@media (min-width: 1800px) {
  .ce-block__content {
    max-width: 700px !important;
  }
}

@media (min-width: 1900px) {
  .ce-block__content {
    max-width: 750px !important;
  }
}

@media (min-width: 2000px) {
  .ce-block__content {
    max-width: 800px !important;
  }
}
</style>
