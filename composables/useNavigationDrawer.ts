import { ref, onMounted } from 'vue';

export default function useNavigationDrawer() {
  const clipped = ref(false);
  const drawer = ref(false);
  const currentWidth = ref(0);

  onMounted(() => {
    currentWidth.value = window.innerWidth;

    window.addEventListener('resize', () => {
      currentWidth.value = window.innerWidth;
    });
  });
  const onClickOutside = computed(() => (drawer ? () => {} : closeDrawable));

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

  const isPermanent = computed(() => currentWidth.value >= 959);

  return {
    clipped,
    drawer,
    isPermanent,
    closeDrawable,
    onClickOutside,
  };
}
