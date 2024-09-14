<template>
  <div class="tw-flex">
    <alex-custom-button :variant="'text'" @click="openModalForCreation">
      <v-icon>mdi-plus</v-icon>
    </alex-custom-button>
    <v-dialog v-model="openModal" width="50%" persistent>
      <v-form ref="createForm" v-model="formValid" @submit.prevent="submit">
        <v-card width="100%" class="pa-3">
          <v-card-title class="d-flex justify-space-between align-center font-weight-700">
            {{ $t('pages.admin.title2') }}
            <alex-custom-button variant="text" icon="mdi-plus" size="default" @click="closeForm()">
              <v-icon>mdi-close</v-icon>
            </alex-custom-button>
          </v-card-title>
          <alex-inputs-stepper
            :steps-config="{
              step1: {
                title: $t('pages.admin.company'),
                subtitle: $t('pages.admin.informations'),
              },
              step2: {
                title: $t('pages.admin.representative'),
                subtitle: $t('pages.admin.informations'),
                validate: [
                  {
                    name: 'empresa',
                    callback: async () => {
                      try {
                        await schemaStep1.validate(formData, {
                          abortEarly: false,
                        });
                      } catch (error) {
                        console.log(error);
                      }
                    },
                  },
                ],
                scheme: schemaStep1,
              },
            }"
            @submit="submit"
          >
            <template #controls="{ isFirstStep, onPrevStep, isValid, loading, isLastStep, onNextStep }">
              <div class="d-flex justify-end gap 4">
                <alex-custom-button text="Cancelar" @click="closeForm()" variant="secondary" class="mr-3" />
                <alex-custom-button v-if="!isFirstStep" class="mr-3" text="Voltar" @click="onPrevStep" />
                <alex-custom-button
                  v-if="!isLastStep"
                  class="mr-3"
                  text="Próximo"
                  :disabled="!isValid"
                  @click="onNextStep"
                />
                <alex-custom-button
                  v-if="isLastStep"
                  type="submit"
                  :text="formData.id ? 'Atualizar' : 'Adicionar'"
                  :disabled="isValid"
                  :loading="loading"
                />
              </div>
            </template>
            <template #step1>
              <v-row justify="start" class="pa-5" dense>
                <v-col cols="12" class="d-flex">
                  <v-col cols="4" class="d-flex flex-column justify-center align-center">
                    <app-user-avatar
                      :user-id="-1"
                      can-edit
                      can-delete
                      :size="180"
                      :placeholder="formData.socialName"
                      avatar-style="border-radius:10px;"
                      :profile-picture="
                        formData.cover && formData.cover.data
                          ? {
                              url: formData.cover.data.attributes.url,
                              id: formData.cover.data.id,
                            }
                          : null
                      "
                    />
                  </v-col>
                  <v-col cols="8" class="d-flex flex-column">
                    <alex-inputs-text-field
                      v-model="formData.cnpj"
                      :label="$t('pages.admin.cnpj')"
                      :placeholder="'Ex: 00.394.460/00058-87'"
                      :rules="rules.cnpj"
                      minlength="14"
                      maxlength="18"
                      name="cnpj"
                      required
                      @change="formatCNPJ"
                      :disabled="!!formData.id"
                    />

                    <alex-inputs-text-field
                      v-model="formData.name"
                      :label="$t('pages.admin.nameFantasy.label')"
                      :placeholder="'Instituto Federal de Alagoas'"
                      name="nameFantasy"
                      :rules="rules.nameFantasy"
                      required
                      :disabled="!!formData.id"
                    />
                  </v-col>
                </v-col>
                <v-col cols="12">
                  <alex-inputs-text-field
                    v-model="formData.socialName"
                    name="razaoSocial"
                    :label="$t('pages.admin.companynameField.label')"
                    :placeholder="'Ex: Instituto Federal de Alagoas'"
                    :rules="rules.socialName"
                    :disabled="!!formData.id"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <alex-inputs-text-field
                    v-model="formData.email"
                    name="email"
                    :label="$t('pages.admin.email')"
                    :placeholder="'Ex: ifal@ifal.edu.br'"
                    :rules="rules.email"
                    :disabled="!!formData.id"
                    required
                  />
                </v-col>
                <v-col cols="6">
                  <alex-inputs-text-field
                    v-model="formData.sector"
                    name="setor"
                    :label="$t('pages.admin.sector')"
                    :placeholder="'Ex: Educação'"
                    :rules="rules.sector"
                    :disabled="!!formData.id"
                    required
                  />
                </v-col>
                <v-col cols="6">
                  <alex-inputs-text-field
                    v-model="formData.phone"
                    :label="$t('pages.admin.phone')"
                    :placeholder="'Ex: 3355-7722'"
                    :disabled="!!formData.id"
                    name="telefone"
                    minlength="10"
                    maxlength="11"
                  />
                </v-col>
                <v-col cols="12">
                  <alex-inputs-text-field
                    v-model="formData.address"
                    :label="$t('pages.admin.address')"
                    :placeholder="'Ex: R. Mizael Domingues, 530 - Centro, Maceió - AL, 57020-600'"
                    :disabled="!!formData.id"
                    name="endereço"
                  />
                </v-col>
              </v-row>
            </template>
            <template #step2>
              <v-row justify="start" class="pa-5" dense>
                <v-col cols="12" class="d-flex justify-center align-center">
                  <div class="rounded-circle w-130 h-130 d-flex justify-center align-center upload-container">
                    <app-user-avatar
                      :user-id="formData.id"
                      can-edit
                      can-delete
                      :size="180"
                      avatar-style="border-radius: 10%"
                      :profile-picture="
                        formData.cover && formData.cover.data
                          ? {
                              url: formData.cover.data.attributes.url,
                              id: formData.cover.data.id,
                            }
                          : null
                      "
                    />
                  </div>
                </v-col>
                <v-col cols="12">
                  <alex-inputs-select
                    v-model="formData.users"
                    :items="
                      users.map((user) => ({
                        value: user.id,
                        title: user.fullname,
                      }))
                    "
                    :label="$t('pages.admin.usersField.label')"
                    :placeholder="$t('pages.admin.usersField.placeholder')"
                    name="users"
                    :rules="rules.users"
                    required
                  />
                </v-col>
              </v-row>
            </template>
          </alex-inputs-stepper>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { Strapi4ResponseData } from '@nuxtjs/strapi/dist/runtime/types';
