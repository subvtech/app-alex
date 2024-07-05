<template>
  <div>
    <div class="control-group">
      <label>
        <input type="checkbox" :checked="isEditable" @change="toggleEditable" />
        Editable
      </label>
    </div>
    <editor-content :editor="editor" />
    {{ user?.username }}
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
// import StarterKit from '@tiptap/starter-kit';
import { StarterKit } from '@syfxlin/tiptap-starter-kit';
import { Editor, EditorContent } from '@tiptap/vue-3';
import Collaboration from '@tiptap/extension-collaboration';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { TiptapCollabProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';

const doc = new Y.Doc();

const editor = ref(null);
const isEditable = ref(true);

const collors = [
  '#f783ac',
  '#f3a683',
  '#f3d683',
  '#d9f683',
  '#aef683',
  '#83f6b4',
  '#83f6f0',
  '#83baf6',
  '#838cf6',
  '#c783f6',
  '#f683e4',
  '#f683a6',
];

onMounted(() => {
  const user = useStrapiUser();
  const provider = new TiptapCollabProvider({
    name: encodeURIComponent('document.name'), // Unique document identifier for syncing. This is your document name.
    appId: 'starter-kit', // Your Cloud Dashboard AppID or `baseURL` for on-premises
    token: 'notoken', // Your JWT token
    document: doc,

    // The onSynced callback ensures initial content is set only once using editor.setContent(), preventing repetitive content loading on editor syncs.
    onSynced() {
      if (!doc.getMap('config').get('initialContentLoaded') && editor) {
        doc.getMap('config').set('initialContentLoaded', true);

        editor.value.commands.setContent(`
            <p>This is a radically reduced version of Tiptap. It has support for a document, with paragraphs and text. That’s it. It’s probably too much for real minimalists though.</p>
            <p>The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.</p>
            `);
      }
    },
  });

  editor.value = new Editor({
    extensions: [
      StarterKit.configure({
        table: false,
        BlockMenuButtonViewOptions: {
          icon: 'bold',
          name: 'bold',
          command: 'bold',
          isActive: (editor) => editor.isActive('bold'),
          isDisabled: (editor) => editor.isDisabled('bold'),
        },
      }),
      HorizontalRule,
      Collaboration.configure({
        document: doc,
      }),
      CollaborationCursor.configure({
        provider,
        user: {
          name: user.value ? user.value.username : 'Anonymous',
          color: collors[Math.floor(Math.random() * collors.length)],
        },
      }),
    ],
    content: props.modelValue,
    onUpdate: ({ editor }) => {
      // HTML
      //   emits('update:modelValue', editor.getHTML());

      // JSON
      emits('update:modelValue', editor.getJSON());
    },
  });
});

const toggleEditable = () => {
  isEditable.value = !isEditable.value;
};

watch(isEditable, (value) => {
  if (editor.value) {
    editor.value.setEditable(value);
  }
});

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

const emits = defineEmits(['update:modelValue']);

watch(
  () => props.modelValue,
  (value) => {
    if (!editor.value) {
      return;
    }
    // HTML
    // const isSame = editor.value.getHTML() === value;

    // JSON
    const isSame =
      JSON.stringify(editor.value.getJSON()) === JSON.stringify(value);

    if (!isSame) {
      editor.value.commands.setContent(value, false);
    }
  },
);
</script>

<style lang="scss">
/* Basic editor styles */
.tiptap {
  :first-child {
    margin-top: 0;
  }

  /* List styles */
  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  /* Heading styles */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    text-wrap: pretty;
  }

  h1,
  h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  h4,
  h5,
  h6 {
    font-size: 1rem;
  }

  /* Code and preformatted text styles */
  code {
    background-color: var(--purple-light);
    border-radius: 0.4rem;
    color: var(--black);
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  pre {
    background: var(--black);
    border-radius: 0.5rem;
    color: var(--white);
    font-family: 'JetBrainsMono', monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }
  }

  blockquote {
    border-left: 3px solid rgb(var(--v-theme-gray-300));
    margin: 1.5rem 0;
    padding-left: 1rem;
  }

  hr {
    border: none;
    border-top: 1px solid rgb(var(--v-theme-gray-200));
    margin: 2rem 0;
  }
  background-color: #fff;
  padding: 18px;
  border-radius: 8px;
}

.collaboration-cursor__caret {
  border-left: 1px solid #0d0d0d;
  border-right: 1px solid #0d0d0d;
  margin-left: -1px;
  margin-right: -1px;
  pointer-events: none;
  position: relative;
  word-break: normal;
}

/* Render the username above the caret */
.collaboration-cursor__label {
  border-radius: 3px 3px 3px 0;
  color: #0d0d0d;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  left: -1px;
  line-height: normal;
  padding: 0.1rem 0.3rem;
  position: absolute;
  top: -1.4em;
  user-select: none;
  white-space: nowrap;
}
</style>
