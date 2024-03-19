import * as yup from 'yup';

// validates whether a string of numbers is a valid cpf
export function isValidCpf(val: string): boolean {
  if (!val) return false;
  val = val.replace(/\D/g, '');
  if (val === '00000000000') return false;
  const firstDigit = 10;
  const secondDigit = 11;

  const validateDigit = (index: number, multiplier: number): boolean => {
    let sum = 0;
    for (let i = 1; i <= index; i++) {
      sum += parseInt(val.substring(i - 1, i)) * (multiplier - i);
    }
    let result = (sum * firstDigit) % secondDigit;
    if (result === firstDigit || result === secondDigit) result = 0;
    return result === parseInt(val.substring(index, index + 1));
  };

  return validateDigit(9, firstDigit + 1) && validateDigit(10, secondDigit + 1);
}

const MIN_LENGTH_SHORT = 3;
const MIN_LENGTH_LONG = 4;
const MAX_LENGTH_SHORT = 20;
const MAX_LENGTH_MEDIUM = 64;
const MAX_LENGTH_LONG = 256;
const MAX_LENGTH_EXTRA_LONG = 4000;

const fullnameRegex = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/gm;

interface StringRuleProps {
  required?: boolean;
  length?: number;
  min?: number;
  max?: number;
  matches?: { regex: RegExp; errorMsg?: string };
  trim?: boolean;
}

// generates a yup.string() object that can have min, length, max, matches, required and trim
const getStringRule = (
  i18n: any,
  key: string,
  { required, length, min, max, matches, trim }: StringRuleProps,
): yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''> => {
  let rule = yup.string();

  if (required) rule = rule.required(i18n.t(`rules.${key}.required`));
  if (length) rule = rule.length(length, i18n.t(`rules.${key}.length`));
  else {
    if (min) rule = rule.min(min, i18n.t(`rules.min`, { min }));
    if (max) rule = rule.max(max, i18n.t(`rules.max`, { max }));
  }
  if (trim) rule = rule.trim();
  if (matches)
    rule = rule.matches(
      matches.regex,
      i18n.t(matches.errorMsg ? matches.errorMsg : `rules.${key}.invalid`),
    );

  return rule;
};

export const useBasicRules = () => {
  /*
    This composable is a cluster of yup rules, 
    it's being used throughout the entire application to validate forms

  */
  const i18n = useI18n();

  // generates a yup.string() object with min 3, max 20, required and it trim its borders
  const getMin3Max20StringRule = (name: string) =>
    getStringRule(i18n, name, {
      min: MIN_LENGTH_SHORT,
      max: MAX_LENGTH_SHORT,
      required: true,
      trim: true,
    });

  // generates a yup.string() object with min 4, max 64, required and it trim its borders
  const getMin4Max64StringRule = (name: string) =>
    getStringRule(i18n, name, {
      min: MIN_LENGTH_LONG,
      max: MAX_LENGTH_MEDIUM,
      required: true,
      trim: true,
    });

  // generates a yup.string() object with min 4, max 256, required and it trim its borders
  const getMin4Max256StringRule = (name: string) =>
    getStringRule(i18n, name, {
      min: MIN_LENGTH_LONG,
      max: MAX_LENGTH_LONG,
      required: true,
      trim: true,
    });

  const shortTitleRules = {
    title: getMin3Max20StringRule('title'),
  };

  const longTitleRules = {
    title: getMin4Max64StringRule('title'),
  };

  const longDescriptionRules = {
    description: getStringRule(i18n, 'description', {
      required: true,
      min: MIN_LENGTH_LONG,
      max: MAX_LENGTH_EXTRA_LONG,
      trim: true,
    }),
  };

  const fullnameRules = {
    fullname: getMin4Max64StringRule('fullName').matches(
      fullnameRegex,
      i18n.t('rules.fullName.onlyLetters'),
    ),
  };

  const shortDescriptionRules = {
    description: getMin4Max256StringRule('description'),
  };

  const cpfRules = {
    cpf: getStringRule(i18n, 'cpf', { required: true, length: 14 }).test(
      'test-invalid-cpf',
      i18n.t('rules.cpf.invalid'),
      (cpf) => isValidCpf(cpf!),
    ),
  };

  return {
    shortDescriptionRules,
    fullnameRules,
    longDescriptionRules,
    cpfRules,
    longTitleRules,
    shortTitleRules,
    getStringRule,
    getMin3Max20StringRule,
    getMin4Max64StringRule,
    getMin4Max256StringRule,
  };
};
