<template>
  <v-container fluid>
    <v-row justify="space-between">
      <alex-custom-breadcrumbs
        :title="$t('pages.admin.title')"
        :items="[
          { disabled: false, title: 'Home', to: '/' },
          { disabled: false, title: 'Administrador', to: '/admin' },
          { disabled: true, title: 'Instituições', to: '/admin/institutions' },
        ]"
      />
      <v-col cols="3" class="d-flex justify-end">
        <alex-custom-button @click="openModalForCreation" variant="primary">
          <v-icon>mdi-plus</v-icon>
          {{ $t('pages.admin.newInstitution') }}
        </alex-custom-button>
      </v-col>
    </v-row>
    <v-data-table
      v-model:expanded="expanded"
      class="row-pointer pa-3 mt-4 rounded-lg"
      variant="outline"
      :headers="headers"
      :items="paginatedData"
      item-value="name"
      show-expand
      no-data-text="No data"
      fixed-header
      :height="300"
    >
      <template #top>
        <v-row>
          <v-col cols="12" class="d-flex jusify-space-between">
            <v-row>
              <v-col cols="3" class="h-10">
                <alex-inputs-text-field
                  v-model="searchText"
                  :placeholder="$t('pages.admin.searchPlaceholder')"
                  outlined
                  prepend-inner-icon="mdi-magnify"
                  class=""
                  name="search"
                  dense
                />
              </v-col>
            </v-row>
            <alex-institution-dropdown theme="light" variant="primary">
              <template #activator="{ props }">
                <alex-custom-button
                  size="large"
                  icon="mdi-plus"
                  variant="tertiary"
                  dark
                  v-bind="props"
                  @click="dropdown = !dropdown"
                >
                  <v-icon>mdi-format-list-bulleted</v-icon>
                </alex-custom-button>
              </template>
              <template #items>
                <v-list class="d-flex flex-column gap-1 max-h-100">
                  <v-list-item
                    v-for="(field, index) in itemsDisplayedFields"
                    :key="index"
                    class="pa-1"
                    height="30px"
                  >
                    <v-list-item-content>
                      <v-checkbox
                        v-model="field.selected"
                        :label="field.text"
                        dense
                      ></v-checkbox>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </template>
            </alex-institution-dropdown>
          </v-col>
        </v-row>
      </template>
      <template #item="{ item }">
        <tr class="w-100 tr-hover">
          <td v-if="showPositions" class="text-warning-1">{{ item.id }}</td>
          <td v-if="isFieldVisible('socialName')">{{ item.socialName }}</td>
          <td v-if="isFieldVisible('name')">{{ item.name }}</td>
          <td v-if="isFieldVisible('email')">{{ item.email }}</td>
          <td v-if="isFieldVisible('cnpj')">{{ item.cnpj }}</td>
          <td v-if="isFieldVisible('address')">{{ item.address }}</td>
          <td v-if="isFieldVisible('phone')">{{ item.phone }}</td>
          <td v-if="isFieldVisible('users')">{{ item.users }}</td>
          <td v-if="isFieldVisible('sector')">{{ item.sector }}</td>
          <td v-if="isFieldVisible('cover')">{{ item.cover }}</td>
          <td v-if="isFieldVisible('createdAt')">{{ item.createdAt }}</td>
          <td v-if="isFieldVisible('createdBy')">{{ item.createdBy }}</td>
          <td v-if="isFieldVisible('updatedAt')">{{ item.updatedAt }}</td>
          <td v-if="isFieldVisible('updatedBy')">{{ item.updatedBy }}</td>
          <td>
            <alex-custom-dropdown
              :items="getDropdownItems(item)"
              variant="text"
            />
          </td>
        </tr>
      </template>
      <template #bottom>
        <v-col class="d-flex justify-space-between align-center" cols="12">
          <v-text
            >Mostrando do {{ (activePage - 1) * itemsPerPage + 1 }} a
            {{ Math.min(activePage * itemsPerPage, dataWithIndex.length) }} de
            {{ dataWithIndex.length }}</v-text
          >
          <alex-custom-pagination
            v-model="activePage"
            :length="totalPages"
            :total-visible="3"
          />
        </v-col>
      </template>
    </v-data-table>
    <v-dialog v-model="openModal" width="50%" persistent>
      <v-form ref="createForm" v-model="formValid" @submit.prevent="submit">
        <v-card width="100%" class="pa-3">
          <v-card-title
            class="d-flex justify-space-between align-center font-weight-700"
          >
            {{ $t('pages.admin.title2') }}
            <alex-custom-button
              variant="text"
              icon="mdi-plus"
              size="default"
              @click="closeForm()"
            >
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
            <template
              #controls="{
                isFirstStep,
                onPrevStep,
                isValid,
                loading,
                isLastStep,
              }"
            >
              <div class="d-flex justify-end gap 4">
                <alex-custom-button
                  text="Cancelar"
                  @click="closeForm()"
                  variant="secondary"
                  class="mr-3"
                />
                <alex-custom-button
                  v-if="!isFirstStep"
                  class="mr-3"
                  text="Voltar"
                  @click="onPrevStep"
                />
                <alex-custom-button
                  v-if="!isLastStep"
                  class="mr-3"
                  text="Próximo"
                  :disabled="!isValid"
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
                  <v-col
                    cols="4"
                    class="d-flex flex-column justify-center align-center"
                  >
                    <app-user-avatar
                      :userId="formData.id || undefined"
                      can-edit
                      can-delete
                      :size="180"
                      :placeholder="formData.socialName"
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
                  <div
                    class="rounded-circle w-130 h-130 d-flex justify-center align-center upload-container"
                  >
                    <app-user-avatar
                      :userId="formData.id || undefined"
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
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Strapi4ResponseMany } from '@nuxtjs/strapi/dist/runtime/types';
import * as yup from 'yup';

