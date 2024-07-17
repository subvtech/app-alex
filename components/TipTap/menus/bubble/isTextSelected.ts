import { isTextSelection } from '@tiptap/core';
import { Editor } from '@tiptap/vue-3';

export const isTextSelected = ({ editor }: { editor: Editor }) => {
  const {
    state: {
      doc,
      selection,
      selection: { empty, from, to },
    },
  } = editor;

  // Sometime check for `empty` is not enough.
  // Doubleclick an empty paragraph returns a node size of 2.
  // So we check also for an empty text size.
  const isEmptyTextBlock =
    !doc.textBetween(from, to).length && isTextSelection(selection);

  console.log(editor);
  if (empty || isEmptyTextBlock || !editor.isEditable) {
    return false;
  }
  return (
    editor.isActive('paragraph') ||
    editor.isActive('heading') ||
    editor.isActive('blockquote') ||
    editor.isActive('TaskList') ||
    editor.isActive('OrderedList') ||
    editor.isActive('BulletList') ||
    editor.isActive('Table') ||
    editor.isActive('Link')
  );
};

export default isTextSelected;
