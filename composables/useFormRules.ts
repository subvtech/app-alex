import * as yup from 'yup';

export function isValidCpf(val: string) {
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

export const useFormRules = () => {
  const i18n = useI18n();
  const locale = i18n.locale.value === 'pt' ? 'pt-BR' : 'en-US';
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const { isSameOrBeforeHour } = useDatetime();
  const emailRegex =
    /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/gi;
  const emailRules = {
    email: yup
      .string()
      .required(i18n.t('rules.email.required'))
      .trim()
      .matches(emailRegex, i18n.t('rules.email.invalid')),
  };

  const passwordRules = {
    password: yup.string().required(i18n.t('rules.password.required')),
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

  const usernameRules = {
    username: yup
      .string()
      .required(i18n.t('rules.username.required'))
      .min(6, i18n.t('rules.username.min'))
      .max(64, i18n.t('rules.username.max'))
      .matches(
        /^[a-zA-Z0-9_-]*[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+[a-zA-Z0-9_-]*$/,
        i18n.t('rules.username.onlyLetters'),
      )
      .trim(),
  };

  const fullnameRules = {
    fullname: yup
      .string()
      .required(i18n.t('rules.fullName.required'))
      .min(6, i18n.t('rules.fullName.min'))
      .max(64, i18n.t('rules.fullName.max'))
      .matches(
        /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/gm,
        i18n.t('rules.fullName.onlyLetters'),
      )
      .trim(),
  };

  const cpfRules = {
    cpf: yup
      .string()
      .required(i18n.t('rules.cpf.required'))
      .length(14, i18n.t('rules.cpf.length'))
      .test('test-invalid-cpf', i18n.t('rules.cpf.invalid'), (cpf) =>
        isValidCpf(cpf),
      ),
  };
  const goalRules = {
    keyword: yup
      .string()
      .min(2, ({ min }) => i18n.t('rules.keyword.min', { min }))
      .matches(/^[^\s]*$/, i18n.t('rules.keyword.noSpaces'))
      .matches(/^[a-zA-Z]*$/, i18n.t('rules.keyword.onlyLetters'))
      .required(i18n.t('rules.keyword.required')),
    description: yup
      .string()
      .required(i18n.t('rules.description.required'))
      .min(6, ({ min }) => i18n.t('rules.description.min', { min }))
      .max(4000, ({ max }) => i18n.t('rules.description.max', { max }))
      .trim(),
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
    .typeError('A data precisa ser válida');

  const descriptionRules = {
    description: yup
      .string()
      .required(i18n.t('rules.description.required'))
      .min(6, ({ min }) => i18n.t('rules.description.min', { min }))
      .max(4000, ({ max }) => i18n.t('rules.description.max', { max }))
      .trim(),
  };

  const phoneRules = {
    phone: yup
      .string()
      .matches(
        // eslint-disable-next-line no-useless-escape
        /^\((?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])\) (?:9[0-9])[0-9]{3}\-[0-9]{4}$/,
        i18n.t('rules.phone.invalid'),
      )
      .required(i18n.t('rules.phone.required')),
  };

  const generalCourseSchema = yup.object({
    startDate: startDateUpdateRules,
    endDate: endDateRules,
    title: yup
      .string()
      .min(3, ({ min }) => i18n.t('rules.title.min', { min }))
      .max(20, ({ max }) => i18n.t('rules.title.max', { max }))
      .required(i18n.t('rules.title.required'))
      .trim(),
    slug: yup
      .string()
      .min(3, ({ min }) => i18n.t('rules.slug.min', { min }))
      .max(20, ({ max }) => i18n.t('rules.slug.max', { max }))
      .required(i18n.t('rules.slug.required'))
      .trim(),
  });

  const generalTrailSchema = yup.object({
    title: yup
      .string()
      .min(3, ({ min }) => i18n.t('rules.title.min', { min }))
      .max(20, ({ max }) => i18n.t('rules.title.max', { max }))
      .required(i18n.t('rules.title.required'))
      .trim(),
    ...descriptionRules,
  });

  const registerStep1 = yup.object({
    ...fullnameRules,
    ...emailRules,
    ...cpfRules,
  });

  const registerStep2 = yup.object({
    yourRole: yup
      .string()
      .required(i18n.t('rules.yourRole.required'))
      .oneOf(['professor', 'aluno'] as const),
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
    ...passwordRules,
    ...usernameRules,
  });
  const loginSchema = {
    ...emailRules,
    password: passwordRules.password,
  };

  const profileSchema = yup.object({
    ...fullnameRules,
    ...phoneRules,
    ...cpfRules,
  });
  const urlRegex =
  /^(?=.{4,2048}$)((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]{1,63}(\.[a-zA-Z]{1,63}){1,5}(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/;
  const urlRules = yup
    .string()
    .matches(urlRegex, i18n.t('rules.url.valid'))
    .min(4, i18n.t('rules.url.min'))
    .max(64, i18n.t('rules.url.max'))

    .required(i18n.t('rules.url.required'))
    .trim();
  const socialsSchema = yup.object({
    name: yup
      .string()
      .min(3, i18n.t('rules.name.min', { min: 3 }))
      .max(20, i18n.t('rules.name.max', { min: 20 }))
      .required()
      .trim(),

    url: urlRules,
  });

  const createCourseRules = yup.object({
    title: yup
      .string()
      .required(i18n.t('rules.title.required'))
      .min(4, ({ min }) => i18n.t('rules.title.min', { min }))
      .max(64, ({ max }) => i18n.t('rules.title.max', { max }))
      .trim(),
    description: yup
      .string()
      .required(i18n.t('rules.description.required'))
      .min(4, ({ min }) => i18n.t('rules.description.min', { min }))
      .max(256, ({ max }) => i18n.t('rules.description.max', { max }))
      .trim(),
    class: yup
      .string()
      .required(i18n.t('rules.class.required'))
      .min(4, ({ min }) => i18n.t('rules.class.min', { min }))
      .max(64, ({ max }) => i18n.t('rules.class.max', { max }))
      .trim(),
    startDate: startDateCreationRules,
    endDate: endDateRules,
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

      startHour: yup
        .string()
        .required(i18n.t('rules.meeting.startHour.required')),
      endHour: yup
        .string()
        .required(i18n.t('rules.meeting.endHour.required'))
        .test(
          'endHourTest',
          i18n.t('rules.meeting.endHour.beforeStartHour'),
          (value, ctx) => {
            const { startHour } = ctx.parent;
            return isSameOrBeforeHour(value, startHour) === 1;
          },
        ),
    });

  const createTrailsRules = yup.object({
    title: yup
      .string()
      .required(i18n.t('rules.title.required'))
      .min(4, ({ min }) => i18n.t('rules.title.min', { min }))
      .max(64, ({ max }) => i18n.t('rules.title.max', { max }))
      .trim(),
    description: yup
      .string()
      .required(i18n.t('rules.description.required'))
      .min(4, ({ min }) => i18n.t('rules.description.min', { min }))
      .max(256, ({ max }) => i18n.t('rules.description.max', { max }))
      .trim(),
  });

  const createGroupRules = {
    groupTitle: yup
      .string()
      .min(4, i18n.t('rules.url.min'))
      .max(64, i18n.t('rules.url.max'))
      .required(i18n.t('pages.classes.groupNameIsRequired'))
      .trim(),
    leader: yup.mixed().required(i18n.t('pages.classes.responsibleIsRequired')),
    members: yup
      .array()
      .required(i18n.t('pages.classes.participantsIsRequired'))
      .min(2, i18n.t('pages.classes.participantsIsRequired')),
  };

  return {
    registerSchemas: { registerStep1, registerStep2, registerStep3 },
    schema4: yup.object(passwordRules),
    emailRules: yup.object(emailRules),
    passwordRules,
    fullnameRules,
    descriptionRules,
    cpfRules,
    profileSchema,
    socialsSchema,
    goalRules,
    nameRules: yup
      .string()
      .min(3, ({ min }) => i18n.t('rules.name.min', { min }))
      .max(20, ({ max }) => i18n.t('rules.name.max', { max }))
      .matches(/^((?!instagram\b)(?!linkedin\b)(?!youtube\b).)*/)
      .required(i18n.t('rules.name.required'))
      .trim(),
    titleRules: yup
      .string()
      .min(3, ({ min }) => i18n.t('rules.title.min', { min }))
      .max(20, ({ max }) => i18n.t('rules.title.max', { max }))
      .required(i18n.t('rules.title.required'))
      .trim(),
    urlRules: urlRules,
    generalCourseSchema,
    loginSchema,
    createCourseRules,
    generalTrailSchema,
    emailRegex,
    scheduleRules,
    createTrailsRules,
    createGroupRules,
  };
};
