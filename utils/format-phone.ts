export function formatPhone(value = '') {
  return value.replace(/[^\d]/g, '').replace(/.*/, (m) => {
    if (m.length === 11) return m.replace(/(\d{2})(\d{5})(\d{4}).*/g, '($1) $2-$3');
    if (m.length > 6) return m.replace(/(\d{2})(\d{4})(\d{1,4}).*/g, '($1) $2-$3');
    if (m.length > 2) return m.replace(/(\d{2})(\d{1,4}).*/g, '($1) $2');
    return m;
  });
}
