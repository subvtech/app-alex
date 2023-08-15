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

function isValidCpf(val) {
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
  const fullnameRules = [(v: string) => !!v || 'Nome completo é necessário'];
  const usernameRules = [(v: string) => !!v || 'Usuário é necessário'];
  const userType = [(v: string) => !!v || 'O tipo de usuário é necessário'];
  const emailRules = [
    (v: string) => !!v || 'Email é necessário',
    (v: string) => /.+@.+\..+/.test(v) || 'Adicione um e-mail valido',
  ];

  const passwordRules = [
    (v: string) => !!v || 'Senha é necessário',
    (v: string) =>
      /^(.*[a-z]?)([A-Z])(.*[a-z]?)([A-Z])(.*[a-z]?)$/.test(v) ||
      '2 caracteres maiúscula necessárias',
    (v: string) => /^.*[0-9]$/.test(v) || 'Pelo menos 1 número necessário',
    (v: string) => /^.*[a-z]$/.test(v) || 'Pelo menos 1 caractére minúsculo',
  ];

  const confirmPasswordRules = computed(() => {
    const temp: ((v: any) => boolean | string)[] = [
      (v: any) => !!v || 'Senha é necessária',
    ];
    if (formData)
      temp.push((v: any) => v === formData.password1 || 'Senhas diferentes');
    return temp;
  });

  const cpfRules = [
    (v: any) => !!v || 'CPF é necessário',
    (v: string | any[]) => v.length === 11 || 'CPF contem 11 caracteres',
    (v: any) => isValidCpf(v) || 'CPF inválido',
  ];

  const institutionRules = [
    (v: string) => !!v || 'Instituição é necessário'
  ]
  return {
    emailRules,
    fullnameRules,
    usernameRules,
    passwordRules,
    confirmPasswordRules,
    cpfRules,
    userType,
    institutionRules,
  };
};
