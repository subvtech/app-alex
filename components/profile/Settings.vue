<template>
  <profile-card title="Informações pessoais" :full-width="true">
    <template v-slot:content>
      <div>
        <v-form
          ref="form"
          color="black"
          class="d-flex flex-column"
          @submit.prevent="updateValues"
        >
          <alex-inputs-stepper-field
            label="Nome completo"
            name="fullname"
            class=""
          />
          <div class="d-flex">
            <alex-inputs-stepper-field
              label="Telefone"
              name="phone"
              class="mr-6"
            />

            <alex-inputs-stepper-field label="CPF" name="cpf" />
          </div>
          <alex-inputs-stepper-field
            label="Sobre"
            name="about"
            typeField="textarea"
            class=""
            color="black"
            variant="outlined"
          />
          <div class="d-flex justify-end">
            <v-btn class="btn" color="accent" variant="outlined">
              Cancelar</v-btn
            >
            <v-btn class="btn ml-2" color="accent"> Salvar perfil </v-btn>
           
          </div>
        </v-form>
      </div>
    </template>

    <template v-slot:footer> </template>
  </profile-card>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';

const { profileSchema } = useFormRules();
const loading = ref(false);
const messageStore = useMessageStore();

const { handleSubmit, errors, values, controlledValues } = useForm({
  validationSchema: profileSchema,
  keepValuesOnUnmount: true,
});

const isValid = computed(
  () =>
    !Object.values(controlledValues.value).includes(undefined) &&
    !Object.values(errors.value).length,
);

const updateValues = handleSubmit(async () => {
  loading.value = true;
  try {
    /*
    await resetPassword({
      code: route.query.code as string,
      password: values.password,
      passwordConfirmation: values.confirmPassword,
    });
    emit('confirmation-message');*/
  } catch (error) {
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

.contacts {
  gap: 16px;
  border-bottom: 1px solid #eaeef1;
  flex-direction: column;
  .contact {
    gap: 16px;
    .icon {
      width: 24px;
      height: 24px;
      path {
        fill: #5d6872;
      }
    }
    .field {
      gap: 4px;
      p {
        color: #abb2b9;
        font-size: 14px;
        font-weight: 400;
      }

      span {
        color: #5d6872;
        font-size: 16px;
        font-weight: 400;
        line-height: 22px;
      }
    }
  }
}
@media (max-width: 800px) {
  .contacts {
    flex-wrap: wrap;
    flex-direction: row;
    .contact {
      max-width: 130px;
    }
  }
}
</style>
