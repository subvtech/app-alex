import { isTextSelection } from '@tiptap/core';
import { CellSelection } from '@tiptap/pm/tables';
import { Editor } from '@tiptap/vue-3';

export const isTextSelected = ({ editor }: { editor: Editor }) => {
  const {
    state: {
      doc,
      selection,
      selection: { empty, from, to },
    },
  } = editor;

  if (!editor.isEditable) {
    return false;
  }

  // Inside a table the menu must also show with an empty selection (cursor in a
  // cell) or with a cell selection, otherwise the table commands are unreachable.
  if (editor.isActive('table') || selection instanceof CellSelection) {
    return true;
  }

  // Sometime check for `empty` is not enough.
  // Doubleclick an empty paragraph returns a node size of 2.
  // So we check also for an empty text size.
  const isEmptyTextBlock =
    !doc.textBetween(from, to).length && isTextSelection(selection);

  if (empty || isEmptyTextBlock) {
    return false;
  }
  return (
    editor.isActive('paragraph') ||
    editor.isActive('heading') ||
    editor.isActive('blockquote') ||
    editor.isActive('TaskList') ||
    editor.isActive('OrderedList') ||
    editor.isActive('BulletList') ||
    editor.isActive('Link')
  );
};

export default isTextSelected;
