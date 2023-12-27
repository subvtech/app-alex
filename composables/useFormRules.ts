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
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
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

  const keywordRules = yup
    .object({
      text: yup
        .string()
        .matches(/^[^\s]*$/, i18n.t('rules.keyword.noSpaces'))
        .matches(/^[a-zA-Z]*$/, i18n.t('rules.keyword.onlyLetters'))
        .required(i18n.t('rules.keyword.required')),
    })
    .required(i18n.t('rules.keyword.required'));

  const descriptionRules = {
    description: yup
      .string()
      .required(i18n.t('rules.description.required'))
      .min(6, i18n.t('rules.description.min'))
      .max(4000, i18n.t('rules.description.max'))
      .trim(),
  };

  const phoneRules = {
    phone: yup
      .string()
      .matches(
        /^\((?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])\) (?:9[0-9])[0-9]{3}\-[0-9]{4}$/,
        i18n.t('rules.phone.invalid'),
      )
      .required(i18n.t('rules.phone.required')),
  };

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

  const socialsSchema = yup.object({
    name: yup
      .string()
      .min(3, i18n.t('rules.name.min', { min: 3 }))
      .max(20, i18n.t('rules.name.max', { min: 20 }))
      .required()
      .trim(),

    url: yup
      .string()
      .min(4, i18n.t('rules.url.min'))
      .max(64, i18n.t('rules.url.max'))
      .required()
      .trim(),
  });

  const urlSchema = yup.object({
    url: yup
      .string()
      .min(4, i18n.t('rules.url.min'))
      .max(64, i18n.t('rules.url.max'))
      .required()
      .trim(),
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
    startDate: yup
      .date()
      .required(i18n.t('rules.startDate.required'))
      .min(currentDate.toISOString(), ({ min }) =>
        i18n.t('rules.startDate.min', { min: min.toString().split('T')[0] }),
      ),
    endDate: yup
      .date()
      .required(i18n.t('rules.endDate.required'))
      .min(yup.ref('startDate'), i18n.t('rules.endDate.beforeStartDate')),
  });

  const scheduleRules = yup.object({
    meetingDate: yup
      .date()
      .required(i18n.t('rules.meeting.date.required'))
      .min(currentDate.toISOString(), ({ min }) =>
        i18n.t('rules.startDate.min', { min: min.toString().split('T')[0] }),
      ),
    startHour: yup
      .string()
      .required(i18n.t('rules.meeting.startHour.required')),
    endHour: yup.string().required(i18n.t('rules.meeting.endHour.required')),
  });

  return {
    registerSchemas: { registerStep1, registerStep2, registerStep3 },
    schema4: yup.object(passwordRules),
    emailRules: yup.object(emailRules),
    passwordRules,
    fullnameRules,
    descriptionRules,
    keywordRules,
    cpfRules,
    profileSchema,
    socialsSchema,
    nameRules: yup
      .string()
      .min(3, ({ min }) => i18n.t('rules.name.min', { min }))
      .max(20, ({ max }) => i18n.t('rules.name.max', { max }))
      .matches(/^((?!instagram\b)(?!linkedin\b)(?!youtube\b).)*/)
      .required(i18n.t('rules.name.required'))
      .trim(),
    urlRules: yup
      .string()
      .min(4, i18n.t('rules.url.min'))
      .max(64, i18n.t('rules.url.max'))
      .required()
      .trim(),
    loginSchema,
    createCourseRules,
    emailRegex,
    scheduleRules,
  };
};
