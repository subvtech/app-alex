import { useDisplay } from 'vuetify';

export const useDirection = () => {
  const { md } = useDisplay();
  const direction = ref(md.value ? 'HORIZONTAL' : 'VERTICAL');
  watch(md, () => {
    if (md.value) {
      direction.value = 'HORIZONTAL';
    } else {
      direction.value = 'VERTICAL';
    }
  });
  return direction;
};
