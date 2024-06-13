export const useOnStopTyping = (
  search: Ref<string | undefined>,
  callback: (value?: string) => Promise<unknown> | unknown,
  ms: number = 500,
  first: boolean = true,
  whenEmpty: boolean = true,
) => {
  const isTyping = ref(false);
  const callFirst = ref(first);
  const empty = ref(whenEmpty);
  watchEffect((onInvalidate) => {
    if (!search.value && empty.value) {
      return;
    }
    if (!callFirst.value) {
      callFirst.value = true;
      return;
    }

    isTyping.value = true;

    const timeout = setTimeout(async () => {
      isTyping.value = false;
      await callback(search.value);
    }, ms);

    onInvalidate(() => {
      clearInterval(timeout);
    });
  });
  return {
    isTyping,
  };
};
