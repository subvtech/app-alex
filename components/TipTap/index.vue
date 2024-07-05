<template>
  <div>
    <div class="control-group">
      <label>
        <input type="checkbox" :checked="isEditable" @change="toggleEditable" />
        Editable
      </label>
    </div>

    <div class="bubble-menu-wrapper">
      <!-- <bubble-menu
        v-if="editor"
        :editor="editor"
        :tippy-options="{ duration: 100 }"
      > -->
      <div class="bubble-menu text-dark-gray text-body-3 pa-3 d-flex ga-2">
        <button
          :class="{ 'is-active': editor?.isActive('bold') }"
          @click="editor.chain().focus().toggleBold().run()"
        >
          Bold
        </button>
        <button
          :class="{ 'is-active': editor?.isActive('italic') }"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          Italic
        </button>
        <button
          :class="{ 'is-active': editor?.isActive('strike') }"
          @click="editor.chain().focus().toggleStrike().run()"
        >
          Strike
        </button>
      </div>
      <!-- </bubble-menu> -->
    </div>
    <editor-content :editor="editor" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { Editor, EditorContent } from '@tiptap/vue-3';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import { TiptapCollabProvider } from '@hocuspocus/provider';
// import { WebrtcProvider } from 'y-webrtc';
import * as Y from 'yjs';

import Commands from './slash-menu/commands.js';
import suggestion from './slash-menu/suggestion.js';

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
    appId: '7j9y6m10', // Your Cloud Dashboard AppID or `baseURL` for on-premises
    token: 'notoken', // Your JWT token
    document: doc,

    // The onSynced callback ensures initial content is set only once using editor.setContent(), preventing repetitive content loading on editor syncs.
    onSynced() {
      if (!doc.getMap('config').get('initialContentLoaded') && editor) {
        doc.getMap('config').set('initialContentLoaded', true);
      }
    },
  });

  editor.value = new Editor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      BubbleMenu.configure({
        element: document.querySelector('.bubble-menu-wrapper'),
        tippyOptions: {
          duration: 100,
          theme: 'transparent',
        },
      }),
      Commands.configure({
        suggestion,
      }),
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

.bubble-menu {
  background: #fff;
  border: 1px solid rgb(var(--v-theme-gray-100));
  overflow: auto;
  position: relative;

  button {
    align-items: center;
    gap: 0.25rem;
    transition: all 0.2s ease;
    padding: 6px;
    border-radius: 4px;

    &:hover {
      background-color: #f5f5f5;
      color: rgb(var(--v-theme-gray-900)) !important;
    }

    &.is-active {
      background-color: #e5e5e5;
      color: rgb(var(--v-theme-gray-900)) !important;
    }
  }
}
</style>
