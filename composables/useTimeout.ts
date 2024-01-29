export const useTimeout = (milliseconds: number) => {
  const timeSpan = milliseconds < 1 ? 500 : milliseconds;
  const timeoutId = ref<NodeJS.Timeout | null>(null);
  const stopTimeout = () => {
    if (timeoutId.value) clearTimeout(timeoutId.value);
    else timeoutId.value = null;
  };

  return { timeSpan, timeoutId, stopTimeout };
};
