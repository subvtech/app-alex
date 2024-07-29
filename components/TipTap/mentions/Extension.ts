import { Node } from '@tiptap/core';
import { mergeAttributes, VueNodeViewRenderer } from '@tiptap/vue-3';
import MemberCard from './MemberCard.vue';
import Suggestions from './Suggestions';

export default Node.create({
  name: 'member-card',
  group: 'block',
  atom: true,

  parseHTML() {
    return [
      {
        tag: 'member-card',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['member-card', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return VueNodeViewRenderer(MemberCard);
  },

  suggestion: Suggestions,
});
