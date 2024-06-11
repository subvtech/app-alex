export const useOnStopTyping = (
  search: Ref<string>,
  callback: () => Promise<unknown> | unknown,
  emptyCall: boolean = false,
) => {
  const isTyping = ref(false);
  watchEffect(async (onInvalidate) => {
    if (search.value?.length > 0) {
      isTyping.value = true;

      const getData = setTimeout(async () => {
        isTyping.value = false;
        await callback();
      }, 500);

      onInvalidate(() => {
        clearInterval(getData);
      });
    } else if (emptyCall) {
      await callback();
    }
  });
};
