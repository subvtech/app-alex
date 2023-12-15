import * as yup from 'yup';

type FormDataType = {
  fullname: string;
  username: string;
  email: string;
  cpf: string;
  password1: string;
  password2: string;
  yourRole: string;
  institution: string;
};

export function isValidCpf(val) {
  val = val.replace(/\D/g, '');
  if (val === '00000000000') return false;

  let sum;
  let left;
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

export const useFormRules = (formData?: FormDataType) => {
  const i18n = useI18n();
  const emailRules = {
    email: yup
      .string()
      .required(i18n.t('rules.email.required'))
      .email(i18n.t('rules.email.invalid')),
  };

  const passwordRules = {
    password: yup.string().required(i18n.t('rules.password.required')),
    //.matches(/^(?=.*[a-z])/, i18n.t('rules.password.lowercase'))
    //.matches(/^(?=.*[A-Z])/, i18n.t('rules.password.upperCase'))
    //.matches(/^(?=.*\d)/, i18n.t('rules.password.number'))
    /*.matches(
        /(?=.*[^a-zA-Z0-9])/,
        i18n.t('rules.password.character'),
      )*/
    //.min(8, i18n.t('rules.password.min'))
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
      .max(64, i18n.t('rules.username.max')),
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
      ),
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
      .min(12, i18n.t('rules.description.min'))
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
      .min(3, i18n.t('rules.name.min'))
      .max(20, i18n.t('rules.name.max'))
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
      .min(3, i18n.t('rules.name.min'))
      .max(20, i18n.t('rules.name.max'))
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
  };
};
