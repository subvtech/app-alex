<template>
  <profile-card
    :title="$t('components.profile.settings.title')"
    :full-width="true"
  >
    <template v-slot:content>
      <div>
        <v-form
          ref="form"
          color="black"
          class="d-flex flex-column"
          @submit.prevent="updateValues"
        >
          <alex-inputs-stepper-field
            :label="$t('components.profile.settings.fullname')"
            :value="fullname"
            name="fullname"
            class=""
          />
          <div class="block d-flex flex-wrap">
            <alex-inputs-stepper-field
              :label="$t('components.profile.settings.phone')"
              :value="telephone"
              name="phone"
              v-maska:[phoneMask]
            />
            <alex-inputs-stepper-field
              :label="$t('components.profile.settings.cpf')"
              :value="cpf"
              name="cpf"
              v-maska:[cpfMask]
            />
          </div>
          <alex-inputs-stepper-field
            :label="$t('components.profile.settings.about')"
            :value="info"
            name="info"
            typeField="textarea"
            class=""
            color="black"
            variant="outlined"
          />
          <div class="d-flex justify-end">
            <v-btn
              class="btn"
              color="accent"
              @click="cancel"
              variant="outlined"
            >
              {{ $t('components.profile.settings.cancel') }}</v-btn
            >
            <v-btn class="btn ml-2" color="accent" type="submit">
              {{ $t('components.profile.settings.save') }}
            </v-btn>
          </div>
        </v-form>
      </div>
    </template>

    <template v-slot:footer> </template>
  </profile-card>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';

const { update } = useStrapi();
const { profileSchema } = useFormRules();
const messageStore = useMessageStore();
const emit = defineEmits(['update:user'])

const loading = ref(false);

const props = defineProps({
  fullname: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    default: '',
  },
  info: {
    type: String,
    required: true,
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

const { fullname, telephone, cpf, info } = toRefs(props);

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
  info.value = props.info;
};

const updateValues = handleSubmit(async () => {
  loading.value = true;

  const data = { ...values, phone: values.phone.replace(/[^0-9]/g, '') };
  try {
    const url = useStrapiUrl() + '/users/' + props.id;
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data }),
    };

    await fetch(url, options);

    emit('update:user', {})
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
form {
  gap: 24px;
  .btn {
    text-transform: none !important;
  }
}
.block {
  gap: 24px;
}
@media (max-width: 600px) {
  .block {
    flex-direction: column;
  }
}
</style>
