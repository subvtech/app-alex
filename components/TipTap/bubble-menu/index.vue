<template>
  <div class="bubble-menu text-dark-gray text-body-3 pa-0 d-flex ga-2 rounded">
    <menubar :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3';
import menubar from './menubar.vue';

defineProps({
  editor: {
    type: Editor,
    required: true,
  },
});
</script>

<!-- 
<button
:class="{ 'is-active': props.editor?.isActive('bold') }"
@click="props.editor.chain().focus().toggleBold().run()"
>
Bold
</button>
<button
:class="{ 'is-active': props.editor?.isActive('italic') }"
@click="props.editor.chain().focus().toggleItalic().run()"
>
Italic
</button>
<button
:class="{ 'is-active': props.editor?.isActive('strike') }"
@click="props.editor.chain().focus().toggleStrike().run()"
>
Strike
</button> -->

<style scoped>
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
