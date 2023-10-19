<template>
  <v-container id="start" class="d-flex justify-space-between">
    <v-btn @click="saveEditor()">Save</v-btn>
    <a href="#teste123">Teste</a>
    <v-btn @click="loadEditor">Load</v-btn>
  </v-container>
  <client-only>
    <v-row>
      <v-col :cols="!editable ? 9 : 12">
        <div id="editorjs" class="editorjs w-full p-6 sm:p-16" />
      </v-col>

      <v-col v-if="!editable" cols="3">
        <Anchors :anchors="anchors"></Anchors>
      </v-col>
    </v-row>
  </client-only>
</template>

<script setup lang="ts">
import EditorJS from '@editorjs/editorjs';
import Delmiter from '@editorjs/delimiter';
// import Header from 'editorjs-header-with-anchor';
import Image from '@editorjs/image';
import ImageUrl from '@editorjs/simple-image';
import InlineCode from '@editorjs/inline-code';
import Link from '@editorjs/link';
import List from '@editorjs/nested-list';
import Marker from '@editorjs/marker';
import Quote from '@editorjs/quote';
// import Table from 'editorjs-table';
// import Table2 from '@editorjs/table';
import Hyperlink from 'editorjs-hyperlink';
import AlignmentBlockTune from 'editorjs-text-alignment-blocktune';
// import SocialPost from 'editorjs-social-post-plugin';
// import Code from '@editorjs/code';
import Alert from 'editorjs-alert';
import Paragraph from '@editorjs/paragraph';
import Warning from '@editorjs/warning';
import Attaches from '@editorjs/attaches';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';
import Embed from '@editorjs/embed';
import { Strapi4ResponseData } from '@nuxtjs/strapi/dist/runtime/types';
import { Structure } from '../models/structure.model';
import { Upload } from '../models/upload.model';
import { dataLength } from 'ethers';
import Carousel from '../editor-js/plugins/carousel/CarouselBlock';
import header from '../editor-js/plugins/header/HeaderBlock';
import Anchors from '../components/Anchors.vue';
import { i18n } from '~/assets/editor-i18n';
import { useMessageStore } from '~/stores/message';

const messageStore = useMessageStore();
const strapiClient = useStrapiClient();
const emit = defineEmits(['ready', 'change']);
const instance = ref();
const token = useStrapiToken();
const editable = ref(false);
const anchors = ref([]);

const props = defineProps({
  data: {
    type: Object as PropType<Strapi4ResponseData<Structure>>,
    default: () => {},
  },
});

const planData = computed(() => {
  const structure: any = { ...props.data.attributes, id: props.data.id };
  structure.blocks = props.data.attributes.blocks.data.map((b) => {
    if (!b.attributes.tunes) {
      delete b.attributes.tunes;
    }
    return { ...b.attributes, id: b.id };
  });
  return structure;
});

const uploadBaseUrl = computed(() => {
  const runtimeConfig = useRuntimeConfig();
  return runtimeConfig.public.strapi.url;
});

onMounted(() => {
  instance.value = new EditorJS({
    readOnly: editable.value,
    tools: {
      delimiter: Delmiter,
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
                  const url = uploadBaseUrl.value + res[0].url;
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
      /*    table: {
        class: Table,
        // inlineToolbar: true,
        config: {
          rows: 2,
          cols: 3,
        },
      }, */
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
      // socialPost: SocialPost,
      /*   code: {
        class: Code,
        config: {
          placeholder: 'Escreva o código aqui...',
        },
      }, */
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
          endpoint: `/api/upload-file?token=${token}`,
          buttonText: 'Selecionar arquivo',
          errorMessage: 'Erro no upload do arquivo',
        },
      },
      carousel: {
        class: Carousel,
        config: {
          uploadBaseUrl: uploadBaseUrl.value,
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
    i18n,
    minHeight: 400,
    autofocus: true,
    data: planData.value,
    holder: 'editorjs',
    // logLevel: 'ERROR',
    placeholder: 'Clique para iniciar...',
    onReady: () => {
      /* eslint-disable-next-line */
      new DragDrop(instance.value);
      /* eslint-disable-next-line */
      new Undo({ editor: instance.value });
      emit('ready');
    },
    onChange: () => emit('change'),
  });
});
const saveEditor = () => {
  instance.value.save().then((outputData) => {
    console.log(outputData);
  });
};

const loadEditor = () => {};
</script>

<style scoped>
.editorjs >>> .ce-header {
  padding: 0 0 1em;
}

.editorjs >>> .ce-block {
  margin-top: 16px;
}

.editorjs >>> .ce-block:first-of-type {
  margin-top: 0;
}

.editorjs >>> .ce-block:last-of-type {
  margin-bottom: 0;
}

/* stylelint-disable */
.editorjs >>> .ce-block__content,
.editorjs >>> .ce-toolbar__content {
  /* max-width: 64rem; */
  max-width: 95%;
}
</style>
