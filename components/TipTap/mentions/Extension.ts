import { Mention } from '@tiptap/extension-mention';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import MemberCard from './MemberCard.vue';
const CustomMention = Mention.extend({
  addNodeView() {
    return VueNodeViewRenderer(MemberCard);
  },
});

export default CustomMention;
