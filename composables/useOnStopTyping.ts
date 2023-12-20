export const useOnStopTyping = (
  search: Ref<string>,
  callback: () => Promise<unknown>,
) => {
  const isTyping = ref(false);
  watchEffect((onInvalidate) => {
    if (search.value.length > 0) {
      isTyping.value = true;

      const getData = setTimeout(async () => {
        isTyping.value = false;
        await callback();
      }, 500);

      onInvalidate(() => {
        clearInterval(getData);
      });
    }
  });
};
