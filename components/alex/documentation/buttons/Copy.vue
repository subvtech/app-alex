<template>
  <alex-documentation-buttons-tooltip
    :tooltip-text="tooltipText ?? $t('rules.meeting.copy.hint')"
    :icon="isCopied ? copiedIcon : copyIcon"
    :variant="isCopied ? 'success' : 'text'"
    @click:button="handleClick"
  />
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

<style scoped lang="scss">
.rounded {
  border-radius: 99%;
}
</style>
