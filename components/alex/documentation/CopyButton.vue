<template>
  <alex-custom-button variant="text" color="gray-400" @click="handleClick">
    <v-icon
      v-if="isCopied"
      size="x-large"
      :icon="copiedIcon"
      color="green-lighten-1"
    />
    <v-icon v-else size="x-large" :icon="copyIcon" />
    <v-tooltip
      v-if="tooltipText"
      :text="tooltipText"
      location="top"
      activator="parent"
    />
  </alex-custom-button>
</template>
<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  tooltipText: {
    type: String,
  },
  copyIcon: {
    type: String,
    default: 'mdi-content-copy',
  },
  copiedIcon: {
    type: String,
    default: 'mdi-clipboard-check-multiple-outline',
  },
});
const { copyToClipboard } = useCopyText();

const isCopied = ref(false);

const handleClick = () => {
  if (isCopied.value) {
    isCopied.value = false;
    return;
  }
  copyToClipboard(props.text);
  isCopied.value = true;
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

function handleKeyDown(event) {
  if (event.ctrlKey && event.code === 'KeyC') {
    isCopied.value = false;
  }
}
</script>

<style scoped lang="scss"></style>
