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
    password: yup
      .string()
      .required(i18n.t('rules.password.required'))
      .matches(/^\w*[A-Z]\w*[A-Z]\w*$/gm, i18n.t('rules.password.upperCase'))
      .matches(/^(?=.*\d).{1,}$/gm, i18n.t('rules.password.number'))
      .matches(/^(?=.*[a-z]).{1,}$/gm, i18n.t('rules.password.upperCase'))
      .min(8, i18n.t('rules.password.min')),
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

  const aboutRules = {
    info: yup
      .string()
      .min(12, i18n.t('rules.about.min'))
      .max(4000, i18n.t('rules.about.max'))
      .required(i18n.t('rules.about.required')),
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
    ...aboutRules,
    ...cpfRules,
  });
  return {
    registerSchemas: { registerStep1, registerStep2, registerStep3 },
    schema4: yup.object(passwordRules),
    emailRules: yup.object(emailRules),
    passwordRules,
    fullnameRules,
    cpfRules,
    profileSchema,
    loginSchema,
  };
};
