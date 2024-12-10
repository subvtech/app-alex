export const useOnStopTyping = <T = string>(
  search: Ref<T | undefined>,
  callback: (value?: T) => Promise<unknown> | unknown,
  ms: number = 500,
  first: boolean = true,
  whenEmpty: boolean = true,
) => {
  const isTyping = ref(false);
  const callFirst = ref(first);
  const empty = ref(whenEmpty);
  const timeout = ref();

  watch(search, () => {
    if (timeout.value) {
      clearInterval(timeout.value);
    }
    if (!search.value && empty.value) {
      return;
    }
    if (!callFirst.value) {
      callFirst.value = true;
      return;
    }

    isTyping.value = true;

    timeout.value = setTimeout(async () => {
      isTyping.value = false;
      await callback(search.value);
    }, ms);
  });
  return {
    isTyping,
  };
};
