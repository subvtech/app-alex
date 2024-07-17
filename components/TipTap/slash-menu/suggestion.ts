import { VueRenderer } from '@tiptap/vue-3';
import tippy from 'tippy.js';

import CommandsList from './CommandsList.vue';

export default {
  items: ({ query }) => {
    return [
      {
        divider: true,
        title: 'Format',
      },
      {
        title: 'Heading 1',
        icon: 'mdi-format-header-1',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 1 })
            .run();
        },
      },
      {
        title: 'Heading 2',
        icon: 'mdi-format-header-2',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 2 })
            .run();
        },
      },
      {
        title: 'Heading 3',
        icon: 'mdi-format-header-3',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 3 })
            .run();
        },
      },
      {
        title: 'Blockquote',
        icon: 'mdi-format-quote-close-outline',
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBlockquote().run();
        },
      },
      {
        title: 'Bullet List',
        icon: 'mdi-format-list-bulleted',
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
      },
      {
        title: 'Ordered List',
        icon: 'mdi-format-list-numbered',
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
      },
      {
        title: 'Todo List',
        icon: 'mdi-format-list-checks',
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleTaskList().run();
        },
      },
      {
        title: 'Code Block',
        icon: 'mdi-code-not-equal-variant',
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
        },
      },
      {
        divider: true,
        title: 'Insert',
      },
      {
        title: 'Attaches',
        icon: 'mdi-file-multiple',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent({
              type: 'fileSet',
            })
            .run();
        },
      },
      {
        title: 'Horizontal Rule',
        icon: 'mdi-color-helper',
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setHorizontalRule().run();
        },
      },
      {
        title: 'Table',
        icon: 'mdi-table',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run();
        },
      },
    ]
      .filter((item) => {
        if (query) {
          return (
            item.title.toLowerCase().includes(query.toLowerCase()) &&
            !item.divider
          );
        }
        return true;
      })
      .slice(0, 20);
  },
  /* 

  {
    value: 'codeXml',
    icon: CodeXml,
    ariaLabel: 'Code Block',
    onClick: () => props.editor.chain().focus().toggleCodeBlock().run(),
  }, */
  render: () => {
    let component;
    let popup;

    return {
      onStart: (props) => {
        component = new VueRenderer(CommandsList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
          theme: 'transparent',
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
