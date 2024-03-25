import * as yup from 'yup';

const emailRegex =
  /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/gi;
const phoneRegex =
  /^\((?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])\) (?:9[0-9])[0-9]{3}\-[0-9]{4}$/;
const usernameRegex =
  /^[a-zA-Z0-9_-]*[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+[a-zA-Z0-9_-]*$/;

export const useFormRules = () => {
  /*
    This composable is a cluster of yup rules, 
    it's being used throughout the entire application to validate forms

  */
  const i18n = useI18n();
  const {
    fullnameRules,
    getMin3Max20StringRule,
    getMin4Max64StringRule,
    getStringRule,
    longDescriptionRules,
    longTitleRules,
    cpfRules,
    shortDescriptionRules,
  } = useBasicRules();

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

  const goalRules = {
    verb: yup.lazy((value) =>
      typeof value === 'string'
        ? yup
            .string()
            .min(2, ({ min }) => i18n.t('rules.keyword.min', { min }))
            .matches(/^[^\s]*$/, i18n.t('rules.keyword.noSpaces'))
            .matches(/^[a-zA-Z]*$/, i18n.t('rules.keyword.onlyLetters'))
            .required(i18n.t('rules.keyword.required'))
        : yup.object().required(i18n.t('rules.keyword.required')),
    ),
    ...longDescriptionRules,
  };

  const passwordRules = {
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
  };

  const emailRules = {
    email: getStringRule(i18n, 'email', {
      required: true,
      min: 2,
      matches: { regex: emailRegex },
      trim: true,
    }),
  };

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
    slug: getMin3Max20StringRule('slug'),
    ...longTitleRules,
  });

  const generalTrailSchema = yup.object({
    ...longTitleRules,
    ...longDescriptionRules,
  });

  const registerStep1 = yup.object({
    ...fullnameRules,
    ...emailRules,
    ...cpfRules,
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
    username: getMin4Max64StringRule('username').matches(
      usernameRegex,
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
    class: getMin4Max64StringRule('class'),
    startDate: startDateCreationRules,
    endDate: endDateRules,
    ...shortDescriptionRules,
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
    ...shortDescriptionRules,
    ...longTitleRules,
  });

  const allRules = {
    passwordRules: passwordRules,

    cpfRules: cpfRules,
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
    goalRules: goalRules,
    createCourseRules,
  };

  const allSchemas = {
    registerSchemas: { registerStep1, registerStep2, registerStep3 },
    schema4: yup.object(passwordRules),
    emailSchema: yup.object(emailRules),
    keywordSchema,
    profileSchema: yup.object({
      phone: getStringRule(i18n, 'phone', {
        matches: {
          regex: phoneRegex,
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
