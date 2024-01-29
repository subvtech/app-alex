export const useTimeout = (milliseconds: number) => {
  const timeSpan = milliseconds < 1 ? 500 : milliseconds;
  const timeoutId = ref<NodeJS.Timeout | null>(null);
  const startTimer = ref(false)
  const stopTimeout = () => {
    if (timeoutId.value) clearTimeout(timeoutId.value);
    else timeoutId.value = null;
    startTimer.value = false;
  };

  const setStartTimer = (value: boolean) => startTimer.value = value;



  return { timeSpan, timeoutId, stopTimeout, setStartTimer, startTimer };
};
