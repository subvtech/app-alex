import { mergeAttributes, Node } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';

import Component from './Component.vue';

export default Node.create({
  name: 'bookmark',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      url: {
        default: '',
      },
      meta: {
        default: {
          title: '',
          description: '',
          image: '',
          domain: '',
        },
      },
    };
  },

  addOptions() {
    return {
      readOnly: () => false,
      endpoint: '',
    };
  },

  parseHTML() {
    return [
      {
        tag: 'bookmark',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['bookmark', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return VueNodeViewRenderer(Component);
  },
});
