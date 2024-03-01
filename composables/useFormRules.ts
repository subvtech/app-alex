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
const emailRegex =
  /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/gi;
const phoneRegex =
  /^\((?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])\) (?:9[0-9])[0-9]{3}\-[0-9]{4}$/;
const usernameRegex =
  /^[a-zA-Z0-9_-]*[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+[a-zA-Z0-9_-]*$/;
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
) => {
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

// generates a yup.string() object with min 3, max 20, required and it trim its borders
const getMin3Max20StringRule = (i18n, name: string) =>
  getStringRule(i18n, name, {
    min: MIN_LENGTH_SHORT,
    max: MAX_LENGTH_SHORT,
    required: true,
    trim: true,
  });

// generates a yup.string() object with min 4, max 64, required and it trim its borders
const getMin4Max64StringRule = (i18n, name: string) =>
  getStringRule(i18n, name, {
    min: MIN_LENGTH_LONG,
    max: MAX_LENGTH_MEDIUM,
    required: true,
    trim: true,
  });

// generates a yup.string() object with min 4, max 256, required and it trim its borders
const getMin4Max256StringRule = (i18n, name: string) =>
  getStringRule(i18n, name, {
    min: MIN_LENGTH_LONG,
    max: MAX_LENGTH_LONG,
    required: true,
    trim: true,
  });

const shortTitleRules = (i18n) => ({
  title: getMin3Max20StringRule(i18n, 'title'),
});

const longTitleRules = (i18n) => ({
  title: getMin4Max64StringRule(i18n, 'title'),
});

const longDescriptionRules = (i18n) => ({
  description: getStringRule(i18n, 'description', {
    required: true,
    min: MIN_LENGTH_LONG,
    max: MAX_LENGTH_EXTRA_LONG,
    trim: true,
  }),
});

const fullnameRules = (i18n) => ({
  fullname: getMin4Max64StringRule(i18n, 'fullName').matches(
    fullnameRegex,
    i18n.t('rules.fullName.onlyLetters'),
  ),
});

const shortDescriptionRules = (i18n) => ({
  description: getMin4Max256StringRule(i18n, 'description'),
});

const emailRules = (i18n) => ({
  email: getStringRule(i18n, 'email', {
    required: true,
    min: 2,
    matches: { regex: emailRegex },
    trim: true,
  }),
});

const cpfRules = (i18n) => ({
  cpf: getStringRule(i18n, 'cpf', { required: true, length: 14 }).test(
    'test-invalid-cpf',
    i18n.t('rules.cpf.invalid'),
    (cpf) => isValidCpf(cpf!),
  ),
});

const passwordRules = (i18n) => ({
  password: getStringRule(i18n, 'password', {
    required: true,
  }),
  /*
  .matches(/^(?=.*[a-z])/, i18n.t('rules.password.lowercase'))
  .matches(/^(?=.*[A-Z])/, i18n.t('rules.password.upperCase'))
  .matches(/^(?=.*\d)/, i18n.t('rules.password.number'))
  .matches(
      /(?=.*[^a-zA-Z0-9])/,
      i18n.t('rules.password.character'),
    )
  .min(8, i18n.t('rules.password.min'))
  */
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], i18n.t('rules.confirmPassword.matchError'))
    .required(i18n.t('rules.confirmPassword.required')),
});

