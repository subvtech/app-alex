export const validateCNPJ = (cnpj = ''): boolean => {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14 || /^(.)\1{13}$/.test(cnpj)) return false; // Check length and invalid patterns

  const calculateCheckDigit = (arr: number[], pos: number): number => {
    const wghts = pos === 1 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = arr.slice(0, wghts.length).reduce((acc, val, idx) => acc + val * wghts[idx], 0);
    return sum % 11 < 2 ? 0 : 11 - (sum % 11);
  };

  const cnpjArray = cnpj.split('').map(Number);
  const checkDigit1 = calculateCheckDigit(cnpjArray, 1);
  const checkDigit2 = calculateCheckDigit(cnpjArray, 2);

  return checkDigit1 === cnpjArray[12] && checkDigit2 === cnpjArray[13];
};
