import { createApp } from 'vue';
import {
  DragHandle,
  DragHandleOptions,
} from '@tiptap-pro/extension-drag-handle';
import { VueNodeViewRenderer, Editor } from '@tiptap/vue-3';
import { Node } from '@tiptap/pm/model';
import Component from './Component.vue';
import { useTipTapData } from './TipTapData';
import { vuetify } from '@/plugins/vuetify';

interface VueDragHandleOptions extends Omit<DragHandleOptions, 'onNodeChange'> {
  editor: () => Editor | null;
  onNodeChange?: (data: {
    node: Node | null;
    editor: Editor;
    pos: number;
  }) => void;
}
const data = useTipTapData();

const VueDragHandle = DragHandle.extend<VueDragHandleOptions>({
  addNodeView() {
    return VueNodeViewRenderer(Component);
  },
  addOptions() {
    return {
      ...this.parent?.(),
      editor: () => null,
      onNodeChange: (change) => data.handleNodeChange(change),

      render() {
        const wrapper = document.createElement('div');
        const checkEditor = async () => {
          while (!this.editor()) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
          const app = createApp(Component, {
            editor: this.editor(),
            currentNode: data.currentNode,
            currentNodePos: data.currentNodePos,
          });
          app.use(vuetify);
          app.use(i18n);
          app.mount(wrapper);
        };

        checkEditor();
        return wrapper;
      },
    };
  },
});

export default VueDragHandle;
