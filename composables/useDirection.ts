import { useDisplay } from 'vuetify';

export const useDirection = () => {
  const { md } = useDisplay();
  const direction = computed(() => (md.value ? 'HORIZONTAL' : 'VERTICAL'));
  return direction;
};