definePageMeta({
  middleware: 'auth',
  layout: 'admin',
});

interface Institution {
  id: number;
  cnpj: string;
  users: Strapi4ResponseMany<Omit<User, 'id' | 'institutions'>>;
  name: string;
  socialName: string;
  email: string;
  phone: string;
  sector: string;
  cover: {
    data: CoverData;
  } | null;
  address: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

interface CreationForm {
  id: number | null;
  cnpj: string;
  users: User[];
  name: string;
  socialName: string;
  email: string;
  address: string;
  sector: string;
  phone: string;
  cover: {
    data: CoverData;
  } | null;
}

interface CoverData {
  id: number;
  attributes: {
    url: string;
  };
}
export interface PropsListComponentType {
  title: string;
  showPositions?: boolean;
  listEmits?: boolean;
}

export interface DispayedListItem {
  text: string;
  selected?: boolean;
  checkbox?: boolean;
}
const institutions = ref<Strapi4ResponseMany<Institution>>({
  data: [],
  meta: {},
});
const users = ref<User[]>([]);
const searchText = ref('');
const openModal = ref(false);
const formValid = ref(false);
const saving = ref(false);
const dropdown = ref(true);
const activePage = ref(1);
const itemsPerPage = 4;
const { find, create, update, delete: remove } = useStrapi();
const expanded = ref<string[]>([]);

const totalPages = computed(() => {
  return Math.ceil(dataWithIndex.value.length / itemsPerPage);
});

const paginatedData = computed(() => {
  const start = (activePage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return dataWithIndex.value.slice(start, end);
});

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

const props = withDefaults(defineProps<PropsListComponentType>(), {
  title: 'List Institutions',
  showPositions: false,
  listEmits: false,
});

const itemsDisplayedFields = ref([
  { text: 'Name', selected: true, checkbox: true },
  { text: 'SocialName', selected: true, checkbox: true },
  { text: 'Email', selected: true, checkbox: true },
  { text: 'CNPJ', selected: true, checkbox: true },
  { text: 'Address', selected: true, checkbox: true },
  { text: 'Phone', selected: true, checkbox: true },
  { text: 'Users', selected: false, checkbox: false },
  { text: 'Sector', selected: true, checkbox: true },
  { text: 'Cover', selected: false, checkbox: false },
  { text: 'CreatedAt', selected: false, checkbox: false },
  { text: 'CreatedBy', selected: false, checkbox: false },
  { text: 'UpdatedAt', selected: false, checkbox: false },
  { text: 'UpdatedBy', selected: false, checkbox: false },
]);
const getDropdownItems = (item) => [
  {
    text: 'Editar',
    onClick() {
      openModalForEditing(item);
    },
  },
  {
    text: 'Excluir',
    onClick() {
      confirmDeleteInstitution(item.id);
    },
  },
];
const dataWithIndex = computed(() => {
  const data = institutions.value.data.map((item) => ({
    id: item.id,
    cnpj: item.attributes.cnpj,
    name: item.attributes.name,
    socialName: item.attributes.socialName,
    email: item.attributes.email,
    sector: item.attributes.sector,
    users: item.attributes.users.data.map((user) => ({
      id: user.id,
      ...user.attributes,
    })),
    address: item.attributes.address,
    phone: item.attributes.phone,
    cover: item.attributes.cover,
    createdAt: item.attributes.createdAt,
    createdBy: item.attributes.createdBy,
    updatedAt: item.attributes.updatedAt,
    updatedBy: item.attributes.updatedBy,
  }));

  if (searchText.value) {
    const searchValue = searchText.value.toLowerCase();
    return data.filter((item) => {
      return Object.values(item).some((value) => {
        if (value) {
          return value.toString().toLowerCase().includes(searchValue);
        }
        return false;
      });
    });
  }

  return props.showPositions
    ? data.map((item, index) => ({ index: index + 1, ...item }))
    : data;
});

const headers = computed(() => {
  const indexCol = props.showPositions ? [{ title: 'ID', key: 'id' }] : [];
  return [
    ...indexCol,
    ...itemsDisplayedFields.value
      .filter((field) => field.selected)
      .map((field) => ({
        title: field.text,
        key: field.text.toLowerCase().replace(/\s/g, ''),
      })),
  ];
});

const isFieldVisible = (field) => {
  return itemsDisplayedFields.value.find(
    (item) => item.text.toLowerCase() === field.toLowerCase(),
  )?.selected;
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

const fetchInstitutions = async () => {
  try {
    // TODO: Adicionar campo representante
    const response = await find<Institution>('admin/institutions', {
      populate: ['cover', 'users'],
    });

    if (response && response.data) {
      institutions.value = response;
    } else {
      throw new Error('Error fetching institutions');
    }
  } catch (error) {
    console.error('Error fetching institutions:', error);
  }
};

const fetchUsers = async () => {
  try {
    const response = await find('users'); // TODO: Buscar apenas os professores
    if (!response) {
      throw new Error('Error fetching users');
    }
    users.value = response as unknown as User[];
    console.log('Fetched Users:', users.value); // Log para verificar os usuários
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

function formatCNPJ() {
  let documentId = formData.value.cnpj.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
  if (documentId.length === 14) {
    documentId = documentId.padStart(14, '0');
    documentId = documentId.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5',
    );
    formData.value.cnpj = documentId;
    fetchCNPJ();
  }
}
const fetchCNPJ = () => {
  let cnpj = formData.value.cnpj.replace(/\W|\s/g, '');
  fetch(`https://api-publica.speedio.com.br/buscarcnpj?cnpj=${cnpj}`)
    .then((body) => body.json())
    .then((data) => {
      console.log(data);
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

const openModalForEditing = (data: CreationForm) => {
  formData.value = { ...data };
  openModal.value = true;
};

const resetForm = () => {
  formData.value = getInitForm();
};

const submit = async () => {
  saving.value = true;

  try {
    if (formData.value.id) {
      await update(`admin/institutions/${formData.value.id}`, formData.value);
    } else {
      const { id, ...newInstitutionData } = formData.value;
      await create('admin/institutions', newInstitutionData);
    }

    fetchInstitutions();
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

const confirmDeleteInstitution = async (id: string) => {
  if (confirm('Are you sure you want to delete this institution?')) {
    try {
      const response = await remove(`admin/institutions/${id}`);
      if (!response) {
        throw new Error('Error deleting institution');
      }
      fetchInstitutions();
    } catch (error) {
      console.error('Error deleting institution:', error);
    }
  }
};

fetchInstitutions();
fetchUsers();
</script>

<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}

.tr-hover {
  cursor: pointer;

  &:hover {
    background-color: rgb(var(--v-theme-gray-blue)) !important;
  }
}

.max-h-120 {
  max-height: 120px;
}

.upload-container {
  position: relative;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
}

.file-input-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  top: 50%;
  left: 50%;
  transform: translate(-60%, -30%);
  z-index: 999;
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
