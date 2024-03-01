import * as yup from 'yup';

export function isValidCpf(val: string) {
  if (!val) return false;
  val = val.replace(/\D/g, '');
  if (val === '00000000000') return false;

  let sum: number;
  let left: number;
  sum = 0;

  for (let i = 1; i <= 9; i++)
    sum = sum + parseInt(val.substring(i - 1, i)) * (11 - i);
  left = (sum * 10) % 11;

  if (left === 10 || left === 11) left = 0;
  if (left !== parseInt(val.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++)
    sum = sum + parseInt(val.substring(i - 1, i)) * (12 - i);
  left = (sum * 10) % 11;

  if (left === 10 || left === 11) left = 0;
  if (left !== parseInt(val.substring(10, 11))) return false;
  return true;
}

const MIN_LENGTH_SHORT = 3;
const MIN_LENGTH_LONG = 4;
const MAX_LENGTH_SHORT = 20;
const MAX_LENGTH_MEDIUM = 64;
const MAX_LENGTH_LONG = 256;
const MAX_LENGTH_EXTRA_LONG = 4000;

export const useFormRules = () => {
  const i18n = useI18n();
  const locale = i18n.locale.value === 'pt' ? 'pt-BR' : 'en-US';
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const { isSameOrBeforeHour } = useDatetime();
  const emailRegex =
    /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/gi;

  const getStringRule = (
    key: string,
    {
      required,
      length,
      min,
      max,
      matches,
      trim,
    }: {
      required?: boolean;
      length?: number;
      min?: number;
      max?: number;
      matches?: { regex: RegExp; errorMsg?: string };
      trim?: boolean;
    },
  ) => {
    let rule = yup.string();

    if (required) rule = rule.required(i18n.t(`rules.${key}.required`));
    if (length) rule = rule.length(length, i18n.t(`rules.${key}.length`));
    else {
      if (min) rule = rule.min(min, i18n.t(`rules.min`));
      if (max) rule = rule.max(max, i18n.t(`rules.max`));
    }
    if (trim) rule = rule.trim();
    if (matches)
      rule = rule.matches(
        matches.regex,
        i18n.t(matches.errorMsg ? matches.errorMsg : `rules.${key}.invalid`),
      );

    return rule;
  };

  const getMin3Max20StringRule = (name: string) =>
    getStringRule(name, {
      min: MIN_LENGTH_SHORT,
      max: MAX_LENGTH_SHORT,
      required: true,
      trim: true,
    });

  const getMin4Max64StringRule = (name: string) =>
    getStringRule(name, {
      min: MIN_LENGTH_LONG,
      max: MAX_LENGTH_MEDIUM,
      required: true,
      trim: true,
    });

  const getMin4Max256StringRule = (name: string) =>
    getStringRule(name, {
      min: MIN_LENGTH_LONG,
      max: MAX_LENGTH_LONG,
      required: true,
      trim: true,
    });

  const emailRules = {
    email: getStringRule('email', {
      required: true,
      min: 2,
      matches: { regex: emailRegex },
      trim: true,
    }),
  };

  const passwordRules = {
    password: getStringRule('password', {
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
  };

  const fullnameRules = {
    fullname: getMin4Max64StringRule('fullName').matches(
      /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/gm,
      i18n.t('rules.fullName.onlyLetters'),
    ),
  };

  const cpfRules = {
    cpf: getStringRule('cpf', { required: true, length: 14 }).test(
      'test-invalid-cpf',
      i18n.t('rules.cpf.invalid'),
      (cpf) => isValidCpf(cpf!),
    ),
  };

  const keywordRules = yup
    .object({
      text: getStringRule('text', { min: 2, required: true })
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

  const shortTitleRules = {
    title: getMin3Max20StringRule('title'),
  };

  const longTitleRules = {
    title: getMin4Max64StringRule('title'),
  };

  const descriptionRules = {
    description: getStringRule('description', {
      required: true,
      min: MIN_LENGTH_LONG,
      max: MAX_LENGTH_EXTRA_LONG,
      trim: true,
    }),
  };

  const generalCourseSchema = yup.object({
    startDate: startDateUpdateRules,
    endDate: endDateRules,

    slug: getMin3Max20StringRule('slug'),
    ...shortTitleRules,
  });

  const generalTrailSchema = yup.object({
    ...shortTitleRules,
    ...descriptionRules,
  });

  const registerStep1 = yup.object({
    ...fullnameRules,
    ...emailRules,
    ...cpfRules,
  });

  const registerStep2 = yup.object({
    yourRole: getStringRule('yourRole', { required: true }).oneOf([
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
    username: getMin4Max64StringRule('username').matches(
      /^[a-zA-Z0-9_-]*[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+[a-zA-Z0-9_-]*$/,
      i18n.t('rules.username.onlyLetters'),
    ),
    ...passwordRules,
  });
  const loginSchema = {
    ...emailRules,
    password: passwordRules.password,
  };

  const socialsSchema = yup.object({
    name: getMin3Max20StringRule('name'),
    url: getMin4Max64StringRule('url'),
  });

  const createCourseRules = yup.object({
    description: getMin4Max256StringRule('description'),
    class: getMin4Max64StringRule('class'),
    startDate: startDateCreationRules,
    endDate: endDateRules,
    ...longTitleRules,
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

      startHour: getStringRule('meeting.startHour', { required: true }),
      endHour: getStringRule('meeting.endHour', { required: true }).test(
        'endHourTest',
        i18n.t('rules.meeting.endHour.beforeStartHour'),
        (value, ctx) => {
          const { startHour } = ctx.parent;
          return isSameOrBeforeHour(value!, startHour) === 1;
        },
      ),
    });

  const createTrailsRules = yup.object({
    description: getMin4Max256StringRule('description'),
    ...longTitleRules,
  });

  const allRules = {
    passwordRules,
    fullnameRules,
    descriptionRules,
    keywordRules,
    shortTitleRules,
    longTitleRules,
    cpfRules,
    nameRules: getMin3Max20StringRule('name').matches(
      /^((?!instagram\b)(?!linkedin\b)(?!youtube\b).)*/,
    ),
    urlRules: getMin4Max64StringRule('url'),
    scheduleRules,
    createTrailsRules,
    createGroupRules: {
      groupTitle: getMin4Max64StringRule('groupName'),
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
    schema4: yup.object(passwordRules),
    emailSchema: yup.object(emailRules),

    profileSchema: yup.object({
      phone: getStringRule('phone', {
        matches: {
          regex:
            /^\((?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])\) (?:9[0-9])[0-9]{3}\-[0-9]{4}$/,
        },
        required: true,
      }),
      ...fullnameRules,
      ...cpfRules,
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
