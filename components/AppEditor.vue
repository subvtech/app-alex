<template>
  <div id="editorjs" class="editorjs w-full p-6 sm:p-16" />
</template>

<script>
import { i18n } from '~/assets/editor-i18n';
const pkgs = {};

if (process.client) {
  pkgs.EditorJS = require('@editorjs/editorjs');

  pkgs.tools = {
    // code: require('@editorjs/code'),
    delimiter: require('@editorjs/delimiter'),
    // embed: require('@editorjs/embed'),
    // header: {
    //   class: require('@editorjs/header'),
    //   shortcut: 'CMD+SHIFT+H',
    //   tunes: ['alignmentBlockTune'],
    // },
    header: {
      class: require('editorjs-header-with-anchor'),
      shortcut: 'CMD+SHIFT+H',
      tunes: ['alignmentBlockTune'],
      config: {
        allowAnchor: true,
        anchorLength: 100,
      },
    },
    image: {
      class: require('@editorjs/image'),
    },
    imageUrl: require('@editorjs/simple-image'),
    inlineCode: {
      class: require('@editorjs/inline-code'),
      shortcut: 'CMD+SHIFT+C',
    },
    link: {
      class: require('@editorjs/link'),
      config: {
        endpoint: '/api/fetch-url',
      },
    },
    list: {
      // class: require('@editorjs/list'),
      class: require('@editorjs/nested-list'),
      inlineToolbar: true,
    },
    marker: {
      class: require('@editorjs/marker'),
      shortcut: 'CMD+SHIFT+M',
    },
    // quote: require('@editorjs/quote'),
    quote: {
      class: require('@editorjs/quote'),
      inlineToolbar: true,
      shortcut: 'CMD+SHIFT+O',
      config: {
        quotePlaceholder: 'Insira uma citação',
        captionPlaceholder: 'Autor da citação',
      },
    },
    table: {
      class: require('editorjs-table'),
      // inlineToolbar: true,
      config: {
        rows: 2,
        cols: 3,
      },
    },
    alignmentBlockTune: {
      class: require('editorjs-text-alignment-blocktune'),
      config: {
        default: 'left',
        blocks: {
          header: 'center',
          list: 'left',
        },
      },
    },
    hyperlink: {
      class: require('editorjs-hyperlink'),
      config: {
        shortcut: 'CMD+L',
        target: '_blank',
        rel: 'nofollow',
        availableTargets: ['_blank', '_self'],
        availableRels: ['author', 'noreferrer'],
        validate: false,
      },
    },
    socialPost: require('editorjs-social-post-plugin'),
    code: {
      class: require('@editorjs/code'),
      config: {
        placeholder: 'Escreva o código aqui...',
      },
    },
    // code: require('editorjs-codemirror'),
    alert: {
      class: require('editorjs-alert'),
      inlineToolbar: true,
      shortcut: 'CMD+SHIFT+A',
      config: {
        defaultType: 'info',
        messagePlaceholder: 'Enter something',
      },
    },
    paragraph: {
      // class: require('editorjs-paragraph-with-alignment'),
      class: require('@editorjs/paragraph'),
      inlineToolbar: true,
      tunes: ['alignmentBlockTune'],
    },
    warning: {
      class: require('@editorjs/warning'),
      inlineToolbar: true,
      shortcut: 'CMD+SHIFT+W',
      config: {
        titlePlaceholder: 'Título',
        messagePlaceholder: 'Mensagem',
      },
    },
  };
}

const { EditorJS, tools } = pkgs;

export default {
  name: 'AppEditor',
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    planData() {
      const data = this.data;

      data.blocks = this.data.blocks.map((d) => {
        if (!d.tunes) {
          delete d.tunes;
        }
        return d;
      });

      return data;
    },
  },
  mounted() {
    tools.image.config = {
      uploader: {
        uploadByFile: (file) => {
          const formData = new FormData();

          formData.append('files', file, file.name);

          return this.$strapi.$http
            .$post('/upload', formData)
            .then(([res]) => {
              const url = res.url;
              return { success: 1, file: { url } };
            })
            .catch((err) => {
              this.$error(err);
            });
        },
      },
    };

    const DragDrop = require('editorjs-drag-drop');
    const Undo = require('editorjs-undo');

    tools.attaches = {
      class: require('@editorjs/attaches'),
      config: {
        endpoint: `/api/upload-file?token=${this.$strapi.getToken()}`,
        buttonText: 'Selecionar arquivo',
        errorMessage: 'Erro no upload do arquivo',
      },
    };

    this.instance = new EditorJS({
      tools,
      i18n,
      minHeight: 400,
      autofocus: true,
      data: this.planData,
      holder: 'editorjs',
      logLevel: 'ERROR',
      placeholder: 'Clique para iniciar...',
      onReady: () => {
        /* eslint-disable-next-line */
        new DragDrop(this.instance);

        /* eslint-disable-next-line */
        new Undo({ editor: this.instance });

        this.$emit('ready');
      },
      onChange: () => this.$emit('change'),
    });
  },
};
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
