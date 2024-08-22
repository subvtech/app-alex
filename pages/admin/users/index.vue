<template>
  <v-container fluid>
    <v-row justify="space-between">
      <alex-custom-breadcrumbs
        :title="$t('pages.users.users')"
        :items="[
          { disabled: false, title: 'Home', to: '/' },
          { disabled: false, title: 'Administrador', to: '/admin' },
          { disabled: true, title: 'Users', to: '/admin/users' },
        ]"
      />
      <v-col cols="3" class="d-flex justify-end">
        <alex-custom-button @click="openModalForCreation" variant="primary">
          <v-icon>mdi-plus</v-icon>
          {{ $t('pages.users.new_user') }}
        </alex-custom-button>
      </v-col>
    </v-row>
    <v-data-table
      v-model:expanded="expanded"
      class="row-pointer pa-3 mt-4 rounded-lg"
      variant="outline"
      :headers="headers"
      :items="paginatedData"
      item-value="username"
      show-expand
      no-data-text="No data"
      fixed-header
      :height="590"
    >
      <template #top>
        <v-row>
          <v-col cols="12" class="d-flex jusify-space-between">
            <v-row>
              <v-col cols="3" class="h-10">
                <alex-inputs-text-field
                  v-model="searchText"
                  :placeholder="$t('pages.users.search_users')"
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
                <v-list class="d-flex flex-column gap-1 max-h-120">
                  <v-list-item
                    class="pa-1"
                    v-for="(item, index) in itemsDisplayedFields"
                    :key="index"
                    height="30"
                  >
                    <v-list-item-content>
                      <v-checkbox
                        v-model="item.selected"
                        :label="item.text"
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
          <td v-if="isFieldVisible('username')">{{ item.username }}</td>
          <td v-if="isFieldVisible('fullname')">{{ item.fullname }}</td>
          <td v-if="isFieldVisible('email')">{{ item.email }}</td>
          <td v-if="isFieldVisible('cpf')">{{ item.cpf }}</td>
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
          <v-text>
            {{
              $t('pages.users.pagination.display_offset', {
                from: (activePage - 1) * itemsPerPage + 1,
                to: Math.min(activePage * itemsPerPage, dataWithIndex.length),
                total: dataWithIndex.length,
              })
            }}
          </v-text>
          <alex-custom-pagination
            v-model="activePage"
            :length="totalPages"
            :total-visible="3"
          />
        </v-col>
      </template>
    </v-data-table>

    <v-dialog v-model="openModal" width="60%" persistent>
      <v-form ref="createForm" v-model="formValid" @submit.prevent="submit">
        <v-card width="100%" class="pa-3">
          <v-card-title
            class="d-flex justify-space-between align-center font-weight-700"
          >
            {{
              isEdit
                ? $t('pages.users.edit_user')
                : $t('pages.users.create_user')
            }}
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
                title: $t('pages.users.personal_data'),
                subtitle: 'Gerais',
                validate: [
                  {
                    name: 'username',
                    callback: async (value) => {
                      try {
                        await schemaStep1(isEdit).validate(creationForm, {
                          abortEarly: false,
                        });
                        return { status: true };
                      } catch (error) {
                        console.log(error);
                      }
                    },
                  },
                ],
                scheme: schemaStep1(isEdit),
              },
              step2: {
                title: $t('pages.users.personal_data'),
                subtitle: 'Gerais',
              },
            }"
            @submit="submit"
          >
            <template #controls="{ isValid }">
              <div class="d-flex justify-end">
                <alex-custom-button
                  :text="$t('pages.users.cancel')"
                  @click="closeForm()"
                  variant="secondary"
                  class="mr-3"
                />
                <alex-custom-button
                  type="submit"
                  :text="$t('pages.users.save')"
                  :disabled="!isValid"
                  :loading="saving"
                />
              </div>
            </template>

            <template #step1>
              <v-row justify="start" class="pa-5">
                <v-col cols="12">
                  <v-row class="tw-flex tw-space-x-4">
                    <div class="tw-flex-1">
                      <alex-inputs-text-field
                        v-model="creationForm.username"
                        class="w-flex-1"
                        :label="$t('pages.users.fields.username')"
                        :placeholder="$t('pages.users.fields.username')"
                        name="username"
                        :rules="rules.username"
                        required
                      />
                    </div>
                    <div class="tw-flex-1">
                      <alex-inputs-text-field
                        v-model="creationForm.fullname"
                        class="w-flex-1"
                        :label="$t('pages.users.fields.fullname')"
                        :placeholder="$t('pages.users.fields.fullname')"
                        name="fullname"
                        :rules="rules.fullname"
                        required
                      />
                    </div>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row class="tw-flex tw-items-center tw-space-x-4">
                    <div class="tw-flex-1">
                      <alex-custom-switch
                        v-model="creationForm.confirmed"
                        :label="$t('pages.users.fields.confirmed')"
                        :placeholder="$t('pages.users.fields.confirmed')"
                        name="confirmed"
                      />
                    </div>
                    <div class="tw-flex-1">
                      <alex-custom-switch
                        v-model="creationForm.blocked"
                        :label="$t('pages.users.fields.blocked')"
                        :placeholder="$t('pages.users.fields.blocked')"
                        name="blocked"
                      />
                    </div>
                  </v-row>
                  <v-row class="tw-flex tw-items-center tw-space-x-4">
                    <div class="tw-flex-1">
                      <alex-custom-switch
                        v-model="creationForm.isProfessor"
                        :label="$t('pages.users.fields.isProfessor')"
                        :placeholder="$t('pages.users.fields.isProfessor')"
                        name="isProfessor"
                        required
                      />
                    </div>
                    <div class="tw-flex-1">
                      <alex-inputs-text-field
                        v-model="creationForm.cpf"
                        :label="$t('pages.users.fields.cpf')"
                        :placeholder="$t('pages.users.fields.cpf')"
                        name="cpf"
                        :rules="rules.cpf"
                        required
                      />
                    </div>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row class="tw-flex tw-space-x-4">
                    <div class="tw-flex-1">
                      <alex-inputs-text-field
                        v-model="creationForm.email"
                        :label="$t('pages.users.fields.email')"
                        :placeholder="$t('pages.users.fields.email')"
                        name="email"
                        :rules="rules.email"
                        required
                      />
                    </div>
                    <div class="tw-flex-1">
                      <alex-inputs-text-field
                        v-model="creationForm.password"
                        :label="$t('pages.users.fields.password')"
                        :placeholder="$t('pages.users.fields.password')"
                        name="password"
                        :required="!isEdit"
                      />
                    </div>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row class="tw-flex tw-items-center tw-space-x-4">
                    <div class="tw-flex-1">
                      <alex-inputs-text-field
                        v-model="creationForm.phone"
                        :label="$t('pages.users.fields.phone')"
                        :placeholder="$t('pages.users.fields.phone')"
                        name="phone"
                      />
                      <alex-inputs-select
                        v-model="creationForm.role"
                        :items="
                          roles.map((r) => ({
                            value: r.id,
                            title: r.name,
                          }))
                        "
                        :label="$t('pages.users.fields.role')"
                        :placeholder="$t('pages.users.fields.role')"
                        name="role"
                      />
                    </div>
                    <div class="tw-flex-1">
                      <div class="tw-flex tw-flex-col tw-mb-4">
                        <alex-inputs-select
                          :items="
                            institutions.map((i) => ({
                              value: i.id,
                              title: i.attributes.name,
                            }))
                          "
                          :label="$t('pages.users.fields.institutions')"
                          :placeholder="$t('pages.users.fields.institutions')"
                          @change="(evt) => setRegisteredInstitutions(evt)"
                          name="institutions"
                        />
                        <Collapsible
                          v-model:open="isInstitutions"
                          class="tw-space-y-2 tw-overflow-y-scroll tw-max-h-30"
                        >
                          <CollapsibleContent class="tw-space-y-2">
                            <div
                              class="tw-rounded-md tw-border px-4 py-3 tw-font-mono tw-text-sm tw-flex tw-justify-between tw-items-center"
                              v-for="inst in registeredInstitutions"
                              :key="inst.id"
                            >
                              {{ inst.name }}
                              <v-icon
                                @click="removeRegisteredInstitutions(inst.id)"
                                >mdi-close</v-icon
                              >
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </div>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row class="tw-flex tw-items-center tw-space-x-4">
                    <div class="tw-flex-1"></div>
                  </v-row>
                </v-col>
              </v-row>
            </template>

            <template #step2>
              <v-row justify="start" class="pa-5">
                <v-col>
                  <v-row class="tw-flex tw-items-center tw-space-x-4">
                    <div class="tw-flex-2">
                      <app-user-avatar
                        :user-id="creationForm.id"
                        can-edit
                        can-delete
                        :size="250"
                        avatarStyle="background-color:red !important"
                        :placeholder="creationForm.username"
                        :profile-picture="creationForm.avatar"
                      />
                    </div>
                    <div class="tw-flex-1">
                      <alex-inputs-select
                        v-model="creationForm.user_wallet"
                        :items="
                          wallets.map((w) => ({
                            value: w.id,
                            title: w.attributes.address,
                          }))
                        "
                        :label="$t('pages.users.fields.user_wallet')"
                        :placeholder="$t('pages.users.fields.user_wallet')"
                        name="user_wallet"
                      />

                      <alex-inputs-text-area
                        v-model="creationForm.info"
                        :label="$t('pages.users.fields.info')"
                        :placeholder="$t('pages.users.fields.info')"
                        name="info"
                      />
                    </div>
                  </v-row>
                </v-col>

                <v-col cols="12">
                  <v-row class="tw-flex tw-items-center tw-space-x-4">
                    <div class="tw-flex-1">
                      <div class="tw-flex tw-flex-col tw-mb-4">
                        <alex-inputs-select
                          :items="
                            socials.map((s) => ({
                              value: s.id,
                              title: s.attributes.name,
                            }))
                          "
                          :label="$t('pages.users.fields.socials')"
                          :placeholder="$t('pages.users.fields.socials')"
                          name="socials"
                        />
                        <Collapsible
                          v-model:open="isSocials"
                          class="tw-space-y-2 tw-overflow-y-scroll tw-max-h-30"
                        >
                          <CollapsibleContent class="tw-space-y-2">
                            <div
                              class="tw-rounded-md tw-border px-4 py-3 tw-font-mono tw-text-sm tw-flex tw-justify-between tw-items-center"
                              v-for="social in registeredSocials"
                              :key="social.id"
                            >
                              {{ social.name }}
                              <v-icon
                                @click="removeRegisteredSocials(social.id)"
                                >mdi-close</v-icon
                              >
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>

                      <div class="tw-flex tw-flex-col tw-mb-4">
                        <alex-inputs-select
                          :defaults="creationForm.tags"
                          :items="
                            tags.map((t) => ({
                              value: t.id,
                              title: t.attributes.text,
                            }))
                          "
                          :label="$t('pages.users.fields.tags')"
                          :placeholder="$t('pages.users.fields.tags')"
                          name="tags"
                        />

                        <Collapsible
                          v-model:open="isTags"
                          class="tw-space-y-2 tw-overflow-y-scroll tw-max-h-30"
                        >
                          <CollapsibleContent class="tw-space-y-2">
                            <div
                              class="tw-rounded-md tw-border px-4 py-3 tw-font-mono tw-text-sm tw-flex tw-justify-between tw-items-center"
                              v-for="tag in registeredTags"
                              :key="tag.id"
                            >
                              {{ tag.text }}
                              <v-icon @click="removeRegisteredTags(tag.id)"
                                >mdi-close</v-icon
                              >
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </div>
                    <div class="tw-flex-2">
                      <div
                        class="rounded tw-h-72 tw-w-72 justify-center align-center upload-container"
                      >
                        <v-file-input
                          v-model="creationForm.cover"
                          @change="(evt: Event) => onFileChange(evt, 'cover')"
                          accept="image/*"
                          class="tw-w-full tw-h-full input-content"
                          hide-input
                          name="cover"
                        />
                        <v-icon v-if="!cover">mdi-camera</v-icon>
                        <v-img
                          v-if="cover"
                          :src="coverPreview"
                          class="profile-img"
                        />
                      </div>
                    </div>
                  </v-row>
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
import * as yup from 'yup';
import { Role, User } from '~/models/user.model';
import { Institution } from '../institutions/index.vue';
import { Collapsible, CollapsibleContent } from '~/components/ui/collapsible';

