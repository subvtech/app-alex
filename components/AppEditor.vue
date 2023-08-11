<template>
  <client-only>
    <div id="editorjs" class="editorjs w-full p-6 sm:p-16" />
  </client-only>
</template>

<script setup lang="ts">
import EditorJS from '@editorjs/editorjs';
import Delmiter from '@editorjs/delimiter';
import Header from 'editorjs-header-with-anchor';
import Image from '@editorjs/image';
import ImageUrl from '@editorjs/simple-image';
import InlineCode from '@editorjs/inline-code';
import Link from '@editorjs/link';
import List from '@editorjs/nested-list';
import Marker from '@editorjs/marker';
import Quote from '@editorjs/quote';
import Table from 'editorjs-table';
import Hyperlink from 'editorjs-hyperlink';
import AlignmentBlockTune from 'editorjs-text-alignment-blocktune';
import SocialPost from 'editorjs-social-post-plugin';
import Code from '@editorjs/code';
import Alert from 'editorjs-alert';
import Paragraph from '@editorjs/paragraph';
import Warning from '@editorjs/warning';
import Attaches from '@editorjs/attaches';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';
import { Strapi4ResponseData } from '@nuxtjs/strapi/dist/runtime/types';
import { Structure } from 'models/structure.model';
import { i18n } from '~/assets/editor-i18n';
import { useMessageStore } from '~/stores/message';
import { Upload } from 'models/upload.model';
const messageStore = useMessageStore();
const strapiClient = useStrapiClient();
const emit = defineEmits(['ready', 'change']);
const instance = ref();

const token = useStrapiToken();

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

onMounted(() => {
  instance.value = new EditorJS({
    tools: {
      delimiter: Delmiter,
      // embed: require('@editorjs/embed'),
      header: {
        class: Header,
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
                  const url = res.url;
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
      table: {
        class: Table,
        // inlineToolbar: true,
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
      socialPost: SocialPost,
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
          endpoint: `/api/upload-file?token=${token}`,
          buttonText: 'Selecionar arquivo',
          errorMessage: 'Erro no upload do arquivo',
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
  max-width: 100%;
}
</style>
