<template>
  <alex-documentation-buttons-tooltip
    :tooltip-text="tooltipText ?? $t('rules.meeting.copy.hint')"
    :icon="isCopied ? copiedIcon : copyIcon"
    :variant="isCopied ? 'success' : 'text'"
    @click:button="handleClick"
    rounded
  />
</template>
<script setup lang="ts">
export interface CopyButtonComponentType {
  text: string;
  tooltipText?: string;
  copyIcon?: string;
  copiedIcon?: string;
}

const props = withDefaults(defineProps<CopyButtonComponentType>(), {
  copyIcon: 'mdi-content-copy',
  copiedIcon: 'mdi-clipboard-check-multiple-outline',
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
