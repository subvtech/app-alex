import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePageHeaderStore = defineStore('page-header', () => {
  const title = ref('');
  const hasMainButton = ref(false);
  const mainButtonText = ref('');
  const mainButtonIcon = ref('');
  const hasSecondaryButton = ref(false);
  const secondaryButtonText = ref(false);
  const secondaryButtonIcon = ref('');
  const noBackArrow = ref(false);
  const items = ref<{ title: string; disabled?: boolean; to?: string }[]>([]);
  const showHeader = ref(false);

  const onMainAction = ref();
  const onSecondaryAction = ref();

  const headerOptions = computed<any>(() => {
    return {
      title: title.value,
      hasMainButton: hasMainButton.value,
      mainButtonText: mainButtonText.value,
      mainButtonIcon: mainButtonIcon.value,
      hasSecondaryButton: hasSecondaryButton.value,
      secondaryButtonText: secondaryButtonText.value,
      secondaryButtonIcon: secondaryButtonIcon.value,
      noBackArrow: noBackArrow.value,
      items: items.value,
    };
  });

  return {
    headerOptions,
    title,
    hasMainButton,
    mainButtonText,
    mainButtonIcon,
    hasSecondaryButton,
    secondaryButtonText,
    secondaryButtonIcon,
    noBackArrow,
    items,
    showHeader,
    onMainAction,
    onSecondaryAction,
  };
});
