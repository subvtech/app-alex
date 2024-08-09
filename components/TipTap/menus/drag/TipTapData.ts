import { ref } from 'vue';
import { Node } from '@tiptap/pm/model';
import { Editor } from '@tiptap/core';

export const useTipTapData = () => {
  const currentNode = ref<Node | null>(null);
  const currentNodePos = ref<number>(-1);

  const handleNodeChange = (data: {
    node: Node | null;
    editor: Editor;
    pos: number;
  }) => {
    if (data.node) {
      currentNode.value = data.node;
    }

    currentNodePos.value = data.pos;
  };

  return {
    currentNode,
    currentNodePos,
    setCurrentNode: (node: Node | null) => {
      currentNode.value = node;
    },
    setCurrentNodePos: (pos: number) => {
      currentNodePos.value = pos;
    },
    handleNodeChange,
  };
};
