<template>
  <alex-custom-card
    :title="$t('components.profile.settings.title')"
    :full-width="true"
    :showIcon="false"
  >
    <template v-slot:content>
      <div class="settings">
        <v-form
          ref="form"
          color="black"
          class="d-flex flex-column"
          @submit.prevent="updateValues"
        >
          <alex-inputs-text-field
            :label="$t('components.profile.settings.fullname')"
            :value="fullname"
            name="fullname"
            class=""
          />
          <div class="block d-flex flex-wrap">
            <alex-inputs-text-field
              :label="$t('components.profile.settings.phone')"
              :value="telephone"
              name="phone"
              v-maska:[phoneMask]
            />
            <alex-inputs-text-field
              :label="$t('components.profile.settings.cpf')"
              :value="cpf"
              name="cpf"
              v-maska:[cpfMask]
            />
          </div>
          <div class="buttons d-flex justify-end">
            <v-btn
              class="btn"
              color="accent"
              @click="cancel"
              variant="outlined"
            >
              {{ $t('components.profile.settings.cancel') }}</v-btn
            >
            <v-btn class="btn" color="accent" type="submit">
              {{ $t('components.profile.settings.save') }}
            </v-btn>
          </div>
        </v-form>
      </div>
    </template>

    <template v-slot:footer> </template>
  </alex-custom-card>
  <div class="d-flex flex-column">
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

const cancel = () => {
  telephone.value = props.telephone;
  fullname.value = props.fullname;
  cpf.value = props.cpf;
};

const updateValues = handleSubmit(async () => {
  loading.value = true;

  try {
    await client(`/users/${props.id}`, {
      method: 'PUT',
      body: { ...values, phone: values.phone.replace(/[^0-9]/g, '') },
    });

    emit('update:user', {});
  } catch (error) {
    console.log(error);
    messageStore.message = error as string;
    messageStore.color = 'red';
    messageStore.show = true;
  } finally {
    loading.value = false;
  }
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
