<template>
  <client-only>
    <div
      id="editorjs"
      class="editorjs w-100 pa-0"
      :is-editing="isEditing"
      v-bind="$attrs"
    ></div>
  </client-only>
</template>

<script setup lang="ts">
import EditorJS from '@editorjs/editorjs';
import Delimiter from '@editorjs/delimiter';
import Image from '@editorjs/image';
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
import Attaches from '@editorjs/attaches';
import Undo from 'editorjs-undo';
import Embed from '@editorjs/embed';
import { Upload } from '../models/upload.model';
import Carousel from '../editor-js/plugins/carousel/CarouselBlock';
import header from '../editor-js/plugins/header/HeaderBlock';

import { i18n } from '~/assets/editor-i18n';
import { useMessageStore } from '~/stores/message';
import AIText from '~/editor-js/plugins/AiText';
const messageStore = useMessageStore();
const strapiClient = useStrapiClient();
const isEditing = ref(true);
const emit = defineEmits(['ready', 'change']);
const instance = ref();
onMounted(() => {
  instance.value = new EditorJS({
    autofocus: true,
    tools: {
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
      aiText: {
        class: AIText,
        config: {
          openaiKey: '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',
          callback: (text: string) => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve('AI: ' + text);
              }, 3000);
            });
          },
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
          uploader: {
            uploadByFile: (file) => {
              const formData = new FormData();

              formData.append('files', file, file.name);

              return strapiClient<Upload>('/upload', {
                method: 'POST',
                body: formData,
              })
                .then((res) => {
                  const data = res[0];
                  return {
                    success: 1,
                    file: {
                      url: data.url,
                      title: data.name,
                      extension: data.ext.slice(1),
                    },
                  };
                })
                .catch((err) => {
                  return { success: 0, file: { error: err } };
                });
            },
          },
          buttonText: 'Selecionar arquivo',
          errorMessage: 'Erro no upload do arquivo',
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
            const res = await strapiClient('/upload', {
              method: 'POST',
              body: formData,
            });
            if (slides.length > 1) {
              const url = res[0].url;
              const videoId = res[0].id;
              const thumbnail = res[1].url;
              const imgId = res[1].id;
              return { success: 1, url, thumbnail, videoId, imgId };
            } else {
              const { url, id } = res[0];
              return { success: 1, url, imgId: id };
            }
          },
          handleDeletedFiles: async (file) => {
            if (file.videoId)
              await strapiClient(`/upload/files/${file.videoId}`, {
                method: 'DELETE',
              });
            if (file.imgId)
              strapiClient(`/upload/files/${file.imgId}`, {
                method: 'DELETE',
              });
          },
        },
      },
    },
    i18n,
    minHeight: 400,
    data: { blocks: [] },
    holder: 'editorjs',
    // logLevel: 'ERROR',
    placeholder: 'Clique para iniciar...',
    onReady: async () => {
      const data = await instance.value.save();
      if (data.blocks.length > 0) {
        /* eslint-disable-next-line */
        new Undo({ editor: instance.value });
      }
      emit('ready');
    },
    onChange: () => emit('change'),
  });
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

const toggleReadOnly = () => {
  instance.value.isReady.then(async () => {
    await instance.value.readOnly.toggle();
    isEditing.value = !instance.value.readOnly.isEnabled;
    if (!instance.value.readOnly.isEnabled) {
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
    }
  });
};

const navigateToId = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
};

const clearEditor = () => {
  instance.value.isReady.then(() => {
    instance.value.clear();
  });
};

const isReady = async () => {
  return await instance.value.isReady;
};
defineExpose({
  getData,
  loadEditor,
  toggleReadOnly,
  navigateToId,
  clearEditor,
  isReady,
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
</style>
