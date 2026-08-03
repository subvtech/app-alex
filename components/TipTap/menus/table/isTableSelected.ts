import { isTextSelection } from '@tiptap/core';
import { Editor } from '@tiptap/vue-3';
import { isTextSelected } from '../bubble/isTextSelected';

export const isTableSelected = ({ editor }: { editor: Editor }) => {
  if (!editor.isEditable) {
    return false;
  }
  // CellSelection também passa por isTextSelected, porque as células contêm
  // parágrafos. Sem o isTextSelection o menu sumiria ao selecionar células.
  const hasTextSelection = isTextSelection(editor.state.selection) && isTextSelected({ editor });
  return editor.isActive('table') && !hasTextSelection;
};

export default isTableSelected;
