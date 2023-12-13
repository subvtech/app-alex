import { useDisplay } from 'vuetify';

export function useDirection(breakpoint: 'tablet' | 'mobile' = 'tablet') {
  const { md, xs } = useDisplay();

  const value = computed(() => {
    switch (breakpoint) {
      case 'mobile':
        return xs.value ? 'VERTICAL' : 'HORIZONTAL';
      case 'tablet':
        return md.value ? 'HORIZONTAL' : 'VERTICAL';
    }
  });
  return value;
}
