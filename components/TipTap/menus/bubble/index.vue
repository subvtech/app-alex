<template>
  <div
    class="bubble-menu text-dark-gray text-body-3 pa-0 d-flex rounded d-flex flex-wrap rounded-lg w-100"
    :class="fixedMenuBar ? 'fixed-menu-bar' : 'float-bubble-menu'"
  >
    <menubar :editor="editor" />
    <v-divider :class="dividerClass" class="divider" :vertical="isVerticalDivider"></v-divider>
    <toggleGroup :editor="editor" :fixed-menu-bar="fixedMenuBar" />
  </div>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';
import { Editor } from '@tiptap/vue-3';
import menubar from './menubar.vue';
import toggleGroup from './toggleGroup.vue';

const props = defineProps({
  editor: {
    type: Editor,
    required: true,
  },
  fixedMenuBar: {
    type: Boolean,
    default: false,
  },
});

const { width } = useWindowSize();

const isVerticalDivider = computed(() => width.value > 850 || (props.fixedMenuBar && width.value > 560));

const dividerClass = computed(() => ({
  'vertical-divider mx-1': isVerticalDivider.value,
  'horizontal-divider my-1': !isVerticalDivider.value,
}));
</script>

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

.divider {
  border-color: rgb(var(--v-theme-gray-800));
}

@media (max-width: 850px) {
  .float-bubble-menu {
    max-width: 235px;
    justify-content: center;
  }
}

@media (max-width: 560px) {
  .fixed-menu-bar {
    justify-content: center;
  }
}
</style>
