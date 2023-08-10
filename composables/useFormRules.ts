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

export const useFormRules = (formData?: FormDataType) => {
  const fullnameRules = [(v) => !!v || 'Nome completo é necessário'];
  const usernameRules = [(v) => !!v || 'Usuário é necessário'];

  const emailRules = [
    (v) => !!v || 'Email é necessário',
    (v) => /.+@.+\..+/.test(v) || 'Adicione um e-mail valido',
  ];

  const passwordRules = [(v) => !!v || 'Senha é necessário'];

  const confirmPasswordRules = computed(() => {
    return [
      (v: any) => !!v || 'Senha é necessária',
      (v: any) => v === formData.password1 || 'Senha diferentes',
    ];
  });

  const cpfRules = [
    (v: any) => !!v || 'CPF é necessário',
    (v: string | any[]) => v.length === 11 || 'CPF contem 11 caracteres',
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