export const useFormRules = () => {
  /*
    This composable is a cluster of yup rules, 
    it's being used throughout the entire application to validate forms

  */
  const i18n = useI18n();

  const locale = i18n.locale.value === 'pt' ? 'pt-BR' : 'en-US';
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const { isSameOrBeforeHour } = useDatetime();

  const keywordSchema = yup
    .object({
      text: getStringRule(i18n, 'text', { min: 2, required: true })
        .matches(/^[^\s]*$/, i18n.t('rules.keyword.noSpaces'))
        .matches(/^[a-zA-Z]*$/, i18n.t('rules.keyword.onlyLetters')),
    })
    .required(i18n.t('rules.keyword.required'));

  const startDateCreationRules = yup
    .date()
    .required(i18n.t('rules.startDate.required'))
    .min(currentDate, ({ min }) =>
      i18n.t('rules.startDate.min', {
        min: min.toLocaleString(locale).split(',')[0],
      }),
    )
    .typeError(i18n.t('rules.startDate.typeError'));

  const startDateUpdateRules = yup
    .date()
    .required(i18n.t('rules.startDate.required'))
    .typeError(i18n.t('rules.startDate.typeError'));

  const endDateRules = yup
    .date()
    .required(i18n.t('rules.endDate.required'))
    .min(yup.ref('startDate'), i18n.t('rules.endDate.beforeStartDate'))
    .typeError(i18n.t('rules.endDate.typeError'));

  const generalCourseSchema = yup.object({
    startDate: startDateUpdateRules,
    endDate: endDateRules,
    slug: getMin3Max20StringRule(i18n, 'slug'),
    ...shortTitleRules(i18n),
  });

  const generalTrailSchema = yup.object({
    ...shortTitleRules(i18n),
    ...longDescriptionRules(i18n),
  });

  const registerStep1 = yup.object({
    ...fullnameRules(i18n),
    ...emailRules(i18n),
    ...cpfRules(i18n),
  });

  const registerStep2 = yup.object({
    yourRole: getStringRule(i18n, 'yourRole', { required: true }).oneOf([
      'professor',
      'aluno',
    ] as const),
    institution: yup
      .number()
      .optional()
      .nullable()
      .when('yourRole', {
        is: 'professor',
        then: (scheme) => scheme.required(i18n.t('rules.institution.required')),
      }),
  });

  const registerStep3 = yup.object({
    username: getMin4Max64StringRule(i18n, 'username').matches(
      usernameRegex,
      i18n.t('rules.username.onlyLetters'),
    ),
    ...passwordRules(i18n),
  });

  const loginSchema = {
    ...emailRules(i18n),
    password: passwordRules(i18n).password,
  };

  const socialsSchema = yup.object({
    name: getMin3Max20StringRule(i18n, 'name'),
    url: getMin4Max64StringRule(i18n, 'url'),
  });

  const createCourseRules = yup.object({
    class: getMin4Max64StringRule(i18n, 'class'),
    startDate: startDateCreationRules,
    endDate: endDateRules,
    ...shortDescriptionRules(i18n),
    ...longTitleRules(i18n),
  });

  const scheduleRules = (startDate?: Date, endDate?: Date) =>
    yup.object({
      date: yup
        .date()
        .required(i18n.t('rules.meeting.date.required'))
        .min(startDate || currentDate, ({ min }) =>
          i18n.t('rules.startDate.min', {
            min: min.toLocaleString(i18n.locale.value).split(',')[0],
          }),
        )
        .max(endDate || currentDate, ({ max }) =>
          i18n.t('rules.endDate.max', {
            max: max.toLocaleString(i18n.locale.value).split(',')[0],
          }),
        ),

      startHour: getStringRule(i18n, 'meeting.startHour', { required: true }),
      endHour: getStringRule(i18n, 'meeting.endHour', { required: true }).test(
        'endHourTest',
        i18n.t('rules.meeting.endHour.beforeStartHour'),
        (value, ctx) => {
          const { startHour } = ctx.parent;
          return isSameOrBeforeHour(value!, startHour) === 1;
        },
      ),
    });

  const createTrailsRules = yup.object({
    ...shortDescriptionRules(i18n),
    ...longTitleRules(i18n),
  });

  const allRules = {
    passwordRules: passwordRules(i18n),
    fullnameRules: fullnameRules(i18n),
    longDescriptionRules: longDescriptionRules(i18n),

    shortTitleRules: shortTitleRules(i18n),
    longTitleRules: longTitleRules(i18n),
    cpfRules: cpfRules(i18n),
    nameRules: getMin3Max20StringRule(i18n, 'name').matches(
      /^((?!instagram\b)(?!linkedin\b)(?!youtube\b).)*/,
    ),
    urlRules: getMin4Max64StringRule(i18n, 'url'),
    scheduleRules,
    createTrailsRules,
    createGroupRules: {
      groupTitle: getMin4Max64StringRule(i18n, 'groupName'),
      leader: yup
        .mixed()
        .required(i18n.t('pages.classes.responsibleIsRequired')),
      members: yup
        .array()
        .required(i18n.t('pages.classes.participant.required'))
        .min(2, i18n.t('pages.classes.participant.required')),
    },

    createCourseRules,
  };

  const allSchemas = {
    registerSchemas: { registerStep1, registerStep2, registerStep3 },
    schema4: yup.object(passwordRules(i18n)),
    emailSchema: yup.object(emailRules(i18n)),
    keywordSchema,
    profileSchema: yup.object({
      phone: getStringRule(i18n, 'phone', {
        matches: {
          regex: phoneRegex,
        },
        required: true,
      }),
      ...fullnameRules(i18n),
      ...cpfRules(i18n),
    }),
    socialsSchema,
    generalTrailSchema,

    generalCourseSchema,
    loginSchema,
  };

  return {
    emailRegex,
    ...allSchemas,
    ...allRules,
  };
};