import * as yup from 'yup';
import { CreationForm } from '~/pages/admin/institutions/index.vue';
import { CompletedInstitution } from '~/pages/projects/[id]/overview.vue';
const { find, create, update } = useStrapi();
const route = useRoute();
const learningPlanId = computed(() => parseInt(route.params?.id.toString()));
const users = ref<User[]>([]);
const openModal = ref(false);
const formValid = ref(false);
const saving = ref(false);

interface InstitutionsProps {
  institutions: Strapi4ResponseData<CompletedInstitution>[];
}

const props = defineProps<InstitutionsProps>();

const schemaStep1 = yup.object().shape({
  cnpj: yup.string().required('CNPJ é obrigatório'),
  nomeFantasia: yup.string().required('Nome Fantasia é obrigatório'),
  razaoSocial: yup.string().required('Razão Social é obrigatória'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  setor: yup.string().required('Setor é obrigatório'),
  users: yup.number().required('Representante é obrigatório'),
});

const rules = {
  socialName: [(v: string) => !!v || 'Name is required'],
  nameFantasy: [(v: string) => !!v || 'Name is required'],
  email: [(v: string) => !!v || 'Email is required'],
  cnpj: [(v: string) => !!v || 'CNPJ is required'],
  sector: [(v: string) => !!v || 'Sector is required'],
  users: [(v: string) => !!v || 'Users is required'],
};

const getInitForm = () => ({
  id: null,
  cnpj: '',
  users: [],
  name: '',
  socialName: '',
  email: '',
  address: '',
  sector: '',
  cover: null,
  phone: '',
});

const formData = ref<CreationForm>(getInitForm());

const fetchUsers = async () => {
  try {
    const response = await find('users');
    if (!response) {
      throw new Error('Error fetching users');
    }
    users.value = response as unknown as User[];
    console.log('Fetched Users:', users.value);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

function formatCNPJ() {
  let cnpjValue = formData.value.cnpj.replace(/\D/g, '');
  if (cnpjValue.length === 14) {
    cnpjValue = cnpjValue.padStart(14, '0');
    cnpjValue = cnpjValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    formData.value.cnpj = cnpjValue;
    fetchCNPJ(cnpjValue);
  }
}
const fetchCNPJ = (cnpjValue: string) => {
  fetch(`https://api-publica.speedio.com.br/buscarcnpj?cnpj=${cnpjValue}`)
    .then((body) => body.json())
    .then((data) => {
      if (data) {
        formData.value.name = data['NOME FANTASIA'] || data.nomeFantasia;
        formData.value.socialName = data['RAZAO SOCIAL'] || data.razaoSocial;
        formData.value.phone = `${data.DDD} ${data.TELEFONE}` || data.phone;
        formData.value.email = data.EMAIL || data.email;
        formData.value.address =
          `${data['TIPO LOGRADOURO']} ${data.LOGRADOURO}, ${data.BAIRRO}, ${data.MUNICIPIO} - ${data.UF}, ${data.CEP}` ||
          data.address;
        formData.value.sector = data.SETOR || data.sector;
      }
    })
    .catch(function (error) {
      console.log(`Error: ${error}`);
    });
};

const openModalForCreation = () => {
  resetForm();
  openModal.value = true;
};

// const openModalForEditing = (data: CreationForm) => {
//   formData.value = { ...data };
//   openModal.value = true;
// };

const resetForm = () => {
  formData.value = getInitForm();
};

const submit = async () => {
  saving.value = true;

  try {
    if (formData.value.id) {
      await update(`admin/institutions/${formData.value.id}`, formData.value);
    } else {
      const { id, ...rest } = formData.value;
      console.log(rest);
      const newInstitution = await create('admin/institutions', rest);

      const ids = props.institutions.map((intitution) => intitution.id);
      await update(`learningplans/${learningPlanId.value}`, {
        institutions: [newInstitution.data.id, ...ids],
      });
    }

    closeForm();
  } catch (error) {
    console.error('Error saving institution:', error);
  } finally {
    saving.value = false;
  }
};

const closeForm = () => {
  openModal.value = false;
  resetForm();
};

fetchUsers();
</script>

<style lang="scss" scoped></style>
