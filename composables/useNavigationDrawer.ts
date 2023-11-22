import { ref, onMounted, watch } from 'vue';

export default function useNavigationDrawer() {
  const clipped = ref(false);
  const drawer = ref(false);
  const isPermanent = ref(false);
  const currentWidth = ref(0);

  onMounted(() => {
    currentWidth.value = window.innerWidth;
    if (currentWidth.value >= 959) {
      isPermanent.value = true;
    } else {
      isPermanent.value = false;
    }
    window.addEventListener('resize', () => {
      currentWidth.value = window.innerWidth;
    });
  });

  const closeDrawable = (clippedValue = true) => {
    if (isPermanent.value) {
      if (!drawer.value) drawer.value = true;
      clipped.value = clippedValue;
    } else if (drawer.value) {
      if (clipped.value) clipped.value = false;
      drawer.value = false;
    } else {
      drawer.value = true;
    }
  };

  watch(
    () => currentWidth.value,
    () => {
      if (currentWidth.value >= 959) {
        isPermanent.value = true;
      } else {
        isPermanent.value = false;
      }
    },
  );

  return {
    clipped,
    drawer,
    isPermanent,
    closeDrawable,
  };
}
