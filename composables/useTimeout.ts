export const useTimeout = (milliseconds: number = 1000) => {
  const timeSpan = ref(milliseconds < 0 ? 0 : milliseconds);

  const remainingTime = ref(0);
  const timeEllapsed = ref(0);

  const timeoutId = ref<NodeJS.Timeout | null>(null);
  const timeRunning = ref(false);

  const theresTime = computed(() => remainingTime.value > 0);

  const stopTimeout = (resetTime = false) => {
    if (timeoutId.value) clearTimeout(timeoutId.value);
    else timeoutId.value = null;
    timeRunning.value = false;

    timeEllapsed.value = 0;
    remainingTime.value = resetTime ? timeSpan.value : 0;
  };

  const setTimeRunning = (value: boolean) => {
    timeRunning.value = value;
    if (value) remainingTime.value = timeSpan.value;
  };

  const setTimeSpan = (value: number) => {
    timeSpan.value = value;
  };

  watch(
    [timeRunning, remainingTime],
    () => {
      if (!theresTime.value) {
        stopTimeout();
        return;
      }

      timeoutId.value = setTimeout(() => {
        remainingTime.value -= 1000;
        timeEllapsed.value += 1;
      }, 1000);
    },
    { immediate: true },
  );
  return {
    timeSpan,
    timeoutId,
    remainingTime,
    timeEllapsed,
    stopTimeout,
    setTimeRunning,
    setTimeSpan,
    theresTime,
    timeRunning,
  };
};
