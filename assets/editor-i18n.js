/* eslint-disable */
export const i18n = {
  /**
   * @type {I18nDictionary}
   */
  messages: {
    /**
     * Other below: translation of different UI components of the editor.js core
     */
    ui: {
      blockTunes: {
        toggler: {
          'Click to tune': 'Clique para ajustar',
          'or drag to move': 'ou puxe para mover',
          Anchor: 'Âncora',
        },
      },
      inlineToolbar: {
        converter: {
          'Convert to': 'Converter para',
        },
      },
      toolbar: {
        toolbox: {
          Add: 'Adicionar',
        },
      },
    },

    /**
     * Section for translation Tool Names: both block and inline tools
     */
    toolNames: {
      Text: 'Texto',
      Heading: 'Cabeçalho',
      List: 'Lista',
      Warning: 'Aviso',
      Alert: 'Alerta',
      Image: 'Imagem',
      'Social Post': 'Post Social',
      Fileset: 'Anexo',
      Checklist: 'Checklist',
      Quote: 'Citação',
      Code: 'Código',
      Delimiter: 'Delimitador',
      'Raw HTML': 'HTML Puro',
      Table: 'Tabela',
      Link: 'Link',
      Hyperlink: 'Link',
      Marker: 'Marcador',
      Bold: 'Negrito',
      Italic: 'Itálico',
      InlineCode: 'Código Inline',
      Attachment: 'Anexo',
      'AI TEXT (experimental)': 'Texto IA',
    },

    /**
     * Section for passing translations to the external tools classes
     */
    tools: {
      /**
       * Each subsection is the i18n dictionary that will be passed to the corresponded plugin
       * The name of a plugin should be equal the name you specify in the 'tool' section for that plugin
       */
      warning: {
        // <-- 'Warning' tool will accept this dictionary section
        Title: 'Título',
        Message: 'Mensagem',
      },

      /**
       * Link is the internal Inline Tool
       */
      link: {
        'Add a link': 'Adicionar um link',
      },
      /**
       * The "stub" is an internal block tool, used to fit blocks that does not have the corresponded plugin
       */
      stub: {
        'The block can not be displayed correctly.':
          'Este bloco não pôde ser exibido corretamente.',
      },
    },

    /**
     * Section allows to translate Block Tunes
     */
    blockTunes: {
      /**
       * Each subsection is the i18n dictionary that will be passed to the corresponded Block Tune plugin
       * The name of a plugin should be equal the name you specify in the 'tunes' section for that plugin
       *
       * Also, there are few internal block tunes: "delete", "moveUp" and "moveDown"
       */
      delete: {
        Delete: 'Deletar',
      },
      moveUp: {
        'Move up': 'Acima',
      },
      moveDown: {
        'Move down': 'Abaixo',
      },
      table: {
        'Insert column before': 'Inserir coluna antes',
        'Insert column after': 'Inserir coluna depois',
        'Insert row before': 'Inserir linha antes',
        'Insert row after': 'Inserir linha depois',
        'Delete row': 'Deletar linha',
        'Delete column': 'Deletar coluna',
      },
      list: {
        'Ordered': 'Ordenada',
        Unordered: 'Desordenada',
      },
      Image: {
        'Select an Image': 'Selecione uma Imagem',
        'With border': 'Com borda',
        'With background': 'Com plano de fundo',
        'Stretch image': 'Esticar imagem',
      },
    },
  },
};
