export const formatCNPJ = (value = '') => {
  return value.replace(/[^\d]/g, '').replace(/.*/, (m) => {
    if (m.length > 12) return m.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2}).*/g, '$1.$2.$3/$4-$5');
    if (m.length > 8) return m.replace(/(\d{2})(\d{3})(\d{3})(\d{1,4}).*/g, '$1.$2.$3/$4');
    if (m.length > 5) return m.replace(/(\d{2})(\d{3})(\d{1,3}).*/g, '$1.$2.$3');
    if (m.length > 2) return m.replace(/(\d{2})(\d{1,3}).*/g, '$1.$2');
    return m;
  });
};
