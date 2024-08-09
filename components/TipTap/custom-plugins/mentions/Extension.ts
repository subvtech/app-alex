import { Mention } from '@tiptap/extension-mention';
import { mergeAttributes, VueNodeViewRenderer } from '@tiptap/vue-3';
import MemberCard from './MemberCard.vue';
const CustomMention = Mention.extend({
  name: 'member-card',
  group: 'inline',

  addAttributes() {
    return {
      fullname: {
        default: 'Sem nome' as string,
      },
      username: {
        default: 'Sem username' as string,
      },
      avatarUrl: {
        default: '' as string,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'member-card',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'member-card',
      mergeAttributes(
        {
          username: node.attrs.username || '',
          fullname: node.attrs.fullname || '',
          avatarUrl: node.attrs.avatarUrl || '',
        },
        HTMLAttributes,
      ),
      `${node.attrs.label ?? node.attrs.id}`,
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(MemberCard);
  },
});

export default CustomMention;
