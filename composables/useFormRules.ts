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
  const fullnameRules = [(v) => !!v || 'Nome completo é necessário'];
  const usernameRules = [(v) => !!v || 'Usuário é necessário'];

  const emailRules = [
    (v) => !!v || 'Email é necessário',
    (v) => /.+@.+\..+/.test(v) || 'Adicione um e-mail valido',
  ];

  const passwordRules = [(v) => !!v || 'Senha é necessário'];

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
  return {
    emailRules,
    fullnameRules,
    usernameRules,
    passwordRules,
    confirmPasswordRules,
    cpfRules,
  };
};