definePageMeta({
  middleware: 'auth',
  layout: 'admin',
});

export interface PropsListComponentType {
  title: string;
  showPositions?: boolean;
  listEmits?: boolean;
}

type ItemType<t> = {
  id: number;
  attributes: t;
};

const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const institutions = ref<ItemType<InstitutionsType>[]>([]);
const socials = ref<ItemType<SocialItemType>[]>([]);
const tags = ref<ItemType<Tag>[]>([]);
const wallets = ref<ItemType<Wallet>[]>([]);
const searchText = ref('');
const openModal = ref(false);
const formValid = ref(false);
const saving = ref(false);
const isEdit = ref(false);
const dropdown = ref(true);
const activePage = ref(1);
const itemsPerPage = 10;
const cover = ref<File | null>(null);
const avatar = ref<File | null>(null);
const registeredInstitutions = ref<InstitutionsType[]>([]);
const registeredTags = ref<Tag[]>([]);
const registeredSocials = ref<SocialItemType[]>([]);
const isTags = computed(() => registeredTags.value.length > 0);
const isSocials = computed(() => registeredSocials.value.length > 0);
const isInstitutions = computed(() => registeredInstitutions.value.length > 0);
const { find, create, update, delete: _delete } = useStrapi();

const totalPages = computed(() => {
  return Math.ceil(dataWithIndex.value.length / itemsPerPage);
});

