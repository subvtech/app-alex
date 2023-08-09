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
  for (i = 1; i <= 10; i++)
    sum = sum + parseInt(val.substring(i - 1, i)) * (12 - i);
  left = (sum * 10) % 11;

  if (left === 10 || left === 11) left = 0;
  if (left !== parseInt(val.substring(10, 11))) return false;
  return true;
}

export default {
  data() {
    const rules = {
      cpf: { validator: this.validateCPF },
      email: { type: 'email', message: 'Email inválido!' },
      required: { required: true, message: 'Campo obrigatório!' },
      password1: { validator: this.validateToNextPassword },
      password2: { validator: this.compareToFirstPassword },
    };

    return {
      confirmDirty: false,
      validate: {
        cpf: { rules: [rules.required, rules.cpf], normalize: this.formatCPF },
        email: { rules: [rules.required, rules.email] },
        username: { rules: [rules.required], normalize: this.formatUsername },
        password1: { rules: [rules.required, rules.password1] },
        password2: { rules: [rules.required, rules.password2] },
        required: { rules: [rules.required] },
      },
    };
  },
  beforeCreate() {
    // this.form = this.$form.createForm(this);
  },
  methods: {
    handleSubmit() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (err) return;
        this.submit(values);
      });
    },
    handleConfirmBlur(e) {
      this.confirmDirty = this.confirmDirty || !!e.target.value;
    },
    formatUsername(value = '') {
      return value.replace(/[^\w.-]/g, '');
    },
    formatCPF(value) {
      const val = this.parseCPF(value);

      if (val.length <= 3) {
        return val;
      }

      if (val.length <= 6) {
        return val.replace(/(\d{3})(.*)/g, '$1.$2');
      }

      if (val.length <= 9) {
        return val.replace(/(\d{3})(\d{3})(.*)/g, '$1.$2.$3');
      }

      return val.replace(/(\d{3})(\d{3})(\d{3})(.*)/g, '$1.$2.$3-$4');
    },
    parseCPF(value = '') {
      return value
        .trim()
        .replace(/[^\d]/g, '')
        .replace(/^(\d{11}).*/, '$1');
    },
    validateCPF(_rule, value, callback) {
      const val = this.parseCPF(value);

      if (val && !isValidCpf(val)) {
        callback('CPF inválido!'); // eslint-disable-line
      }

      callback();
    },
    validateToNextPassword(_rule, value, callback) {
      if (value && this.confirmDirty) {
        this.form.validateFields(['password2'], { force: true });
      }

      callback();
    },
    compareToFirstPassword(_rule, value, callback) {
      if (value && value !== this.form.getFieldValue('password1')) {
        callback('As senhas não conferem!'); // eslint-disable-line
      } else {
        callback();
      }
    },
  },
};
