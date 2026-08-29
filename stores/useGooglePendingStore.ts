import { defineStore } from 'pinia';

export const useGooglePendingStore = defineStore('googlePending', () => {
  const linkedBy = ref<string | null>(null);
  const hasPending = computed(() => linkedBy.value !== null);

  function setPending(provider?: string) {
    linkedBy.value = provider ?? 'google';
  }

  function clear() {
    linkedBy.value = null;
  }

  return { linkedBy, hasPending, setPending, clear };
});