const paginatedData = computed(() => {
  const start = (activePage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return dataWithIndex.value.slice(start, end);
});

const setRegisteredInstitutions = (institution) => {
  console.log('institution', institution);
  // registeredInstitutions.value.push(institution);
};

const schemaStep1 = (isEdit: boolean) =>
  yup.object().shape({
    username: yup.string().required('Username obrigatório'),
    fullname: yup.string().required('Nome obrigatório'),
    email: yup.string().email().required('Email obrigatório'),
    cpf: yup.string().required('Cpf obrigatório'),
    password: yup.string().when([], {
      is: () => !isEdit,
      otherwise: (schema) => schema.notRequired(),
      then: (schema) => schema.required('Senha obrigatória'),
    }),
    phone: yup.string(),
    confirmed: yup.boolean(),
    blocked: yup.boolean(),
    isProfessor: yup.boolean(),
    role: yup.string(),
  });

const avatarPreview = computed(() => {
  if (!avatar.value) return '';
  return URL.createObjectURL(avatar.value);
});
const coverPreview = computed(() => {
  if (!cover.value) return '';
  return URL.createObjectURL(cover.value);
});

const onFileChange = (event: Event, type: 'avatar' | 'cover') => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    if (type === 'avatar') {
      avatar.value = input.files[0];
      creationForm.value.avatar = input.files[0];
    } else {
      cover.value = input.files[0];
      creationForm.value.cover = input.files[0];
    }
  }
};

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
      confirmDeleteUser(item.id);
    },
  },
];

