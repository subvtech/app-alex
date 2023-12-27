<template>
  <alex-custom-card
    :title="$t('components.profile.settings.title')"
    :full-width="true"
    :showIcon="false"
  >
    <template v-slot:content>
      <div class="settings w-100">
        <div color="black" class="d-flex flex-column">
          <alex-inputs-text-field
            :label="$t('components.profile.settings.fullname')"
            :modelValue="computedFullname"
            name="fullname"
            class=""
          />
          <div class="block d-flex">
            <alex-inputs-text-field
              v-maska:[phoneMask]
              :placeholder="$t('components.profile.settings.phonePlaceholder')"
              :label="$t('components.profile.settings.phone')"
              name="phone"
              :modelValue="computedTelephone"
              class="w-100"
            />

            <alex-inputs-text-field
              v-maska:[cpfMask]
              :placeholder="$t('pages.register.cpfHolder')"
              label="CPF"
              :model-value="computedCpf"
              name="cpf"
              class="w-100"
            />
          </div>
          <div class="buttons d-flex justify-end">
            <alex-custom-button variant="secondary" @click="onCancel">
              {{ $t('components.profile.settings.cancel') }}</alex-custom-button
            >
            <alex-custom-button
              variant="primary"
              type="submit"
              :disabled="theresError"
              @click="onSave"
            >
              {{ $t('components.profile.settings.save') }}
            </alex-custom-button>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:footer> </template>
  </alex-custom-card>
  <div class="d-flex flex-column mt-6">
    <profile-security :email="email" :id="id" /> <profile-wallets :id="id" />
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';

const { profileSchema } = useFormRules();
const client = useStrapiClient();
const messageStore = useMessageStore();
const emit = defineEmits(['update:user']);
const loading = ref(false);

const props = defineProps({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    default: '',
  },
  cpf: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
});

const { fullname, email, telephone, cpf } = toRefs(props);

const computedFullname = ref(fullname.value);
const computedCpf = ref(cpf.value);
const computedTelephone = ref(telephone.value);

const cpfMask = reactive({
  mask: '###.###.###-##',
  eager: true,
});

const phoneMask = {
  mask: '(##) #####-####',
  eager: true,
};

const { handleSubmit, errors, values, controlledValues } = useForm({
  validationSchema: profileSchema,
  keepValuesOnUnmount: true,
});

const onCancel = () => {
  computedTelephone.value = props.telephone;
  computedFullname.value = props.fullname;
  computedCpf.value = props.cpf;
};

const theresError = computed(() => Object.keys(errors.value).length !== 0);

const onSave = handleSubmit(async () => {
  loading.value = true;
  try {
    await client(`/users/${props.id}`, {
      method: 'PUT',
      body: { ...values, phone: values.phone.replace(/[^0-9]/g, '') },
    });

    emit('update:user');
  } catch (error) {
    console.log(error);
    messageStore.setMessage(error as string, 'red', true);
  } finally {
    loading.value = false;
  }
});

watch(fullname, () => {
  computedFullname.value = props.fullname;
});

watch(telephone, () => {
  computedTelephone.value = props.telephone;
});

watch(cpf, () => {
  computedCpf.value = props.cpf;
});
</script>

<style scoped lang="scss">
.settings {
  form {
    gap: 24px;
    .btn {
      text-transform: none !important;
    }
  }
  .block {
    gap: 24px;
  }

  .buttons {
    gap: 8px;
  }
  @media (max-width: 430px) {
    .block {
      flex-direction: column;
    }

    .buttons {
      flex-direction: column-reverse;
    }
  }
}
</style>
