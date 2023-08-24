import * as yup from 'yup';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();
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
  const emailRules = {
    email: yup.string().required('Email é necessário').email('Email inválido'),
  };

  const passwordRules = {
    password: yup
      .string()
      .required('Senha é necessário')
      .matches(
        /^(?=.*[A-Z]).{2,}$/gm,
        'Pelo menos 2 letras maiúsculas necessárias',
      )
      .matches(/^(?=.*\d).{1,}$/gm, 'Pelo menos 1 número necessário')
      .matches(
        /^(?=.*[a-z]).{1,}$/gm,
        'Pelo menos 1 letra minúscula necessário',
      )
      .min(8, 'Mínimo de 8 caracteres'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'As senhas não são idênticas')
      .required('Confirmar Senha é necessário'),
  };
  const schema1 = yup.object({
    fullname: yup
      .string()
      .required('Nome completo é necessário')
      .min(6, 'Mínimo de 6 caracteres')
      .max(64, 'Máximo de 64 caracteres'),
    ...emailRules,
    cpf: yup
      .string()
      .required('CPF é necessário')
      .length(14, 'CPF contém 11 caracteres')
      .test('test-invalid-cpf', 'CPF Inválido', (cpf) => isValidCpf(cpf)),
  });
  const schema2 = yup.object({
    yourRole: yup
      .string()
      .required('Tipo de Usuário é necessário')
      .oneOf(['professor', 'aluno'] as const),
    institution: yup
      .number()
      .optional()
      .nullable()
      .when('yourRole', {
        is: 'professor',
        then: (scheme) => scheme.required('Tipo de instituição é necessário'),
      }),
  });
  const schema3 = yup.object({
    ...passwordRules,
    username: yup
      .string()
      .required('Nome de usuário é necessário')
      .min(6, 'Mínimo de 6 caracteres')
      .max(64, 'Máximo de 64 caracteres'),
  });

  const loginSchema = {
    ...emailRules,
    password: passwordRules.password
  };
  return {
    schema1,
    schema2,
    schema3,
    schema4: yup.object(passwordRules),
    emailRules: yup.object(emailRules),
    loginSchema,
  };
};