const getRoles = async () => {
  try {
    const roleResponse = await find<Role[]>('users-permissions/roles', {
      populate: '*',
    });
    if (!roleResponse) {
      throw new Error(`Error fetching roles`);
    }
    roles.value = roleResponse.roles;
  } catch (error) {
    console.error('Error fetching roles:', error);
  }
};

const getSocials = async () => {
  try {
    const response = await find<SocialItemType[]>('socials', {
      populate: '*',
    });
    if (!response) {
      throw new Error(`Error fetching socials`);
    }

    socials.value = response.data;
  } catch (error) {
    console.error('Error fetching socials:', error);
  }
};

const getTags = async () => {
  try {
    const response = await find<Tag[]>('tags', {
      populate: '*',
    });
    if (!response) {
      throw new Error(`Error fetching tags`);
    }

    tags.value = response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
  }
};

const getWallets = async () => {
  try {
    const response = await find<Wallet[]>('user-wallets', {
      populate: '*',
    });
    if (!response) {
      throw new Error(`Error fetching wallets`);
    }

    wallets.value = response.data;
  } catch (error) {
    console.error('Error fetching wallets:', error);
  }
};

const getInstitutions = async () => {
  try {
    const response = await find<Institution[]>('institutions', {
      populate: '*',
    });
    if (!response) {
      throw new Error(`Error fetching institutions`);
    }

    institutions.value = response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
  }
};

