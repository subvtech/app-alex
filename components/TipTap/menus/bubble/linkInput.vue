<template>
  <alex-inputs-text-field
    v-model="link"
    name="link"
    density="comfortable"
    class="width-60 tiptap-link-selector"
    hide-details
    :placeholder="$t('components.tiptap.menus.bubbleMenu.linkPlaceholder')"
    prepend-inner-icon="mdi-link-variant"
    @input="() => $emit('update:modelValue', link)"
  ></alex-inputs-text-field>
</template>

<script setup lang="ts">
const props = defineProps<{
  activeLink: string;
}>();

defineEmits(['update:modelValue']);

const link = ref(props.activeLink);
</script>

<style>
.tiptap-link-selector {
  .v-field--focused .v-field__prepend-inner .v-icon {
    color: rgb(var(--v-theme-primary--2)) !important;
  }
}
</style>
