import { Node } from '@tiptap/pm/model';
import { NodeSelection } from '@tiptap/pm/state';
import { Editor } from '@tiptap/vue-3';

export default function useContentItemActions(editor: Editor) {
  const resetTextFormatting = (
    currentNode: Ref<Node | null>,
    currentNodePos: Ref<number>,
  ) => {
    const chain = editor.chain();

    chain.setNodeSelection(currentNodePos.value).unsetAllMarks();

    if (currentNode.value?.type.name !== 'paragraph') {
      chain.setParagraph();
    }

    chain.run();
  };

  const duplicateNode = (
    currentNode: Ref<Node | null>,
    currentNodePos: Ref<number>,
  ) => {
    editor.commands.setNodeSelection(currentNodePos.value);

    const { $anchor } = editor.state.selection;
    const selectedNode =
      $anchor.node(1) || (editor.state.selection as NodeSelection).node;

    editor
      .chain()
      .setMeta('hideDragHandle', true)
      .insertContentAt(
        currentNodePos.value + (currentNode.value?.nodeSize || 0),
        selectedNode.toJSON(),
      )
      .run();
  };

  const copyNodeToClipboard = (currentNodePos: Ref<number>) => {
    editor
      .chain()
      .setMeta('hideDragHandle', true)
      .setNodeSelection(currentNodePos.value)
      .run();

    document.execCommand('copy');
  };

  const deleteNode = (currentNodePos: Ref<number>) => {
    editor
      .chain()
      .setMeta('hideDragHandle', true)
      .setNodeSelection(currentNodePos.value)
      .deleteSelection()
      .run();
  };

  const handleAdd = (
    currentNode: Ref<Node | null>,
    currentNodePos: Ref<number>,
  ) => {
    if (currentNodePos.value !== -1) {
      const currentNodeSize = currentNode.value?.nodeSize || 0;
      const insertPos = currentNodePos.value + currentNodeSize;
      const currentNodeIsEmptyParagraph =
        currentNode.value?.type.name === 'paragraph' &&
        currentNode.value?.content?.size === 0;
      const focusPos = currentNodeIsEmptyParagraph
        ? currentNodePos.value + 2
        : insertPos + 2;

      const docSize = editor.state.doc.content.size;

      // TODO: Fix position out of range, acredito que seja relacionado ao tamanho do bloco

      const validInsertPos = Math.min(insertPos, docSize);
      // const validFocusPos = Math.min(focusPos, docSize);

      editor
        .chain()
        .command(({ dispatch, tr, state }) => {
          if (dispatch) {
            if (currentNodeIsEmptyParagraph) {
              tr.insertText(
                '/',
                currentNodePos.value,
                currentNodePos.value + 1,
              );
            } else {
              tr.insert(
                validInsertPos,
                state.schema.nodes.paragraph.create(null, [
                  state.schema.text('/'),
                ]),
              );
            }

            return dispatch(tr);
          }

          return true;
        })
        .focus(focusPos)
        .run();
    }
  };

  return {
    resetTextFormatting,
    duplicateNode,
    copyNodeToClipboard,
    deleteNode,
    handleAdd,
  };
}
