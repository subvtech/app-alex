import { ref, onMounted } from 'vue';

export default function useNavigationDrawer(
  defaultWidth = 0,
  defaultDrawerValue = true,
) {
  const clipped = ref(false);
  const drawer = ref(defaultDrawerValue);
  const currentWidth = ref(defaultWidth);

  const handleSetWidth = () => {
    currentWidth.value = window.innerWidth;
  };
  const onClickOutside = () => {
    closeDrawable();
  };

  const closeDrawable = (clippedValue = true) => {
    clipped.value = clippedValue;
    if (isPermanent.value) {
      if (!drawer.value) {
        drawer.value = true;
      }
      clipped.value = clippedValue;
      return;
    }
    if (drawer.value) {
      clipped.value = false;
      drawer.value = false;
      return;
    }
    drawer.value = true;
    clipped.value = false;
  };
  const isPermanent = computed(() => currentWidth.value >= 767);
  watch(isPermanent, () => {
    if (isPermanent.value && !drawer.value) {
      drawer.value = true;
    }
  });
  onMounted(() => {
    currentWidth.value = window.innerWidth;
    window.addEventListener('resize', handleSetWidth);
  });
  onUnmounted(() => {
    window.removeEventListener('resize', handleSetWidth);
  });
  return {
    clipped,
    drawer,
    closeDrawable,
    onClickOutside,
    currentWidth,
    isPermanent,
  };
}
