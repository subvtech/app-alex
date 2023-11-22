import { ref, onMounted, watch } from 'vue';

export default function useNavigationDrawer() {
  const clipped = ref(false);
  const drawer = ref(true);
  const isPermanent = ref(false);
  const currentWidth = ref(0);

  onMounted(() => {
    currentWidth.value = window.innerWidth;

    window.addEventListener('resize', () => {
      currentWidth.value = window.innerWidth;
    });
  });

  const closeDrawable = () => {
    if (isPermanent.value) {
      if (!drawer.value) drawer.value = true;
      clipped.value = true;
    } else if (drawer.value) {
      if (clipped.value) clipped.value = false;
      drawer.value = false;
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