const getUsers = async () => {
  try {
    const response = await find<User>('users', {
      populate: '*',
    });

    if (!response) {
      throw new Error(`Error fetching users`);
    }

    console.log(response);
    users.value = response;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

export interface PropsListComponentType {
  title: string;
  showPositions?: boolean;
  listEmits?: boolean;
}

const props = withDefaults(defineProps<PropsListComponentType>(), {
  title: 'List Users',
  showPositions: false,
  listEmits: false,
});

export interface DispayedListItem {
  text: string;
  selected?: boolean;
  checkbox?: boolean;
}

const itemsDisplayedFields = ref([
  { text: 'fullname', selected: true, key: 'fullname' },
  { text: 'Username', selected: true, key: 'username' },
  { text: 'Email', selected: true, key: 'email' },
]);

const expanded = ref<string[]>([]);

const dataWithIndex = computed(() => {
  const data = users.value.map((item: User) => ({ ...item }));

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
    ? data.map((item, index) => ({
        index: index + 1,
        ...item,
      }))
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
        key: field.text.toLowerCase().replace(/ /g, ''),
      })),
  ];
});

const isFieldVisible = (field) => {
  return itemsDisplayedFields.value.find(
    (item) => item.text.toLowerCase() === field.toLowerCase(),
  )?.selected;
};

const removeRegisteredInstitutions = (id: number) => {
  registeredInstitutions.value = registeredInstitutions.value.filter(
    (item) => item.id !== id,
  );
};
const removeRegisteredSocials = (id: number) => {
  registeredSocials.value = registeredSocials.value.filter(
    (item) => item.id !== id,
  );
};
const removeRegisteredTags = (id: number) => {
  registeredTags.value = registeredTags.value.filter((item) => item.id !== id);
};

const creationForm = ref<User>({
  fullname: '',
  email: '',
  username: '',
  isProfessor: false,
  cpf: '',
  confirmed: false,
  blocked: false,
  provider: '',
  institutions: [],
  tags: [],
  role: {} as Role,
  socials: [],
  avatar: null,
  cover: null,
  user_wallet: undefined,
  info: '',
  password: undefined,
});

const rules = {
  username: [(v: string) => !!v || 'Username is required'],
  fullname: [(v: string) => !!v || 'Fullname is required'],
  email: [(v: string) => !!v || 'Email is required'],
  cpf: [(v: string) => !!v || 'CPF is required'],
};

const openModalForCreation = () => {
  resetForm();
  isEdit.value = false;
  openModal.value = true;
};

const openModalForEditing = (user: User) => {
  registeredInstitutions.value = user.institutions;
  registeredSocials.value = user.socials;
  registeredTags.value = user.tags;

  creationForm.value = {
    ...user,
    role: user.role.id as never,
    user_wallet: user.user_wallet?.id as never,
  };
  isEdit.value = true;
  openModal.value = true;
};

const resetForm = () => {
  creationForm.value = {
    fullname: '',
    email: '',
    username: '',
    isProfessor: false,
    cpf: '',
    confirmed: false,
    blocked: false,
    provider: '',
    institutions: [],
    tags: [],
    role: {} as Role,
    socials: [],
    avatar: null,
    cover: null,
    user_wallet: undefined,
    info: '',
    password: undefined,
  };
};

const submit = async () => {
  saving.value = true;

  const payload = {
    ...creationForm.value,
    institutions: registeredInstitutions.value.map((item) => item.id),
    socials: registeredSocials.value.map((item) => item.id),
    tags: registeredTags.value.map((item) => item.id),
  };

  try {
    if (isEdit.value) {
      await update(`users/${creationForm.value.id}`, payload);
    } else {
      await create(`admin/users`, payload);
    }

    getUsers();
    closeForm();
  } catch (error) {
    console.error('Error saving User:', error);
  } finally {
    saving.value = false;
  }
};

const closeForm = () => {
  openModal.value = false;
  resetForm();
};

const confirmDeleteUser = async (id: number) => {
  if (confirm('Are you sure you want to delete this User?')) {
    try {
      await _delete(`admin/users/${id}`);
      getUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
};
getUsers();
getRoles();
getInstitutions();
getTags();
getSocials();
getWallets();
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

.profile-img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

.input-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-55%, -25%);
  opacity: 0;
  z-index: 99999;
  cursor: pointer;
}

.upload-container {
  position: relative;
  background-color: #f5f5f5; /* Cinza claro */
  display: flex;
  overflow: hidden;
}
</style>
