export const useCopyText = () => {
  const i18n = useI18n();
  const { setMessage } = useMessageStore();
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      setMessage(i18n.t('rules.copy.success'), 'green', true);
    } catch (err) {
      setMessage(i18n.t('rules.copy.failed'), 'red', true);
      console.error('Failed to copy text: ', err);
    }
  }
  return { copyToClipboard };
};
