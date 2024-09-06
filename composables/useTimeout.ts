export const useTimeout = (milliseconds: number) => {
  const timeSpan = milliseconds < 0 ? 0 : milliseconds;
  const timeEllapsed = ref(0);

  const timeoutId = ref<NodeJS.Timeout | null>(null);
  const timeRunning = ref(false);

  const stopTimeout = () => {
    if (timeoutId.value) clearTimeout(timeoutId.value);
    else timeoutId.value = null;
    timeRunning.value = false;
    timeEllapsed.value = 0;
  };

  const setTimeRunning = (value: boolean) => (timeRunning.value = value);

  watch(timeRunning, () => {
    if (!timeRunning.value) {
      stopTimeout();
      return;
    }
    timeoutId.value = setTimeout(() => {
      timeEllapsed.value++;
    }, timeSpan);
  });
  return { timeSpan, timeoutId, stopTimeout, setTimeRunning, timeRunning };
};
