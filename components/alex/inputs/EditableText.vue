<template>
  <component
    :is="tag"
    v-if="!edit"
    class="editable-text"
    :class="cantEdit && 'editable'"
    v-bind="$attrs"
    @click="handleEditContent"
  >
    {{ model || placeholder }}
  </component>
  <textarea
    v-else-if="cantEdit && edit"
    ref="input"
    v-model="model"
    autofocus
    class="editable-text"
    :class="cantEdit && 'editable'"
    v-bind="$attrs"
    @blur="edit = false"
  />
</template>

<script setup lang="ts">
interface EditableTextProps {
  tag: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  placeholder: string;
  cantEdit: boolean;
}
const props = withDefaults(defineProps<EditableTextProps>(), {
  cantEdit: false,
});
const model = defineModel<string>();
const edit = ref(false);
const input = ref<HTMLInputElement | null>(null);
const handleEditContent = () => {
  if (!props.cantEdit) {
    return;
  }
  edit.value = true;
  setTimeout(() => {
    if (input.value) {
      input.value.focus();
    }
  }, 10);
};
</script>

<style scoped>
.editable-text {
  cursor: text;
}
.editable-text {
  width: 100%;
}
.editable-text.editable:hover {
  background: rgb(var(--v-theme-gray-100));
  border-radius: 8px;
}
.editable-text.editable:focus-visible {
  outline: none;
}
</style>
